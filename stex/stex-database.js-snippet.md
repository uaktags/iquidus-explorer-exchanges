## Add the following to lib/database.js at the top within the ``var`` section
```
, stex = require('./markets/stex')
```

## Add the following to lib/database.js in ``get_market_data`` on line 191
```
case 'stex':
	stex.get_data(settings.markets.stex_currency_pair_id, function (err, obj) {
		return cb(err, obj);
	});
	break;
```