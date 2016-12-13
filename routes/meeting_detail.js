var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;

router.get('/', function (req, res) {
  console.log('Now in ./meeting_detail');
  var mid = req.query.mid;
  var gid = req.query.gid;
  req.session.gid = gid;
  //var query = 'SELECT * FROM REPORT NATURAL JOIN (SELECT * FROM MEETING WHERE MNAME = "' + mname + '") AS M';
  var group_query = 'SELECT GNAME FROM GROUPS WHERE GID = "' + gid + '"';
  var meeting_query = 'SELECT * FROM MEETING WHERE MID = "' + mid + '"';
  if (!req.session.uid){
    var check_register_query = 'SELECT * FROM Regist WHERE MID = "' + mid + '" and user_name = -1' ;
    var belongs_query = 'SELECT * FROM BELONGS WHERE GID = -1;';
  }
  else {
    var check_register_query = 'SELECT * FROM Regist WHERE MID = "' + mid + '" and user_name = "' + req.session.uid + '";';
    var belongs_query = 'SELECT * FROM BELONGS WHERE GID = "' + gid + '" and user_name = "' + req.session.uid +'";';
  }

  pool.getConnection(function(err, connection) {
    connection.query(group_query, function(err, rows) {
      if (err)throw err;
      var gname = rows[0].GNAME;
      connection.query(meeting_query, function(err, rows) {
        if (err)throw err;
        var reports = rows[0];
        var number_of_reports = rows.length;
        var today = new Date();
        if (reports.mtime < today){
          connection.query(belongs_query, function(err, rows) {
            if (err)throw err;
            if(rows.length > 0) {
              var canrg = false;
              var cancancel = false;
              var seereport = true;
            }
            else {
              var canrg = false;
              var cancancel = false;
              var seereport = false;
            }
            if(!req.session.uid){
              res.render('meeting_detail',{canrg:canrg, cancancel:cancancel, seereport:seereport, gname:gname, reports:reports, number_of_reports:number_of_reports, userinfo:false});
            }
            else{
              res.render('meeting_detail',{canrg:canrg, cancancel:cancancel, seereport:seereport, gname:gname, reports:reports, number_of_reports:number_of_reports, userinfo:true, uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
            }
          });
        }
        else {
          connection.query(check_register_query, function(err, rows) {
            if (err)throw err;
            if (rows.length > 0) {
              var canrg = false;
              var cancancel = true;
              var seereport = false;
            }
            else{
              var canrg = true;
              var cancancel = false;
              var seereport = false;
            }
            if(!req.session.uid){
              res.render('meeting_detail',{canrg:canrg, cancancel:cancancel, seereport:seereport, gname:gname, reports:reports, number_of_reports:number_of_reports, userinfo:false});
            }
            else{
              res.render('meeting_detail',{canrg:canrg, cancancel:cancancel, seereport:seereport, gname:gname, reports:reports, number_of_reports:number_of_reports, userinfo:true, uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
            }
          });
        }
      });
    });
    connection.release();
  });
});

module.exports = router;
