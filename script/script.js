$(function(){
	$(document).foundation();
	var operation = "A", /* "A"=adding; "E"=editing */
	 selectedIndex = -1, /*Index of the selected list item */
	 autoId = parseInt(localStorage.getItem("autoId"), 10) || 0,
	 milliSecInHour = 3600000,
	 milliSecInMinute = 60000,
	 editId = 0,
	 _name = $("#name"), 
	 _wateringPeriod = $("#wateringPeriod"),
	 _plantList = $("#plantList"),
	 _plantInfo = $("#plantInfo"),
	 tbClients = localStorage.getItem("tbClients"); /*Retrieve the stored data */
	tbClients = JSON.parse(tbClients); /*Converts string to object */
	

	if(tbClients == null) /*If there is no data, initialize an empty array */
		tbClients = [];
	else if(tbClients.length > 0) /*If there is data, generate the list of same */
		list();
	 	


function add(){
	autoId += 1;
	var date = new Date();
	var dateInMilli = date.getTime(),
		wateringPeriod = parseFloat(_wateringPeriod.val());
	localStorage.setItem("autoId", autoId);
	var client = JSON.stringify({
		id    : autoId,
		name  : _name.val(),
		wateringPeriod : wateringPeriod,
		timeToWater : dateInMilli+(milliSecInHour * wateringPeriod)
		
	});
	var currentLength = tbClients.push(client),
		currentLength = currentLength-1;
	run(tbClients[currentLength], currentLength);
	localStorage.setItem("tbClients", JSON.stringify(tbClients));
	alert("Plant added to garden.");
	_plantInfo[0].reset();
	list();
	$('a.close-reveal-modal').trigger('click');
	return true;
} 

function edit(){
	var date = new Date();
	var dateInMilli = date.getTime(),
		wateringPeriod = parseFloat(_wateringPeriod.val());
	tbClients[selectedIndex] = JSON.stringify({
			id    : editId,
			name  : _name.val(),
			wateringPeriod : wateringPeriod,
			timeToWater : dateInMilli+(milliSecInHour * wateringPeriod),
		});/*Alter the selected plant on the table */
	localStorage.setItem("tbClients", JSON.stringify(tbClients));
	alert("Plant information updated.")
	operation = "A"; /* Return to default value */
	_plantInfo[0].reset();
	list();
	$('a.close-reveal-modal').trigger('click');
	return true;
} 

function remove(){
	tbClients.splice(selectedIndex, 1);
	localStorage.setItem("tbClients", JSON.stringify(tbClients));
	alert("Plant removed.");
} 


function list(){
	_plantList.html("");
	_plantList.html(
		"<thead>"+
		"	<tr>"+
		"	<th>Operations</th>"+
		"	<th>ID</th>"+
		"	<th>Name</th>"+
		"	<th>Watering Period [in hours]</th>"+
		"	<th>Water In Next[in hours]</th>"+
		"	</tr>"+
		"</thead>"+
		"<tbody>"+
		"</tbody>"
		);
	for(var i in tbClients){
		var cli = JSON.parse(tbClients[i]),
			currentRow = parseInt(i,10)+1,
			nowDate = new Date,
			nowDateMilli = nowDate.getTime(),
			remainingTime = (cli.timeToWater - nowDateMilli) / milliSecInMinute,
			operationList = "";
		if(remainingTime > 0 && remainingTime <= 40){
			operationList += "<img src='svg/edit.svg' alt='edit"+i+"' class='btn-edit icon' title='Edit' /><img src='svg/watering.svg' alt='water"+i+"' class='btn-water icon' title='Water It' /><img src='svg/remove.svg' alt='remove' class='btn-remove-disable icon disable' title='Remove' />";
		}else if(remainingTime < 0){
			operationList += "<img src='svg/edit.svg' alt='edit' class='btn-edit-disable disable icon' title='Edit' /><img src='svg/watering.svg' alt='water' class='btn-water-disable icon disable' title='Water It' /> <img src='svg/remove.svg' alt='remove"+i+"' class='btn-remove icon' title='Remove' />";
		}else{
			operationList += "<img src='svg/edit.svg' alt='edit"+i+"' class='btn-edit icon' title='Edit' /><img src='svg/watering.svg' alt='water' class='btn-water-disable icon disable' title='Water It' /><img src='svg/remove.svg' alt='remove' class='btn-remove-disable icon disable' title='Remove' />";
		}
	  	_plantList.find("tbody").append("<tr>"+
									 "	<td>"+operationList+"  </td>" +
									 "	<td>"+cli.id+"</td>" + 
									 "	<td>"+cli.name+"</td>" + 
									 "	<td>"+cli.wateringPeriod+"</td>" +
									 "	<td class='time-to-water'></td>" +
	  								 "</tr>");
		(function (cli, currentRow) {
			setTimeout(function(){
			run(cli, currentRow);
		}, 200);
		})(cli, currentRow);							 
									 
	}
} 


_plantInfo.submit(function(e){
	e.preventDefault();
	if(operation == "A")
		return add();
	else
		return edit();
}); 

_plantList.on("click", ".btn-edit", function(){
	operation = "E";
	selectedIndex = parseInt($(this).attr("alt").replace("edit", ""));
	var cli = JSON.parse(tbClients[selectedIndex]);
	_name.val(cli.name);
	_wateringPeriod.val(cli.wateringPeriod);
	_name.focus();
	editId = cli.id;
	$('a.add-plant').trigger('click');
}); 

_plantList.on("click", ".btn-remove", function(){
	selectedIndex = parseInt($(this).attr("alt").replace("remove", ""));
	remove();
	list();
}); 

_plantList.on("click", ".btn-water", function(){
	selectedIndex = parseInt($(this).attr("alt").replace("water", ""));
	var cli = JSON.parse(tbClients[selectedIndex]);
	alert(selectedIndex);
	var date = new Date();
	var dateInMilli = date.getTime();
	var client = JSON.stringify({
		id    : cli.id,
		name  : cli.name,
		wateringPeriod : cli.wateringPeriod,
		timeToWater : dateInMilli+(milliSecInHour * cli.wateringPeriod),
		
	});
	tbClients[selectedIndex] = client;
	run(tbClients[selectedIndex], selectedIndex);
	localStorage.setItem("tbClients", JSON.stringify(tbClients));
	alert("Plant successfully watered.");
	list();
	return true;
	
	
});



var timer;


function run(cli,i) {
  var nowDate = new Date,
	nowDateMilli = nowDate.getTime(),
	remainingTime = (cli.timeToWater - nowDateMilli) / milliSecInMinute;
  if(remainingTime <= 40 && remainingTime > 0){
	  notification(cli,remainingTime, false);
  }
  else if(remainingTime < 0){
	  notification(cli,remainingTime, true);
  }
  display(cli.timeToWater,i);
  timer = setTimeout(function(){
	  run(cli,i);
  }, milliSecInMinute);
}

function display(time, i) {
  var timeToWater = time;
  if (!timeToWater) {
    _plantList.find("tr").eq(i).find("td.time-to-water").text("- - - -");;
  } else {
	var elapsedMillis = +new Date,
		timePlusMinus = "+";
	elapsedMillis = (timeToWater >= elapsedMillis) ? (timeToWater - elapsedMillis) : (timePlusMinus = '-', elapsedMillis - timeToWater);
    var secs = Math.floor(elapsedMillis%milliSecInMinute/1000);
    var mins = Math.floor(elapsedMillis%milliSecInHour/milliSecInMinute);
    var hours = Math.floor(elapsedMillis%(24*milliSecInHour)/milliSecInHour);
	log(hours+":"+mins+":"+secs);
    _plantList.find("tr").eq(i).find("td.time-to-water").text(timePlusMinus + " " +pad(hours)+":"+pad(mins)+":"+pad(secs));
  }
}

function stop() {
  delete(localStorage["running"]);
  clearTimeout(timer);
}

function pad(val) {
  return (""+val).length==2 ? ""+val : "0"+val;
}

function log() {
  console.log.apply(console, arguments);
}

function notification(cli,remainingTime, remove){
	
	if(! ('Notification' in window) ){
				alert('Web Notification is not supported');
			}	

	Notification.requestPermission(function(permission){
		
		var remainingTime = parseInt(remainingTime, 10),
			title = (remove) ? "Please remove dead plant "+cli.name : "Please water "+cli.name,
			body = (remove) ? "Please replace dead plant with new plant" : "Water it soon else plan will be dead in next "+remainingTime +" minutes";
		var notification = new Notification(title ,{body: body});
	});
}
}); 
