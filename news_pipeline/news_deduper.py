import datetime
import logging
import os
import sys

from dateutil import parser
from sklearn.feature_extraction.text import TfidfVectorizer

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import mongodb_client
import news_topic_modeling_service_client
from cloudAMQP_client import CloudAMQPClient

DEDUPE_NEWS_TASK_QUEUE_URL = 'amqp://tguqkxvf:sMLEmVPLcExOdejsL9PMP4Y8muuWcOce@caterpillar.rmq.cloudamqp.com/tguqkxvf'
DEDUPE_NEWS_TASK_QUEUE_NAME = 'monitor_deduper'

SLEEP_TIME_IN_SECONDS = 1

NEWS_TABLE_NAME = "news"

SAME_NEWS_SIMILARITY_THRESHOLD = 0.9

logger_format = '%(asctime)s - %(message)s'
logging.basicConfig(format=logger_format)
logger = logging.getLogger('news_deduper')
logger.setLevel(logging.DEBUG)

cloudAMQP_client = CloudAMQPClient(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)

def handle_message(msg):
    if msg is None or not isinstance(msg, dict) :
        return
    text = msg['text']
    if text is None:
        return

    # get all recent news based on publishedAt
    published_at = parser.parse(msg['publishedAt'])
    published_at_begin = published_at - datetime.timedelta(days=1)
    published_at_end = published_at + datetime.timedelta(days=1)

    db = mongodb_client.get_db()
    recent_news_list= list(db[NEWS_TABLE_NAME].find({'publishedAt': {'$gte': published_at_begin, '$lt': published_at_end}}))

    if recent_news_list is not None and len(recent_news_list) > 0:
        documents = [news['text'] for news in recent_news_list]
        documents.insert(0, text)

        # Calculate similarity matrix
        tfidf = TfidfVectorizer().fit_transform(documents)
        pairwise_sim = tfidf * tfidf.T

        logger.debug("Pairwise Sim:%s", str(pairwise_sim))

        rows, _ = pairwise_sim.shape

        for row in range(1, rows):
            if pairwise_sim[row, 0] > SAME_NEWS_SIMILARITY_THRESHOLD:
                # Duplicated news. Ignore.
                logger.info("Duplicated news. Ignore.")
                return
    msg['publishedAt'] = parser.parse(msg['publishedAt'])

    # Classify news
    description = msg['description']
    if description is None:
        description = msg['title']

    topic = news_topic_modeling_service_client.classify(description)
    msg['class'] = topic

    db[NEWS_TABLE_NAME].replace_one({'digest': msg['digest']}, msg, upsert=True)

def run():
    while True:
        if cloudAMQP_client is not None:
            msg = cloudAMQP_client.getMessage()
            if msg is not None:
                # Parse and process the msg
                try:
                    handle_message(msg)
                except Exception as e:
                    logger.warning(e)
                    pass

            cloudAMQP_client.sleep(SLEEP_TIME_IN_SECONDS)

if __name__ == "__main__":
    run()