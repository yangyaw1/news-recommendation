import './App.css';

import Auth from '../Auth/Auth';
import NewsCard from '../NewsCard/NewsCard';
import Graph from '../Graph/Graph';
import React from 'react';
import Grid from '@material-ui/core/Grid';

class App extends React.Component {
	constructor() {
		super();
		this.state = { data: {}, focused_news: {}, loaded: false };
	}

	componentDidMount() {
		this.loadNews();
	}

	loadNews() {
		const news_url = 'https://' + window.location.hostname + '/news/userId=' + Auth.getEmail();
		const request = new Request(news_url, {
			method: 'GET',
			headers: {
				'Authorization': 'bearer ' + Auth.getToken(),
			},
		});

		fetch(request)
			.then(res => res.json())
			.then(parsed => {
				console.log(parsed);
				this.setState({
					data: parsed,
					focused_news: parsed.focused_news,
					loaded: true
				});
			});
	}

	generateGraphData(graphData) {
		const nodes = graphData.news.map(news => ({ id: news.digest, news: news }));

		const gData = {
			nodes: nodes,
			links: graphData.graph.links
				.map(link => ({
					source: link.from,
					target: link.to
				}))
		};

		return gData;
	}

	handleNodeClick(node) {
		this.setState({
			focused_news: node.news
		});
	}

	render() {
		if (this.state.loaded === false) {
			return (<div></div>);
		}

		const graphData = this.generateGraphData(this.state.data);
		return (
			<div>
        <Grid container>
          <Grid item md={8}>
            <Graph graphData={graphData} handleNodeClick={(node) => this.handleNodeClick(node)}/>
          </Grid>
          <Grid item md={4}>
            <NewsCard news={this.state.focused_news} />
          </Grid>
        </Grid>
      </div>
		);
	}
}

export default App;