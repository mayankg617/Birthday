let percent=0;

let counter=document.querySelector(".counter");

let loader=document.querySelector("#loader");

let typing=document.querySelector("#typing");

let text="21 May 2024...\nA simple message.\nNo one knew...\nit would become a beautiful habit.";

let i=0;

let interval=setInterval(()=>{

percent++;

counter.innerHTML=percent+"%";

if(percent==100){

clearInterval(interval);

loader.style.display="none";

typeWriter();

}

},45);

function typeWriter(){

if(i<text.length){

typing.innerHTML+=text.charAt(i);

i++;

setTimeout(typeWriter,60);

}

}
