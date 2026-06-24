let employees =
JSON.parse(localStorage.emp || "[]");

let records =
JSON.parse(localStorage.records || "[]");

let activeBreaks =
JSON.parse(localStorage.activeBreaks || "{}");

let selected = "";

let timer = null;
let notificationChecker = null;



function saveData(){

localStorage.emp =
JSON.stringify(employees);

localStorage.records =
JSON.stringify(records);

localStorage.activeBreaks =
JSON.stringify(activeBreaks);

}



function load(){

employeesDiv.innerHTML = "";

employees.forEach((e,index)=>{

let status = "🟢 Working";

let timerText = "";

if(activeBreaks[e]){

let seconds =
Math.floor(
(Date.now()-activeBreaks[e]) / 1000
);

let h =
Math.floor(seconds/3600);

let m =
Math.floor((seconds%3600)/60);

status = "🔴 On Break";

timerText =
`<br><small>${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}</small>`;

}

employeesDiv.innerHTML += `
<div class="employee"

onclick="openEmp('${e}')"

onmousedown="startDeleteEmployee(${index})"
ontouchstart="startDeleteEmployee(${index})"

onmouseup="cancelLongPress()"
onmouseleave="cancelLongPress()"
ontouchend="cancelLongPress()">

`;

<b>${e}</b>

<br>

${status}

${timerText}

</div>

`;

});

}



function addEmployee(){

let n =
empInput.value.trim();

if(!n) return;

if(employees.includes(n)){
alert("Employee already exists");
return;
}

employees.push(n);

saveData();

empInput.value = "";

load();

}



function openEmp(e){

selected = e;

empName.innerHTML = e;

home.classList.add("hide");

breakPage.classList.remove("hide");

clearInterval(timer);

update();

timer =
setInterval(update,1000);

}



function start(){

if(!selected) return;

if(activeBreaks[selected]){

alert("Already on break");

return;

}

activeBreaks[selected] = Date.now();

saveData();

update();

load();

startNotificationChecker();

}



function stop(){

if(!activeBreaks[selected]){

alert("Employee is not on break");

return;

}

let startTime =
activeBreaks[selected];

let endTime =
Date.now();

let minutes =
Math.floor(
(endTime-startTime)/60000
);

records.unshift({

name:selected,

date:new Date(startTime)
.toLocaleDateString(),

start:new Date(startTime)
.toLocaleTimeString(),

end:new Date(endTime)
.toLocaleTimeString(),

minutes:minutes

});

delete activeBreaks[selected];

saveData();

update();

load();

alert("Break saved");

}



function update(){

if(!selected){

document.querySelector(".timer")
.innerHTML = "00:00:00";

return;

}

if(!activeBreaks[selected]){

document.querySelector(".timer")
.innerHTML = "00:00:00";

status.innerHTML =
"🟢 Working";

return;

}

let sec =
Math.floor(
(Date.now()-activeBreaks[selected])
/1000
);

let h =
Math.floor(sec/3600);

let m =
Math.floor((sec%3600)/60);

let s =
sec%60;

document.querySelector(".timer")
.innerHTML =

`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

status.innerHTML =
"🔴 On Break";

}



function startNotificationChecker(){

if(notificationChecker) return;

notificationChecker =
setInterval(()=>{

Object.keys(activeBreaks)
.forEach(emp=>{

let minutes =
Math.floor(
(Date.now()-activeBreaks[emp])
/60000
);

if(
minutes >= 30 &&
minutes % 10 === 0
){

if(
Notification.permission === "granted"
){

new Notification(
"Break Alert",
{
body:
`${emp} has been on break for ${minutes} minutes`
}
);

}

}

});

},60000);

}



function historyPage(){

home.classList.add("hide");

history.classList.remove("hide");

recordsDiv.innerHTML = "";

records.forEach((r,index)=>{

recordsDiv.innerHTML += `

<div class="employee"

onmousedown="startDeleteHistory(${index})"
ontouchstart="startDeleteHistory(${index})"

onmouseup="cancelLongPress()"
onmouseleave="cancelLongPress()"
ontouchend="cancelLongPress()">

<b>${r.name}</b>

<br>

${r.date}

<br>

Start: ${r.start}

<br>

End: ${r.end}

<br>

Duration: ${r.minutes} min

</div>

`;

});

}



function csv(){

let text =
"Name,Date,Start,End,Minutes\n";

records.forEach(r=>{

text +=
`${r.name},${r.date},${r.start},${r.end},${r.minutes}\n`;

});

let a =
document.createElement("a");

a.href =
URL.createObjectURL(
new Blob([text])
);

a.download =
"break-history.csv";

a.click();

}



function back(){

document.querySelectorAll("section")
.forEach(x=>x.classList.add("hide"));

home.classList.remove("hide");

load();

}



function darkMode(){

document.body.classList.toggle("dark");

localStorage.dark =
document.body.classList.contains("dark");

}



if(localStorage.dark==="true"){

document.body.classList.add("dark");

}



let home =
document.getElementById("home");

let breakPage =
document.getElementById("breakPage");

let history =
document.getElementById("history");

let employeesDiv =
document.getElementById("employees");

let recordsDiv =
document.getElementById("records");



load();



if("Notification" in window){

Notification.requestPermission();

}

startNotificationChecker();

let pressTimer;

function startDeleteEmployee(index){

pressTimer = setTimeout(()=>{

if(confirm(`Delete ${employees[index]} ?`)){

// remove active break if exists
delete activeBreaks[employees[index]];

employees.splice(index,1);

saveData();

load();

}

},800); // 800ms long press

}


function startDeleteHistory(index){

pressTimer = setTimeout(()=>{

if(navigator.vibrate){
navigator.vibrate(100);
}

if(confirm("Delete this history record?")){

records.splice(index,1);

saveData();

historyPage();

}

},800);

}


function cancelLongPress(){

clearTimeout(pressTimer);

}
