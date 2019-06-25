var request = require('request');

var base_url = 'https://novaexchange.com/remote/v2';

function get_summary(coin, exchange, cb) {
  var req_url = base_url + '/market/info/' + exchange + "_" + coin + "/";
  request({uri: req_url, json: true}, function (error, response, body) {
    if (error) {
      return cb(error, null);
    } else {
        var summary = [];
        summary['bid'] = body.markets[0].bid;
        summary['ask'] = body.markets[0].ask;
        summary['volume'] = body.markets[0].volume24h;
        summary['high'] = body.markets[0].high24h;
        summary['low'] = body.markets[0].low24h;
        summary['last'] = body.markets[0].last_price;
        summary['change'] = body.markets[0].change24h;
        return cb(null, summary);
      //}
    }
  });
}


function get_trades(coin, exchange, cb) {
  var req_url = base_url + '/market/orderhistory/'+exchange + '_' + coin + "/";
  request({uri: req_url, json: true}, function (error, response, body) {
    if (body.status == 'success') {
      return cb (null, body.items);
    } else {
      return cb(body.message, null);
    }
  });
  return [];
}

function get_orders(coin, exchange, cb) {
  var req_url = base_url + '/market/openorders/' + exchange + '_' + coin + '/BOTH/' ;
  request({uri: req_url, json: true}, function (error, response, body) {
    if (body.success == true) {
      var orders = body;
      var buys = [];
      var sells = [];
      if (orders.buyorders.length > 0){
          for (var i = 0; i < orders.buyorders.length; i++) {
            var order = {
              amount: parseFloat(orders.buyorders[i].baseamount).toFixed(8),
              price: parseFloat(orders.buyorders[i].price).toFixed(8),
              //  total: parseFloat(orders.buy[i].Total).toFixed(8)
              // Necessary because API will return 0.00 for small volume transactions
              total: orders.buyorders[i].amount.toFixed(8)
            }
            buys.push(order);
          }
      }
      if (orders.sellorders.length > 0) {
        for (var x = 0; x < orders.sellorders.length; x++) {
            var order = {
                amount: parseFloat(orders.sellorders[x].baseamount).toFixed(8),
                price: parseFloat(orders.sellorders[x].price).toFixed(8),
                // total: parseFloat(orders.sell[x].Total).toFixed(8)
                // Necessary because API will return 0.00 for small volume transactions
                total: orders.sellorders[x].amount.toFixed(8)
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
  get_data: function(coin, exchange, cb) {
    var error = null;
    get_orders(coin, exchange, function(err, buys, sells) {
      if (err) { error = err; }
		get_summary(coin, exchange, function(err, stats) {
          if (err) { error = err; }
		  get_trades(coin, exchange, function(err, trades){
			if (err) { error = err; }
			return cb(error, {buys: buys, sells: sells, chartdata: [], trades: trades, stats: stats});
		  });
        });
    });
  }
};