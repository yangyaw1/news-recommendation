const client = require('./rpc_client');

client.add(1, 2, result => {
    console.assert(result === 3)
});

client.get_news(0, result => {
    console.assert(result.length === 50)
});