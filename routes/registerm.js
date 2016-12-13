var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin, function (req, res) {
  console.log('Now in ./registerm, mid = ',req.query.mid);
  var mid = req.query.mid,
    uid = req.session.uid,
    gid = req.session.gid;

  var check_query = 'SELECT * FROM REGIST WHERE user_name = "' + uid + '" and mid="' + mid + '";';
  var check_belong_group = 'SELECT * FROM BELONGS WHERE user_name="'+uid+'" and gid="'+ gid +'";';
  var check_meeting_exist = 'SELECT * FROM MEETING WHERE mid = "' + mid + '";';
  pool.getConnection(function(err, connection) {
    connection.query(check_query, function(err, rows) {
      if (err)throw err;
      if(rows.length > 0) {
        console.log("Already registered");
        return res.redirect('back');
      }
      else {
        connection.query(check_belong_group, function(err, rows) {
          if (err)throw err;
          if (rows.length < 1){
            console.log("Not belong to group yet");
            res.redirect('/group_detail?gid='+gid);
          }
          else{
            connection.query(check_meeting_exist, function(err, rows) {
              if (err)throw err;
              if(rows.length < 1) {
                console.log("Meeting not exist");
                return res.redirect('back');
              }
              else{
                var insert_meeting = 'INSERT INTO REGIST(USER_NAME, MID) VALUES("' + uid + '","' + mid + '");';
                connection.query(insert_meeting, function(err, rows) {
                  if (err)throw err;
                  console.log('Insert into regist success');
                  res.redirect('/meeting_detail?gid='+gid+'&mid='+mid);
                });
              }
            });
          }
        });
      }
    });
    connection.release();
  });
});

module.exports = router;
