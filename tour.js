/* Deployment Ready: offline, dependency-free onboarding. No checklist writes. */
(()=>{
'use strict';
const KEY='deployment-ready-tour-v1';
const steps=[
 {page:'home',selector:'#homePage .hero',title:'Welcome to Deployment Ready',body:'Choose your service branch and prepare at your own pace. Your planning information stays on this device.'},
 {page:'home',selector:'.phase-panel',title:'Choose your deployment phase',body:'Select Preparing, Deployed, or Returning. The app never changes your phase without your choice.'},
 {page:'home',selector:'.home-grid',title:'See your progress',body:'These shortcuts show your packing and readiness progress and take you directly to each checklist.'},
 {page:'packing',selector:'#packingPage .branch-row',title:'Start your packing checklist',body:'Choose your branch and optionally load a starter template. Follow your unit’s official packing list first.'},
 {page:'packing',selector:'#packingPage #addForm',title:'Customize your equipment',body:'Add your own items, organize them by bag, and check them off as you pack.'},
 {page:'readiness',selector:'#readinessDashboard',title:'Track readiness tasks',body:'Open preparation areas and mark tasks To Do, Completed, or Not Applicable. Avoid entering sensitive details.'},
 {page:'home',selector:'.stage2-tool-grid',title:'Explore planning tools',body:'Use the Budget Planner, Milestones, Family Support Plan, and Military Resources as optional preparation aids.'},
 {page:'home',selector:'#backupPanel',title:'Protect your progress',body:'Download a full backup before clearing browser data or switching devices. You can restart this tour here anytime.'}
];
let current=0,active=false,highlight=null,previousFocus=null;
const root=document.createElement('div');root.id='drTour';root.hidden=true;
root.innerHTML='<div class="dr-tour-shade"></div><section class="dr-tour-card" role="dialog" aria-modal="true" aria-labelledby="drTourTitle" aria-describedby="drTourBody"><div class="dr-tour-top"><span id="drTourCount"></span><button type="button" id="drTourSkip" aria-label="Skip tutorial">Skip tour ✕</button></div><h2 id="drTourTitle"></h2><p id="drTourBody"></p><div class="dr-tour-progress" aria-hidden="true"></div><div class="dr-tour-actions"><button type="button" id="drTourBack">← Back</button><button type="button" id="drTourNext">Next →</button></div></section>';
document.body.append(root);
const $=id=>document.getElementById(id);
const replay=document.createElement('button');replay.type='button';replay.className='outline';replay.id='restartTour';replay.textContent='▶ Take the guided tour';
const settings=$('backupPanel');if(settings){settings.insertBefore(replay,settings.querySelector('h3'));replay.addEventListener('click',()=>start());}
function clearHighlight(){if(highlight){highlight.classList.remove('dr-tour-highlight');highlight=null;}}
function pageTo(page){const button=document.querySelector('.main-nav [data-page="'+page+'"]');if(button)button.click();}
function render(){clearHighlight();const s=steps[current];pageTo(s.page);highlight=document.querySelector(s.selector);if(highlight){highlight.classList.add('dr-tour-highlight');highlight.scrollIntoView({block:'center',behavior:'instant'});}root.hidden=false;$('drTourCount').textContent='STEP '+(current+1)+' OF '+steps.length;$('drTourTitle').textContent=s.title;$('drTourBody').textContent=s.body;$('drTourBack').disabled=current===0;$('drTourNext').textContent=current===steps.length-1?'Finish ✓':'Next →';root.querySelector('.dr-tour-progress').replaceChildren(...steps.map((_,i)=>{const x=document.createElement('span');if(i<=current)x.className='filled';return x;}));$('drTourNext').focus({preventScroll:true});}
function finish(){active=false;root.hidden=true;clearHighlight();try{localStorage.setItem(KEY,'done');}catch(e){}if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});}
function start(){if(active)return;previousFocus=document.activeElement;current=0;active=true;render();}
$('drTourSkip').addEventListener('click',finish);$('drTourBack').addEventListener('click',()=>{if(current>0){current--;render();}});$('drTourNext').addEventListener('click',()=>{if(current===steps.length-1)finish();else{current++;render();}});
document.addEventListener('keydown',e=>{if(!active)return;if(e.key==='Escape'){e.preventDefault();finish();}if(e.key==='Tab'){const controls=[...root.querySelectorAll('button:not(:disabled)')];const i=controls.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();controls[controls.length-1].focus();}else if(!e.shiftKey&&i===controls.length-1){e.preventDefault();controls[0].focus();}}});
let done=false;try{done=localStorage.getItem(KEY)==='done';}catch(e){}if(!done)window.addEventListener('load',()=>setTimeout(start,450),{once:true});
})();
