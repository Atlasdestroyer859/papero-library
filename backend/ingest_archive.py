import requests
import sqlite3
import random
import time
from database import DB_NAME, get_db_connection, init_db

# We want a library of ~100 books
# Strategy: Search for popular subjects to get guaranteed hits with Covers + IA IDs
SUBJECTS = ["thriller", "romance", "fantasy", "science_fiction", "history", "biography"]

def fetch_books_by_subject(subject, limit=20):
    url = f"https://openlibrary.org/search.json?subject={subject}&limit={limit}&has_fulltext=true"
    try:
        print(f"Fetching {subject}...")
        res = requests.get(url).json()
        return res.get('docs', [])
    except Exception as e:
        print(f"Error fetching {subject}: {e}")
        return []

def seed_database():
    if os.path.exists(DB_NAME):
        os.remove(DB_NAME) # Clean slate
    init_db()
    
    conn = get_db_connection()
    c = conn.cursor()
    
    print("Seeding Library from OpenLibrary Search API...")
    
    all_books = []
    
    # 1. Fetch
    for subject in SUBJECTS:
        docs = fetch_books_by_subject(subject, limit=25) # 25 * 6 = 150 potential books
        for doc in docs:
            # Filter for valid IA ID and Cover
            if 'ia' in doc and 'cover_i' in doc:
                all_books.append({
                    'title': doc.get('title'),
                    'author': doc.get('author_name', ['Unknown Author'])[0],
                    'ia_id': doc.get('ia')[0], # Take first IA ID
                    'cover_id': doc.get('cover_i'),
                    'year': doc.get('first_publish_year', 2000),
                    'category': subject.replace('_', ' ').title()
                })
        time.sleep(1) # Be nice to API

    # 2. Insert
    count = 0
    seen_ia = set()
    
    for book in all_books:
        if book['ia_id'] in seen_ia:
            continue
        seen_ia.add(book['ia_id'])
        
        # Deterministic Price
        price_seed = sum(ord(char) for char in book['title'])
        price = (price_seed % 500) + 99 
        
        cover_url = f"https://covers.openlibrary.org/b/id/{book['cover_id']}-L.jpg"

        try:
            c.execute('''
                INSERT INTO books (ia_id, title, author, category, description, price, rating, cover_url, year)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                book['ia_id'],
                book['title'],
                book['author'],
                book['category'],
                f"A classic {book['category']} title: {book['title']}.",
                price,
                4.5,
                cover_url,
                book['year']
            ))
            count += 1
        except sqlite3.IntegrityError:
            pass # Skip duplicates

    # Create Demo User
    c.execute("INSERT INTO users (id, name, email, password_hash) VALUES (1, 'Fahim H.', 'user@test.com', 'hash')")
    
    conn.commit()
    conn.close()
    print(f"Database seeded with {count} books.")

import os
if __name__ == "__main__":
    seed_database()
