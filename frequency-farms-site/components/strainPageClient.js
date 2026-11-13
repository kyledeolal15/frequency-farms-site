// Client-side behavior for the per-strain page: fills the page from the
// strain data, draws the spectrum position, and runs the 3D bud viewer.
// Needs window.THREE (three.js r128) to be loaded first.
export function initStrainPage(STRAIN_LIST, CUR) {
const STRAINS = {};
STRAIN_LIST.forEach((s) => { STRAINS[s.slug] = s; });
const STATES={
  flow:{name:'Flow & Creation',tag:'Loose \u2022 Imaginative \u2022 Unforced',pos:0},
  energy:{name:'Energy & Expression',tag:'Bright \u2022 Talkative \u2022 Lifted',pos:1},
  balance:{name:'Balance & Harmony',tag:'Centered \u2022 Versatile \u2022 Smooth',pos:2},
  calm:{name:'Calm & Centering',tag:'Slow \u2022 Settled \u2022 Even',pos:3},
  recovery:{name:'Recovery & Grounding',tag:'Heavy \u2022 Quiet \u2022 Restorative',pos:4}
};
function hx(h){h=h.replace('#','');return [0,2,4].map(i=>parseInt(h.substr(i,2),16));}
function gradAt(g,t){const n=g.length-1,x=Math.min(n,Math.max(0,t*n)),i=Math.min(n-1,Math.floor(x)),f=x-i,a=hx(g[i]),b=hx(g[i+1]);return 'rgb('+a.map((v,k)=>Math.round(v+(b[k]-v)*f)).join(',')+')';}
function stateFor(s){if(s.state)return s.state;const t=s.type.toLowerCase();return t.includes('indica')?'calm':t.includes('sativa')?'energy':'balance';}
function gradCss(g){return 'linear-gradient(90deg,'+g.map((c,i)=>c+' '+Math.round(i/(g.length-1)*100)+'%').join(',')+')';}

const vid=document.getElementById('realVid'),paneReal=document.getElementById('paneReal'),pane3d=document.getElementById('pane3d'),hint=document.getElementById('hint');
let active3d=true;
function pickSlug(){return CUR;}
function render(){
  const slug=pickSlug(),s=STRAINS[slug],stKey=stateFor(s),st=STATES[stKey],g=s.grad;
  const c1=g[0],c2=g[Math.floor((g.length-1)/2)],c3=g[g.length-1],root=document.documentElement.style;
  root.setProperty('--c1',c1);root.setProperty('--c2',c2);root.setProperty('--c3',c3);root.setProperty('--grad',gradCss(g));
  document.querySelectorAll('.st1').forEach(x=>x.setAttribute('stop-color',c1));document.querySelectorAll('.st2').forEach(x=>x.setAttribute('stop-color',c2));document.querySelectorAll('.st3').forEach(x=>x.setAttribute('stop-color',c3));
  const set=(k,v)=>document.querySelectorAll('[data-f="'+k+'"]').forEach(el=>el.textContent=v);
  const show=(k,on)=>document.querySelectorAll('[data-block="'+k+'"]').forEach(el=>el.hidden=!on);
  const has=a=>!!(a&&a.length);
  set('name',s.name);set('sub','Exotic Flower');
  {const nm=document.querySelector('.name'),w=document.querySelector('.bag').clientWidth-40,lw=Math.max(...s.name.split(' ').map(x=>x.length));let fs=Math.min(67,Math.floor(w/(lw*0.5)));nm.style.fontSize=fs+'px';nm.style.whiteSpace='normal';
   const fit=()=>{let f=fs;nm.style.fontSize=f+'px';const words=s.name.split(' ');const probe=document.createElement('span');probe.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font:inherit;letter-spacing:inherit';nm.appendChild(probe);
     const widest=()=>Math.max(...words.map(x=>{probe.textContent=x;return probe.offsetWidth;}));while(f>28&&widest()>nm.clientWidth){f-=2;nm.style.fontSize=f+'px';}probe.remove();};fit();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);}set('stateName',st.name);set('stateTag',st.tag);set('type',s.type);
  set('genetics',s.genetics||'');show('genetics',!!s.genetics);
  const lines=(k,a)=>document.querySelectorAll('[data-f="'+k+'"]').forEach(el=>{el.innerHTML='';(a||[]).forEach(x=>{const d=document.createElement('span');d.className='ln';d.textContent=x;el.appendChild(d);});});
  lines('flavor',s.flavor);lines('aroma',s.aroma);show('flavor',has(s.flavor));show('aroma',has(s.aroma));
  show('gf-rule',!!s.genetics&&has(s.flavor));
  document.querySelector('[data-f="effects"]').innerHTML=(s.effects||[]).map(x=>'<span>'+x+'</span>').join('');show('effects',has(s.effects));
  show('ae-rule',has(s.aroma)&&has(s.effects));
  show('story',!!s.story);set('story',s.story||'');
  show('terpenes',has(s.terpenes));set('terpenes',(s.terpenes||[]).join(' • '));
  const col2=!!s.genetics||has(s.flavor),col3=!!s.story||has(s.aroma)||has(s.effects)||has(s.terpenes);
  document.getElementById('col2').hidden=!col2;document.getElementById('col3').hidden=!col3;
  document.querySelector('.info').classList.toggle('solo',!col2);
  // the terpenes block carries its own leading rule; drop it if it's first in the column
  const tr=document.querySelector('[data-block="terpenes"] .mini-rule');if(tr)tr.hidden=!(s.story||has(s.aroma)||has(s.effects));
  const sr=document.querySelector('[data-block="story"] .mini-rule');if(sr)sr.hidden=!(has(s.aroma)||has(s.effects)||has(s.terpenes));
  
  document.querySelectorAll('.node').forEach((n,i)=>{n.classList.toggle('on',n.dataset.s===stKey);n.style.setProperty('--c',gradAt(g,i/4));});
  document.getElementById('trackDot').style.setProperty('--dot',gradAt(g,st.pos/4));
  document.querySelector('[data-f="stateIcon"]').innerHTML=document.querySelector('.node[data-s="'+stKey+'"] .ring').innerHTML.replace('stroke="currentColor"','stroke="url(#gh)"');
  document.getElementById('trackDot').style.left=(10+st.pos*20)+'%';
  document.title=s.name+' — Frequency Farms';
  const hasVid=!!s.video;document.getElementById('viewToggle').hidden=!hasVid;
  if(hasVid){if(vid.getAttribute('src')!==s.video)vid.src=s.video;if(s.poster)vid.poster=s.poster;}
  else{vid.pause();vid.removeAttribute('src');vid.removeAttribute('poster');
    if(!active3d){document.querySelector('#viewToggle button[data-v="3d"]').click();}}
  document.getElementById('moreList').innerHTML=Object.keys(STRAINS).map(k=>'<a href="/s/'+k+'" class="'+(k===slug?'cur':'')+'" style="--g:'+gradCss(STRAINS[k].grad)+'">'+STRAINS[k].name+'</a>').join('');
}
render();
document.querySelectorAll('.view-toggle button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.view-toggle button').forEach(x=>x.classList.toggle('on',x===b));
  active3d=b.dataset.v==='3d';
  pane3d.classList.toggle('off',!active3d);paneReal.classList.toggle('off',active3d);hint.style.opacity=active3d?1:0;
  if(active3d)vid.pause();else{const p=vid.play();if(p&&p.catch)p.catch(()=>{});}
}));
pane3d.addEventListener('pointerdown',()=>{hint.style.opacity=0;},{once:true});

