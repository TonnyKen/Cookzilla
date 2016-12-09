// $('.recipe').on('click', function () {
//   var value = $(this).find('a').attr('target');
//   alert(JSON.stringify({ rid : value }));
//   $.ajax({
//     type: "POST",
//     contentType: "application/json",
//     data : JSON.stringify({ rid : value }),
//     url:"/search",
//     async:false,
//     success: function(data) {
//         window.location.assign(data.redirect);
//         console.log(JSON.stringify(data));
//     }
//   });
// });
