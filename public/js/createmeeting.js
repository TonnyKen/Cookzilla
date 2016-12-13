$(document).ready(function() {
  $('#createmeeting').click(function(){
    var mname = $('#mname').val();
    var location = $('#location').val();
    var year = $('#year').val();
    var month = $('#month').val();
    var day = $('#day').val();
    var realtime = $('#realtime').val();
    var lasttime = $('#lasttime').val();

    var d = year + '-' + month + '-' + day + 'T' + realtime + ':00';
    alert(d);
    var today = new Date();
    if (lasttime !== parseInt(lasttime, 10)){
        alert('lasttime is not integer');
    }

    if ((new Date(d) !== "Invalid Date" && !isNaN(new Date(d))))
    {
      if (new Date(d) > today){
        $.ajax({
            type: "POST",
            contentType: "application/json",
            data : JSON.stringify({mname:mname, location:location, time:d, lasttime:lasttime}),
            url:"/createmeeting",
            async:false,
            success: function(data) {
              alert('createmeeting ajax complete');
              window.location.href = data.redirect;
            }
        });
      }
      else {
        alert('Last date');
      }
    }
    else{
      alert('Wrong date format, wrong');
    }
  });
});
