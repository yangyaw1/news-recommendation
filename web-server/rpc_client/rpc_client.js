const jayson = require('jayson');
 
// create a client
const client = jayson.client.http({
  port: 4040,
  hostname: 'localhost'
});

function add(a, b, callback){
    client.request('add', [a, b], (err, response) => {
        if(err) throw err;
        console.log(response.result);
        callback(response.result);
    });
}

function get_news(user_id, callback){
    client.request('get_news', [user_id], (err, response) => {
        if(err) throw err;
        let obj = JSON.parse(response.result);
        callback(obj);
    });
}
 
function logNewsClickForUser(userId, newsId) {
    console.log('send!');
	client.request('log_news_click_for_user', [userId, newsId], (err, response) => {
		if (err) throw err;
	});
}

module.exports = {
    add: add,
    get_news: get_news,
    logNewsClickForUser: logNewsClickForUser
}