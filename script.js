let employees =
JSON.parse(localStorage.emp || "[]");


let records =
JSON.parse(localStorage.records || "[]");


let selected="";


let startTime =
localStorage.start || null;



let active =
localStorage.active || null;



let timer;





function load(){


employeesDiv.innerHTML="";


employees.forEach(e=>{


let status="🟢 Working";


if(active==e)

status="🔴 On Break";


employeesDiv.innerHTML +=

`

<div class="employee"

onclick="openEmp('${e}')">

<b>${e}</b>

<br>

${status}

</div>

`;


});


}



function addEmployee(){


let n=empInput.value.trim();


if(!n)return;


employees.push(n);


localStorage.emp=
JSON.stringify(employees);


empInput.value="";


load();


}





function openEmp(e){


selected=e;


empName.innerHTML=e;


home.classList.add("hide");

breakPage.classList.remove("hide");


}



function start(){


if(startTime)return;



startTime=Date.now();


active=selected;


localStorage.start=startTime;


localStorage.active=active;



timer=setInterval(update,1000);


notify();


}



function update(){


let sec=
Math.floor(
(Date.now()-startTime)/1000
);



let h=Math.floor(sec/3600);


let m=Math.floor(sec%3600/60);


let s=sec%60;



document.querySelector(".timer")
.innerHTML=

`${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;


}



function stop(){


let end=Date.now();


let min=Math.floor(
(end-startTime)/60000
);



records.unshift({

name:selected,

date:new Date().toLocaleDateString(),

minutes:min

});



localStorage.records=
JSON.stringify(records);



localStorage.removeItem("start");

localStorage.removeItem("active");



startTime=null;

active=null;


clearInterval(timer);


alert("Saved");


back();

}




function notify(){


setInterval(()=>{


if(!startTime)return;


let min=Math.floor(

(Date.now()-startTime)
/60000

);



if(min>=30 && min%10==0){


new Notification(
"Break Alert",
{
body:selected+
" break "+min+
" minutes"
}
);


}


},60000);


}




function historyPage(){


home.classList.add("hide");

history.classList.remove("hide");


recordsDiv.innerHTML="";


records.forEach(r=>{


recordsDiv.innerHTML+=

`

<div class="employee">

${r.name}

<br>

${r.date}

<br>

${r.minutes} minutes

</div>

`;

});


}





function csv(){


let text="Name,Date,Minutes\n";


records.forEach(r=>{


text+=`${r.name},${r.date},${r.minutes}\n`;

});


let a=document.createElement("a");


a.href=URL.createObjectURL(
new Blob([text])
);


a.download="break.csv";


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

}


let home=document.getElementById("home");

let breakPage=document.getElementById("breakPage");

let history=document.getElementById("history");

let employeesDiv=document.getElementById("employees");

let recordsDiv=document.getElementById("records");


load();


Notification.requestPermission();
