let employees =
JSON.parse(localStorage.getItem("employees")) || [];

let records =
JSON.parse(localStorage.getItem("records")) || [];


let currentEmployee="";

let startTime =
localStorage.getItem("startTime");


let activeEmployee =
localStorage.getItem("activeEmployee");


let timer;

let alertTimer;



// LOAD

loadEmployees();


// DARK MODE

if(localStorage.getItem("dark")=="true"){
document.body.classList.add("dark");
}



// ADD EMPLOYEE

function addEmployee(){

let name =
document.getElementById("newEmployee").value.trim();


if(!name)return;


if(!employees.includes(name)){

employees.push(name);


localStorage.setItem(
"employees",
JSON.stringify(employees)
);

}


document.getElementById("newEmployee").value="";


loadEmployees();

}



// EMPLOYEE LIST

function loadEmployees(){

let box =
document.getElementById("employeeList");


box.innerHTML="";


employees.forEach(name=>{


let status="🟢 Working";


let time="";


if(
activeEmployee==name &&
startTime
){

status="🔴 On Break";


time =
getLiveTime();

}



box.innerHTML += `


<div class="employee"

onclick="openBreak('${name}')">


<b>${name}</b>

<br>

${status}

${time ? "<br>"+time : ""}


</div>


`;


});


}



// OPEN BREAK PAGE

function openBreak(name){

currentEmployee=name;


document.getElementById("empTitle")
.innerHTML=name;


employeesPage.classList.add("hidden");

breakPage.classList.remove("hidden");



if(
activeEmployee==name &&
startTime
){

timer =
setInterval(updateTimer,1000);


updateTimer();


}

}




// START BREAK

function startBreak(){


if(startTime)return;


startTime =
new Date().getTime();


activeEmployee =
currentEmployee;



localStorage.setItem(
"startTime",
startTime
);


localStorage.setItem(
"activeEmployee",
activeEmployee
);



timer =
setInterval(
updateTimer,
1000
);



updateTimer();


startAlerts();


loadEmployees();


}




// TIMER DISPLAY

function updateTimer(){


if(!startTime)return;


timer.innerHTML =
getLiveTime();


loadEmployees();


}



function getLiveTime(){


let diff =
new Date().getTime()
-
Number(startTime);



let sec =
Math.floor(diff/1000);


let h =
Math.floor(sec/3600);


let m =
Math.floor(
(sec%3600)/60
);


let s =
sec%60;


return

String(h).padStart(2,"0")
+
":"
+
String(m).padStart(2,"0")
+
":"
+
String(s).padStart(2,"0");


}




// NOTIFICATIONS

function startAlerts(){


clearInterval(alertTimer);


alertTimer =
setInterval(()=>{


let minutes =
Math.floor(

(
new Date().getTime()
-
Number(startTime)
)
/60000

);



if(
minutes>=30 &&
minutes%10==0
){


if(Notification.permission==="granted"){


new Notification(

"Break Alert",

{

body:

activeEmployee+
" break "
+
minutes+
" minutes"

}

);


}


}



},60000);



}



// STOP BREAK

function stopBreak(){


if(!startTime)return;


let start =
new Date(
Number(startTime)
);


let end =
new Date();



let minutes =
Math.floor(
(end-start)/60000
);



records.unshift({

name:activeEmployee,

date:
start.toLocaleDateString(),

start:
start.toLocaleTimeString(),

end:
end.toLocaleTimeString(),

min:
minutes


});



localStorage.setItem(

"records",

JSON.stringify(records)

);



// CLEAR

localStorage.removeItem(
"startTime"
);


localStorage.removeItem(
"activeEmployee"
);


startTime=null;

activeEmployee=null;


clearInterval(timer);

clearInterval(alertTimer);



document.getElementById("timer")
.innerHTML="00:00:00";


alert("Break Saved");


loadEmployees();


}



// HISTORY

function showHistory(){


employeesPage.classList.add("hidden");

historyPage.classList.remove("hidden");



let h =
document.getElementById("history");


h.innerHTML="";



records.forEach(r=>{


h.innerHTML += `


<tr>

<td>${r.name}</td>

<td>${r.date}</td>

<td>${r.start}</td>

<td>${r.end}</td>

<td>${r.min}</td>


</tr>


`;


});


}




// CSV EXPORT

function exportCSV(){


let csv =
"Name,Date,Start,End,Minutes\n";


records.forEach(r=>{


csv +=

`${r.name},${r.date},${r.start},${r.end},${r.min}\n`;


});



let blob =
new Blob([csv]);



let a =
document.createElement("a");


a.href =
URL.createObjectURL(blob);


a.download =
"break-record.csv";


a.click();


}



// BACK

function backHome(){


document.querySelectorAll(".page")
.forEach(p=>{

p.classList.add("hidden");

});


employeesPage.classList.remove("hidden");


loadEmployees();

}




// DARK MODE

function darkMode(){


document.body.classList.toggle("dark");


localStorage.setItem(

"dark",

document.body.classList.contains("dark")

);


}




// NOTIFICATION PERMISSION

if(
"Notification" in window
){

Notification.requestPermission();

}



// OFFLINE

if(
"serviceWorker" in navigator
){

navigator.serviceWorker.register(
"sw.js"
);

}
