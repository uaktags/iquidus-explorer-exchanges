## Add the following to lib/database.js at the top within the ``var`` section
```
, poloniex = require('./markets/poloniex')
```

## Add the following to lib/database.js in ``get_market_data`` on line 191
```
case 'poloniex':
	nova.get_data(settings.markets.coin, settings.markets.exchange, function (err, obj) {
		return cb(err, obj);
	});
	break;
```