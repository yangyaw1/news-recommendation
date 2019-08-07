import requests

from json import loads

NEWS_API_ENDPOINT = 'https://newsapi.org/v1/'
NEWS_API_KEY = 'd0bd1e61ad2f486abe8c478c0302ebe1'

ARTICLES_API = 'articles'

CNN = 'cnn'

DEFAULT_SOURCES = [CNN]
SORT_BY_TOP = 'top'


def get_news_from_sources(sources=DEFAULT_SOURCES, sortBy=SORT_BY_TOP):
	articles = []

	for source in sources:
		playload = {
			'apiKey': NEWS_API_KEY,
			'source': source,
			'sortBy': sortBy
		}

		response = requests.get(NEWS_API_ENDPOINT + ARTICLES_API, params=playload)
		res_json = loads(response.content.decode('utf-8'))

		# Extrat news from response.
		if (res_json is not None and
				res_json['status'] == 'ok' and
				res_json['source'] is not None):
			for news in res_json['articles']:
				news['source'] = res_json['source']

			articles.extend(res_json['articles'])

	return articles
