var timer;

window.onload = function() {

  display();
  log(localStorage["running"]);
  log(localStorage["startTime"]);
  if (localStorage["running"]) run();
  $_("#toggle").onclick = function() {
    if (localStorage["running"]) {
      stop();
    } else {
      run();
    }
    display();
  };
  $_("#reset").onclick = reset;
};


function reset() {
  stop();
  delete localStorage["startTime"];
  display();
}

function run() {
  localStorage["running"] = "true";
  if (!localStorage["startTime"]) {
    localStorage["startTime"] = +new Date;
  }
  display();
  timer = setTimeout(run, 100);
}

function display() {
  $_("#toggle").innerHTML = localStorage["running"] ? "lap" : "start";
  var startTime = localStorage["startTime"];
  if (!startTime) {
    $_("#elapsed").innerHTML = "----";
  } else {
    var elapsedMillis = +new Date - parseInt(localStorage["startTime"]);
    var decs = Math.floor(elapsedMillis%1000/100);
    var secs = Math.floor(elapsedMillis%60000/1000);
    var mins = Math.floor(elapsedMillis%3600000/60000);
    var hours = Math.floor(elapsedMillis%(24*3600000)/3600000);
    $_("#elapsed").innerHTML =
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

function $_(selector) {
  return document.querySelector(selector);
}

function log() {
  console.log.apply(console, arguments);
}