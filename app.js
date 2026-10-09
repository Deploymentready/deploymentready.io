"use strict";
const CATEGORIES=["Uniforms & Clothing","Footwear","Hygiene","Military Gear","Electronics","Documents","Personal Items"];
const STARTER=[
["Uniforms","Uniforms & Clothing"],["PT clothing","Uniforms & Clothing"],["Socks and underwear","Uniforms & Clothing"],["Boots","Footwear"],["Shower shoes","Footwear"],["Toothbrush and toothpaste","Hygiene"],["Soap and deodorant","Hygiene"],["Towel","Hygiene"],["Required issued gear","Military Gear"],["Chargers and cables","Electronics"],["Military ID / CAC","Documents"],["Required travel documents","Documents"],["Personal medications (if applicable)","Personal Items"]
];
const KEY="deployment-ready-v1";
const $=id=>document.getElementById(id);
function starter(branch){return STARTER.map(([name,category],i)=>({id:"starter-"+i,name,category,packed:false}));}
function validItem(x){return x&&typeof x.id==="string"&&typeof x.name==="string"&&x.name.length<=100&&CATEGORIES.includes(x.category)&&typeof x.packed==="boolean";}
function read(){try{let x=JSON.parse(localStorage.getItem(KEY));if(x&&typeof x.branch==="string"&&Array.isArray(x.items)&&x.items.length<=5000&&x.items.every(validItem))return x;}catch(e){}return {branch:"Army",items:starter("Army")};}
let state=read(),filter="All";
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){alert("Unable to save on this device. Check browser storage settings.");}}
function element(tag,cls,txt){let e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;}
function render(){
 $("branch").value=state.branch;
 const count=state.items.length,packed=state.items.filter(x=>x.packed).length,pct=count?Math.round(packed/count*100):0;
 $("percent").textContent=pct+"%";$("total").textContent=count;$("packed").textContent=packed;$("remaining").textContent=count-packed;$("progressBar").style.width=pct+"%";
 const filters=$("filters");filters.replaceChildren();
 ["All",...CATEGORIES].forEach(c=>{let b=element("button",c===filter?"active":"",c);b.type="button";b.onclick=()=>{filter=c;render();};filters.append(b);});
 const list=$("itemList");list.replaceChildren();
 const visible=state.items.filter(x=>filter==="All"||x.category===filter);
 $("empty").hidden=visible.length>0;
 visible.forEach(item=>{
  const row=element("div","item"+(item.packed?" done":""));
  const check=element("input");check.type="checkbox";check.checked=item.packed;check.setAttribute("aria-label","Packed: "+item.name);
  check.onchange=()=>{item.packed=check.checked;save();render();};
  const label=element("div","name",item.name);label.append(element("small","category",item.category));
  const del=element("button","delete","×");del.type="button";del.setAttribute("aria-label","Remove "+item.name);
  del.onclick=()=>{if(confirm("Remove "+item.name+"?")){state.items=state.items.filter(x=>x.id!==item.id);save();render();}};
  row.append(check,label,del);list.append(row);
 });
}
CATEGORIES.forEach(c=>{let o=element("option","",c);o.value=c;$("newCategory").append(o);});
$("branch").onchange=e=>{state.branch=e.target.value;save();render();};
$("addForm").onsubmit=e=>{e.preventDefault();let name=$("newName").value.trim();if(!name)return;if(state.items.length>=5000){alert("List is full.");return;}state.items.push({id:"item-"+Date.now()+"-"+Math.random().toString(36).slice(2),name,category:$("newCategory").value,packed:false});$("newName").value="";save();render();};
$("reset").onclick=()=>{if(confirm("Replace your entire list with the starter items? This cannot be undone.")){state.items=starter(state.branch);filter="All";save();render();}};
$("clearPacked").onclick=()=>{if(confirm("Mark all items as unpacked?")){state.items.forEach(x=>x.packed=false);save();render();}};
$("export").onclick=()=>{let blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="deployment-ready-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$("import").onchange=async e=>{const file=e.target.files[0];if(!file)return;try{let x=JSON.parse(await file.text());if(!x||!["Army","Marine Corps","Navy","Air Force","Space Force","Coast Guard"].includes(x.branch)||!Array.isArray(x.items)||x.items.length>5000||!x.items.every(validItem))throw Error("Invalid backup");if(confirm("Replace your current list with this backup?")){state=x;filter="All";save();render();}}catch(err){alert("That file is not a valid Deployment Ready backup.");}e.target.value="";};
render();
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
