var speedtest = require('speedtest-net');
var fileSystem = require('fs');

var fileName = __dirname + '/history.json';
var history = JSON.parse(fileSystem.readFileSync(fileName));
var socket = require('socket.io-client')('http://localhost:3000/');




socket.on('logger:run', function(){
	console.log('Starting speedtest...');
	var test = speedtest();
		
	test.on('data', function (data) {
		var result = {
			download: data.speeds.download,
			upload: data.speeds.upload,
			ping: data.server.ping,
			date: Date.now()
		};
		
		/* Push the results to the history list */
		history.push(result);
		
		/* Send result to server */
		socket.emit('server:results', history);
		
		/* Create json object and write to file */
		var jsonResult = JSON.stringify(history);
		fileSystem.writeFile(fileName, jsonResult, function (err) {
			if (err) {
				console.log('Something went wrong: ' + err);
			} else {
				console.log('Speedtest finished');
			}
		});
	});
	
	test.on('error', function (err) {
		console.error(err);
	});

})

/* Send entire history to the server */
socket.on('logger:history', function(){
	socket.emit('server:results', history);
	
});

socket.on('connect', function(){
	console.log("Logger connected");
});

