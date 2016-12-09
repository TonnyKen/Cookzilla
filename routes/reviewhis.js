var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;

router.get('/', function (req, res) {
  console.log('Now in ./reviewhis, params:',req.query.rid);
  var rid = req.query.rid;
  history_query = 'SELECT * FROM REVIEW WHERE RID = "' + rid + '";';
  pool.getConnection(function(err, connection) {
    connection.query(history_query, function(err, rows) {
      if (err)throw err;
      console.log(rows);
      if(!req.session.uid) {
        res.render('reviewshis',{reviews:rows, userinfo:false});
      }
      else {
        res.render('reviewshis',{reviews:rows, userinfo:true, uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
      }
    });
    connection.release();
  });
  // res.render('user',{userinfo:true, uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
});

module.exports = router;
