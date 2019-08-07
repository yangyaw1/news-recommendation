from pymongo import MongoClient

MONGO_DB_HOST = 'localhost'
MONGO_DB_PORT = '27017'
DB_NAME = 'trendy'

# Prevent creating a lot instances
client = MongoClient("%s:%s" % (MONGO_DB_HOST, MONGO_DB_PORT))

def get_db(db_name=DB_NAME):
    db = client[db_name]
    return db
    