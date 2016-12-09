var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
// var $conf = require('../config/default');
// var connection = mysql.createConnection($conf.mysql);

var jsonWrite = function (res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code:'1',
			msg: 'Can not do it'
		});
	} else {
		res.json(ret);
	}
};

router.post('/', function (req, res) {
	//req.session.reset();
    var password = req.body.password,
      	email = req.body.email;
      	console.log(email);
      	console.log(password);
		pool.getConnection(function(err, connection) {
			// Use the connection
			connection.query('select user_name, password from User where login_name = "' + email + '"', function(err, rows) {
				console.log(rows);
				var uid = rows[0].user_name;
				if(rows[0].password === password) {
					req.session.uid = uid;
					res.redirect('/main');
					console.log(req.session.uid);
				}
			connection.release();			// Don't use the connection here, it has been returned to the pool.
			});
		});
    //res.redirect();
});

module.exports = router;
