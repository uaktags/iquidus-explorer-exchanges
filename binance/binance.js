"use strict";
var request = require('request');

var base_url = 'https://api.binance.com/api/v1';

function get_summary(coin, exchange, cb) {
  var req_url = base_url + '/ticker/24hr?symbol=' + coin + exchange;
  var summary = {};
  request({uri: req_url, json: true}, function (error, response, body) {
    if (error) {
      return cb(error, null);
    } else {
      summary['bid'] = parseFloat(body.bidPrice).toFixed(8);
      summary['ask'] = parseFloat(body.askPrice).toFixed(8);
      summary['volume'] = parseFloat(body.qouteVolume);
      summary['volume_btc'] = parseFloat(body.volume);
      summary['high'] = parseFloat(body.highPrice).toFixed(8);
      summary['low'] = parseFloat(body.lowPrice).toFixed(8);
      summary['last'] = parseFloat(body.lastPrice).toFixed(8);
      return cb (null, summary);
    }
  });
}

function get_trades(coin, exchange, cb) {
    var req_url = base_url + '/trades?symbol=' + coin + exchange + '&limit=100';
    request({uri: req_url, json: true}, function (error, response, body) {
      if (!error) {
        return cb (null, body);
      } else {
        return cb(error, null);
      }
    });
    return [];
  }

function get_orders(coin, exchange, cb) {
    var req_url = base_url + '/depth?symbol=' + coin + exchange ;
    request({uri: req_url, json: true}, function (error, response, body) {
      if (!error) {
        var orders = body;
        var buys = [];
        var sells = [];
        if (orders.bids.length > 0){
            for (var i = 0; i < orders.bids.length; i++) {
              var order = {
                amount: parseFloat(orders.bids[i][1]).toFixed(8),
                price: parseFloat(orders.bids[i][0]).toFixed(8),
                //  total: parseFloat(orders.buy[i].Total).toFixed(8)
                // Necessary because API will return 0.00 for small volume transactions
                total:  parseFloat(orders.bids[i][1]).toFixed(8)
              }
              buys.push(order);
            }
        }
        if (orders.asks.length > 0) {
          for (var x = 0; x < orders.asks.length; x++) {
              var order = {
                  amount: parseFloat(orders.asks[x][1]).toFixed(8),
                  price: parseFloat(orders.asks[x][0]).toFixed(8),
                  // total: parseFloat(orders.sell[x].Total).toFixed(8)
                  // Necessary because API will return 0.00 for small volume transactions
                  total: parseFloat(orders.asks[x][1]).toFixed(8)
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