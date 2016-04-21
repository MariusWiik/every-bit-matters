var socket = io();


socket.on('connect', function(data){
	console.log("Connected");	
});

socket.on('client:display', function(results){
	
	
	var todayTemp = new Array();
	var todayHum = new Array();
	var yesterdayTemp = new Array();
	var yesterdayHum = new Array();
	
	
	var today = new Date();
	var yesterday = new Date();
	yesterday.setDate(today.getDate() - 1); //Set to yesterday
	
	
	
	var todaysDate;
	var yesterdaysDate;

	/* Loop through all json objects */
	results.forEach(function(data){	
		/* Add to correct array */
		if(getDay(data.time) == today.getDate()){
			/* Add to today array */
		    
			/* Add a label for the chart */
			data.label = getHour(data.time);
			
			/* Get todays date */
			todaysDate = getDate(data.time);
			
			
			/* Create temperature object */
			var temp = {
				x : getHour(data.time), y : data.Temperature
			}
			/* Push to todayTemp array */
			todayTemp.push(temp);
			
			/* Same for humidity */
			var hum = {
				x : getHour(data.time), y : data.Humidity
			}
			todayHum.push(hum);
		}
		/* Do the same for yesterday */
		else if(getDay(data.time) == yesterday.getDate()){
			var temp = {
				x : getHour(data.time), y : data.Temperature
			}
			yesterdaysDate = getDate(data.time);
			console.log(yesterdaysDate);
			var hum = {
				x : getHour(data.time), y : data.Humidity
			}
			yesterdayTemp.push(temp);
			yesterdayHum.push(hum);
			
		}
	
	});
	
	/* Draw todays chart  */
    render_chart(todaysDate, todayTemp, todayHum, "today");
	
	/* Draw yesterdays chart */
	render_chart(yesterdaysDate, yesterdayTemp, yesterdayHum, "yesterday");
		
}); 

/* Get date from unix timestamp */
function getDay(UNIX_timestamp){
	var a = new Date(UNIX_timestamp * 1000);
	return a.getDate();
}

function getDate(UNIX_TIMESTAMP){
	var a = new Date(UNIX_TIMESTAMP * 1000);
	var month = a.getMonth() + 1; // Increment month because javascript for some reason counts months from 0.
	return getDay(UNIX_TIMESTAMP) + "." + month;
}

function getHour(UNIX_TIMESTAMP){
	var a = new Date(UNIX_TIMESTAMP * 1000);
	return a.getHours();
}

function render_chart(date, temp, hum, div){
	
	var chart = new CanvasJS.Chart(div, {
		animationEnabled: true,
		title:{
			text: "Temp and humidity for " + date
		},
		axisX:{
			title: "Time",
			interval: 1	
		},
		data: [              
			{
				showInLegend: true,
				name: "Temperature C",
				type: "spline",
				dataPoints: temp
			},
			{
				showInLegend: true,
				name: "Humidity %",
				type: "spline",
				dataPoints: hum	
			},
		],
		

	});
	chart.render();
}
