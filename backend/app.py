from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db_connection, init_db

app = Flask(__name__)
CORS(app)

# Initialize DB on startup
init_db()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "AI eBook Backend"})

# --- AUTHENTICATION API ---

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
        
    conn = get_db_connection()
    try:
        # Create Hash
        pwd_hash = generate_password_hash(password)
        
        # Insert User
        cur = conn.execute('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', 
                           (name or split_email(email), email, pwd_hash))
        user_id = cur.lastrowid
        
        # Initialize Profile
        conn.execute('INSERT INTO user_profiles (user_id, streak_days) VALUES (?, 0)', (user_id,))
        
        conn.commit()
        return jsonify({"success": True, "user": {"id": user_id, "name": name, "email": email}})
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists"}), 409
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()
    
    if user and check_password_hash(user['password_hash'], password):
        # Successful Login
        return jsonify({
            "success": True, 
            "user": {
                "id": user['id'], 
                "name": user['name'], 
                "email": user['email']
            }
        })
    
    return jsonify({"error": "Invalid credentials"}), 401

def split_email(email):
    return email.split('@')[0]

# --- REAL STORE API ---

@app.route('/api/books', methods=['GET'])
def get_books():
    """Returns the full catalog from the database."""
    conn = get_db_connection()
    books = conn.execute('SELECT * FROM books').fetchall()
    conn.close()
    books_list = [dict(row) for row in books]
    return jsonify(books_list)

@app.route('/api/read/<int:book_id>', methods=['GET'])
def get_book_content(book_id):
    """Returns the Internet Archive Embed URL."""
    conn = get_db_connection()
    book = conn.execute('SELECT title, ia_id FROM books WHERE id = ?', (book_id,)).fetchone()
    conn.close()
    
    if not book:
        return jsonify({"error": "Book not found"}), 404
        
    # Return the Embed URL for the Iframe
    return jsonify({
        "title": book['title'],
        "type": "iframe",
        "url": f"https://archive.org/embed/{book['ia_id']}?ui=embed&wrapper=false"
    })

@app.route('/api/library', methods=['GET'])
def get_library():
    """Returns books purchased by a specific user."""
    user_id = request.args.get('user_id') 
    if not user_id:
        return jsonify([])
        
    conn = get_db_connection()
    # Join books and purchases
    query = '''
        SELECT b.*, p.purchase_date, p.progress, p.user_id 
        FROM books b
        JOIN purchases p ON b.id = p.book_id
        WHERE p.user_id = ?
    '''
    library = conn.execute(query, (user_id,)).fetchall()
    conn.close()
    return jsonify([dict(row) for row in library])

