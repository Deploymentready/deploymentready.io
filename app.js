"use strict";
const CATEGORIES=["Uniforms & Clothing","Footwear","Hygiene","Military Gear","Electronics","Documents","Personal Items"];
const BAGS=["Unassigned","Rucksack","Duffel Bag 1","Duffel Bag 2","Tough Box","Carry-on / Personal Bag"];
const BRANCHES=["Army","Marine Corps","Navy","Air Force","Space Force","Coast Guard"];
const COMMON=[["Socks and underwear","Uniforms & Clothing"],["Weather-appropriate footwear","Footwear"],["Toothbrush and toothpaste","Hygiene"],["Soap and deodorant","Hygiene"],["Towel","Hygiene"],["Chargers and cables","Electronics"],["Military ID / CAC","Documents"],["Required travel documents","Documents"],["Personal medications (if applicable)","Personal Items"]];
const TEMPLATES={
 "Army":[["OCP uniforms","Uniforms & Clothing"],["Army PT uniform","Uniforms & Clothing"],["Combat boots","Footwear"],["Issued field equipment (per unit list)","Military Gear"]],
 "Marine Corps":[["Required service/utility uniforms","Uniforms & Clothing"],["PT gear","Uniforms & Clothing"],["Approved boots","Footwear"],["Issued equipment (per unit list)","Military Gear"]],
 "Navy":[["Required Navy uniforms","Uniforms & Clothing"],["PT gear","Uniforms & Clothing"],["Required footwear","Footwear"],["Issued gear (per command list)","Military Gear"]],
 "Air Force":[["Required Air Force uniforms","Uniforms & Clothing"],["PT gear","Uniforms & Clothing"],["Approved boots","Footwear"],["Issued equipment (per unit list)","Military Gear"]],
 "Space Force":[["Required Space Force uniforms","Uniforms & Clothing"],["PT gear","Uniforms & Clothing"],["Approved footwear","Footwear"],["Issued equipment (per unit list)","Military Gear"]],
 "Coast Guard":[["Required Coast Guard uniforms","Uniforms & Clothing"],["PT gear","Uniforms & Clothing"],["Required footwear","Footwear"],["Issued gear (per command list)","Military Gear"]]
};
const OLD_KEY="deployment-ready-v1",KEY="deployment-ready-v2",$=id=>document.getElementById(id);
const newId=()=>"item-"+Date.now()+"-"+Math.random().toString(36).slice(2);
const item=(name,category,bag="Unassigned",packed=false,id=newId())=>({id,name,category,bag,packed});
function starter(branch){return [...COMMON,...TEMPLATES[branch]].map(([n,c])=>item(n,c));}
function validItem(x){return x&&typeof x.id==="string"&&x.id.length<120&&typeof x.name==="string"&&x.name.length>0&&x.name.length<=100&&CATEGORIES.includes(x.category)&&BAGS.includes(x.bag)&&typeof x.packed==="boolean";}
function validState(x){return x&&BRANCHES.includes(x.branch)&&Array.isArray(x.items)&&x.items.length<=5000&&x.items.every(validItem);}
function migrateOld(x){if(!x||!BRANCHES.includes(x.branch)||!Array.isArray(x.items)||x.items.length>5000)return null;let items=x.items.map(v=>item(v.name,v.category,"Unassigned",v.packed,v.id));let next={branch:x.branch,items};return validState(next)?next:null;}
function read(){try{let v=localStorage.getItem(KEY);if(v){let x=JSON.parse(v);if(validState(x))return x;}let old=localStorage.getItem(OLD_KEY);if(old){let x=migrateOld(JSON.parse(old));if(x)return x;}}catch(e){}return {branch:"Army",items:starter("Army")};}
let state=read(),categoryFilter="All",bagFilter="All",editingId=null;
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){alert("Saving failed. Check available browser storage.");}}
function el(tag,cls,text){let e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function options(select,values){values.forEach(v=>{let o=el("option","",v);o.value=v;select.append(o);});}
options($("newCategory"),CATEGORIES);options($("editCategory"),CATEGORIES);options($("newBag"),BAGS);options($("editBag"),BAGS);options($("bagFilter"),["All",...BAGS]);
function render(){
 $("branch").value=state.branch;$("bagFilter").value=bagFilter;
 let total=state.items.length,packed=state.items.filter(x=>x.packed).length,pct=total?Math.round(packed/total*100):0;
 $("percent").textContent=pct+"%";$("total").textContent=total;$("packed").textContent=packed;$("remaining").textContent=total-packed;$("progressBar").style.width=pct+"%";
 let bars=$("bagProgress");bars.replaceChildren();
 BAGS.forEach(b=>{let items=state.items.filter(x=>x.bag===b);if(!items.length)return;let n=items.filter(x=>x.packed).length,p=Math.round(n/items.length*100),line=el("div","bag-line");line.append(el("span","",b));let bar=el("div","mini-bar"),fill=el("div");fill.style.width=p+"%";bar.append(fill);line.append(bar,el("span","",p+"%"));bars.append(line);});
 if(!bars.childElementCount)bars.append(el("span","muted","Assign items to bags to see their progress."));
 let filters=$("filters");filters.replaceChildren();["All",...CATEGORIES].forEach(c=>{let b=el("button",c===categoryFilter?"active":"",c);b.type="button";b.onclick=()=>{categoryFilter=c;render();};filters.append(b);});
 let list=$("itemList");list.replaceChildren();let visible=state.items.filter(x=>(categoryFilter==="All"||x.category===categoryFilter)&&(bagFilter==="All"||x.bag===bagFilter));$("empty").hidden=visible.length>0;
 visible.forEach(x=>{let row=el("div","item"+(x.packed?" done":"")),check=el("input");check.type="checkbox";check.checked=x.packed;check.setAttribute("aria-label","Packed: "+x.name);check.onchange=()=>{x.packed=check.checked;save();render();};let info=el("div","item-info"),name=el("div","name",x.name);info.append(name,el("small","details",x.category+" • "+x.bag));let actions=el("div","item-actions"),edit=el("button","edit","Edit");edit.type="button";edit.setAttribute("aria-label","Edit "+x.name);edit.onclick=()=>openEdit(x.id);let del=el("button","delete","×");del.type="button";del.setAttribute("aria-label","Remove "+x.name);del.onclick=()=>{if(confirm("Remove "+x.name+"?")){state.items=state.items.filter(i=>i.id!==x.id);save();render();}};actions.append(edit,del);row.append(check,info,actions);list.append(row);});
}
function openEdit(id){let x=state.items.find(i=>i.id===id);if(!x)return;editingId=id;$("editName").value=x.name;$("editCategory").value=x.category;$("editBag").value=x.bag;$("editDialog").showModal();}
$("editForm").onsubmit=e=>{e.preventDefault();let x=state.items.find(i=>i.id===editingId),name=$("editName").value.trim();if(!x||!name)return;x.name=name;x.category=$("editCategory").value;x.bag=$("editBag").value;save();$("editDialog").close();render();};
$("cancelEdit").onclick=()=>$("editDialog").close();
$("branch").onchange=e=>{state.branch=e.target.value;save();render();};
$("bagFilter").onchange=e=>{bagFilter=e.target.value;render();};
$("loadTemplate").onclick=()=>{let existing=new Set(state.items.map(x=>x.name.toLocaleLowerCase()));let missing=starter(state.branch).filter(x=>!existing.has(x.name.toLocaleLowerCase()));if(!missing.length){alert("All suggested items for this branch are already on your list.");return;}if(state.items.length+missing.length>5000){alert("List is full.");return;}if(confirm("Add "+missing.length+" suggested items for "+state.branch+"? Existing items will be kept.")){state.items.push(...missing);save();render();}};
$("addForm").onsubmit=e=>{e.preventDefault();let name=$("newName").value.trim();if(!name)return;if(state.items.length>=5000){alert("List is full.");return;}state.items.push(item(name,$("newCategory").value,$("newBag").value));$("newName").value="";save();render();};
$("reset").onclick=()=>{if(confirm("Replace your entire list with the starter list for "+state.branch+"? This deletes custom items and packed statuses. Export a backup first if needed.")){state.items=starter(state.branch);categoryFilter="All";bagFilter="All";save();render();}};
$("clearPacked").onclick=()=>{if(confirm("Mark every item as unpacked?")){state.items.forEach(x=>x.packed=false);save();render();}};
$("export").onclick=()=>{let blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="deployment-ready-v2-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$("import").onchange=async e=>{let f=e.target.files[0];if(!f)return;try{let raw=JSON.parse(await f.text()),x=validState(raw)?raw:migrateOld(raw);if(!x)throw Error("invalid");if(confirm("Replace your current packing list with this backup?")){state=x;categoryFilter="All";bagFilter="All";save();render();}}catch(err){alert("This is not a valid Deployment Ready backup.");}e.target.value="";};
save();render();if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
