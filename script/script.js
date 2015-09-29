$(function(){
	$(document).foundation();
	var app = app || {};
	
	
	
app.init = function(){
	
	app.data = app.data || {};
	app.data.operation = "A", /* "A"=adding; "E"=editing */
	 app.data.selectedIndex = -1, /*Index of the selected list item */
	 app.data.autoId = parseInt(localStorage.getItem("autoId"), 10) || 0,
	 app.data.milliSecInHour = 3600000,
	 app.data.milliSecInMinute = 60000,
	 app.data.editId = 0,
	 app.data._name = $("#name"), 
	 app.data._wateringPeriod = $("#wateringPeriod"),
	 app.data._plantList = $("#plantList"),
	 app.data._plantInfo = $("#plantInfo"),
	 app.data._plantAlert = $(".plant-alert"),
	 app.data._plantAlertText = app.data._plantAlert.find("span"),
	 app.data.plantGarden = localStorage.getItem("plantGarden"); /*Retrieve the stored data */
	app.data.plantGarden = JSON.parse(app.data.plantGarden); /*Converts string to object */
	
	if(app.data.plantGarden == null) /*If there is no data, initialize an empty array */
		app.data.plantGarden = [];
	else if(app.data.plantGarden.length > 0) /*If there is data, generate the list of same */
		app.list();
		
app.data._plantInfo.submit(function(e){
	e.preventDefault();
	if(app.data.operation == "A")
		return app.add();
	else
		return app.edit();
}); 

app.data._plantList.on("click", ".btn-edit", function(){
	app.data.operation = "E";
	app.data.selectedIndex = parseInt($(this).attr("alt").replace("edit", ""));
	var cli = JSON.parse(app.data.plantGarden[app.data.selectedIndex]);
	app.data._name.val(cli.name);
	app.data._wateringPeriod.val(cli.wateringPeriod);
	app.data._name.focus();
	app.data.editId = cli.id;
	$('a.add-plant').trigger('click');
}); 

app.data._plantList.on("click", ".btn-remove", function(){
	app.data.selectedIndex = parseInt($(this).attr("alt").replace("remove", ""));
	app.remove();
	app.list();
}); 

app.data._plantList.on("click", ".btn-water", function(){
	app.data.selectedIndex = parseInt($(this).attr("alt").replace("water", ""));
	var cli = JSON.parse(app.data.plantGarden[app.data.selectedIndex]);
	var date = new Date();
	var dateInMilli = date.getTime();
	var client = JSON.stringify({
		id    : cli.id,
		name  : cli.name,
		wateringPeriod : cli.wateringPeriod,
		timeToWater : dateInMilli+(app.data.milliSecInHour * cli.wateringPeriod),
		
	});
	app.data.plantGarden[app.data.selectedIndex] = client;
	app.run(app.data.plantGarden[app.data.selectedIndex], app.data.selectedIndex);
	localStorage.setItem("plantGarden", JSON.stringify(app.data.plantGarden));
	app.alertMessage("Plant successfully watered.");
	app.list();
	return true;
	
	
});
};	

app.add = function(){
	app.data.autoId += 1;
	var date = new Date();
	var dateInMilli = date.getTime(),
		wateringPeriod = parseFloat(app.data._wateringPeriod.val());
	localStorage.setItem("autoId", app.data.autoId);
	var client = JSON.stringify({
		id    : app.data.autoId,
		name  : app.data._name.val(),
		wateringPeriod : wateringPeriod,
		timeToWater : dateInMilli+(app.data.milliSecInHour * wateringPeriod)
		
	});
	var currentLength = app.data.plantGarden.push(client),
		currentLength = currentLength-1;
	app.run(app.data.plantGarden[currentLength], currentLength);
	localStorage.setItem("plantGarden", JSON.stringify(app.data.plantGarden));
	app.alertMessage("Plant added to garden.");
	app.data._plantInfo[0].reset();
	app.list();
	$('a.close-reveal-modal').trigger('click');
	return true;
};

app.edit = function(){
	var date = new Date();
	var dateInMilli = date.getTime(),
		wateringPeriod = parseFloat(app.data._wateringPeriod.val());
	app.data.plantGarden[app.data.selectedIndex] = JSON.stringify({
			id    : app.data.editId,
			name  : app.data._name.val(),
			wateringPeriod : wateringPeriod,
			timeToWater : dateInMilli+(app.data.milliSecInHour * wateringPeriod),
		});/*Alter the selected plant on the table */
	localStorage.setItem("plantGarden", JSON.stringify(app.data.plantGarden));
	app.alertMessage("Plant information updated.")
	app.data.operation = "A"; /* Return to default value */
	app.data._plantInfo[0].reset();
	app.list();
	$('a.close-reveal-modal').trigger('click');
	return true;
};

app.remove = function(){
	app.data.plantGarden.splice(app.data.selectedIndex, 1);
	localStorage.setItem("plantGarden", JSON.stringify(app.data.plantGarden));
	app.alertMessage("Plant removed.");
};


app.list = function(){
	app.data._plantList.html("");
	app.data._plantList.html(
		"<thead>"+
		"	<tr>"+
		"	<th>Operations</th>"+
		"	<th class='hide-for-small'>ID</th>"+
		"	<th>Name</th>"+
		"	<th class='hide-for-small'>Watering Period [in hours]</th>"+
		"	<th>Water In Next[in hours]</th>"+
		"	</tr>"+
		"</thead>"+
		"<tbody>"+
		"</tbody>"
		);
	for(var i in app.data.plantGarden){
		var cli = JSON.parse(app.data.plantGarden[i]),
			currentRow = parseInt(i,10)+1,
			nowDate = new Date,
			nowDateMilli = nowDate.getTime(),
			remainingTime = (cli.timeToWater - nowDateMilli) / app.data.milliSecInMinute,
			operationList = "";
		if(remainingTime > 0 && remainingTime <= 40){
			operationList += "<img src='svg/edit.svg' alt='edit"+i+"' class='btn-edit icon' title='Edit' /><img src='svg/watering.svg' alt='water"+i+"' class='btn-water icon' title='Water It' /><img src='svg/remove.svg' alt='remove' class='btn-remove-disable icon disable' title='Remove' />";
		}else if(remainingTime < 0){
			operationList += "<img src='svg/edit.svg' alt='edit' class='btn-edit-disable disable icon' title='Edit' /><img src='svg/watering.svg' alt='water' class='btn-water-disable icon disable' title='Water It' /> <img src='svg/remove.svg' alt='remove"+i+"' class='btn-remove icon' title='Remove' />";
		}else{
			operationList += "<img src='svg/edit.svg' alt='edit"+i+"' class='btn-edit icon' title='Edit' /><img src='svg/watering.svg' alt='water' class='btn-water-disable icon disable' title='Water It' /><img src='svg/remove.svg' alt='remove' class='btn-remove-disable icon disable' title='Remove' />";
		}
	  	app.data._plantList.find("tbody").append("<tr>"+
									 "	<td>"+operationList+"  </td>" +
									 "	<td class='hide-for-small'>"+cli.id+"</td>" + 
									 "	<td>"+cli.name+"</td>" + 
									 "	<td class='hide-for-small'>"+cli.wateringPeriod+"</td>" +
									 "	<td class='time-to-water'></td>" +
	  								 "</tr>");
		(function (cli, currentRow) {
			setTimeout(function(){
			app.run(cli, currentRow);
		}, 200);
		})(cli, currentRow);							 
									 
	}
};

app.alertMessage = function(message){
	app.data._plantAlertText.text(message);
	app.data._plantAlert.toggle( "slow", function() {
		setTimeout(function(){app.data._plantAlert.toggle("slow");},1000);
	});
};


app.run = function(cli,i) {
  var nowDate = new Date,
	nowDateMilli = nowDate.getTime(),
	remainingTime = (cli.timeToWater - nowDateMilli) / app.data.milliSecInMinute;
  if(remainingTime <= 40 && remainingTime > 0){
	  app.notification(cli,remainingTime, false);
  }
  else if(remainingTime < 0){
	  app.notification(cli,remainingTime, true);
  }
  app.display(cli.timeToWater,i);
  setTimeout(function(){
	  app.run(cli,i);
  }, app.data.milliSecInMinute);
};

app.display = function(time, i) {
  var timeToWater = time;
  if (!timeToWater) {
    app.data._plantList.find("tr").eq(i).find("td.time-to-water").text("- - - -");;
  } else {
	var elapsedMillis = +new Date,
		timePlusMinus = "+";
	elapsedMillis = (timeToWater >= elapsedMillis) ? (timeToWater - elapsedMillis) : (timePlusMinus = '-', elapsedMillis - timeToWater);
    var secs = Math.floor(elapsedMillis%app.data.milliSecInMinute/1000);
    var mins = Math.floor(elapsedMillis%app.data.milliSecInHour/app.data.milliSecInMinute);
    var hours = Math.floor(elapsedMillis%(24*app.data.milliSecInHour)/app.data.milliSecInHour);
    app.data._plantList.find("tr").eq(i).find("td.time-to-water").text(timePlusMinus + " " +app.pad(hours)+":"+app.pad(mins)+":"+app.pad(secs));
  }
};


app.pad = function(val) {
  return (""+val).length==2 ? ""+val : "0"+val;
}

app.log = function() {
  console.log.apply(console, arguments);
}

app.notification = function(cli,remainingTime, remove){
	
	if(! ('Notification' in window) ){
				app.alertMessage('Web Notification is not supported');
			}	
	
	Notification.requestPermission(function(permission){
		
		var title = (remove) ? "Please remove dead plant "+cli.name : "Please water "+cli.name,
			body = (remove) ? "Please replace dead plant with new plant" : "Water it soon else plan will be dead in next "+parseInt(remainingTime, 10) +" minutes";
		var notification = new Notification(title ,{body: body, icon:"https://cdn.vectorstock.com/i/composite/77,06/watering-can-and-pot-vector-407706.jpg"});
	});
}
app.init();
}); 
