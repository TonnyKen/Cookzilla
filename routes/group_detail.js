var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;

router.get('/', function (req, res) {
  console.log('group_detail',req.query);
  var gname = req.query.gname;
  //res.render('search_result');
  var member_query = 'SELECT GNAME, USER_NAME, PROFILE, LOGIN_NAME FROM BELONGS NATURAL JOIN (SELECT * FROM GROUPS WHERE GNAME = '+ "'" + gname + "'" +') AS G NATURAL JOIN USER;';
  var meeting_query = 'SELECT GNAME, MNAME FROM MEETING, ORGANIZE, (SELECT * FROM GROUPS WHERE GNAME = ' + "'" + gname + "'" + ') AS G WHERE MEETING.MID = ORGANIZE.MID AND ORGANIZE.GID = G.GID;';

  pool.getConnection(function(err, connection) {
    connection.query(member_query, function(err, rows) {
      if (err)throw err;
      var members = rows;
      connection.query(meeting_query, function(err, rows) {
        if (err)throw err;
        var meetings = rows;
        console.log({members:members, meetings:meetings, group:gname});
        if(!req.session.uid) {
          res.render('groups_detail',{members:members, meetings:meetings, group:gname, userinfo:false});
        }
        else {
          res.render('groups_detail',{members:members, meetings:meetings, group:gname, userinfo:true, uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
        }

      });
    });
    connection.release();
  });
});

module.exports = router;
