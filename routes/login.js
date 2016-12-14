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
		console.log('Now in ./login post');
	//req.session.reset();
    var password = req.body.password,
      	email = req.body.email;
		pool.getConnection(function(err, connection) {
			// Use the connection
			var check_query = 'select user_name, password, login_name, nick_name from User where login_name = ' +  connection.escape(email) + ' and password =' + connection.escape(password);
			console.log(check_query);
			connection.query(check_query, function(err, rows) {
				if (err)throw err;
				if(rows.length === 1) {
					req.session.uid = rows[0].user_name;
					req.session.login_name = rows[0].login_name;
					req.session.nick_name = rows[0].nick_name;
					return res.redirect('/main');
				}
				else{
					req.flash('error', 'email or password wrong, type again');
					return res.redirect('/signup');
				}
			connection.release();			// Don't use the connection here, it has been returned to the pool.
			});
		});
    //res.redirect();
});

module.exports = router;
