var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin, function (req, res) {
  console.log('Now in joingroup, insert into gid:', req.query.gid);
  var gid = req.query.gid;
  var uid = req.session.uid;
  
  pool.getConnection(function(err, connection) {
    var check_query = "SELECT * FROM BELONGS WHERE gid = " + connection.escape(gid) + " and user_name = " + connection.escape(uid);
    connection.query(check_query, function(err, rows) {
      if (err)throw err;
      if(rows.length > 0){
        console.log('Belongs already have this pairs, attack found');
        return res.redirect('back');
      }
      else {
        var insert_belongs_query = "INSERT INTO BELONGS (user_name, gid) VALUES (" + connection.escape(uid) + "," + connection.escape(gid) + ");";
        connection.query(insert_belongs_query, function(err, rows) {
          if (err)throw err;
          req.flash('success', 'Join group success, enjoy it');
          console.log('Insert success');
          return res.redirect('back');
        });
      }
    });
    connection.release();
  });
});

module.exports = router;
