import os
import sys

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

from cloudAMQP_client import CloudAMQPClient

SCRAPE_NEWS_TASK_QUEUE_URL = 'amqp://crrfobkn:vaiUzKBTiM8UvfK7cGPDl-W4L7QQTpMe@caterpillar.rmq.cloudamqp.com/crrfobkn'
SCRAPE_NEWS_TASK_QUEUE_NAME = 'fetcher_monitor'
DEDUPE_NEWS_TASK_QUEUE_URL = 'amqp://tguqkxvf:sMLEmVPLcExOdejsL9PMP4Y8muuWcOce@caterpillar.rmq.cloudamqp.com/tguqkxvf'
DEDUPE_NEWS_TASK_QUEUE_NAME = 'monitor_deduper'

def clearQueue(queue_url, queue_name):
    queue_client = CloudAMQPClient(queue_url, queue_name)

    num_of_messages = 0

    while True:
        if queue_client is not None:
            msg = queue_client.getMessage()
            if msg is None:
                print("Cleared %d messages." % num_of_messages)
                return
            num_of_messages += 1


if __name__ == "__main__":
    clearQueue(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)
    clearQueue(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)