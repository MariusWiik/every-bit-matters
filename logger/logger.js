var speedtest = require('speedtest-net');
var fileSystem = require('fs');
var fallbackScript = "jsontest.py"
var pythonscript = "templog.py"
var fileName = __dirname + '/history.json';
var history = JSON.parse(fileSystem.readFileSync(fileName));
var socket = require('socket.io-client')('http://localhost:3000/');

/* To execute shell command */
var sys = require('util');
var exec = require('child_process').exec;
var child;


socket.on('logger:run', function(){
	console.log('Getting new reading...');
	/* Invoke pythonscript to get new reading */
	
	child = exec('python3 ' + pythonscript, function(error, stdout, stderr){
		
		/* If the script prints error or some other error occurs */
		if(stdout == "Error" || error != null){
			console.log("Generating random data ");
			/* Fallback to randomly generated data data */
			child = exec('python3 ' + fallbackScript + " 48", function(error, stdout, stderr){
				/* Change filename to testData */
				fileName = __dirname + '/testData.json';
			});
		}
		
		
		/* Parse the file again to look for changes */
		history = JSON.parse(fileSystem.readFileSync(fileName));
		/* Change filename back */
		fileName = __dirname + '/history.json';
		/* Send result to server */
		console.log("Sending results to server");
		socket.emit('server:results', history);
	});
	
	
	
		
})

/* Send entire history to the server */
socket.on('logger:history', function(){
	socket.emit('server:results', history);
	
});

socket.on('connect', function(){
	console.log("Logger connected");
});

