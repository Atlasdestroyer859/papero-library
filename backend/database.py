import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Store DB in the backend directory for consistency, or root. 
# Let's keep it in the backend folder to avoid cluttering root, but previous logs showed root usage.
# To match current confirmed working state (app.py from root), let's use the one in root?
# Actually, better to place it in backend/ folder to be self-contained.
# ...Wait, the verification showed 133 books in root DB? Let's check the previous tool output first.
# Safe bet: Use os.path.dirname(__file__) which is 'backend/'. 
# But if app.py is run from root, 'ebook_market.db' is in root.
# I will switch to using the ROOT directory explicitly.
DB_NAME = os.path.join(os.path.dirname(BASE_DIR), "ebook_market.db")

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    
    # Users Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Books Table (Real Content from Internet Archive)
    c.execute('''
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ia_id TEXT UNIQUE,          -- Internet Archive ID (e.g. 'prideandprejudic00aust')
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            cover_url TEXT,             -- Full URL to OpenLibrary Cover
            category TEXT,
            description TEXT,
            price INTEGER DEFAULT 0,    -- Pre-calculated Price in INR
            rating REAL DEFAULT 4.5,
            year INTEGER
        )
    ''')
    
    # Purchases Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS purchases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            book_id INTEGER,
            purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            progress INTEGER DEFAULT 0,
            last_read_at TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (book_id) REFERENCES books (id),
            UNIQUE(user_id, book_id)
        )
    ''')

    # --- PHASE 6: NEW INTERACTIVE TABLES ---

    # User Profiles (Gamification & Avatar)
    c.execute('''
        CREATE TABLE IF NOT EXISTS user_profiles (
            user_id INTEGER PRIMARY KEY,
            bio TEXT,
            avatar_url TEXT,
            fav_genres TEXT, -- JSON string
            streak_days INTEGER DEFAULT 0,
            last_login TIMESTAMP,
            badges TEXT, -- JSON string
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Interactions (Likes/Dislikes for AI Training)
    c.execute('''
        CREATE TABLE IF NOT EXISTS interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            book_id TEXT, -- Can be local ID or global 'ext_' ID
            interaction_type TEXT, -- 'like', 'dislike', 'onboard_interest'
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Comments & Ratings (Community)
    c.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            book_id TEXT, -- Can be local ID or global 'ext_' ID
            text TEXT,
            rating INTEGER, -- 1-5 Star
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # --- MIGRATION LOGIC (Self-Healing) ---
    try:
        # Check if 'last_read_at' exists in purchases
        c.execute("SELECT last_read_at FROM purchases LIMIT 1")
    except sqlite3.OperationalError:
        print("🔧 Migrating DB: Adding 'last_read_at' to purchases...")
        c.execute("ALTER TABLE purchases ADD COLUMN last_read_at TIMESTAMP")
        
    conn.commit()
    conn.close()
    print(f"Database {DB_NAME} initialized successfully with Phase 6 Schema.")

if __name__ == "__main__":
    init_db()