(function start3d(){

if(!window.THREE){pane3d.innerHTML='<p style="padding:24px">3D view could not load.</p>';return;}
let seed=4217;function rnd(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646;}
function rr(a,b){return a+(b-a)*rnd();}
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputEncoding=THREE.sRGBEncoding;
pane3d.appendChild(renderer.domElement);
const host=renderer.domElement;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(34,1,.1,100);let camDist=6.6;
scene.add(new THREE.HemisphereLight(0xf5f1ec,0x1a0f22,.8));
const key=new THREE.DirectionalLight(0xffffff,1.1);key.position.set(3,4,5);scene.add(key);
const rim=new THREE.PointLight(0xff2e93,1.6,14);rim.position.set(-3.2,1.2,-2.5);scene.add(rim);
const bud=new THREE.Group();scene.add(bud);
function profile(y){const t=(y+1.45)/3.0;return 0.92*Math.pow(Math.sin(Math.PI*Math.min(1,t*1.04)),.8)*(1-.32*t)+.05;}
const calyxGeo=new THREE.IcosahedronGeometry(1,2);
{const p=calyxGeo.attributes.position;for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i);v.multiplyScalar(1+.12*Math.sin(v.x*7+v.y*5)*Math.cos(v.z*6));p.setXYZ(i,v.x,v.y,v.z);}calyxGeo.computeVertexNormals();}
const N=520,calyx=new THREE.InstancedMesh(calyxGeo,new THREE.MeshStandardMaterial({roughness:.62}),N);
const palette=[0x8a9a62,0x9aa673,0x7d8d55,0xa9b285,0x8a6a8e,0xa98aa6,0x6f7f4c,0xb59ab0];
const m=new THREE.Matrix4(),q=new THREE.Quaternion(),pos=new THREE.Vector3(),scl=new THREE.Vector3(),col=new THREE.Color();const surface=[];
for(let i=0;i<N;i++){const y=rr(-1.4,1.5),a=rr(0,6.283),r=profile(y)*rr(.78,1.02);pos.set(Math.cos(a)*r,y,Math.sin(a)*r);
  const s=rr(.13,.26)*(.75+.5*profile(y));scl.set(s*rr(.8,1.1),s*rr(1.1,1.6),s*rr(.8,1.1));q.setFromEuler(new THREE.Euler(rr(-.5,.5),a,rr(-.6,.6)));
  m.compose(pos,q,scl);calyx.setMatrixAt(i,m);col.setHex(palette[Math.floor(rnd()*palette.length)]);col.lerp(new THREE.Color(0xf3efe6),rr(.05,.4));calyx.setColorAt(i,col);surface.push({p:pos.clone(),r:s});}
