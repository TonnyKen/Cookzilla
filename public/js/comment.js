$(document).ready(function() {
  $('#commentSubmit').click(function(){
    var starNumber = $('.glyphicon-star').length;
    var title = $('#title').val();
    var review = $('#review').val();
    var comment = $('#comment_suggestion').val();
    $.ajax({
        type: "POST",
        contentType: "application/json",
        data : JSON.stringify({title:title, review:review, stars:starNumber, comment:comment}),
        url:"/comment",
        async:false,
        success: function(data) {
          window.location.href = data.redirect;
        }
    });
  });
});
