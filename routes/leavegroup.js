var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin, function (req, res) {
  console.log('Now in leavegroup, delete from gid:', req.query.gid);
  var gid = req.query.gid;
  var uid = req.session.uid;
  check_query = "SELECT * FROM BELONGS WHERE gid = " + "'" + gid + "' and user_name = " + "'" + uid + "';";
  delete_belongs_query = "DELETE FROM BELONGS WHERE user_name = '" + uid + "' and gid = '" +   gid + "';";
  delete_regist_query = "DELETE FROM REGIST WHERE (user_name, mid) in (select * from (select * from Regist where user_name = '"+ uid + "') as A where A.mid in (select mid from groups natural join Organize natural join Meeting where gid = '"+ gid +"'));";
  pool.getConnection(function(err, connection) {
    connection.query(check_query, function(err, rows) {
      if (err)throw err;
      if(rows.length > 0){
        console.log('Could delete here, starting deleting');
        connection.query(delete_belongs_query, function(err, rows) {
          if (err)throw err;
          console.log('leave group success');
          connection.query(delete_regist_query, function(err, rows) {
            if (err)throw err;
            console.log('delete register success');
            return res.redirect('back');
          });
        });
      }
      else {
        console.log('No pairs in belongs, attack found');
        return res.redirect('back');
      }
    });
    connection.release();
  });
});

module.exports = router;
