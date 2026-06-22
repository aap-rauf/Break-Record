let employees =
JSON.parse(localStorage.getItem("employees")) || [];


let records =
JSON.parse(localStorage.getItem("records")) || [];


let currentEmployee="";

let startTime =
localStorage.getItem("startTime");

let timer;

let alertTimer;



function save(){

localStorage.setItem(
"employees",
JSON.stringify(employees)
);

}



function addEmployee(){

let n=
document.getElementById("newEmployee").value;


if(n){

employees.push(n);

save();

loadEmployees();

}

}



function loadEmployees(){

let box=
document.getElementById("employeeList");


box.innerHTML="";


employees.forEach(e=>{


box.innerHTML+=`

<div class="employee"
onclick="openBreak('${e}')">

${e}

</div>

`;

});


}



function openBreak(name){

currentEmployee=name;


document.getElementById("empTitle")
.innerHTML=name;


employeesPage.classList.add("hidden");

breakPage.classList.remove("hidden");

}



function startBreak(){


if(startTime)return;


startTime=new Date();


timer=setInterval(updateTimer,1000);


checkAlert();


}



function updateTimer(){


let diff=
new Date()-startTime;


let sec=
Math.floor(diff/1000);


let h=
Math.floor(sec/3600);


let m=
Math.floor((sec%3600)/60);


let s=
sec%60;


timer.innerHTML=

`${h}:${m}:${s}`;


}



function checkAlert(){

setInterval(()=>{


if(!startTime)return;


let min=
Math.floor(
(new Date()-startTime)/60000
);



if(min>=30 && min%10==0){


new Notification(
"Break Alert",
{

body:
currentEmployee+
" break "+min+
" minutes"

});


}


},60000);


}



function stopBreak(){


if(!startTime)return;


let end=new Date();


let minutes=
Math.floor(
(end-startTime)/60000
);



records.unshift({

name:currentEmployee,

date:
new Date().toLocaleDateString(),

start:
startTime.toLocaleTimeString(),

end:
end.toLocaleTimeString(),

min:minutes

});



localStorage.setItem(
"records",
JSON.stringify(records)
);



clearInterval(timer);

startTime=null;


alert("Break saved");


}



function showHistory(){


employeesPage.classList.add("hidden");

historyPage.classList.remove("hidden");


let h=
document.getElementById("history");


h.innerHTML="";


records.forEach(r=>{


h.innerHTML+=`

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



function exportCSV(){


let csv=
"Name,Date,Start,End,Minutes\n";


records.forEach(r=>{


csv+=

`${r.name},${r.date},${r.start},${r.end},${r.min}\n`;


});


let blob=
new Blob([csv]);


let a=
document.createElement("a");


a.href=
URL.createObjectURL(blob);


a.download="break-record.csv";


a.click();


}



function backHome(){


document.querySelectorAll(".page")
.forEach(p=>p.classList.add("hidden"));


employeesPage.classList.remove("hidden");


}



function darkMode(){

document.body.classList.toggle("dark");


localStorage.setItem(
"dark",
document.body.classList.contains("dark")
);


}



if(localStorage.getItem("dark")=="true")

document.body.classList.add("dark");



loadEmployees();



if(
"Notification" in window
)

Notification.requestPermission();




if("serviceWorker" in navigator)

navigator.serviceWorker.register("sw.js");
