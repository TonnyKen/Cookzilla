var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin, function (req, res) {
  console.log('Now in cancel register, delete from mid:', req.query.mid);
  var mid = req.query.mid;
  var uid = req.session.uid;

  pool.getConnection(function(err, connection) {
    var check_query = "SELECT * FROM REGIST WHERE user_name = " + connection.escape(uid) + " and mid = " + connection.escape(mid);
    connection.query(check_query, function(err, rows) {
      if (err)throw err;
      if(rows.length > 0){
        console.log('Could delete here, starting deleting');
        var delete_regist_query = "DELETE FROM REGIST WHERE user_name = " + connection.escape(uid) + " and mid = " +   connection.escape(mid);
        console.log(delete_regist_query);
        connection.query(delete_regist_query, function(err, rows) {
          if (err)throw err;
          console.log('leave regist success');
          return res.redirect('back');
        });
      }
      else {
        console.log('No pairs in REGIST, attack found');
        return res.redirect('back');
      }
    });
    connection.release();
  });
});

module.exports = router;
