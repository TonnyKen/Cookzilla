var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin, function (req, res) {
  console.log('Now in ./creategroup, get');
  return res.render('yourgroup', {userinfo:true,uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
});

router.post('/', checkLogin, function (req, res) {
  console.log('Now in ./creategroup, post');
  var gname = req.body.gname,
    description = req.body.description,
    uid = req.session.uid;

  pool.getConnection(function(err, connection) {
    var check_exist = 'select * from groups where gname ="' +connection.escape(gname)+'";';
    connection.query(check_exist, function(err, rows) {
      if (err)throw err;
      if(rows.length > 0){
        console.log('Groups already exist');
        return res.redirect('back');
      }
      else{
        var insert_groups = 'INSERT INTO GROUPS (GNAME, DESCRIPTION, LEADER) VALUES (' + connection.escape(gname) + ','+ connection.escape(description) + ',' + connection.escape(uid) + ');';
        connection.query(insert_groups, function(err, rows) {
          if (err)throw err;
          var gid = rows.insertId;
          var insert_belongs = 'INSERT INTO BELONGS (USER_NAME, GID) VALUES (' + connection.escape(uid) + ','+ connection.escape(gid) +');';
          connection.query(insert_belongs, function(err, rows) {
            if (err)throw err;
            console.log("insert belongs success");
            res.redirect('/group_detail?gid=' + gid);
          });
        });
      }
    });
    connection.release();
  });
});

module.exports = router;
