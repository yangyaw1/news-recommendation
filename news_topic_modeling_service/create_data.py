import os
import sys
import csv

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import mongodb_client
import news_topic_modeling_service_client

if __name__ == '__main__':
    writer = csv.writer(open("data.csv", 'w'))
    db = mongodb_client.get_db()
    cursor = db['news'].find({})
    count = 0
    for news in cursor:
        if 'description' in news and news['description'] is not None:
            writer.writerow([news['class'], news['description'], news['source']])
        elif 'title' in news and news['title'] is not None:
            writer.writerow([news['class'], news['title'], news['source']])