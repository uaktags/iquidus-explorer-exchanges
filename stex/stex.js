var request = require('request');

var base_url = 'https://api3.stex.com';

function get_summary(currencypairid, cb) {
  var req_url = base_url + '/public/ticker/' + currencypairid;
  request({uri: req_url, json: true}, function (error, response, body) {
    if (error) {
      return cb(error, null);
    } else {
        var summary = [];
		var data = body.data;
        summary['bid'] = data.bid;
        summary['ask'] = data.ask;
        summary['volume'] = data.volume;
        summary['high'] = data.high;
        summary['low'] = data.low;
        summary['last'] = data.last;
        //summary['change'] = body.markets[0].change24h;
        return cb(null, summary);
      //}
    }
  });
}


function get_trades(currencypairid, cb) {
  var req_url = base_url + '/public/trades/' + currencypairid + '?sort=DESC&limit=100';
  request({uri: req_url, json: true}, function (error, response, body) {
    if (body.success == true) {
      return cb (null, body.data);
    } else {
      return cb(body.message, null);
    }
  });
}

function get_orders(currencypairid, cb) {
  var req_url = base_url + '/public/orderbook/' + currencypairid + '?limit_bids=100&limit_asks=100' ;
  request({uri: req_url, json: true}, function (error, response, body) {
    if (body.success == true) {
      var orders = body['data'];
      var buys = [];
      var sells = [];
      if (orders.ask.length > 0){
          for (var i = 0; i < orders.ask.length; i++) {
            var order = {
              amount: parseFloat(orders.ask[i].amount).toFixed(8),
              price: parseFloat(orders.ask[i].price).toFixed(8),
              //  total: parseFloat(orders.buy[i].Total).toFixed(8)
              // Necessary because API will return 0.00 for small volume transactions
              total: orders.ask[i].cumulative_amount.toFixed(8)
            }
            buys.push(order);
          }
      }
      if (orders.bid.length > 0) {
        for (var x = 0; x < orders.bid.length; x++) {
            var order = {
                amount: parseFloat(orders.bid[x].amount).toFixed(8),
                price: parseFloat(orders.bid[x].price).toFixed(8),
                //    total: parseFloat(orders.sell[x].Total).toFixed(8)
                // Necessary because API will return 0.00 for small volume transactions
                total: orders.bid[x].cumulative_amount.toFixed(8)
            }
            sells.push(order);
        }
      }
      return cb(null, buys, sells);
    } else {
      return cb(body.message, [], []);
    }
  });
}

module.exports = {
  get_data: function(currency_pair, cb) {
    var error = null;
    get_orders(currency_pair, function(err, buys, sells) {
      if (err) { error = err; }
		get_summary(currency_pair, function(err, stats) {
          if (err) { error = err; }
		  get_trades(currency_pair, function(err, trades){
			if (err) { error = err; }
			return cb(error, {buys: buys, sells: sells, chartdata: [], trades: trades, stats: stats});
		  });
        });
    });
  }
};