$(function(){
	$(document).foundation();
	var operation = "A", /* "A"=adding; "E"=editing */
	 selectedIndex = -1, /*Index of the selected list item */
	 autoId = parseInt(localStorage.getItem("autoId"), 10) || 0,
	 milliSecInHour = 3600000,
	 milliSecInMinute = 60000
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
		timeToWater : dateInMilli+(milliSecInHour * wateringPeriod),
		
	});
	var currentLength = tbClients.push(client),
		currentLength = currentLength-1;
	console.log(currentLength);
	run(tbClients[currentLength], currentLength);
	localStorage.setItem("tbClients", JSON.stringify(tbClients));
	alert("Plant added to garden.");
	_plantInfo[0].reset();
	list();
	$('a.close-reveal-modal').trigger('click');
	return true;
} 

function edit(){
	tbClients[selectedIndex] = JSON.stringify({
			id    : editId,
			name  : _name.val(),
			wateringPeriod : _wateringPeriod.val()
		});//Alter the selected item on the table
	localStorage.setItem("tbClients", JSON.stringify(tbClients));
	alert("Plant information updated.")
	operation = "A"; //Return to default value
	_plantInfo[0].reset();
	list();
	$('a.close-reveal-modal').trigger('click');
	return true;
} 

function remove(){
	tbClients.splice(selectedIndex, 1);
	console.log(selectedIndex);
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
			operationList = "<img src='svg/edit.svg' alt='edit"+i+"' class='btn-edit icon' title='Edit' />";
		if(remainingTime > 0){
			operationList += "<img src='svg/watering.svg' alt='water"+i+"' class='btn-water icon' title='Water It' />";
		}else{
			operationList += "<img src='svg/remove.svg' alt='remove"+i+"' class='btn-remove icon' title='Remove' />";
		}
		log(operationList);
	  	_plantList.find("tbody").append("<tr>"+
								 	 /*"	<td><img src='svg/edit.svg' alt='edit"+i+"' class='btn-edit icon'/><img src='svg/remove.svg' alt='remove"+i+"' class='btn-remove icon'/> <img src='svg/watering.svg' alt='watering"+i+"' class='btn-water icon'/>  </td>" + */
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
	console.log(selectedIndex);
	remove();
	list();
}); 

_plantList.on("click", ".btn-water", function(){
	selectedIndex = parseInt($(this).attr("alt").replace("remove", ""));
	console.log(selectedIndex);
	remove();
	list();
});



var timer;


function run(cli,i) {
  //localStorage["running"] = "true";
  console.log(i);
  /*if (!tbClients[i]["timeToWater"]) {
    tbClients[i]["timeToWater"] = +new Date;
  }*/
  var nowDate = new Date,
	nowDateMilli = nowDate.getTime(),
	remainingTime = (cli.timeToWater - nowDateMilli) / milliSecInMinute;
  if(remainingTime <= 40 && remainingTime > 0){
	  notification(cli,remainingTime);
  }
  /*else if(remainingTime < 0){
	  notification(cli,remainingTime, "remove");
  }*/
  display(cli.timeToWater,i);
  timer = setTimeout(function(){
	  run(cli,i);
  }, milliSecInMinute);
}

function display(time, i) {
  //$("#toggle").innerHTML = localStorage["running"] ? "lap" : "start";
  var timeToWater = time;
  if (!timeToWater) {
    $("#elapsed").innerHTML = "----";
  } else {
    //var elapsedMillis = +new Date - parseInt(timeToWater);
	var elapsedMillis = +new Date ;
	elapsedMillis = timeToWater - elapsedMillis;
    var decs = Math.floor(elapsedMillis%1000/100);
    var secs = Math.floor(elapsedMillis%60000/1000);
    var mins = Math.floor(elapsedMillis%3600000/60000);
    var hours = Math.floor(elapsedMillis%(24*3600000)/3600000);
	log(hours+":"+mins+":"+secs+"."+decs);
    _plantList.find("tr").eq(i).find("td.time-to-water").text(pad(hours)+":"+pad(mins)+":"+pad(secs)+"."+decs);
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

function notification(cli,remainingTime){
	
	if(! ('Notification' in window) ){
				alert('Web Notification is not supported');
			}	

	Notification.requestPermission(function(permission){
		var notification = new Notification("Please water "+cli.name ,{body:'Water it soon else plan will be dead in next '+remainingTime +" minutes"});
	});
}
}); 
