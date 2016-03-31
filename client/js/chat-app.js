
(function(chat) {
  'use strict';
    chat = chat || (window.chat = {});

    var userAndToken = {};

    window.chat.init(function messageHandler(data) {
      addMessageToHTML(data.message, data.username);
    });

  // Creating a login on submit
  $('#login').on('submit', function( event ) {
    event.preventDefault();
    tokenGen($('.username').val(), getGHProfile);
    removeLoginAddChat();
  });

  // Call to server to generate a token with provided username
  function tokenGen(name, callback) {
    $.ajax({
      type: 'POST',
      url: '/login',
      contentType: 'application/json',
      data: JSON.stringify({ username: name }),
      success: function getNameAndToken(data) {
        userAndToken.username = data.username;
        userAndToken.token = data.token;
        callback(data.username);
      },
    });
  }

  // Call to GitHub api to check to see if the user has an avatar
  function getGHProfile(data) {
    $.ajax({
      type: 'GET',
      url: 'https://api.github.com/users/' + data,
      dataType: 'json',
      success: function showGHUser(data) {
        userAndToken.avatar_url = data.avatar_url;
        console.log(userAndToken.avatar_url);
      },
      error: function handleErrors() {
        userAndToken.avatar_url = 'https://avatars.githubusercontent.com/u/11791361?v=3';
      }
    });
  }

  // Grabs the message input and resets the input field
  $('#send-message').on('submit', function( event ) {
    event.preventDefault();
    sendMessage($('.message').val());
    $('.message').val('');
  });

  // Sends the user's message to the server with their auth token
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

  // Removes the login form and adds the message input to the UI
  function removeLoginAddChat() {
    $('#login').remove();
    $('#chat').css('display', 'block');
    $(".message").focus();
  }

  // Adds the messages to HTML elements
  function addMessageToHTML(message, username) {
    $('#messages')
      .append( $('<p>').text(message)
          .append( $('<cite>').text(username)
              .append( $('<img>').attr( {src: userAndToken.avatar_url, class: 'avatar_img'} ) ) ) );
  }

})(window.chat);
