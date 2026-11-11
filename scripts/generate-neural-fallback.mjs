// Optional authoring utility. Deployment uses the checked-in assets, without a build.
import { readFile, writeFile } from 'node:fs/promises';
import * as THREE from '../packages/js/vendor/three.module.min.js';
import { outline } from '../packages/js/portrait-outline.js';
import { palette, random } from '../packages/js/portrait-network.js';
const curve=new THREE.CatmullRomCurve3(outline.filter((_,i)=>i%3===0).map(([x,y])=>new THREE.Vector3((x/530-.5)*3.1,(.5-y/690)*4.03,0)),true,'catmullrom',.4);
curve.arcLengthDivisions=600;curve.updateArcLengths();
const p=new THREE.Vector3(),t=new THREE.Vector3(),f=n=>n.toFixed(1),phase=2;
function at(u,lane){u=(u%1+1)%1;curve.getPointAt(u,p);curve.getTangentAt(u,t);const d=.055+lane*.065+Math.sin(u*Math.PI*10-phase*1.2+lane)*.035;return [(p.x+t.y*d)/3.1*530+265,345-(p.y-t.x*d)/4.03*690];}
const parts=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 530 690"><g id="portrait">'];
for(let lane=0;lane<3;lane++){
 const color=palette[[0,1,3][lane]];
 for(let i=0;i<100;i++){
  const u=i/100;if(Math.sin(u*Math.PI*6-phase*.65+lane*1.8)<-.2)continue;
  const a=at(u,lane),b=at((i+1)/100,lane);const opacity=.45*Math.max(0,Math.min(1,(690-Math.max(a[1],b[1]))/100));
  parts.push(`<path d="M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}" fill="none" stroke="${color}" stroke-width="1" opacity="${opacity.toFixed(2)}"/>`);
 }
 for(let i=0;i<10;i++){const a=at(i/10+phase*(.021+lane*.004)+lane*.05,lane);if(a[1]>645)continue;parts.push(`<circle cx="${f(a[0])}" cy="${f(a[1])}" r="1.8" fill="${color}" opacity=".75"/>`);}
}
const body=[];
for(let row=0;row<8;row++)for(let col=0;col<22;col++){
 const i=row*22+col,u=col/21,v=row/7,jitter=(random(i+91)-.5)*.055;
 const x=(u-.5)*2.7+Math.sin(v*Math.PI+phase*.3)*.12+jitter;
 const y=-1.61+(v-.5)*.96+Math.sin(u*Math.PI*2+phase*.35)*.14+(u-.5)*.15;
 const strength=Math.pow(Math.max(0,Math.sin(u*Math.PI)*Math.sin(v*Math.PI)),.55)*Math.max(0,Math.min(1,(y+2.04)/.54));
 const node={x:x/3.1*530+265,y:345-y/4.03*690,strength};body.push(node);
 for(const j of [col?i-1:-1,row?i-22:-1,row&&col?i-23:-1]){if(j<0)continue;const b=body[j];parts.push(`<path d="M${f(node.x)} ${f(node.y)}L${f(b.x)} ${f(b.y)}" stroke="${palette[1]}" stroke-width=".9" opacity="${(.4*Math.min(strength,b.strength)).toFixed(2)}"/>`);}
 parts.push(`<circle cx="${f(node.x)}" cy="${f(node.y)}" r="1.7" fill="${palette[col%3===0?3:1]}" opacity="${(.7*strength).toFixed(2)}"/>`);
}
parts.push('</g></svg>');await writeFile(new URL('../packages/images/neural-portrait.svg',import.meta.url),parts.join(''));
const htmlFile=new URL('../index.html',import.meta.url);let html=await readFile(htmlFile,'utf8');
const fallback=`<svg class="hero-fallback neural-fallback" viewBox="0 0 530 690" aria-hidden="true"><defs><clipPath id="portrait-clip"><polygon points="${outline.map(p=>p.join(',')).join(' ')}"/></clipPath><linearGradient id="portrait-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="76%" stop-color="white"/><stop offset="100%" stop-color="black"/></linearGradient><mask id="portrait-mask"><rect width="530" height="690" fill="url(#portrait-fade)"/></mask></defs><image class="fallback-photo" href="./packages/images/portrait.webp" width="530" height="690" clip-path="url(#portrait-clip)" mask="url(#portrait-mask)"/><use href="./packages/images/neural-portrait.svg#portrait"></use></svg>`;
html=html.replace(/<svg class="hero-fallback neural-fallback"[\s\S]*?<\/svg>/,fallback);await writeFile(htmlFile,html);
console.log(`Static portrait frame: ${(parts.join('').length/1024).toFixed(1)} KB`);
