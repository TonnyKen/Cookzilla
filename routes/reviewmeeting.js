var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin, function (req, res) {
  console.log('Now in ./review meeting get');
  var uid = req.session.uid,
    mid = req.query.mid;
  req.session.mid = mid;
  var meeting_query = 'SELECT mtime FROM MEETING WHERE MID = "' + mid + '"';
  var check_register_query = 'SELECT * FROM Regist WHERE MID = "' + mid + '" and user_name = "' + uid + '";';
  pool.getConnection(function(err, connection) {
    connection.query(meeting_query, function(err, rows) {
      if (err)throw err;
      if (rows.length < 1){
        console.log('Meeting not exist, attack found');
        req.flash('error', 'Meeting not exist');
        return res.redirect('back');
      }
      var today = new Date();
      if (rows[0].mtime > today){
        console.log('Meeting not comming, attack found');
        req.flash('error', 'Meeting not comming yet, can not review');
        return res.redirect('back');
      }
      connection.query(check_register_query, function(err, rows) {
        if (err)throw err;
        if(rows.length < 1){
          console.log('Not registered, attack found');
          req.flash('error', 'you not registered this meeting');
          return res.redirect('back');
        }
        return res.render('meeting_review',{userinfo:true, uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
      });
    });
  });
});


router.post('/', checkLogin, function (req, res) {
  console.log('Now in ./review meeting post');
  var mid = req.session.mid,
    src = req.body.src,
    uid = req.session.uid,
    description = req.body.description;
  if(mid === '-1'){
    console.log('Mid wrong');
    return res.redirect('back');
  }
  req.session.mid = '-1';
  var can_insert_query = "select mid from report where user_name="+uid+" and mid="+mid+";";
  var insert_report_query = 'insert into REPORT(user_name,mid,PHOTOS,description) values(' + uid + ',' + mid + ',"'+src + '","' + description +'")';
  pool.getConnection(function(err, connection) {
    connection.query(can_insert_query, function(err, result) {
      if (err)throw err;
      if (result.length > 0){
        console.log('Already wrote review, can not write any more');
        req.flash('error', 'Already wrote review, can not write any more');
        return res.send({redirect:'/main'})
      }
      connection.query(insert_report_query, function(err, result) {
        if (err)throw err;
        console.log('Insert report success');
        req.flash('success', 'Review success, hope to see you again');
        res.send({redirect:'/seereport?mid=' + mid})
      });
    });
    connection.release();
  });
});

module.exports = router;
