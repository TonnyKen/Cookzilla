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
		try {
				if (!(email.length >= 6 && email.length <= 25)) {
					throw new Error('Wrong email address, length limit in 6 - 25');
				}
				if (password.length < 6) {
					throw new Error('Wrong password, at least 6 letters');
				}
				if (nickname.length < 1) {
					throw new Error('Please input your username');
				}
			} catch (e) {
				req.flash('error', e.message);
				return res.redirect('/signup');
			}
		var check_query = "select * from user where LOGIN_NAME = '" + email + "'";
    pool.getConnection(function(err, connection) {
    // Use the connection
			connection.query(check_query, function(err, rows) {
				if(err) throw err;
				if (rows.length > 0){
					req.flash('error', 'You have already signed up with this email');
					return res.redirect('/signup');
				}
				else{
					connection.query('INSERT INTO USER (PROFILE,LOGIN_NAME,PASSWORD,NICK_NAME) VALUES("","' + email + '","' + password + '","' + nickname + '")', function(err, result) {
		        if(err) throw err;
						console.log('Insert success,id:',result.insertId);
						req.session.uid = result.insertId;
						req.session.login_name = email;
						req.session.nick_name = nickname;
						return res.redirect('/main');
					});
				}
			});
      connection.release();
  });
});



module.exports = router;
