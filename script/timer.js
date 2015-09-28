var timer;


function run(i) {
  //localStorage["running"] = "true";
  if (!tbClients[i]["startTime"]) {
    tbClients[i]["startTime"] = +new Date;
  }
  //display();
  timer = setTimeout(run, 100);
}

function display(i) {
  //$("#toggle").innerHTML = localStorage["running"] ? "lap" : "start";
  var startTime = tbClients[i]["startTime"];
  if (!startTime) {
    $("#elapsed").innerHTML = "----";
  } else {
    var elapsedMillis = +new Date - parseInt(tbClients[i]["startTime"]);
    var decs = Math.floor(elapsedMillis%1000/100);
    var secs = Math.floor(elapsedMillis%60000/1000);
    var mins = Math.floor(elapsedMillis%3600000/60000);
    var hours = Math.floor(elapsedMillis%(24*3600000)/3600000);
    $("#elapsed").innerHTML =
      pad(hours)+":"+pad(mins)+":"+pad(secs)+"."+decs;
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