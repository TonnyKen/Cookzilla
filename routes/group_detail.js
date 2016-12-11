var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;

router.get('/', function (req, res) {
  console.log('group_detail',req.query);
  var gid = req.query.gid;
  var uid = req.session.uid;
  if (!uid) {
    uid = -1;
  }
  //res.render('search_result');
  var check_query = "SELECT * FROM BELONGS WHERE gid = " + "'" + gid + "' and user_name = " + "'" + uid + "';";
  var member_query = 'SELECT GNAME, USER_NAME, PROFILE, LOGIN_NAME FROM BELONGS NATURAL JOIN (SELECT * FROM GROUPS WHERE GID = '+ "'" + gid + "'" +') AS G NATURAL JOIN USER;';
  var old_meeting_query = 'SELECT GNAME, MNAME, MLOCATION, MTIME FROM MEETING, ORGANIZE, (SELECT * FROM GROUPS WHERE GID = ' + "'" + gid + "'" + ') AS G WHERE MEETING.MID = ORGANIZE.MID AND ORGANIZE.GID = G.GID AND MTIME < now();';
  var new_meeting_query = 'SELECT GNAME, MNAME, MLOCATION, MTIME FROM MEETING, ORGANIZE, (SELECT * FROM GROUPS WHERE GID = ' + "'" + gid + "'" + ') AS G WHERE MEETING.MID = ORGANIZE.MID AND ORGANIZE.GID = G.GID AND MTIME > now();';

  pool.getConnection(function(err, connection) {
    connection.query(check_query, function(err, rows) {
      if (err)throw err;
      if (rows.length > 0) {
        var joinit = false;
        var leaveit = true;
      }
      else{
        var joinit = true;
        var leaveit = false;
      }
      connection.query(member_query, function(err, rows) {
        if (err)throw err;
        var gname = rows[0].GNAME;
        var members = rows;
        var number_of_member = members.length;
        connection.query(old_meeting_query, function(err, rows) {
          if (err)throw err;
          var old_meetings = rows;
          var number_of_old_meeting = old_meetings.length;
          connection.query(new_meeting_query, function(err, rows) {
            if (err)throw err;
            var new_meetings = rows;
            var number_of_new_meeting = new_meetings.length;
            if(!req.session.uid) {
              res.render('groups_detail',{gid:gid,joinit:joinit, leaveit:leaveit, members:members, old_meetings:old_meetings,new_meetings:new_meetings, group:gname, number_of_old_meeting:number_of_old_meeting,number_of_new_meeting:number_of_new_meeting, number_of_member:number_of_member, userinfo:false});
            }
            else {
              res.render('groups_detail',{gid:gid,joinit:joinit, leaveit:leaveit, members:members, old_meetings:old_meetings,new_meetings:new_meetings, group:gname, number_of_old_meeting:number_of_old_meeting,number_of_new_meeting:number_of_new_meeting, number_of_member:number_of_member, userinfo:true, uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
            }
          });
        });
      });
    });
    connection.release();
  });
});

module.exports = router;
