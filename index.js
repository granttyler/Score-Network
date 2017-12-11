//code sources :
// https://github.com/socketio/socket.io/tree/master/examples/chat
//https://socket.io/demos/chat/

var express = require('express');
var app = express();
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

//SERVER SETUP
server.listen(port, function(){
  console.log('listening on port ' + port);
});

//ROUTING - reference html file
var stat = express.static(__dirname + "/public");
app.use(stat);

//CHATROOM - functions

var numUsers = 0;

io.on('connection', function(socket){

  var addedUser = false;
  var sender = socket.username;

  //when the client emits 'new message', this listens and executes
  //adding recipient as a property to be passed from the client.
  //using the recipient data, I can route messages to a particular
  //user??

//dec 7
//made a condition which asseses the
//presence of a ':' in the message.
//if there is one, the message is
//divided into the first two indexes
//of an array. if there isnt, the message
//is broadcast using io.on containing
//io.emit. if there is, the message is
//routed using socket.on containing
//socket.emit.

socket.on('new message', function(data){
  var message = data;
    if( message.indexOf(':') < 0 ){
    // message without :
    socket.broadcast.emit('new message', {
          username: socket.username,
          message: data
        });
  }else{
    // message with :
      var arr = message.split(':');
      var recipient = arr[0];
      var msg = arr[1];
      io.on('new message', function(data){
      io.emit('new message', {
        username: socket.username,
        message: msg,
        });
      });
  }
});
  //when the client emits 'add user', this listens and executes
      socket.on('add user', function (username) {
    //set up a variable to evaluate whether the user is the group leader.
  //  var isLeader = false;

  //  if (addedUser) return;
    //redirect the server to execute something different if the username
    //is Leader
  //  if (username == 'Leader') {

  //  }

    //we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    //echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

    //when the client emits 'typing', we broadcast it to others
    socket.on('typing', function(){
      socket.broadcast.emit('typing', {
        username: socket.username
      });
    });

    //when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function () {
      socket.broadcast.emit('stop typing', {
        username: socket.username
      });
    });

    //when the user disconnects.. perform this
    socket.on('disconnect', function(){
      if (addedUser) {
        --numUsers;
        //echo globally that this client left
        socket.broadcast.emit('user left', {
          username: socket.username,
          numUsers: numUsers
        });
      }
    });
  });
