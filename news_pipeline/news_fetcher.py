import logging
import os
import sys

from newspaper import Article

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
from cloudAMQP_client import CloudAMQPClient

SLEEP_TIME_IN_SECONDS = 5

SCRAPE_NEWS_TASK_QUEUE_URL = 'amqp://crrfobkn:vaiUzKBTiM8UvfK7cGPDl-W4L7QQTpMe@caterpillar.rmq.cloudamqp.com/crrfobkn'
SCRAPE_NEWS_TASK_QUEUE_NAME = 'fetcher_monitor'
DEDUPE_NEWS_TASK_QUEUE_URL = 'amqp://tguqkxvf:sMLEmVPLcExOdejsL9PMP4Y8muuWcOce@caterpillar.rmq.cloudamqp.com/tguqkxvf'
DEDUPE_NEWS_TASK_QUEUE_NAME = 'monitor_deduper'


LOGGER_FORMAT = '%(asctime)s - %(message)s'
logging.basicConfig(format=LOGGER_FORMAT)
LOGGER = logging.getLogger('news_fetcher')
LOGGER.setLevel(logging.DEBUG)

dedupe_news_queue_client = None
scrape_news_queue_client = None

def handle_message(msg):
	if not isinstance(msg, dict):
		LOGGER.warning('message is broken')
		return

	text = None

	article = Article(msg['url'])
	article.download()
	article.parse()

	msg['text'] = article.text
	dedupe_news_queue_client.sendMessage(msg)


def run():
	while True:
		if scrape_news_queue_client is not None:
			msg = scrape_news_queue_client.getMessage()
			if msg is not None:
				try:
					handle_message(msg)
				except Exception as e:
					LOGGER.warning(e)
					pass
			scrape_news_queue_client.sleep(SLEEP_TIME_IN_SECONDS)


if __name__ == "__main__":
	scrape_news_queue_client = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)
	dedupe_news_queue_client = CloudAMQPClient(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)

	run()