(()=>{
const panels=[...document.querySelectorAll('.hero,.journey-card,.evidence,.closing,.fee-preview,.operation-card,.asset-row,.activity-empty,.activity-demo,.reserve-grid')];

for(const panel of panels){panel.classList.add('metal-panel');let frame=0;
 panel.addEventListener('pointermove',event=>{if(event.pointerType==='touch'||frame)return;const x=event.clientX,y=event.clientY;frame=requestAnimationFrame(()=>{frame=0;const box=panel.getBoundingClientRect();panel.style.setProperty('--metal-x',((x-box.left)/box.width*100).toFixed(1)+'%');panel.style.setProperty('--metal-y',((y-box.top)/box.height*100).toFixed(1)+'%')})},{passive:true});
 panel.addEventListener('pointerleave',()=>{if(frame)cancelAnimationFrame(frame);frame=0;panel.style.removeProperty('--metal-x');panel.style.removeProperty('--metal-y')},{passive:true});
}
})();

// Light follows the pointer with a little inertia, without replacing the cursor.
(()=>{
 if(!matchMedia('(hover: hover) and (pointer: fine)').matches)return;
 const landing=!!document.querySelector('.vip-stage');
 document.body.classList.toggle('landing-depth',landing);
 const light=document.createElement('div');light.className='cursor-light';light.setAttribute('aria-hidden','true');document.body.append(light);
 const hero=landing?document.querySelector('.hero'):null;
 let tx=0,ty=0,x=0,y=0,frame=0,active=false;
 function draw(){frame=0;if(!active||document.hidden)return; x+=(tx-x)*.09;y+=(ty-y)*.09;
  light.style.transform=`translate3d(${(x-425).toFixed(2)}px,${(y-425).toFixed(2)}px,0)`;
  if(hero){const b=hero.getBoundingClientRect();hero.style.setProperty('--field-x',(62+(x/innerWidth-.5)*13).toFixed(2)+'%');hero.style.setProperty('--field-y',(32+(y-b.top)/b.height*8).toFixed(2)+'%')}
  if(Math.abs(tx-x)+Math.abs(ty-y)>.2)frame=requestAnimationFrame(draw);
 }
 document.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;tx=e.clientX;ty=e.clientY;if(!active){x=tx;y=ty}active=true;document.body.classList.add('cursor-present');if(!frame)frame=requestAnimationFrame(draw)},{passive:true});
 function leave(){active=false;document.body.classList.remove('cursor-present');cancelAnimationFrame(frame);frame=0}
 document.documentElement.addEventListener('pointerleave',leave);window.addEventListener('blur',leave);document.addEventListener('visibilitychange',()=>{if(document.hidden)leave()});
})();
