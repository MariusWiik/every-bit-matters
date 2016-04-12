var socket = io();


socket.on('connect', function(data){
	console.log("Connected");	
});

socket.on('client:display', function(results){
	
	/* get DOM element */
	var tbody = document.getElementsByTagName('tbody')[0];
	
	/* Clear the table body */
	tbody.innerHTML = "";
	
	
	/* Go through all data and write it to the DOM */
	results.forEach(function(data){
	

	/* Create row */
	var tr = document.createElement('tr');
	
	/* Create columns */
	var date = document.createElement('td');
	var ping = document.createElement('td');
	var upload = document.createElement('td');
	var download = document.createElement('td');
	
	/*Populate columns */
	date.innerText = timeConverter(data.date);
	ping.innerText = data.ping;
	upload.innerText = data.upload;
	download.innerText = data.download;
	
	/* append columns to row */
	tr.appendChild(date);
	tr.appendChild(ping);
	tr.appendChild(upload);
	tr.appendChild(download);
	
	/* Append row to body */
	tbody.appendChild(tr);
		
	});
}); 

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}