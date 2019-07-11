var palitanx = require('./palitanx');
var settings = require('./settings-market-example.json');
palitanx.get_data(settings.markets.coin, settings.markets.exchange, function (err, obj) {
	if(err) throw new Error(err);
	console.log(obj);
  });