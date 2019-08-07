const express = require('express');
const router = express.Router();
const rpc_client = require('../rpc_client/rpc_client');

/* GET news. */
router.get('/userId=:userId', (req, res) => {
	let userId = req.params['userId'];
	rpc_client.get_news(userId, result => {
		res.json(result);
	});
	// res.json(test_data);
});

router.post('/userId=:userId&newsId=:newsId', (req, res) => {
	let userId = req.params['userId'];
	let newsId = req.params['newsId'];
	rpc_client.logNewsClickForUser(userId, newsId);
	res.status(200);	
});

module.exports = router;


// const test_data = {
// 	"news": [{
// 			"source": "business-insider",
// 			"author": "Matthew DeBord",
// 			"title": "Elon Musk has no problem selling Tesla cars — but strong demand could become a problem",
// 			"description": "The temptation its to lump all of Tesla's problems together into one big problem bucket, mainly because the Model 3's delays have been so extreme.",
// 			"url": "http://www.businessinsider.com/tesla-strong-demand-could-backfire-become-problem-2018-2",
// 			"urlToImage": "https://amp.businessinsider.com/images/5a8f32db391d941d008b491a-750-375.jpg",
// 			"publishedAt": "2018-02-24T13:57:14Z",
// 			"digest": "3RjuEomJo2adf6OadyZbU7OHA==\n",
// 			"reason": "Today"
// 		},
// 		{
// 			"source": "Kotaku.com",
// 			"author": "Heather Alexandra",
// 			"title": "Riot Discloses Loot Box Odds For League of Legends",
// 			"description": "Riot Games revealed the drop rates for League of Legends’ loot crates yesterday, offering transparency for a system that until now has been opaque. This comes during a time when loot boxes have triggered a great deal of outrage among players, pundits, and eve…",
// 			"url": "https://kotaku.com/riot-discloses-loot-box-odds-for-league-of-legends-1823275409",
// 			"urlToImage": "https://i.kinja-img.com/gawker-media/image/upload/s--QS5t_zTw--/c_fill,fl_progressive,g_center,h_900,q_80,w_1600/j89vioglgrn74sdpzvez.png",
// 			"publishedAt": "2018-02-23T20:00:00Z",
// 			"digest": "3RjduEomJozf6OadyZbU7OHA==\n",
// 			"reason": "Today"
// 		},
// 		{
// 			"url": "http://www.cnn.com/2017/02/13/politics/trump-watch-live-coverage-week-4",
// 			"publishedAt": "2017-02-15T17:43:29.000Z",
// 			"source": "cnn",
// 			"digest": "AGZk1sdSF0TencJhK4ZbGw==\n",
// 			"author": "Daniella Diaz and Alysha Love, CNN",
// 			"class": "World",
// 			"urlToImage": "http://i2.cdn.cnn.com/cnnnext/dam/assets/170213091043-trump-week-4-live-super-tease.jpg",
// 			"description": "President Trump hosts world leaders. Michael Flynn has resigned. There will be high-stakes cabinet votes and more executive actions. We're covering Trump's fourth week in office here.",
// 			"title": "Trump watch: Live coverage"
// 		},
// 		{
// 			"url": "http://us.cnn.com/2017/02/15/politics/house-republicans-earmarks/index.html",
// 			"source": "cnn",
// 			"digest": "Lun9SIzVBuhi+ZIXuKrKLw==\n",
// 			"author": "Tom LoBianco, CNN",
// 			"class": "U.S.",
// 			"urlToImage": "http://i2.cdn.cnn.com/cnnnext/dam/assets/161108211245-us-capitol-building-1108-super-tease.jpg",
// 			"description": "Earmarks, the simultaneously hated and beloved DC tool that lets lawmakers direct money to specific programs and projects, may be coming back.",
// 			"title": "Republicans may bring earmarks back"
// 		},
// 		{
// 			"url": "http://us.cnn.com/2017/02/15/politics/hate-groups-spiked-in-2016/index.html",
// 			"source": "cnn",
// 			"digest": "rotSoejfOk8CB0r+4N7osg==\n",
// 			"author": "Sara Ganim, Chris Welch, Nathaniel Meyersohn",
// 			"class": "U.S.",
// 			"urlToImage": "http://i2.cdn.cnn.com/cnnnext/dam/assets/170215103339-evropa-serve-your-people-super-tease.jpg",
// 			"description": "The number of hate groups in America spiked in 2016, according to the Southern Poverty Law Center.",
// 			"title": "'A resurgence of white nationalism': Hate groups spiked in 2016"
// 		},
// 		{
// 			"url": "http://us.cnn.com/videos/politics/2017/02/15/jake-tapper-comments-conspiracy-theories-donald-trump-michael-flynn-lead.cnn",
// 			"source": "cnn",
// 			"urlToImage": "http://i2.cdn.cnn.com/cnnnext/dam/assets/161221194033-trump-flynn-12-21-super-tease.jpg",
// 			"author": null,
// 			"class": "U.S.",
// 			"description": "CNN's Jake Tapper discusses how President Donald Trump handled the resignation of National Security Adviser Michael Flynn, and how Trump's comments claiming the media was creating \"conspiracy theories\" were false.",
// 			"title": "Tapper calls out Trump on conspiracy theories - CNN Video",
// 			"digest": "3YKE1jeAdnDaTygeomEDug==\n"
// 		},
// 		{
// 			"url": "http://us.cnn.com/videos/politics/2017/02/15/clinton-security-adviser-never-talked-to-russia-sot-tsr.cnn",
// 			"source": "cnn",
// 			"urlToImage": "http://i2.cdn.cnn.com/cnnnext/dam/assets/161216124830-hillary-clinton-super-tease.jpg",
// 			"author": null,
// 			"class": "U.S.",
// 			"description": "As the fallout from Michael Flynn's resignation continues, former national security adviser to Hillary Clinton, Jake Sullivan, says no one from the Clinton campaign ever reached out to Russia during the 2016 presidential campaign.",
// 			"title": "Clinton adviser: I never spoke to Russia - CNN Video",
// 			"digest": "TRUshhvCK8sTarbZoAQApQ==\n"
// 		},
// 		{
// 			"url": "http://us.cnn.com/2017/02/15/politics/jason-chaffetz-inspector-general/index.html",
// 			"source": "cnn",
// 			"urlToImage": "http://i2.cdn.cnn.com/cnnnext/dam/assets/170117204533-chaffetz-cummings-oversight-super-tease.jpg",
// 			"author": "Eli Watkins, CNN",
// 			"class": "U.S.",
// 			"description": "Two top House Republicans asked the Inspector General on Wednesday to investigate leaks surrounding the ouster of former national security adviser Michael Flynn.",
// 			"title": "Chaffetz, Goodlatte ask government watchdog to investigate leaks",
// 			"digest": "E0U0uDU1e1zQcF3/l8kBPw==\n"
// 		}