bud.add(calyx);
bud.add(new THREE.Mesh(new THREE.LatheGeometry(Array.from({length:24},(_,i)=>{const y=-1.45+i*(3/23);return new THREE.Vector2(Math.max(.02,profile(y)*.78),y);}),32),new THREE.MeshStandardMaterial({color:0x5f7040,roughness:.8})));
const ls=new THREE.Shape();ls.moveTo(0,0);ls.quadraticCurveTo(.18,.35,0,1);ls.quadraticCurveTo(-.18,.35,0,0);
const lg=new THREE.ShapeGeometry(ls,8),lm1=new THREE.MeshStandardMaterial({color:0x56663a,roughness:.7,side:THREE.DoubleSide}),lm2=new THREE.MeshStandardMaterial({color:0x5b3f5e,roughness:.7,side:THREE.DoubleSide});
for(let i=0;i<18;i++){const y=rr(-1.2,1.1),a=rr(0,6.283),r=profile(y)*.85,l=new THREE.Mesh(lg,rnd()<.4?lm2:lm1),s=rr(.45,.85);l.scale.set(s,s,s);
  l.position.set(Math.cos(a)*r,y,Math.sin(a)*r);l.rotation.set(0,-a+Math.PI/2,0);l.rotateX(rr(-.3,.2));l.rotateZ(rr(-1.3,-.6)*(rnd()<.5?1:-1));l.rotateY(Math.PI/2);bud.add(l);}
