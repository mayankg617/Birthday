let c=5;let e=document.getElementById('count');let o=document.getElementById('overlay');
let m=document.getElementById('main');
let t='21 May 2024... A simple text. 14 May 2026... Destiny brought us together again. Happy Birthday Mansi!';
function type(i=0){if(i<t.length){document.getElementById('typing').textContent+=t[i];setTimeout(()=>type(i+1),40);}}
let iv=setInterval(()=>{c--;e.textContent=c;if(c==0){clearInterval(iv);o.style.display='none';m.classList.remove('hidden');type();}},1000);