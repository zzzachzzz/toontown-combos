(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const l of s)if(l.type==="childList")for(const o of l.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const l={};return s.integrity&&(l.integrity=s.integrity),s.referrerPolicy&&(l.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?l.credentials="include":s.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(s){if(s.ep)return;s.ep=!0;const l=n(s);fetch(s.href,l)}})();const He=(e,t)=>e===t,T=Symbol("solid-proxy"),ce=Symbol("solid-track"),Z={equals:He};let Me=Le;const B=1,z=2,Se={owned:null,cleanups:null,context:null,owner:null};var d=null;let ue=null,Ke=null,v=null,S=null,I=null,ie=0;function X(e,t){const n=v,r=d,s=e.length===0,l=t===void 0?r:t,o=s?Se:{owned:null,cleanups:null,context:l?l.context:null,owner:l},i=s?e:()=>e(()=>G(()=>ae(o)));d=o,v=null;try{return U(i,!0)}finally{v=n,d=r}}function me(e,t){t=t?Object.assign({},Z,t):Z;const n={value:e,observers:null,observerSlots:null,comparator:t.equals||void 0},r=s=>(typeof s=="function"&&(s=s(n.value)),Oe(n,s));return[ke.bind(n),r]}function P(e,t,n){const r=_e(e,t,!1,B);oe(r)}function _(e,t,n){n=n?Object.assign({},Z,n):Z;const r=_e(e,t,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,oe(r),ke.bind(r)}function Ce(e){return U(e,!1)}function G(e){if(v===null)return e();const t=v;v=null;try{return e()}finally{v=t}}function Re(e){return d===null||(d.cleanups===null?d.cleanups=[e]:d.cleanups.push(e)),e}function ge(){return v}function Ve(e,t){const n=Symbol("context");return{id:n,Provider:Ze(n),defaultValue:e}}function We(e){return d&&d.context&&d.context[e.id]!==void 0?d.context[e.id]:e.defaultValue}function Je(e){const t=_(e),n=_(()=>fe(t()));return n.toArray=()=>{const r=n();return Array.isArray(r)?r:r!=null?[r]:[]},n}function ke(){if(this.sources&&this.state)if(this.state===B)oe(this);else{const e=S;S=null,U(()=>ee(this),!1),S=e}if(v){const e=this.observers?this.observers.length:0;v.sources?(v.sources.push(this),v.sourceSlots.push(e)):(v.sources=[this],v.sourceSlots=[e]),this.observers?(this.observers.push(v),this.observerSlots.push(v.sources.length-1)):(this.observers=[v],this.observerSlots=[v.sources.length-1])}return this.value}function Oe(e,t,n){let r=e.value;return(!e.comparator||!e.comparator(r,t))&&(e.value=t,e.observers&&e.observers.length&&U(()=>{for(let s=0;s<e.observers.length;s+=1){const l=e.observers[s],o=ue&&ue.running;o&&ue.disposed.has(l),(o?!l.tState:!l.state)&&(l.pure?S.push(l):I.push(l),l.observers&&Pe(l)),o||(l.state=B)}if(S.length>1e6)throw S=[],new Error},!1)),t}function oe(e){if(!e.fn)return;ae(e);const t=ie;Qe(e,e.value,t)}function Qe(e,t,n){let r;const s=d,l=v;v=d=e;try{r=e.fn(t)}catch(o){return e.pure&&(e.state=B,e.owned&&e.owned.forEach(ae),e.owned=null),e.updatedAt=n+1,xe(o)}finally{v=l,d=s}(!e.updatedAt||e.updatedAt<=n)&&(e.updatedAt!=null&&"observers"in e?Oe(e,r):e.value=r,e.updatedAt=n)}function _e(e,t,n,r=B,s){const l={fn:e,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:d,context:d?d.context:null,pure:n};return d===null||d!==Se&&(d.owned?d.owned.push(l):d.owned=[l]),l}function Ae(e){if(e.state===0)return;if(e.state===z)return ee(e);if(e.suspense&&G(e.suspense.inFallback))return e.suspense.effects.push(e);const t=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<ie);)e.state&&t.push(e);for(let n=t.length-1;n>=0;n--)if(e=t[n],e.state===B)oe(e);else if(e.state===z){const r=S;S=null,U(()=>ee(e,t[0]),!1),S=r}}function U(e,t){if(S)return e();let n=!1;t||(S=[]),I?n=!0:I=[],ie++;try{const r=e();return Xe(n),r}catch(r){n||(I=null),S=null,xe(r)}}function Xe(e){if(S&&(Le(S),S=null),e)return;const t=I;I=null,t.length&&U(()=>Me(t),!1)}function Le(e){for(let t=0;t<e.length;t++)Ae(e[t])}function ee(e,t){e.state=0;for(let n=0;n<e.sources.length;n+=1){const r=e.sources[n];if(r.sources){const s=r.state;s===B?r!==t&&(!r.updatedAt||r.updatedAt<ie)&&Ae(r):s===z&&ee(r,t)}}}function Pe(e){for(let t=0;t<e.observers.length;t+=1){const n=e.observers[t];n.state||(n.state=z,n.pure?S.push(n):I.push(n),n.observers&&Pe(n))}}function ae(e){let t;if(e.sources)for(;e.sources.length;){const n=e.sources.pop(),r=e.sourceSlots.pop(),s=n.observers;if(s&&s.length){const l=s.pop(),o=n.observerSlots.pop();r<s.length&&(l.sourceSlots[o]=r,s[r]=l,n.observerSlots[r]=o)}}if(e.owned){for(t=e.owned.length-1;t>=0;t--)ae(e.owned[t]);e.owned=null}if(e.cleanups){for(t=e.cleanups.length-1;t>=0;t--)e.cleanups[t]();e.cleanups=null}e.state=0}function Ye(e){return e instanceof Error?e:new Error(typeof e=="string"?e:"Unknown error",{cause:e})}function xe(e,t=d){throw Ye(e)}function fe(e){if(typeof e=="function"&&!e.length)return fe(e());if(Array.isArray(e)){const t=[];for(let n=0;n<e.length;n++){const r=fe(e[n]);Array.isArray(r)?t.push.apply(t,r):t.push(r)}return t}return e}function Ze(e,t){return function(r){let s;return P(()=>s=G(()=>(d.context={...d.context,[e]:r.value},Je(()=>r.children))),void 0),s}}const ze=Symbol("fallback");function pe(e){for(let t=0;t<e.length;t++)e[t]()}function et(e,t,n={}){let r=[],s=[],l=[],o=0,i=t.length>1?[]:null;return Re(()=>pe(l)),()=>{let a=e()||[],c,u;return a[ce],G(()=>{let g=a.length,$,k,A,N,F,C,O,p,b;if(g===0)o!==0&&(pe(l),l=[],r=[],s=[],o=0,i&&(i=[])),n.fallback&&(r=[ze],s[0]=X(E=>(l[0]=E,n.fallback())),o=1);else if(o===0){for(s=new Array(g),u=0;u<g;u++)r[u]=a[u],s[u]=X(f);o=g}else{for(A=new Array(g),N=new Array(g),i&&(F=new Array(g)),C=0,O=Math.min(o,g);C<O&&r[C]===a[C];C++);for(O=o-1,p=g-1;O>=C&&p>=C&&r[O]===a[p];O--,p--)A[p]=s[O],N[p]=l[O],i&&(F[p]=i[O]);for($=new Map,k=new Array(p+1),u=p;u>=C;u--)b=a[u],c=$.get(b),k[u]=c===void 0?-1:c,$.set(b,u);for(c=C;c<=O;c++)b=r[c],u=$.get(b),u!==void 0&&u!==-1?(A[u]=s[c],N[u]=l[c],i&&(F[u]=i[c]),u=k[u],$.set(b,u)):l[c]();for(u=C;u<g;u++)u in A?(s[u]=A[u],l[u]=N[u],i&&(i[u]=F[u],i[u](u))):s[u]=X(f);s=s.slice(0,o=g),r=a.slice(0)}return s});function f(g){if(l[u]=g,i){const[$,k]=me(u);return i[u]=k,t(a[u],$)}return t(a[u])}}}function y(e,t){return G(()=>e(t||{}))}const tt=e=>`Stale read from <${e}>.`;function j(e){const t="fallback"in e&&{fallback:()=>e.fallback};return _(et(()=>e.each,e.children,t||void 0))}function Ee(e){const t=e.keyed,n=_(()=>e.when,void 0,{equals:(r,s)=>t?r===s:!r==!s});return _(()=>{const r=n();if(r){const s=e.children;return typeof s=="function"&&s.length>0?G(()=>s(t?r:()=>{if(!G(n))throw tt("Show");return e.when})):s}return e.fallback},void 0,void 0)}function nt(e,t,n){let r=n.length,s=t.length,l=r,o=0,i=0,a=t[s-1].nextSibling,c=null;for(;o<s||i<l;){if(t[o]===n[i]){o++,i++;continue}for(;t[s-1]===n[l-1];)s--,l--;if(s===o){const u=l<r?i?n[i-1].nextSibling:n[l-i]:a;for(;i<l;)e.insertBefore(n[i++],u)}else if(l===i)for(;o<s;)(!c||!c.has(t[o]))&&t[o].remove(),o++;else if(t[o]===n[l-1]&&n[i]===t[s-1]){const u=t[--s].nextSibling;e.insertBefore(n[i++],t[o++].nextSibling),e.insertBefore(n[--l],u),t[s]=n[l]}else{if(!c){c=new Map;let f=i;for(;f<l;)c.set(n[f],f++)}const u=c.get(t[o]);if(u!=null)if(i<u&&u<l){let f=o,g=1,$;for(;++f<s&&f<l&&!(($=c.get(t[f]))==null||$!==u+g);)g++;if(g>u-i){const k=t[o];for(;i<u;)e.insertBefore(n[i++],k)}else e.replaceChild(n[i++],t[o++])}else o++;else t[o++].remove()}}}const ve="_$DX_DELEGATE";function rt(e,t,n,r={}){let s;return X(l=>{s=l,t===document?e():m(t,e(),t.firstChild?null:void 0,n)},r.owner),()=>{s(),t.textContent=""}}function w(e,t,n){let r;const s=()=>{const o=document.createElement("template");return o.innerHTML=e,n?o.content.firstChild.firstChild:o.content.firstChild},l=t?()=>G(()=>document.importNode(r||(r=s()),!0)):()=>(r||(r=s())).cloneNode(!0);return l.cloneNode=l,l}function Ge(e,t=window.document){const n=t[ve]||(t[ve]=new Set);for(let r=0,s=e.length;r<s;r++){const l=e[r];n.has(l)||(n.add(l),t.addEventListener(l,st))}}function J(e,t,n){n==null?e.removeAttribute(t):e.setAttribute(t,n)}function m(e,t,n,r){if(n!==void 0&&!r&&(r=[]),typeof t!="function")return te(e,t,r,n);P(s=>te(e,t(),s,n),r)}function st(e){const t=`$$${e.type}`;let n=e.composedPath&&e.composedPath()[0]||e.target;for(e.target!==n&&Object.defineProperty(e,"target",{configurable:!0,value:n}),Object.defineProperty(e,"currentTarget",{configurable:!0,get(){return n||document}});n;){const r=n[t];if(r&&!n.disabled){const s=n[`${t}Data`];if(s!==void 0?r.call(n,s,e):r.call(n,e),e.cancelBubble)return}n=n._$host||n.parentNode||n.host}}function te(e,t,n,r,s){for(;typeof n=="function";)n=n();if(t===n)return n;const l=typeof t,o=r!==void 0;if(e=o&&n[0]&&n[0].parentNode||e,l==="string"||l==="number")if(l==="number"&&(t=t.toString()),o){let i=n[0];i&&i.nodeType===3?i.data!==t&&(i.data=t):i=document.createTextNode(t),n=q(e,n,r,i)}else n!==""&&typeof n=="string"?n=e.firstChild.data=t:n=e.textContent=t;else if(t==null||l==="boolean")n=q(e,n,r);else{if(l==="function")return P(()=>{let i=t();for(;typeof i=="function";)i=i();n=te(e,i,n,r)}),()=>n;if(Array.isArray(t)){const i=[],a=n&&Array.isArray(n);if(de(i,t,n,s))return P(()=>n=te(e,i,n,r,!0)),()=>n;if(i.length===0){if(n=q(e,n,r),o)return n}else a?n.length===0?ye(e,i,r):nt(e,n,i):(n&&q(e),ye(e,i));n=i}else if(t.nodeType){if(Array.isArray(n)){if(o)return n=q(e,n,r,t);q(e,n,null,t)}else n==null||n===""||!e.firstChild?e.appendChild(t):e.replaceChild(t,e.firstChild);n=t}}return n}function de(e,t,n,r){let s=!1;for(let l=0,o=t.length;l<o;l++){let i=t[l],a=n&&n[e.length],c;if(!(i==null||i===!0||i===!1))if((c=typeof i)=="object"&&i.nodeType)e.push(i);else if(Array.isArray(i))s=de(e,i,a)||s;else if(c==="function")if(r){for(;typeof i=="function";)i=i();s=de(e,Array.isArray(i)?i:[i],Array.isArray(a)?a:[a])||s}else e.push(i),s=!0;else{const u=String(i);a&&a.nodeType===3&&a.data===u?e.push(a):e.push(document.createTextNode(u))}}return s}function ye(e,t,n=null){for(let r=0,s=t.length;r<s;r++)e.insertBefore(t[r],n)}function q(e,t,n,r){if(n===void 0)return e.textContent="";const s=r||document.createTextNode("");if(t.length){let l=!1;for(let o=t.length-1;o>=0;o--){const i=t[o];if(s!==i){const a=i.parentNode===e;!l&&!o?a?e.replaceChild(s,i):e.insertBefore(s,n):a&&i.remove()}else l=!0}}else e.insertBefore(s,n);return[s]}var lt=()=>["%csolid-devtools","color: #fff; background: #2c4f7c; padding: 1px 4px;"];function it(...e){console.warn(...lt(),...e)}const he=Symbol("store-raw"),D=Symbol("store-node"),x=Symbol("store-has"),Ie=Symbol("store-self");function Te(e){let t=e[T];if(!t&&(Object.defineProperty(e,T,{value:t=new Proxy(e,ut)}),!Array.isArray(e))){const n=Object.keys(e),r=Object.getOwnPropertyDescriptors(e);for(let s=0,l=n.length;s<l;s++){const o=n[s];r[o].get&&Object.defineProperty(e,o,{enumerable:r[o].enumerable,get:r[o].get.bind(t)})}}return t}function ne(e){let t;return e!=null&&typeof e=="object"&&(e[T]||!(t=Object.getPrototypeOf(e))||t===Object.prototype||Array.isArray(e))}function V(e,t=new Set){let n,r,s,l;if(n=e!=null&&e[he])return n;if(!ne(e)||t.has(e))return e;if(Array.isArray(e)){Object.isFrozen(e)?e=e.slice(0):t.add(e);for(let o=0,i=e.length;o<i;o++)s=e[o],(r=V(s,t))!==s&&(e[o]=r)}else{Object.isFrozen(e)?e=Object.assign({},e):t.add(e);const o=Object.keys(e),i=Object.getOwnPropertyDescriptors(e);for(let a=0,c=o.length;a<c;a++)l=o[a],!i[l].get&&(s=e[l],(r=V(s,t))!==s&&(e[l]=r))}return e}function re(e,t){let n=e[t];return n||Object.defineProperty(e,t,{value:n=Object.create(null)}),n}function W(e,t,n){if(e[t])return e[t];const[r,s]=me(n,{equals:!1,internal:!0});return r.$=s,e[t]=r}function ot(e,t){const n=Reflect.getOwnPropertyDescriptor(e,t);return!n||n.get||!n.configurable||t===T||t===D||(delete n.value,delete n.writable,n.get=()=>e[T][t]),n}function je(e){ge()&&W(re(e,D),Ie)()}function at(e){return je(e),Reflect.ownKeys(e)}const ut={get(e,t,n){if(t===he)return e;if(t===T)return n;if(t===ce)return je(e),n;const r=re(e,D),s=r[t];let l=s?s():e[t];if(t===D||t===x||t==="__proto__")return l;if(!s){const o=Object.getOwnPropertyDescriptor(e,t);ge()&&(typeof l!="function"||e.hasOwnProperty(t))&&!(o&&o.get)&&(l=W(r,t,l)())}return ne(l)?Te(l):l},has(e,t){return t===he||t===T||t===ce||t===D||t===x||t==="__proto__"?!0:(ge()&&W(re(e,x),t)(),t in e)},set(){return!0},deleteProperty(){return!0},ownKeys:at,getOwnPropertyDescriptor:ot};function se(e,t,n,r=!1){if(!r&&e[t]===n)return;const s=e[t],l=e.length;n===void 0?(delete e[t],e[x]&&e[x][t]&&s!==void 0&&e[x][t].$()):(e[t]=n,e[x]&&e[x][t]&&s===void 0&&e[x][t].$());let o=re(e,D),i;if((i=W(o,t,s))&&i.$(()=>n),Array.isArray(e)&&e.length!==l){for(let a=e.length;a<l;a++)(i=o[a])&&i.$();(i=W(o,"length",l))&&i.$(e.length)}(i=o[Ie])&&i.$()}function Be(e,t){const n=Object.keys(t);for(let r=0;r<n.length;r+=1){const s=n[r];se(e,s,t[s])}}function ct(e,t){if(typeof t=="function"&&(t=t(e)),t=V(t),Array.isArray(t)){if(e===t)return;let n=0,r=t.length;for(;n<r;n++){const s=t[n];e[n]!==s&&se(e,n,s)}se(e,"length",r)}else Be(e,t)}function K(e,t,n=[]){let r,s=e;if(t.length>1){r=t.shift();const o=typeof r,i=Array.isArray(e);if(Array.isArray(r)){for(let a=0;a<r.length;a++)K(e,[r[a]].concat(t),n);return}else if(i&&o==="function"){for(let a=0;a<e.length;a++)r(e[a],a)&&K(e,[a].concat(t),n);return}else if(i&&o==="object"){const{from:a=0,to:c=e.length-1,by:u=1}=r;for(let f=a;f<=c;f+=u)K(e,[f].concat(t),n);return}else if(t.length>1){K(e[r],t,[r].concat(n));return}s=e[r],n=[r].concat(n)}let l=t[0];typeof l=="function"&&(l=l(s,n),l===s)||r===void 0&&l==null||(l=V(l),r===void 0||ne(s)&&ne(l)&&!Array.isArray(l)?Be(s,l):se(e,r,l))}function gt(...[e,t]){const n=V(e||{}),r=Array.isArray(n),s=Te(n);function l(...o){Ce(()=>{r&&o.length===1?ct(n,o[0]):K(n,o)})}return[s,l]}it('`import "solid-devtools";` is an entry point for the vite plugin.\nIf you\'re seeing this message you probably forgot to add the plugin to your vite config.');const ft=({initialState:e}={})=>{const[t,n]=gt({isLured:!1,showOrgView:!0,selectedOrgGags:Array.from({length:4},()=>null),hideLvl13UpCogs:!1,...e});return new class{getIsLured=()=>t.isLured;toggleIsLured=()=>n("isLured",r=>!r);setIsLured=r=>n("isLured",r);getShowOrgView=()=>t.showOrgView;toggleShowOrgView=()=>n("showOrgView",r=>!r);getSelectedOrgGags=()=>t.selectedOrgGags;setOrToggleSelectedOrgGag=(r,s)=>{n("selectedOrgGags",r,l=>s===l?null:s)};resetSelectedOrgGags=()=>{n("selectedOrgGags",Array.from({length:4},()=>null))};getSelectedOrgGagTrackCounts=_(()=>this.getSelectedOrgGags().reduce((r,s)=>(s!==null&&r[s]++,r),{toonup:0,trap:0,lure:0,sound:0,throw:0,squirt:0,drop:0}));getHideLvl13UpCogs=()=>t.hideLvl13UpCogs;toggleHideLvl13UpCogs=()=>n("hideLvl13UpCogs",r=>!r);getMaxCogLvl=()=>t.hideLvl13UpCogs?12:20;getStateForStorage=()=>({isLured:t.isLured,selectedOrgGags:t.selectedOrgGags,hideLvl13UpCogs:t.hideLvl13UpCogs})}},$e="savedState",dt=()=>{const e=localStorage.getItem($e);if(!e)return null;try{return JSON.parse(e)}catch(t){return console.error(`Error parsing localStorage item '${$e}'`,t),null}},Y=e=>{localStorage.setItem("savedState",JSON.stringify(e))},Ne=Ve(),ht=e=>{const t=dt()??void 0,n=ft({initialState:t});return y(Ne.Provider,{value:n,get children(){return e.children}})},H=()=>We(Ne);var h=(e=>(e.toonup="toonup",e.trap="trap",e.lure="lure",e.sound="sound",e.throw="throw",e.squirt="squirt",e.drop="drop",e))(h||{});const mt=Object.values(h),L="/toontown-combos/",le={toonup:{name:"Toon Up",img:`${L}gag_icons/Feather.png`},trap:{name:"Trap",img:`${L}gag_icons/Banana_Peel.png`},lure:{name:"Lure",img:`${L}gag_icons/$1_Bill.png`},sound:{name:"Sound",img:`${L}gag_icons/Bike_Horn.png`},throw:{name:"Throw",img:`${L}gag_icons/Cupcake.png`},squirt:{name:"Squirt",img:`${L}gag_icons/Squirting_Flower.png`},drop:{name:"Drop",img:`${L}gag_icons/Flower_Pot.png`}};var pt=w("<div class=combo><span class=combo-dmg></span><div class=gags>"),vt=w("<div class=gag-icon-container><img class=gag-icon>"),yt=w("<span class=org>Org");const $t=e=>y(Ee,{get when(){return e.combo.damageKillsCog()},get children(){var t=pt(),n=t.firstChild,r=n.nextSibling;return m(n,()=>e.combo.damage()),m(r,y(j,{get each(){return e.combo.gags},children:s=>(()=>{var l=vt(),o=l.firstChild;return m(l,(()=>{var i=_(()=>!!s.isOrg);return()=>i()&&yt()})(),null),P(i=>{var a=s.isOrg?`var(--${s.track})`:"unset",c=`${L}gag_icons/${s.name.replace(/\s/g,"_")}.png`;return a!==i.e&&((i.e=a)!=null?l.style.setProperty("background",a):l.style.removeProperty("background")),c!==i.t&&J(o,"src",i.t=c),i},{e:void 0,t:void 0}),l})()})),t}});function*wt(e,t){let n=[];for(const r of t)n.push(r),n.length===e&&(yield n,n=[]);n.length>0&&(yield n)}function*bt({maxCogLvl:e,organicGags:t,isLured:n}){const r={isLured:n,organicGags:t},s=["sound","throw","squirt","drop"],l=["sound","throw","squirt"];for(let o=e;o>=1;o--)for(const i of s)if(i==="drop")for(const a of l)for(let c=4;c>=1;c--){const u=Math.max(c-1,1);yield{...r,cogLvl:o,gags:{drop:u,[a]:u===c?0:1}}}else for(let a=4;a>=1;a--)yield{...r,cogLvl:o,gags:{[i]:a}}}const Fe={1:6,2:12,3:20,4:30,5:42,6:56,7:72,8:90,9:110,10:132,11:156,12:196,13:224,14:254,15:286,16:320,17:356,18:394,19:434,20:476},we={[h.toonup]:0,[h.trap]:1,[h.lure]:2,[h.sound]:3,[h.throw]:4,[h.squirt]:5,[h.drop]:6},be={[h.toonup]:{1:{name:"Feather",damage:0},2:{name:"Megaphone",damage:0},3:{name:"Lipstick",damage:0},4:{name:"Bamboo Cane",damage:0},5:{name:"Pixie Dust",damage:0},6:{name:"Juggling Cubes",damage:0},7:{name:"High Dive",damage:0}},[h.lure]:{1:{name:"$1 Bill",damage:0},2:{name:"Small Magnet",damage:0},3:{name:"$5 Bill",damage:0},4:{name:"Big Magnet",damage:0},5:{name:"$10 Bill",damage:0},6:{name:"Hypno-goggles",damage:0},7:{name:"Presentation",damage:0}},[h.trap]:{1:{name:"Banana Peel",damage:12},2:{name:"Rake",damage:20},3:{name:"Marbles",damage:35},4:{name:"Quicksand",damage:50},5:{name:"Trapdoor",damage:85},6:{name:"TNT",damage:180},7:{name:"Railroad",damage:200}},[h.sound]:{1:{name:"Bike Horn",damage:4},2:{name:"Whistle",damage:7},3:{name:"Bugle",damage:11},4:{name:"Aoogah",damage:16},5:{name:"Elephant Trunk",damage:21},6:{name:"Foghorn",damage:50},7:{name:"Opera Singer",damage:90}},[h.throw]:{1:{name:"Cupcake",damage:6},2:{name:"Fruit Pie Slice",damage:10},3:{name:"Cream Pie Slice",damage:17},4:{name:"Whole Fruit Pie",damage:27},5:{name:"Whole Cream Pie",damage:40},6:{name:"Birthday Cake",damage:100},7:{name:"Wedding Cake",damage:120}},[h.squirt]:{1:{name:"Squirting Flower",damage:4},2:{name:"Glass of Water",damage:8},3:{name:"Squirt Gun",damage:12},4:{name:"Seltzer Bottle",damage:21},5:{name:"Fire Hose",damage:30},6:{name:"Storm Cloud",damage:80},7:{name:"Geyser",damage:105}},[h.drop]:{1:{name:"Flower Pot",damage:10},2:{name:"Sandbag",damage:18},3:{name:"Anvil",damage:30},4:{name:"Big Weight",damage:45},5:{name:"Safe",damage:70},6:{name:"Grand Piano",damage:170},7:{name:"Toontanic",damage:180}}};class St{lvl;isLured;constructor({lvl:t,isLured:n}){this.lvl=t,this.isLured=n}get hp(){return Fe[this.lvl]}toString(){return`Cog(level: ${this.lvl}, HP: ${this.hp})`}}class Q{track;lvl;isOrg;constructor({track:t,lvl:n,isOrg:r=!1}){this.track=t,this.lvl=n,this.isOrg=r}static fromGag(t){return new Q({track:t.track,lvl:t.lvl,isOrg:t.isOrg})}get name(){return this.lvl===0?"None":be[this.track][this.lvl].name}get damage(){if(this.lvl===0)return 0;const t=be[this.track][this.lvl].damage;return this.isOrg?t<10?t+1:Math.floor(t*1.1):t}multipliers(t){return this.lvl===0?{multi:!1,knockback:!1}:this.track===h.toonup||this.track===h.trap||this.track===h.lure?{multi:!1,knockback:!1}:{multi:t.trackCounts()[this.track]>=2,knockback:this.knockback(t)}}multiplier(t){const n=this.multipliers(t);return 1+(n.multi?.2:0)+(n.knockback?.5:0)}knockback(t){if(!t.cog.isLured)return!1;const n=t.trackCounts();return n.trap>0||n.sound>0?!1:this.track==="throw"||this.track==="squirt"&&n.throw===0}toString(){return`Gag(name: ${this.name}, level: ${this.lvl}, damage: ${this.damage}, isOrg: ${this.isOrg})`}}class R{gags;cog;gagsInput;organicGagsInput;constructor({gags:t,cog:n,gagsInput:r,organicGagsInput:s}){this.gags=t,this.cog=n,this.gagsInput=R.cleanGagCounts(r??{}),this.organicGagsInput=R.cleanGagCounts(s??{})}static fromCombo(t){return new R({gags:t.gags.map(n=>Q.fromGag(n)),cog:t.cog,gagsInput:t.gagsInput,organicGagsInput:t.organicGagsInput})}static cleanGagCounts(t){return Object.values(h).reduce((n,r)=>(t.hasOwnProperty(r)&&t[r]>0&&(n[r]=t[r]),n),{})}trackCounts(){return this.gags.reduce((t,n)=>(n.lvl!==0&&(t[n.track]+=1),t),Object.fromEntries(Object.values(h).map(t=>[t,0])))}damage(){const t=this.gags.reduce((n,r)=>n+r.damage*r.multiplier(this),0);return Math.ceil(t)}damageKillsCog(){return this.damage()>=this.cog.hp}inputKey(){const t={lvl:this.cog.lvl,isLured:this.cog.isLured},n=this.gagsInput,r=this.organicGagsInput;return{cog:t,gags:n,organicGags:r}}outputKey(){const t=[...this.gags].sort(qe).map(r=>{const s=r.damage,{lvl:l,track:o}=r,{multi:i,knockback:a}=r.multipliers(this);return{track:o,lvl:l,dmg:s,multi:i,knockback:a}});return{dmg:this.damage(),gags:t}}toString(){return`Combo(damage: ${this.damage()} gags: [
${this.gags.map(t=>`  ${t}`).join(`,
`)}
])`}}function Ct({cogLvl:e,isLured:t,gags:n,organicGags:r}){let s=0;for(const[a,c]of Object.entries(n)){if(!h.hasOwnProperty(a))throw new Error(`Unrecognized gag track key '${a}' in \`gags\` argument. Must be one of: ${Object.values(h).map(u=>"'"+u+"'").join(", ")}`);if(typeof c!="number"||isNaN(c))throw new Error(`Values in \`gags\` argument must be a number. For key '${a}' got value '${c}'.`);if(a==="trap"&&c>1)throw new Error("Cannot specify multiple trap gags, must be 0 or 1.");s+=c}if(s<1||s>4)throw new Error(`Sum of values in \`gags\` argument must be 1 <= n <= 4. Received ${s}.`);const l=Object.entries(n).reduce((a,[c,u])=>{for(let f=0;f<u;f++){const g=f<=(r[c]??0)-1;a.push(new Q({track:c,lvl:1,isOrg:g}))}return a},[]);l.sort((a,c)=>c.damage-a.damage);const o=new St({lvl:e,isLured:t});let i=new R({gags:l,cog:o,gagsInput:n,organicGagsInput:r});return i=kt(i),i.gags.sort(qe),i}function kt(e){for(;!e.damageKillsCog();){for(const r of e.gags)r.lvl!==7&&(r.lvl+=1);if(e.gags.every(r=>r.lvl===7))break}if(!e.damageKillsCog())return e.gags=e.gags.map(r=>new Q({track:r.track,lvl:0,isOrg:r.isOrg})),e;const t=e.trackCounts().drop>0;let n=0;for(;n!==e.gags.length-1;)for(n=e.gags.length-1;n>=0&&e.gags[n].lvl!==0;n--)if(e.gags[n].lvl-=1,!e.damageKillsCog()){e.gags[n].lvl+=1;break}for(let r=0;r<e.gags.length;r++)e.gags[r].isOrg=!1,e.damageKillsCog()||(e.gags[r].isOrg=!0);if(t)for(let r=0;r<e.gags.length;r++)e.gags[r].track!=="drop"&&e.gags[r].lvl===0&&(e.gags[r].lvl=1);return e}function qe(e,t){const n=we[e.track]-we[t.track];return n!==0?n:t.damage-e.damage}var Ot=w("<div class=combo-cell>");const _t=()=>{const e=H(),t=_(()=>{const n=e.getMaxCogLvl(),r=e.getSelectedOrgGagTrackCounts(),s=e.getIsLured();return Array.from(bt({maxCogLvl:n,organicGags:r,isLured:s}),l=>Ct(l))});return y(j,{get each(){return Array.from(wt(4,t()))},children:n=>(()=>{var r=Ot();return m(r,y(j,{each:n,children:s=>y($t,{combo:s})})),r})()})};var At=w("<div class=cog-lvl-cell><div class=cog-icon-container><img></div><div><span class=cog-lvl></span><span class=cog-hp></span><span class=hp>HP"),Lt=w("<span>Lured");const Pt=e=>{const t=H(),n=()=>Fe[e.cogLvl],r=()=>e.cogLvl>12?"13+":e.cogLvl.toString();return(()=>{var s=At(),l=s.firstChild,o=l.firstChild,i=l.nextSibling,a=i.firstChild,c=a.nextSibling;return m(l,(()=>{var u=_(()=>!!t.getIsLured());return()=>u()&&Lt()})(),null),m(a,()=>e.cogLvl),m(c,n),P(u=>{var f=`${L}cog_icons/${r()}.png`,g=t.getIsLured()?"var(--lure)":"unset";return f!==u.e&&J(o,"src",u.e=f),g!==u.t&&((u.t=g)!=null?o.style.setProperty("background",g):o.style.removeProperty("background")),u},{e:void 0,t:void 0}),s})()},xt=()=>{const e=H(),t=_(()=>{const n=e.getMaxCogLvl(),r=[];for(let s=n;s>=1;s--)r.push(s);return r});return y(j,{get each(){return t()},children:n=>y(Pt,{cogLvl:n})})};var Et=w("<ul class=org-gag-track-list role=listbox>"),Gt=w("<li role=option><button><div class=img-container><img></div><span>");const It=e=>{const t=H(),n=()=>t.getSelectedOrgGags()[e.toonIdx],r=(s,l)=>{t.setOrToggleSelectedOrgGag(s,l),Y(t.getStateForStorage())};return(()=>{var s=Et();return m(s,y(j,{each:mt,children:l=>{const o=()=>n()===l?`var(--${l})`:"transparent";return(()=>{var i=Gt(),a=i.firstChild,c=a.firstChild,u=c.firstChild,f=c.nextSibling;return a.$$click=()=>r(e.toonIdx,l),m(f,()=>le[l].name),P(g=>{var $=o(),k=le[l].img;return $!==g.e&&((g.e=$)!=null?i.style.setProperty("background",$):i.style.removeProperty("background")),k!==g.t&&J(u,"src",g.t=k),g},{e:void 0,t:void 0}),i})()}})),s})()};Ge(["click"]);var Tt=w("<ul class=org-selection-list>"),jt=w("<li><div class=toon-num>Toon ");const Bt=()=>(()=>{var e=Tt();return m(e,y(j,{get each(){return Array.from({length:4})},children:(t,n)=>(()=>{var r=jt(),s=r.firstChild;return s.firstChild,m(s,()=>n()+1,null),m(r,y(It,{get toonIdx(){return n()}}),null),r})()})),e})();var Nt=w("<ul class=org-selection-preview-list>"),Ft=w("<li role=option class=org-selection-preview-list-item>"),qt=w("<div class=img-container><img>"),Dt=w("<span>");const Ut=()=>{const e=H();return y(Ee,{get when(){return e.getSelectedOrgGags().some(t=>t!==null)},get children(){var t=Nt();return m(t,y(j,{get each(){return Array.from({length:4})},children:(n,r)=>{const s=e.getSelectedOrgGags()[r()],l=s!==null?`var(--${s})`:"transparent";return(()=>{var o=Ft();return l!=null?o.style.setProperty("background",l):o.style.removeProperty("background"),m(o,s!==null&&[(()=>{var i=qt(),a=i.firstChild;return P(()=>J(a,"src",le[s].img)),i})(),(()=>{var i=Dt();return m(i,()=>le[s].name),i})()]),o})()}})),t}})};var Ht=w("<div id=app><div id=lvl-13-toggle-container><label><input type=checkbox id=hide-lvl-13-up-cogs>Hide Level 13+ Cogs</label></div><div style=flex-grow:1;overflow:hidden;><div id=combos><div id=cog-lvl-column></div><div id=combos-grid></div></div></div><div id=is-cog-lured><button><img><span>Is Cog Lured?</span></button></div><div style=display:flex;justify-content:center;><button id=expand-org> organic gags selection"),Mt=w("<div id=org-selection-container><div id=org-selection-header><h4>Select Your Party's Organic Gags</h4><button id=clear-selection>Clear Selection</button></div><div id=org-selection>"),Kt=w("<div id=org-selection-preview>");const Rt=()=>y(ht,{get children(){return y(Vt,{})}}),Vt=()=>{const[e,t]=me(!0),n=H(),r=o=>{n.toggleHideLvl13UpCogs(),Y(n.getStateForStorage())},s=o=>{n.toggleIsLured(),Y(n.getStateForStorage())},l=o=>{Ce(()=>{n.resetSelectedOrgGags(),n.setIsLured(!1)}),Y(n.getStateForStorage())};return(()=>{var o=Ht(),i=o.firstChild,a=i.firstChild,c=a.firstChild,u=i.nextSibling,f=u.firstChild,g=f.firstChild,$=g.nextSibling,k=u.nextSibling,A=k.firstChild,N=A.firstChild,F=k.nextSibling,C=F.firstChild,O=C.firstChild;return c.$$click=r,m(g,y(xt,{})),m($,y(_t,{})),A.$$click=s,J(N,"src",`${L}gag_icons/$1_Bill.png`),C.$$click=()=>t(p=>!p),m(C,()=>e()?"Hide":"Show",O),m(o,(()=>{var p=_(()=>!!e());return()=>p()?(()=>{var b=Mt(),E=b.firstChild,M=E.firstChild,De=M.nextSibling,Ue=E.nextSibling;return De.$$click=l,m(Ue,y(Bt,{})),b})():(()=>{var b=Kt();return m(b,y(Ut,{})),b})()})(),null),P(p=>{var b=`repeat(${n.getMaxCogLvl()}, 140px)`,E=`repeat(${n.getMaxCogLvl()}, 140px) / repeat(6, 1fr)`,M=n.getIsLured()?"var(--lure)":"unset";return b!==p.e&&((p.e=b)!=null?g.style.setProperty("grid-template-rows",b):g.style.removeProperty("grid-template-rows")),E!==p.t&&((p.t=E)!=null?$.style.setProperty("grid-template",E):$.style.removeProperty("grid-template")),M!==p.a&&((p.a=M)!=null?A.style.setProperty("background",M):A.style.removeProperty("background")),p},{e:void 0,t:void 0,a:void 0}),P(()=>c.checked=n.getHideLvl13UpCogs()),o})()};Ge(["click"]);const Wt=document.getElementById("root");rt(()=>y(Rt,{}),Wt);
