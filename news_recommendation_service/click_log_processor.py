# -*- coding: utf-8 -*-

'''
Time decay model:
If selected:
p = (1-α)p + α
If not:
p = (1-α)p
Where p is the selection probability, and α is the degree of weight decrease.
The result of this is that the nth most recent selection will have a weight of
(1-α)^n. Using a coefficient value of 0.05 as an example, the 10th most recent
selection would only have half the weight of the most recent. Increasing epsilon
would bias towards more recent results more.
'''

import logging
import news_classes
import os
import sys

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import mongodb_client
from cloudAMQP_client import CloudAMQPClient

NUM_OF_CLASSES = 8
INITIAL_P = 1.0 / NUM_OF_CLASSES

ALPHA = 0.1

SLEEP_TIME_IN_SECONDS = 1

LOG_CLICKS_TASK_QUEUE_URL = 'amqp://wfucolex:FrdYcR6MvErGpVApKYwz5XG1sEwK2KCB@caterpillar.rmq.cloudamqp.com/wfucolex'
LOG_CLICKS_TASK_QUEUE_NAME = 'loger_clicker'

PREFERENCE_MODEL_TABLE_NAME = "user_preference_model"
NEWS_TABLE_NAME = "news"

LOGGER_FORMAT = '%(asctime)s - %(message)s'
logging.basicConfig(format=LOGGER_FORMAT)
LOGGER = logging.getLogger('click_log_processor')
LOGGER.setLevel(logging.DEBUG)

cloudAMQP_client = CloudAMQPClient(LOG_CLICKS_TASK_QUEUE_URL, LOG_CLICKS_TASK_QUEUE_NAME)


def handle_message(msg):
  if msg is None or not isinstance(msg, dict):
    return

  if ('userId' not in msg
      or 'newsId' not in msg):
    return

  userId = msg['userId']
  newsId = msg['newsId']

  # Update user's preference model.
  db = mongodb_client.get_db()
  model = db[PREFERENCE_MODEL_TABLE_NAME].find_one({'userId':userId})

  # If model not exists, create a new one.
  if model is None:
    LOGGER.info("Creating preference model for new user: %s", userId)
    model = {'userId': userId}
    preference = {}
    for clazz in news_classes.classes:
      preference[clazz] = float(INITIAL_P)
    model['preference'] = preference

  LOGGER.info("Updating preference model user: %s", userId)

  # Update model using time decay method.
  news = db[NEWS_TABLE_NAME].find_one({'digest':newsId})
  if (news is None or 'class' not in news or news['class'] not in news_classes.classes):
    return

  click_class = news['class']

  # Update the clicked class.
  old_p = model['preference'][click_class]
  model['preference'][click_class] = float((1 - ALPHA) * old_p + ALPHA)

  # Update not clickes classes.
  for clazz, prob in model['preference'].items():
    if not clazz == click_class:
      model["preference"][clazz] = float(1 - ALPHA) * model["preference"][clazz]

  db[PREFERENCE_MODEL_TABLE_NAME].replace_one({'userId':userId}, model, upsert=True)


def run():
  while True:
    if cloudAMQP_client is not None:
      msg = cloudAMQP_client.getMessage()
      if msg is not None:
        try:
          handle_message(msg)
        except Exception as e:
          LOGGER.warn(e)

      cloudAMQP_client.sleep(SLEEP_TIME_IN_SECONDS)

if __name__ == "__main__":
  run()