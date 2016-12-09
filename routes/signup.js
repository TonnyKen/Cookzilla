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
        var uid = result.insertId;
        console.log(uid);
        req.session.uid = uid;
        if(err) throw err;
        console.log(result);
        res.redirect('/main');
      });
      connection.release();
    });
});



module.exports = router;
