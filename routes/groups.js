var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
// var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', function (req, res) {
  console.log('Now in ./groups get');
  //res.render('search_result');
  search_query = 'SELECT GID,GNAME, DESCRIPTION FROM GROUPS';
  pool.getConnection(function(err, connection) {
    connection.query(search_query, function(err, rows) {
      if (err)throw err;
      if(!req.session.uid) {
        res.render('groups',{groups:rows, userinfo:false});
      }
      else {
        res.render('groups',{groups:rows, userinfo:true, uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
      }
      // And done with the connection.
    connection.release();
    });
  });
});

module.exports = router;
