var graviex = require('./graviex');
var settings = require('./settings-market-example.json');
graviex.get_data(settings.markets.coin.toLowerCase(), settings.markets.exchange.toLowerCase(), function (err, obj) {
	if(err) throw new Error(err);
	console.log(obj);
  });