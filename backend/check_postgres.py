import psycopg2
from psycopg2 import OperationalError

def test_connection():
    # Common default passwords to try
    passwords = ['postgres', 'admin', 'password', '1234', '12345', 'root', '']
    user = 'postgres'
    host = 'localhost'
    port = '5432'
    dbname = 'postgres' # Default DB always exists

    print(f"Testing connection to {host}:{port}...")

    for pwd in passwords:
        try:
            print(f"Trying password: '{pwd}' ... ", end='')
            conn = psycopg2.connect(
                dbname=dbname,
                user=user,
                password=pwd,
                host=host,
                port=port
            )
            print("SUCCESS! ✅")
            print(f"FOUND PASSWORD: {pwd}")
            conn.close()
            return
        except OperationalError:
            print("Failed ❌")

    print("\nCould not find correct password via guessing.")
    print("Please ask the user for their PostgreSQL password.")

if __name__ == "__main__":
    test_connection()
