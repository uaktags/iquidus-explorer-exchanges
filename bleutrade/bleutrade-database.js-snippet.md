## Add the following to lib/database.js at the top within the ``var`` section
```
, belutrade = require('./markets/belutrade')
```

## Add the following to lib/database.js in ``get_market_data`` on line 191
```
case 'belutrade':
	belutrade.get_data(settings.markets.coin, settings.markets.exchange, function (err, obj) {
		return cb(err, obj);
	});
	break;
```