var bittrex = require('./novaexchange');
var settings = require('./settings-market-example.json');
bittrex.get_data(settings.markets.coin, settings.markets.exchange, function (err, obj) {
	if(err) throw new Error(err);
	console.log(obj);
  });