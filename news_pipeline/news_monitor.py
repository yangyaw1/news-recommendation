import datetime
import hashlib
import logging
import os
import redis
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
import news_api_client
from cloudAMQP_client import CloudAMQPClient

REDIS_HOST = 'localhost'
REDIS_PORT = 6379

SLEEP_TIME_IN_SECONDS = 10
NEWS_TIMEOUT_IN_SECONDS = 3600 * 24 * 3

SCRAPE_NEWS_TASK_QUEUE_URL = 'amqp://crrfobkn:vaiUzKBTiM8UvfK7cGPDl-W4L7QQTpMe@caterpillar.rmq.cloudamqp.com/crrfobkn'
SCRAPE_NEWS_TASK_QUEUE_NAME = 'fetcher_monitor'

NEWS_SOURCES = [
    'bbc-news',
    'bbc-sport',
    'bloomberg',
    'cnn',
    'entertainment-weekly',
    'espn',
    'ign',
    'techcrunch',
    'the-new-york-times',
    'the-wall-street-journal',
    'the-washington-post'
]

LOGGER_FORMAT = '%(asctime)s - %(message)s'
logging.basicConfig(format=LOGGER_FORMAT)
LOGGER = logging.getLogger('news_monitor')
LOGGER.setLevel(logging.DEBUG)

redis_client = None
cloudAMQP_client = None


def run():
	while True:
		news_list = news_api_client.get_news_from_sources(NEWS_SOURCES)

		num_of_new_news = 0

		for news in news_list:
			news_digest = hashlib.md5(news['title'].encode('utf-8')).hexdigest()

			if redis_client.get(news_digest) is None:
				num_of_new_news += 1
				news['digest'] = news_digest

				if news['publishedAt'] is None:
					news['publishedAt'] = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

				redis_client.set(news_digest, 'True')
				redis_client.expire(news_digest, NEWS_TIMEOUT_IN_SECONDS)

				cloudAMQP_client.sendMessage(news)

		LOGGER.info("Fetched %d news.", num_of_new_news)
		cloudAMQP_client.sleep(SLEEP_TIME_IN_SECONDS)


if __name__ == "__main__":
	redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT)
	cloudAMQP_client = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)

	run()