@app.route('/api/purchase', methods=['POST'])
def purchase_book():
    data = request.json
    user_id = data.get('user_id')
    raw_book_id = data.get('book_id')
    
    conn = get_db_connection()
    c = conn.cursor()
    
    # 1. Check if this is a GLOBAL book (string ID) or LOCAL (int ID)
    final_book_id = raw_book_id
    
    if isinstance(raw_book_id, str) and raw_book_id.startswith('ext_'):
        # It's a Global Book. We must importing it into our 'books' table first.
        # We need the metadata (passed from frontend preferably, or we fetch again)
        # For simplicity, let's assume the frontend passes the basic book details in 'book_data'
        book_data = data.get('book_data')
        
        if book_data:
            # Check if we already imported it
            existing = c.execute("SELECT id FROM books WHERE ia_id = ?", (book_data.get('ia_id'),)).fetchone()
            if existing:
                final_book_id = existing['id']
            else:
                # Import new book
                try:
                    c.execute('''
                        INSERT INTO books (ia_id, title, author, category, description, price, rating, cover_url, year)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        book_data.get('ia_id'),
                        book_data.get('title'),
                        book_data.get('author'),
                        'Imported', 
                        'Imported from Global Library',
                        book_data.get('price'),
                        4.5,
                        book_data.get('cover_url'),
                        book_data.get('year')
                    ))
                    final_book_id = c.lastrowid
                except Exception as e:
                    print(f"Import Error: {e}")
                    conn.close()
                    return jsonify({"success": False, "error": "Import failed"})
        else:
             # If frontend didn't send data, we can't save it effectively
             conn.close()
             return jsonify({"success": False, "error": "Missing book data for import"})

    # 2. Record Purchase
    try:
        c.execute('INSERT INTO purchases (user_id, book_id) VALUES (?, ?)', (user_id, final_book_id))
        conn.commit()
        success = True
    except sqlite3.IntegrityError:
        success = False # Already owned
    finally:
        conn.close()
    
    return jsonify({"success": success})

    
    return jsonify({"success": success})

# --- ONBOARDING API ---
@app.route('/api/onboarding', methods=['POST'])
def save_onboarding():
    data = request.json
    user_id = data.get('user_id')
    genres = data.get('genres', [])
    
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        # Save Genres into user_profiles
        c.execute('UPDATE user_profiles SET fav_genres = ? WHERE user_id = ?', (str(genres), user_id))
        
        # Also seed the 'interactions' table so the AI picks it up immediately
        for g in genres:
            # We treat Onboarding selection as a 'onboard_interest'
            c.execute('INSERT INTO interactions (user_id, book_id, interaction_type) VALUES (?, ?, ?)',
                      (user_id, g, 'onboard_interest'))
                      
        conn.commit()
        return jsonify({"success": True})
    except Exception as e:
        print(f"Onboarding Error: {e}")
        return jsonify({"success": False, "error": str(e)})
    finally:
        conn.close()

import random

def get_user_interests(user_id):
    """Analyzes user purchases to find a top author or category."""
    conn = get_db_connection()
    # Get last 5 purchases
    query = '''
        SELECT b.author, b.category, b.title 
        FROM purchases p 
        JOIN books b ON p.book_id = b.id 
        WHERE p.user_id = ? 
        ORDER BY p.purchase_date DESC LIMIT 5
    '''
    history = conn.execute(query, (user_id,)).fetchall()
    conn.close()
    
    if not history:
        return "bestsellers" # Fallback
        
    # Simple logic: Pick the most recent author search
    last_book = history[0]
    return f"author:{last_book['author']}" if last_book['author'] != 'Unknown' else last_book['category']

def fetch_openlibrary(query, limit=20, offset=0):
    """Helper to fetch formatted books from OpenLibrary."""
    try:
        url = f"https://openlibrary.org/search.json?q={query}&language=eng&limit={limit}&offset={offset}&has_fulltext=true"
        res = requests.get(url).json()
        results = []
        for doc in res.get('docs', []):
            if 'ia' in doc and 'cover_i' in doc:
                # Deterministic Price
                price_seed = sum(ord(char) for char in doc['title'])
                price = (price_seed % 500) + 99
                
                results.append({
                    'id': f"ext_{doc.get('key')}",
                    'ia_id': doc.get('ia')[0],
                    'title': doc.get('title'),
                    'author': doc.get('author_name', ['Unknown'])[0],
                    'cover_url': f"https://covers.openlibrary.org/b/id/{doc.get('cover_i')}-L.jpg",
                    'price': price,
                    'year': doc.get('first_publish_year', 2000),
                    'category': query.replace('subject:', '').capitalize(), # Use query as category label
                    'description': "Imported from Global Library"
                })
        return results
    except Exception as e:
        print(f"Error fetching {query}: {e}")
        return []

@app.route('/api/global_feed', methods=['GET'])
def get_global_feed():
    """Returns a rich feed of 100+ books: 1 Recommended row + 4 Random Genre rows."""
    user_id = request.args.get('user_id', 1)
    
    # 1. AI Recommendation Row
    interest_query = get_user_interests(user_id)
    recommended = fetch_openlibrary(interest_query)
    
    # 2. Random Discovery Rows
    all_genres = ['thriller', 'romance', 'history', 'science fiction', 'fantasy', 'biography', 'horror', 'business', 'cooking', 'art']
    selected_genres = random.sample(all_genres, 4)
    
    feed = {}
    
    # Add Recommended
    if recommended:
        label = f"Recommended (Because you read {interest_query.replace('author:', '')})"
        feed[label] = recommended
        
    # Add Genres with Random Offsets (Always New)
    for genre in selected_genres:
        offset = random.randint(0, 50) # Skip first 0-50 books to show fresh content
        books = fetch_openlibrary(f"subject:{genre}", limit=15, offset=offset)
        if books:
            feed[genre.title()] = books
            
    return jsonify(feed)

@app.route('/api/progress', methods=['POST'])
def update_progress():
    data = request.json
    user_id = data.get('user_id')
    book_id = data.get('book_id')
    progress = data.get('progress')

    conn = get_db_connection()
    conn.execute('UPDATE purchases SET progress = ? WHERE user_id = ? AND book_id = ?', (progress, user_id, book_id))
    conn.commit()
    conn.close()
    
    return jsonify({"success": True})

# --- INTERACTION API (Likes & Comments) ---

@app.route('/api/interact', methods=['POST'])
def interact():
    """Handles Likes and Dislikes."""
    data = request.json
    user_id = data.get('user_id')
    book_id = data.get('book_id')
    action = data.get('action') # 'like' or 'dislike'
    
    conn = get_db_connection()
    try:
        # Check if already interacted
        existing = conn.execute('SELECT id FROM interactions WHERE user_id = ? AND book_id = ? AND interaction_type = ?', 
                                (user_id, book_id, action)).fetchone()
        
        if existing:
            # Toggle OFF (Remove interaction)
            conn.execute('DELETE FROM interactions WHERE id = ?', (existing['id'],))
            active = False
        else:
            # Toggle ON
            conn.execute('INSERT INTO interactions (user_id, book_id, interaction_type) VALUES (?, ?, ?)',
                         (user_id, book_id, action))
            active = True
            
        conn.commit()
        return jsonify({"success": True, "active": active})
    except Exception as e:
        print(f"Interaction Error: {e}")
        return jsonify({"success": False, "error": str(e)})
    finally:
        conn.close()

@app.route('/api/comments', methods=['GET', 'POST'])
def comments():
    conn = get_db_connection()
    
    if request.method == 'GET':
        book_id = request.args.get('book_id')
        
        # Get comments with user names
        query = '''
            SELECT c.*, u.name as user_name, u.email 
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.book_id = ?
            ORDER BY c.created_at DESC
        '''
        comments = conn.execute(query, (book_id,)).fetchall()
        
        # Calculate Average Rating
        avg_query = 'SELECT AVG(rating) as avg_rating FROM comments WHERE book_id = ? AND rating > 0'
        avg_result = conn.execute(avg_query, (book_id,)).fetchone()
        avg_rating = round(avg_result['avg_rating'], 1) if avg_result['avg_rating'] else 0
        
        conn.close()
        
        return jsonify({
            "comments": [dict(row) for row in comments],
            "community_rating": avg_rating,
            "total_reviews": len(comments)
        })
        
    if request.method == 'POST':
        data = request.json
        try:
            conn.execute('INSERT INTO comments (user_id, book_id, text, rating) VALUES (?, ?, ?, ?)',
                         (data['user_id'], data['book_id'], data['text'], data.get('rating', 0)))
            conn.commit()
            
            # Return the new comment with user info (for optimistic UI)
            user = conn.execute('SELECT name FROM users WHERE id = ?', (data['user_id'],)).fetchone()
            conn.close()
            
            return jsonify({
                "success": True, 
                "comment": {
                    "text": data['text'], 
                    "user_name": user['name'], 
                    "created_at": "Just now"
                }
            })
        except Exception as e:
            conn.close()
            print(f"Comment Error: {e}")
            return jsonify({"success": False, "error": str(e)})

@app.route('/recommend', methods=['GET'])
def recommend():
    # ... (Keep existing recommendation logic, but point to DB later)
    # For now, let's just return random distinct books from DB as 'AI' to keep it fast
    # or keep usage of the old pandas frame if we still have catalog.json
    # Let's use the DB for a "real" SQL-based recommendation (e.g. same category)
    
    book_title = request.args.get('book_title', '')
    conn = get_db_connection()
    
    # Simple Content-Based: Find books in same category
    target_book = conn.execute('SELECT category FROM books WHERE title LIKE ?', (f'%{book_title}%',)).fetchone()
    
    if target_book:
        cat = target_book['category']
        recommendations = conn.execute('SELECT * FROM books WHERE category = ? AND title != ? LIMIT 5', (cat, book_title)).fetchall()
        return jsonify([dict(row) for row in recommendations])
    else:
        # Fallback: Random popular books
        recommendations = conn.execute('SELECT * FROM books ORDER BY RANDOM() LIMIT 5').fetchall()
        return jsonify([dict(row) for row in recommendations])

@app.route('/api/search_external', methods=['GET'])
def search_external():
    """Proxies search to OpenLibrary for 'Infinite' content."""
    query = request.args.get('q')
    if not query:
        return jsonify([])
        
    # Enforce English language to avoid random German/Foreign editions
    url = f"https://openlibrary.org/search.json?q={query}&language=eng&limit=20&has_fulltext=true"
    try:
        res = requests.get(url).json()
        results = []
        for doc in res.get('docs', []):
            if 'ia' in doc and 'cover_i' in doc:
                # Deterministic Price Logic (same as ingest)
                price_seed = sum(ord(char) for char in doc['title'])
                price = (price_seed % 500) + 99
                
                results.append({
                    'id': f"ext_{doc.get('key')}", # distinctive ID
                    'ia_id': doc.get('ia')[0],
                    'title': doc.get('title'),
                    'author': doc.get('author_name', ['Unknown'])[0],
                    'cover_url': f"https://covers.openlibrary.org/b/id/{doc.get('cover_i')}-L.jpg",
                    'price': price,
                    'year': doc.get('first_publish_year', 2000),
                    'description': "Imported from Global Library" # Simplified
                })
        return results
    except Exception as e:
        print(f"External Search Error: {e}")
        return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)
