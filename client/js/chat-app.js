
(function(chat) {
  'use strict';
    chat = chat || (window.chat = {});

    var userAndToken = {};

    window.chat.init(function messageHandler(data) {
      addMessageToHTML(data.message, data.username);
      console.log(data);
    });

  // Creating a login on submit
  $('#login').on('submit', function( event ) {
    event.preventDefault();
    tokenGen($('.username').val());
    removeLoginAddChat();
  });

function tokenGen(name) {
  $.ajax({
    type: 'POST',
    url: '/login',
    contentType: 'application/json',
    data: JSON.stringify({ username: name }),
    success: function getNameAndToken(data) {
      userAndToken.username = data.username;
      userAndToken.token = data.token;
      // console.log(userAndToken.token);
      // console.log(data);
    },
  });
}

$('#send-message').on('submit', function( event ) {
  event.preventDefault();
  sendMessage($('.message').val());
  $('.message').val('');
});

function sendMessage(message) {
  $.ajax({
    type: 'POST',
    url: '/chat',
    contentType: 'application/json',
    headers: {
    authorization: userAndToken.token,
  },
    data: JSON.stringify({message: message}),
  });
}

function removeLoginAddChat() {
  $('#login').remove();
  $('#chat').css('display', 'block');
  $(".message").focus();
}

function addMessageToHTML(message, username) {
  $('#messages')
    .append( $('<p>').text(message)
    .append( $('<cite>').text(username) ) );
}

})(window.chat);
