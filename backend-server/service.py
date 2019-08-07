""" Backend Service. """
from datetime import datetime
import json
import logging
import os
import sys

from bson.json_util import dumps # pylint: disable=import-error
from jsonrpclib.SimpleJSONRPCServer import SimpleJSONRPCServer # pylint: disable=import-error

sys.path.append(os.path.join(os.path.dirname(__file__),'..' ,'common'))
import mongodb_client

from cloudAMQP_client import CloudAMQPClient

LOG_CLICKS_TASK_QUEUE_URL = 'amqp://wfucolex:FrdYcR6MvErGpVApKYwz5XG1sEwK2KCB@caterpillar.rmq.cloudamqp.com/wfucolex'
LOG_CLICKS_TASK_QUEUE_NAME = 'loger_clicker'

SERVER_HOST = 'localhost'
SERVER_PORT = 4040

LOGGER_FORMAT = '%(asctime)s - %(message)s'
logging.basicConfig(format = LOGGER_FORMAT)
LOGGER = logging.getLogger('backend_service')
LOGGER.setLevel(logging.DEBUG)

cloudAMQP_client = CloudAMQPClient(LOG_CLICKS_TASK_QUEUE_URL, LOG_CLICKS_TASK_QUEUE_NAME)

def add(num1, num2):
    """ Test method """
    LOGGER.debug("add is called with %d and %d", num1, num2)
    return num1 + num2
    
def get_one_news():
    LOGGER.debug("get_one_news is called")
    res = mongodb_client.get_db()['news'].find_one()
    return json.loads(dumps(res))

def get_news(user_id):
    LOGGER.debug("get_news is called")
    
    res = {}
    res['news'] = []
    preference = mongodb_client.get_db()['user_preference_model'].find_one({"userId": user_id})
    print(preference)
    if preference == None or preference["preference"] == []:
        news = mongodb_client.get_db()['news'].find().sort("publishedAt",-1).limit(30)
        for single_news in news:
            res['news'].append(single_news)
    else:
        count = 30
        for label in preference["preference"]:
            print(label)
            n = min(count, round(30*preference["preference"][label]))
            count -= n
            news = mongodb_client.get_db()['news'].find({"class": label}).sort("publishedAt",-1).limit(n)
            for single_news in news:
                res['news'].append(single_news)
            if count <= 0:
                break
            
    res['focused_news'] = res['news'][0];
    res['graph'] = {};
    res['graph']['center'] = res['news'][0]['digest'];
    res['graph']['links'] = [];
    class_by_digest = {};
    for single_news in res['news']:
        label = single_news['class']
        digest = single_news['digest']
        if label not in class_by_digest:
            class_by_digest[label] = []
        class_by_digest[label].append(digest)
        
    for label in class_by_digest:
        one_label_class = class_by_digest[label]
        for i in range(len(one_label_class)):
            for j in range(i+1, len(one_label_class)):
                new_link = {}
                new_link['from'] = one_label_class[i]
                new_link['to'] = one_label_class[j]
                res['graph']['links'].append(new_link)
        
    return dumps(res)
    
def log_news_click_for_user(user_id, news_id):
    LOGGER.debug('log_news_click_for_user is called with %s and %s', user_id, news_id)
    message = {'userId':user_id, 'newsId':news_id, 'timestamp':str(datetime.utcnow())}
    cloudAMQP_client.sendMessage(message)
    
def start(host=SERVER_HOST, port=SERVER_PORT):
    # Start RPC server
    server = SimpleJSONRPCServer((host, port))
    server.register_function(add, 'add')
    server.register_function(get_one_news, 'get_one_news')
    server.register_function(get_news, 'get_news')
    server.register_function(log_news_click_for_user, 'log_news_click_for_user')
    LOGGER.info("Starting RPC server on %s:%d", host, port) 
    server.serve_forever()

if __name__ == "__main__":
    start()