var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
//var $conf = require('../config/default');
//var connection = mysql.createConnection($conf.mysql);

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

router.get('/', function (req, res) {
  res.render('signup');
});

router.post('/', function (req, res) {
    var password = req.body.password,
      email = req.body.email,
      nickname = req.body.username;
//    console.log(req.body.username);
      pool.getConnection(function(err, connection) {
      // Use the connection
      connection.query('INSERT INTO USER (PROFILE,LOGIN_NAME,PASSWORD,NICK_NAME) VALUES("","' + email + '","' + password + '","' + nickname + '")', function(err, result) {
        if(err) throw err;
				connection.query('select user_name, password, login_name, nick_name from User where login_name = "' + email + '"', function(err, rows) {
					if(rows[0].password === password) {
						req.session.uid = rows[0].user_name;
						req.session.login_name = rows[0].login_name;
						req.session.nick_name = rows[0].nick_name;
						return res.redirect('/main');
					}
				});
      });
      connection.release();
    });
});



module.exports = router;
