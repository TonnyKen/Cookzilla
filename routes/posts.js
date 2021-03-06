var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin, function (req, res) {
  console.log('Now in ./posts get');
  res.render('postpage',{userinfo:true, uid:req.session.uid,nick_name:req.session.nick_name,login_name:req.session.login_name});
});

router.post('/', checkLogin, function (req, res) {
  console.log('Now in ./posts, post',req.body);
  var title = req.body.title,
    description = req.body.description,
    elements = req.body.elements,
    quantities = req.body.quantities,
    mgs = req.body.mgs,
    tags = req.body.tags,
    pictures = req.body.pictures;
  var recipe_query = "INSERT INTO RECIPE (TITLE, DESCRIPTION, PHOTOS) VALUES (" + "'" + title + "'," + "'" + description + "'," + "'" + pictures + "'" + ");";
  pool.getConnection(function(err, connection) {
    connection.query(recipe_query, function(err, result) {
      if (err)throw err;
      var rid = result.insertId;
      var addr = '/detail?rid='+rid;
      tags.forEach(function(tag){
        tag_query = "SELECT T_ID FROM TAG WHERE TNAME = '" + tag +"';";;
        connection.query(tag_query, function  (err, result) {
          if (err)throw err;
          console.log('search tag here',result);
          if(result.length > 0){
            about_query = "INSERT INTO ABOUT (T_ID, RID) VALUES ('" + result[0]['T_ID'] + "'," + "'" + rid + "')";
            connection.query(about_query, function(err, result) {
              if(err)throw err;
            });
          }
          else{
            insert_tag_query = "INSERT INTO TAG (TNAME) VALUES('" + tag +"');";
            connection.query(insert_tag_query, function(err, result) {
              if(err)throw err;
              console.log(result);
              var tid = result.insertId;
              var about_query = "INSERT INTO ABOUT (T_ID, RID) VALUES ('" + tid + "'," + "'"+rid + "')";
              connection.query(about_query, function(err, result) {
                if(err)throw err;
              });
            });
          }
        });
      });

      elements.forEach(function(element, index){
        element_query = 'SELECT I_NAME FROM INGREDIENT WHERE I_NAME ="'+ element+'";';
        connection.query(element_query, function(err, result) {
          if(err)throw err;
          console.log(result);
          if(result.length < 1) {
            if (mgs[index] == 'g'){
              var type = 0;
            }
            else{
              var type = 1;
            }
            var insert_ingredient_query = "INSERT INTO INGREDIENT (I_NAME, TYPE) VALUES('" + element +"'" + ",'" + type +"');";
            connection.query(insert_ingredient_query, function(err, result) {
              console.log('insert ingre', result);
              if(err)throw err;
            });
          }
          var insert_Containing_query = 'INSERT INTO CONTAINING (RID,I_NAME,AMOUNT) VALUES("' + rid +'","'+ element+'","'+quantities[index] + '");';
          connection.query(insert_Containing_query, function(err, result) {
            if(err)throw err;
            var insert_Post_query = 'INSERT INTO POST (user_name,rid) VALUES("' + req.session.uid +'","'+ rid+'");';
            connection.query(insert_Post_query, function(err, result) {
              if(err)throw err;
            });
          });
        });
      });
      //res.render('meetings',{meetings:rows});
    res.send({redirect:addr});
    });
    connection.release();
  });
});

module.exports = router;