// 	],
// 	"graph": {
// 		"center": "3RjuEomJo2adf6OadyZbU7OHA==\n",
// 		"links": [{
// 				"from": "3RjuEomJo2adf6OadyZbU7OHA==\n",
// 				"to": "3RjduEomJozf6OadyZbU7OHA==\n"
// 			},
// 			{
// 				"from": "3RjuEomJo2adf6OadyZbU7OHA==\n",
// 				"to": "AGZk1sdSF0TencJhK4ZbGw==\n"
// 			},
// 			{
// 				"from": "3RjuEomJo2adf6OadyZbU7OHA==\n",
// 				"to": "Lun9SIzVBuhi+ZIXuKrKLw==\n"
// 			},
// 			{
// 				"from": "3RjuEomJo2adf6OadyZbU7OHA==\n",
// 				"to": "rotSoejfOk8CB0r+4N7osg==\n"
// 			},
// 			{
// 				"from": "3RjuEomJo2adf6OadyZbU7OHA==\n",
// 				"to": "3YKE1jeAdnDaTygeomEDug==\n"
// 			},
// 			{
// 				"from": "3RjduEomJozf6OadyZbU7OHA==\n",
// 				"to": "TRUshhvCK8sTarbZoAQApQ==\n"
// 			},
// 			{
// 				"from": "AGZk1sdSF0TencJhK4ZbGw==\n",
// 				"to": "E0U0uDU1e1zQcF3/l8kBPw==\n"
// 			}
// 		]
// 	},
// 	"focused_news": {
// 		"source": "The Wall Street Journal",
// 		"title": "Berkshire Hathaway Benefits From US Tax Plan",
// 		"description": "Berkshire Hathaway posted a $29 billion gain in 2017 related to changes in U.S. tax law, a one-time boost that inflated annual profits for the Omaha conglomerate.",
// 		"url": "https://www.wsj.com/articles/berkshire-hathaway-posted-29-billion-gain-in-2017-from-u-s-tax-plan-1519480047",
// 		"urlToImage": "https://si.wsj.net/public/resources/images/BN-XP717_3812B_TOP_20180224064100.jpg",
// 		"publishedAt": "2018-02-24T18:42:00Z",
// 		"digest": "3RjuEomJo26O1syZbU7OHA==\n",
// 		"reason": "Recommend"
// 	}
// };
