import sqlite3
from database import get_db_connection

def create_demo_user():
    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute("INSERT OR IGNORE INTO users (id, name, email, password_hash) VALUES (1, 'Demo User', 'demo@test.com', 'hashed')")
        conn.commit()
        print("Demo User Created or Exists.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    create_demo_user()
