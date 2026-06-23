let employees =
JSON.parse(localStorage.employees || "[]");


let data =
JSON.parse(localStorage.records || "[]");


let current="";

let start =
localStorage.startTime;


let active =
localStorage.active;



let timer;





function addEmployee(){


let n =
employeeInput.value.trim();



if(n && !employees.includes(n)){


employees.push(n);


localStorage.employees =
JSON.stringify(employees);


load();


}


employeeInput.value="";


}







function load(){


list.innerHTML="";


employees.forEach(e=>{


let status="🟢 Working";


let time="";



if(active==e && start){


status="🔴 On Break";


time=getTime();


}



list.innerHTML += `


<div class="employee"

onclick="openBreak('${e}')">


<b>${e}</b>

<br>

${status}

<br>

${time}


</div>


`;

});


}


load();





function openBreak(e){


current=e;


name.innerHTML=e;


home.classList.add("hide");

break.classList.remove("hide");


if(active==e && start){


timer=setInterval(clock,1000);


}


}






function startBreak(){


if(start)return;



start=new Date().getTime();


active=current;



localStorage.startTime=start;

localStorage.active=active;



timer=setInterval(clock,1000);



clock();


alerts();



load();


}







function clock(){


clock.innerHTML=getTime();


}



function getTime(){


let s=

Math.floor(

(new Date().getTime()-start)
/1000

);



let h=
Math.floor(s/3600);


let m=
Math.floor((s%3600)/60);


let sec=s%60;



return

`${h.toString().padStart(2,"0")}:
${m.toString().padStart(2,"0")}:
${sec.toString().padStart(2,"0")}`;


}








function alerts(){


setInterval(()=>{


let min=

Math.floor(

(new Date().getTime()-start)
/60000

);



if(min>=30 && min%10==0){


new Notification(

"Break Alert",

{

body:
current+
" break "+min+" minutes"

}


);


}



},60000);



}







function stopBreak(){


let end=new Date();


let st=new Date(
Number(start)
);



data.unshift({

name:current,

date:
st.toLocaleDateString(),

start:
st.toLocaleTimeString(),

end:
end.toLocaleTimeString(),

min:
Math.floor((end-st)/60000)


});



localStorage.records=
JSON.stringify(data);



localStorage.removeItem("startTime");

localStorage.removeItem("active");



start=null;

active=null;



clearInterval(timer);



alert("Saved");


load();



}





function showHistory(){


home.classList.add("hide");


historyPage.classList.remove("hide");



records.innerHTML="";


data.forEach(r=>{


records.innerHTML+=`


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






function csv(){


let c="Name,Date,Start,End,Min\n";


data.forEach(r=>{


c+=`${r.name},${r.date},${r.start},${r.end},${r.min}\n`;


});



let a=document.createElement("a");


a.href=URL.createObjectURL(
new Blob([c])
);


a.download="break.csv";


a.click();


}







function back(){


document.querySelectorAll(".card")
.forEach(x=>x.classList.add("hide"));


home.classList.remove("hide");


load();

}






function darkMode(){


document.body.classList.toggle("dark");


localStorage.dark=
document.body.classList.contains("dark");


}


if(localStorage.dark=="true")

document.body.classList.add("dark");




Notification.requestPermission();



if("serviceWorker" in navigator)

navigator.serviceWorker.register("sw.js");
