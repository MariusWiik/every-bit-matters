var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http);



io.on('connect', function(socket){
   console.log("Client connected");
	
	/* send history to client */
	io.emit('logger:history');
	
	/* Get results from the logger */
	socket.on('server:results', function(data){
		/* Send results to client */
		io.emit('client:display', data);
	});
	
});

/* Tell the logger to log at given intervals */
setInterval(function(){
	io.emit('logger:run');
}, 3600000); /*Every 1 hour */




app.use('/', express.static('client'));

http.listen(port, function () {
    console.log('Server running on http://localhost:' + port + '/');
});

