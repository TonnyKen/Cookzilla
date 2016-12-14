var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin, function (req, res) {
  console.log('Now in ./see reports');
  var uid = req.session.uid,
    mid = req.query.mid;
  if(!mid){
    console.log('No mid found, wrong url');
    return res.redirect('back');
  }
  var meeting_query = 'SELECT mtime FROM MEETING WHERE MID = "' + mid + '"';
  var check_register_query = 'SELECT * FROM Regist WHERE MID = "' + mid + '" and user_name = "' + uid + '";';
  var load_report = 'select * from user natural join report where mid='+mid+';';
  pool.getConnection(function(err, connection) {
    connection.query(meeting_query, function(err, rows) {
      if (err)throw err;
      if (rows.length < 1){
        console.log('Meeting not exist, attack found');
        return res.redirect('back');
      }
      var today = new Date();
      if (rows[0].mtime > today){
        console.log('Meeting not comming, attack found');
        return res.redirect('back');
      }
      connection.query(check_register_query, function(err, rows) {
        if (err)throw err;
        if(rows.length < 1){
          console.log('Not registered, attack found');
          return res.redirect('back');
        }
        connection.query(load_report, function(err, rows) {
          if (err)throw err;
          reports = rows;
          return res.render('meeting_reports',{reports:reports, userinfo:true, uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
        });
      });
    });
  });
});

module.exports = router;
