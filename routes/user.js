var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin, function (req, res) {
  console.log('Now in ./User');
  var uid = req.session.uid;
  var search_posts = 'select * from recipe natural join post where user_name = ' + uid + ';';
  var search_groups = 'select * from belongs natural join groups where user_name ='+ uid +';';
  pool.getConnection(function(err, connection) {
    connection.query(search_posts, function(err, rows) {
      if (err)throw err;
      var recipes = rows;
      connection.query(search_groups, function(err, rows) {
        if (err)throw err;
        var groups = rows;
        res.render('user',{userinfo:true, recipes:recipes, groups:groups, uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
      });
    });
    connection.release();
  });
});

module.exports = router;
