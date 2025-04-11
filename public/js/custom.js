$(function () {
  var socket = io();
  $("#sendTweet").submit(function () {
    var content = $("#tweet").val();
    socket.emit("tweet", { content: content });
    $("#tweet").val("");
    return false;
  });

  socket.on("iscomingTweets", (data) => {
    var html = "";
    html += ' <div id="tweets">';
    html += '<div class="media">';
    html += '<div class="media-left">';
    html +=
      '<a href="/user/' +
      data.user._id +
      '"><img src="' +
      data.user.photo +
      '" class="media-object" /></a>';
    html += "</div>";
    html += '<div class="media-body">';
    html += '<h4 class="media-heading">' + data.user.name + "</h4>";
    html += "<p>" + data.data.content + "</p>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    $("#tweets").prepend(html);
  });
});
