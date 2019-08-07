import os
import random
import requests

from lxml import html


GET_CNN_NEWS_XPATH = """//p[contains(@class, 'zn-body__paragraph')]//text() | //div[contains(@class, 'zn-body__paragraph')]//text()"""

USER_AGENTES_FILE = os.path.join(os.path.dirname(__file__), 'user_agents.txt')
USER_AGENTS = []

with open(USER_AGENTES_FILE, 'r') as uaf:
	for ua in uaf.readlines():
		if ua:
			USER_AGENTS.append(ua.strip()[1:-1])
random.shuffle(USER_AGENTS)


def _get_headers():
	ua = random.choice(USER_AGENTS)
	headers = {
		"Connection":"close",
		"User-Agent":ua
	}

	return headers

def extract_news(news_url):
	response = requests.get(news_url, headers=_get_headers())
	news = {}

	try:
		tree = html.fromstring(response.content)
		news = tree.xpath(GET_CNN_NEWS_XPATH)
		news = '\n'.join(news)
	except Exception:
		return {}

	return news