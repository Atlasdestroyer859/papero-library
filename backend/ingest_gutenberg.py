import requests
import sqlite3
import random
import os
from database import DB_NAME, get_db_connection, init_db

# Curated list of Project Gutenberg IDs for "Kindle-quality" classics
CLASSICS = [
    { "id": 1342, "title": "Pride and Prejudice", "author": "Jane Austen", "category": "Romance" },
    { "id": 84,   "title": "Frankenstein", "author": "Mary Wollstonecraft Shelley", "category": "Horror" },
    { "id": 11,   "title": "Alice's Adventures in Wonderland", "author": "Lewis Carroll", "category": "Fantasy" },
    { "id": 1661, "title": "The Adventures of Sherlock Holmes", "author": "Arthur Conan Doyle", "category": "Mystery" },
    { "id": 98,   "title": "A Tale of Two Cities", "author": "Charles Dickens", "category": "Historical" },
    { "id": 2701, "title": "Moby Dick", "author": "Herman Melville", "category": "Adventure" },
    { "id": 145,  "title": "Middlemarch", "author": "George Eliot", "category": "Classic" },
    { "id": 345,  "title": "Dracula", "author": "Bram Stoker", "category": "Horror" },
    { "id": 6130, "title": "The Iliad", "author": "Homer", "category": "Epic" },
    { "id": 5200, "title": "Metamorphosis", "author": "Franz Kafka", "category": "Philosophy" }
]

def fetch_book_text(gutenberg_id):
    """Fetches the plain text of the book from Gutenberg."""
    url = f"https://www.gutenberg.org/files/{gutenberg_id}/{gutenberg_id}-0.txt"
    try:
        response = requests.get(url)
        response.encoding = 'utf-8' # Ensure utf-8
        if response.status_code == 200:
            return response.text
        # Fallback for some IDs where URL structure differs
        url_alt = f"https://www.gutenberg.org/cache/epub/{gutenberg_id}/pg{gutenberg_id}.txt"
        response = requests.get(url_alt)
        response.encoding = 'utf-8'
        if response.status_code == 200:
            return response.text
        return None
    except Exception as e:
        print(f"Error fetching text for {gutenberg_id}: {e}")
        return None

def seed_database():
    init_db() # Ensure tables exist
    conn = get_db_connection()
    c = conn.cursor()
    
    print("Seeding database with Real Books...")
    
    for book in CLASSICS:
        # Check if already exists
        exists = c.execute("SELECT id FROM books WHERE gutenberg_id = ?", (book['id'],)).fetchone()
        if exists:
            print(f"Skipping {book['title']} (Already exists)")
            continue

        print(f"Fetching content for: {book['title']}...")
        content = fetch_book_text(book['id'])
        
        if content:
            # Clean content (simple crop of headers/footers could go here, but keep raw for now)
            # Assign random price
            price = random.choice([2.99, 4.99, 0.99, 7.50, 5.99])
            
            # Use reliable cover service (Gutenberg covers are sometimes generic, OpenLibrary is better)
            # Using placeholder for consistency or specific reliable URLs if possible
            # Let's use a nice reliable placeholder service that looks like a book
            cover_url = f"https://covers.openlibrary.org/b/title/{book['title'].replace(' ', '+')}-L.jpg"

            c.execute('''
                INSERT INTO books (gutenberg_id, title, author, category, description, price, cover_url, content_path)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                book['id'],
                book['title'],
                book['author'],
                book['category'],
                f"A classic masterpiece by {book['author']}. Read the full text now.",
                price,
                cover_url,
                "db_text_storage" # Flag to say content is stored in a separate Text table or just manage dynamically. 
                # Actually, for sqlite 70k books is heavy, but 10 is fine.
                # Let's Update schema to store content or just save to disk?
                # Storing 10 books in DB text column is fine.
            ))
            
            # We need to update the Schema to actually store the text if we want to serve it.
            # I forgot to add a 'content_blob' or similar to the schema in database.py
            # For now I will assume I can update the row with the content.
            # Wait, database.py had 'content_path'. I'll write the file to disk to keep DB light.
            
            filename = f"books_data/{book['id']}.txt"
            os.makedirs("books_data", exist_ok=True)
            with open(filename, "w", encoding="utf-8") as f:
                f.write(content)
                
            # Update the record with the path
            c.execute("UPDATE books SET content_path = ? WHERE gutenberg_id = ?", (filename, book['id']))
            
            print(f"-> Added {book['title']} (${price})")
        else:
            print(f"-> Failed to download {book['title']}")

    conn.commit()
    conn.close()
    print("Database seeding complete!")

if __name__ == "__main__":
    seed_database()