const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(.03,.12,0),new THREE.Vector3(.1,.22,.02),new THREE.Vector3(.2,.27,.04)]);
const P=260,pist=new THREE.InstancedMesh(new THREE.TubeGeometry(curve,10,.008,4,false),new THREE.MeshStandardMaterial({roughness:.5}),P);
for(let i=0;i<P;i++){const c=surface[Math.floor(rnd()*surface.length)],dir=new THREE.Vector3(c.p.x,c.p.y*.25,c.p.z).normalize();pos.copy(c.p).addScaledVector(dir,c.r*.6);
  q.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().add(new THREE.Vector3(rr(-.4,.4),rr(.1,.6),rr(-.4,.4))).normalize());const s=rr(.8,1.7);scl.set(s,s,s);m.compose(pos,q,scl);pist.setMatrixAt(i,m);
  col.setHex(rnd()<.3?0xb8562f:0xd9792c);pist.setColorAt(i,col);}
bud.add(pist);
const T=3600,tp=new Float32Array(T*3);for(let i=0;i<T;i++){const c=surface[Math.floor(rnd()*surface.length)],v=new THREE.Vector3(rr(-1,1),rr(-1,1),rr(-1,1)).normalize().multiplyScalar(c.r*rr(1,1.2));
  tp[i*3]=c.p.x+v.x*1.1;tp[i*3+1]=c.p.y+v.y*1.4;tp[i*3+2]=c.p.z+v.z*1.1;}
const tg=new THREE.BufferGeometry();tg.setAttribute('position',new THREE.BufferAttribute(tp,3));
bud.add(new THREE.Points(tg,new THREE.PointsMaterial({color:0xf3efe6,size:.022,transparent:true,opacity:.7})));
const stem=new THREE.Mesh(new THREE.CylinderGeometry(.06,.09,.6,10),new THREE.MeshStandardMaterial({color:0x6f7f45,roughness:.8}));stem.position.y=-1.65;bud.add(stem);
bud.rotation.z=-.08;
let yaw=0,pitch=.12,vy=0,drag=false,lx=0,ly=0,idle=2;const pts=new Map();let p0=0,d0=camDist;
host.addEventListener('pointerdown',e=>{pts.set(e.pointerId,{x:e.clientX,y:e.clientY});host.setPointerCapture(e.pointerId);
  if(pts.size===1){drag=true;lx=e.clientX;ly=e.clientY;vy=0;}if(pts.size===2){const[a,b]=[...pts.values()];p0=Math.hypot(a.x-b.x,a.y-b.y);d0=camDist;}});
host.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pts.size===2){const[a,b]=[...pts.values()];if(p0)camDist=Math.min(11,Math.max(3.8,d0*p0/Math.hypot(a.x-b.x,a.y-b.y)));return;}
  if(drag){const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;yaw+=dx*.009;vy=dx*.009;pitch=Math.max(-.6,Math.min(.8,pitch+dy*.004));idle=0;}});
function up(e){pts.delete(e.pointerId);if(pts.size<2)p0=0;if(!pts.size)drag=false;}
host.addEventListener('pointerup',up);host.addEventListener('pointercancel',up);
host.addEventListener('wheel',e=>{e.preventDefault();camDist=Math.min(11,Math.max(3.8,camDist*(1+e.deltaY*.001)));},{passive:false});
function resize(){const w=pane3d.clientWidth,h=pane3d.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
resize();addEventListener('resize',resize);
const clock=new THREE.Clock();
(function loop(){const dt=Math.min(clock.getDelta(),.05);
  if(active3d){if(!drag){idle+=dt;vy*=.95;yaw+=vy+(idle>1.2?.005:0);}
    bud.rotation.y=yaw;bud.rotation.x=pitch*.6;camera.position.set(0,.3+pitch*1.2,camDist);camera.lookAt(0,0,0);renderer.render(scene,camera);}
  requestAnimationFrame(loop);})();
})();
}
