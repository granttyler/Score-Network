//to test socket.io's DOC on ROUTING
//messages.
//presently non-functional
//dec 7 

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
var stat = express.static(__dirname + "/tests");
app.use(stat);

var numUsers = 0;

io.on('connection', function(socket){
  var addedUser = false;
  var io = require('socket.io');
  var chat = io;
  chat.of('/chat').on('connection', function (socket) {
    socket.emit('a message', {
        that: 'only', '/chat': 'will get'
    });

    chat.emit('a message', {
        everyone: 'in', '/chat': 'will get'
    });
  });
  var news = chat.of('/news').on('connection', function (socket){
      socket.emit('item', { news: 'item' });
    });

});
