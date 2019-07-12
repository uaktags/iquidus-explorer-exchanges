var coinexchange = require('./coinexchange');
var settings = require('./settings-market-example.json');

coinexchange.get_data(settings.markets.coin, settings.markets.exchange, function (err, obj) {
	if(err) throw new Error(err);
	console.log(obj);
  });