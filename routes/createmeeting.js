var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin, function (req, res) {
  console.log('Now in ./createmeeting, get');
  var gid = req.query.gid;
  if(!gid){
    return res.redirect('back');
  }
  else{
    req.session.gid = gid;
    return res.render('yourmeeting', {userinfo:true,uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
  }
});

router.post('/', checkLogin, function (req, res) {
  console.log('Now in ./createmeeting, post');
  var mname = req.body.mname,
    location = req.body.location,
    realtime = req.body.time,
    gid = req.session.gid,
    lasttime = req.body.lasttime;

  pool.getConnection(function(err, connection) {
    var insert_meeting = 'INSERT INTO MEETING(MNAME, MLOCATION, MTIME, LASTTIME) VALUES ('+ connection.escape(mname)+ ',' + connection.escape(location) + ',' + connection.escape(realtime) + ',' + connection.escape(lasttime) +');';
    connection.query(insert_meeting, function(err, rows) {
      if (err)throw err;
      var mid = rows.insertId;
      var insert_organize = 'INSERT INTO ORGANIZE(GID, MID) VALUES (' +connection.escape(gid)+ ',' + connection.escape(mid) + ');';
      connection.query(insert_organize, function(err, rows) {
        if (err)throw err;
        res.send({redirect:'/meeting_detail?gid='+gid+'&mid=' + mid});
      });
    });
    connection.release();
  });
});

module.exports = router;
