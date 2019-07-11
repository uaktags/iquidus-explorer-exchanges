## Add the following to lib/database.js at the top within the ``var`` section
```
, ccex = require('./markets/ccex')
```

## Add the following to lib/database.js in ``get_market_data`` on line 191
```
case 'ccex':
	ccex.get_data(settings.markets.coin, settings.markets.exchange, function (err, obj) {
		return cb(err, obj);
	});
	break;
```