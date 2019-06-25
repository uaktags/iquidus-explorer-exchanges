var stex = require('./stex');

stex.get_data(702, function (err, obj) {
	if(err) throw new Error(err);
	console.log(obj);
  });