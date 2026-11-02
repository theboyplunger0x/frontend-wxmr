const amount=document.querySelector('#previewAmount');const output=document.querySelector('#previewOutput');amount.addEventListener('input',()=>{const value=Number(amount.value);output.textContent=Number.isFinite(value)&&value>=.1?(value*.999).toLocaleString('en-US',{maximumFractionDigits:6}):'—'});

// Light and tilt follow the pointer, with a restrained idle movement.
(()=>{
const stage=document.querySelector('.vip-stage'),card=document.querySelector('.vip-card');
if(!stage||!card)return;
// This visual concept explicitly enables the requested card movement.
let frame=0,visible=true,hovering=false,px=.35,py=.35,x=7,y=-14,z=-9,last=0,elapsed=0;
function draw(now){
 frame=0;if(!visible||document.hidden){last=0;return}
 const dt=last?Math.min((now-last)/1000,.05):.016;last=now;elapsed+=dt;
 const targetX=hovering?(0.5-py)*10:6+Math.sin(elapsed*.7)*3.5;
 const targetY=hovering?(px-.5)*15-7:-10+Math.sin(elapsed*.6)*5;
 const targetZ=hovering?-6:-7+Math.sin(elapsed*.45)*1.8;
 const ease=1-Math.exp(-dt*5);x+=(targetX-x)*ease;y+=(targetY-y)*ease;z+=(targetZ-z)*ease;
 card.style.setProperty('--rx',x.toFixed(3)+'deg');card.style.setProperty('--ry',y.toFixed(3)+'deg');card.style.setProperty('--rz',z.toFixed(3)+'deg');
 const lx=hovering?px*100:38+Math.sin(elapsed*.4)*18;
 const ly=hovering?py*100:32+Math.cos(elapsed*.35)*13;
 card.style.setProperty('--light-x',lx.toFixed(2)+'%');card.style.setProperty('--light-y',ly.toFixed(2)+'%');
 frame=requestAnimationFrame(draw);
}
function start(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(draw)}
function stop(){cancelAnimationFrame(frame);frame=0;last=0}
stage.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const b=stage.getBoundingClientRect();px=Math.max(0,Math.min(1,(e.clientX-b.left)/b.width));py=Math.max(0,Math.min(1,(e.clientY-b.top)/b.height));hovering=true;start()},{passive:true});
stage.addEventListener('pointerleave',()=>{hovering=false},{passive:true});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visible?start():stop()},{threshold:.05}).observe(stage);
document.addEventListener('visibilitychange',()=>document.hidden?stop():start());start();
})();
