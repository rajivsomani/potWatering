$(function(){
	$(document).foundation();
	var operation = "A", /* "A"=adding; "E"=editing */
	 selectedIndex = -1, /*Index of the selected list item */
	 autoId = parseInt(localStorage.getItem("autoId"), 10) || 0,
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
	localStorage.setItem("autoId", autoId);
	var client = JSON.stringify({
		id    : autoId,
		name  : _name.val(),
		wateringPeriod : _wateringPeriod.val()
	});
	tbClients.push(client);
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
		"	<th>Watering Period</th>"+
		"	</tr>"+
		"</thead>"+
		"<tbody>"+
		"</tbody>"
		);
	for(var i in tbClients){
		var cli = JSON.parse(tbClients[i]);
	  	_plantList.find("tbody").append("<tr>"+
								 	 "	<td><img src='svg/edit.svg' alt='edit"+i+"' class='btnedit icon'/><img src='svg/remove.svg' alt='remove"+i+"' class='btnremove icon'/>  </td>" + 
									 "	<td>"+cli.id+"</td>" + 
									 "	<td>"+cli.name+"</td>" + 
									 "	<td>"+cli.wateringPeriod+"</td>" +
	  								 "</tr>");
	}
} 


_plantInfo.submit(function(e){
	e.preventDefault();
	if(operation == "A")
		return add();
	else
		return edit();
}); 

_plantList.on("click", ".btnedit", function(){
	operation = "E";
	selectedIndex = parseInt($(this).attr("alt").replace("edit", ""));
	var cli = JSON.parse(tbClients[selectedIndex]);
	_name.val(cli.name);
	_wateringPeriod.val(cli.wateringPeriod);
	_name.focus();
	editId = cli.id;
	$('a.add-plant').trigger('click');
}); 

_plantList.on("click", ".btnremove", function(){
	selectedIndex = parseInt($(this).attr("alt").replace("remove", ""));
	console.log(selectedIndex);
	remove();
	list();
}); 
}); 
