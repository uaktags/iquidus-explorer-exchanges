"use strict";
var request = require('request');

var base_url = 'https://digitalprice.io/api';

function get_summary(coin, exchange, cb) {
  var req_url = base_url + '/markets?baseMarket=' + exchange;
  var summary = {};
  request({uri: req_url, json: true}, function (error, response, body) {
    if (error) {
      return cb(error, null);
    } else {
      if (!body.success) {
        return cb(error, null);
      } else {
        for (let element of body.data) {
            if (element.url == (coin + '-' + exchange).toLowerCase()) {
                summary['bid'] = parseFloat(element.bidHigh).toFixed(8);
                summary['ask'] = parseFloat(element.askLow).toFixed(8);
                summary['volume'] = parseFloat(element.volumeQuote);
                summary['volume_btc'] = parseFloat(element.volumeBase);
                summary['high'] = parseFloat(element.priceHigh).toFixed(8);
                summary['low'] = parseFloat(element.priceLow).toFixed(8);
                summary['last'] = parseFloat(element.priceLast).toFixed(8);
                return cb (null, summary);
                break;
            }
        }
        return cb(error, null);
      }
    }
  });
}

function get_trades(coin, exchange, cb) {
    var req_url = base_url + '/history?market=' + coin + '-' + exchange;
    request({uri: req_url, json: true}, function (error, response, body) {
      if (body.success) {
        return cb (null, body.data);
      } else {
          
        return cb(body.message, null);
      }
    });
    return [];
  }

function get_orders(coin, exchange, cb) {
    var req_url = base_url + '/orders?market=' + coin + '-' + exchange ;
    request({uri: req_url, json: true}, function (error, response, body) {
      if (body.success == true) {
        var orders = body.data;
        var buys = [];
        var sells = [];
        if (orders.BUY.length > 0){
            for (var i = 0; i < orders.BUY.length; i++) {
              var order = {
                amount: parseFloat(orders.BUY[i].amount).toFixed(8),
                price: parseFloat(orders.BUY[i].price).toFixed(8),
                //  total: parseFloat(orders.buy[i].Total).toFixed(8)
                // Necessary because API will return 0.00 for small volume transactions
                total:  parseFloat(orders.BUY[i].total).toFixed(8)
              }
              buys.push(order);
            }
        }
        if (orders.SELL.length > 0) {
          for (var x = 0; x < orders.SELL.length; x++) {
              var order = {
                  amount: parseFloat(orders.SELL[x].amount).toFixed(8),
                  price: parseFloat(orders.SELL[x].price).toFixed(8),
                  // total: parseFloat(orders.sell[x].Total).toFixed(8)
                  // Necessary because API will return 0.00 for small volume transactions
                  total: parseFloat(orders.SELL[x].total).toFixed(8)
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