const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Home-B9cCTbAf.js","assets/Home-BlnFTLGc.css","assets/Dashboard-DIy3O6gs.js","assets/dateHelpers-Cfb31Rsj.js","assets/AdminPanel-B-k7tTnb.js","assets/audit-flpTb8QI.js","assets/EmailMarketing-BAWWOrSJ.js","assets/BarChart-CVgqqN_c.js","assets/BallotResults-B2dH_zCQ.js","assets/xlsx-D_0l8YDs.js","assets/ElectionArchive-Dc5NdVk6.js","assets/VoteContacts-8wC6ia-i.js","assets/EklogikáKentra-ChxEV_-1.js","assets/Bookkeeping-DRFoeRld.js","assets/ExpenseModal-VLR1NG6K.js","assets/BankChip-Cfdq90-X.js","assets/BankTransactions-Cgn2ER_l.js","assets/ExpenseUpload-CsIfG3dl.js","assets/ClaudeRemote-DoYohmyP.js"])))=>i.map(i=>d[i]);
var MR=Object.defineProperty;var FR=(t,e,n)=>e in t?MR(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var z_=(t,e,n)=>FR(t,typeof e!="symbol"?e+"":e,n);function UR(t,e){for(var n=0;n<e.length;n++){const r=e[n];if(typeof r!="string"&&!Array.isArray(r)){for(const i in r)if(i!=="default"&&!(i in t)){const s=Object.getOwnPropertyDescriptor(r,i);s&&Object.defineProperty(t,i,s.get?s:{enumerable:!0,get:()=>r[i]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();var PM=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function BR(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var iE={exports:{}},Kc={},sE={exports:{}},re={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var dl=Symbol.for("react.element"),jR=Symbol.for("react.portal"),zR=Symbol.for("react.fragment"),$R=Symbol.for("react.strict_mode"),qR=Symbol.for("react.profiler"),GR=Symbol.for("react.provider"),KR=Symbol.for("react.context"),WR=Symbol.for("react.forward_ref"),HR=Symbol.for("react.suspense"),QR=Symbol.for("react.memo"),JR=Symbol.for("react.lazy"),$_=Symbol.iterator;function YR(t){return t===null||typeof t!="object"?null:(t=$_&&t[$_]||t["@@iterator"],typeof t=="function"?t:null)}var oE={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},aE=Object.assign,lE={};function _o(t,e,n){this.props=t,this.context=e,this.refs=lE,this.updater=n||oE}_o.prototype.isReactComponent={};_o.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};_o.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function uE(){}uE.prototype=_o.prototype;function Rp(t,e,n){this.props=t,this.context=e,this.refs=lE,this.updater=n||oE}var Pp=Rp.prototype=new uE;Pp.constructor=Rp;aE(Pp,_o.prototype);Pp.isPureReactComponent=!0;var q_=Array.isArray,cE=Object.prototype.hasOwnProperty,Cp={current:null},hE={key:!0,ref:!0,__self:!0,__source:!0};function dE(t,e,n){var r,i={},s=null,o=null;if(e!=null)for(r in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)cE.call(e,r)&&!hE.hasOwnProperty(r)&&(i[r]=e[r]);var a=arguments.length-2;if(a===1)i.children=n;else if(1<a){for(var u=Array(a),c=0;c<a;c++)u[c]=arguments[c+2];i.children=u}if(t&&t.defaultProps)for(r in a=t.defaultProps,a)i[r]===void 0&&(i[r]=a[r]);return{$$typeof:dl,type:t,key:s,ref:o,props:i,_owner:Cp.current}}function XR(t,e){return{$$typeof:dl,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function kp(t){return typeof t=="object"&&t!==null&&t.$$typeof===dl}function ZR(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var G_=/\/+/g;function ud(t,e){return typeof t=="object"&&t!==null&&t.key!=null?ZR(""+t.key):e.toString(36)}function Cu(t,e,n,r,i){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case dl:case jR:o=!0}}if(o)return o=t,i=i(o),t=r===""?"."+ud(o,0):r,q_(i)?(n="",t!=null&&(n=t.replace(G_,"$&/")+"/"),Cu(i,e,n,"",function(c){return c})):i!=null&&(kp(i)&&(i=XR(i,n+(!i.key||o&&o.key===i.key?"":(""+i.key).replace(G_,"$&/")+"/")+t)),e.push(i)),1;if(o=0,r=r===""?".":r+":",q_(t))for(var a=0;a<t.length;a++){s=t[a];var u=r+ud(s,a);o+=Cu(s,e,n,u,i)}else if(u=YR(t),typeof u=="function")for(t=u.call(t),a=0;!(s=t.next()).done;)s=s.value,u=r+ud(s,a++),o+=Cu(s,e,n,u,i);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function tu(t,e,n){if(t==null)return t;var r=[],i=0;return Cu(t,r,"","",function(s){return e.call(n,s,i++)}),r}function eP(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var Ct={current:null},ku={transition:null},tP={ReactCurrentDispatcher:Ct,ReactCurrentBatchConfig:ku,ReactCurrentOwner:Cp};function fE(){throw Error("act(...) is not supported in production builds of React.")}re.Children={map:tu,forEach:function(t,e,n){tu(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return tu(t,function(){e++}),e},toArray:function(t){return tu(t,function(e){return e})||[]},only:function(t){if(!kp(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};re.Component=_o;re.Fragment=zR;re.Profiler=qR;re.PureComponent=Rp;re.StrictMode=$R;re.Suspense=HR;re.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=tP;re.act=fE;re.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var r=aE({},t.props),i=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=Cp.current),e.key!==void 0&&(i=""+e.key),t.type&&t.type.defaultProps)var a=t.type.defaultProps;for(u in e)cE.call(e,u)&&!hE.hasOwnProperty(u)&&(r[u]=e[u]===void 0&&a!==void 0?a[u]:e[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){a=Array(u);for(var c=0;c<u;c++)a[c]=arguments[c+2];r.children=a}return{$$typeof:dl,type:t.type,key:i,ref:s,props:r,_owner:o}};re.createContext=function(t){return t={$$typeof:KR,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:GR,_context:t},t.Consumer=t};re.createElement=dE;re.createFactory=function(t){var e=dE.bind(null,t);return e.type=t,e};re.createRef=function(){return{current:null}};re.forwardRef=function(t){return{$$typeof:WR,render:t}};re.isValidElement=kp;re.lazy=function(t){return{$$typeof:JR,_payload:{_status:-1,_result:t},_init:eP}};re.memo=function(t,e){return{$$typeof:QR,type:t,compare:e===void 0?null:e}};re.startTransition=function(t){var e=ku.transition;ku.transition={};try{t()}finally{ku.transition=e}};re.unstable_act=fE;re.useCallback=function(t,e){return Ct.current.useCallback(t,e)};re.useContext=function(t){return Ct.current.useContext(t)};re.useDebugValue=function(){};re.useDeferredValue=function(t){return Ct.current.useDeferredValue(t)};re.useEffect=function(t,e){return Ct.current.useEffect(t,e)};re.useId=function(){return Ct.current.useId()};re.useImperativeHandle=function(t,e,n){return Ct.current.useImperativeHandle(t,e,n)};re.useInsertionEffect=function(t,e){return Ct.current.useInsertionEffect(t,e)};re.useLayoutEffect=function(t,e){return Ct.current.useLayoutEffect(t,e)};re.useMemo=function(t,e){return Ct.current.useMemo(t,e)};re.useReducer=function(t,e,n){return Ct.current.useReducer(t,e,n)};re.useRef=function(t){return Ct.current.useRef(t)};re.useState=function(t){return Ct.current.useState(t)};re.useSyncExternalStore=function(t,e,n){return Ct.current.useSyncExternalStore(t,e,n)};re.useTransition=function(){return Ct.current.useTransition()};re.version="18.3.1";sE.exports=re;var B=sE.exports;const pE=BR(B),nP=UR({__proto__:null,default:pE},[B]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var rP=B,iP=Symbol.for("react.element"),sP=Symbol.for("react.fragment"),oP=Object.prototype.hasOwnProperty,aP=rP.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,lP={key:!0,ref:!0,__self:!0,__source:!0};function mE(t,e,n){var r,i={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(r in e)oP.call(e,r)&&!lP.hasOwnProperty(r)&&(i[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)i[r]===void 0&&(i[r]=e[r]);return{$$typeof:iP,type:t,key:s,ref:o,props:i,_owner:aP.current}}Kc.Fragment=sP;Kc.jsx=mE;Kc.jsxs=mE;iE.exports=Kc;var V=iE.exports,Zd={},gE={exports:{}},Kt={},_E={exports:{}},yE={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(K,Z){var te=K.length;K.push(Z);e:for(;0<te;){var Pe=te-1>>>1,pe=K[Pe];if(0<i(pe,Z))K[Pe]=Z,K[te]=pe,te=Pe;else break e}}function n(K){return K.length===0?null:K[0]}function r(K){if(K.length===0)return null;var Z=K[0],te=K.pop();if(te!==Z){K[0]=te;e:for(var Pe=0,pe=K.length,Be=pe>>>1;Pe<Be;){var kn=2*(Pe+1)-1,xn=K[kn],bn=kn+1,Nn=K[bn];if(0>i(xn,te))bn<pe&&0>i(Nn,xn)?(K[Pe]=Nn,K[bn]=te,Pe=bn):(K[Pe]=xn,K[kn]=te,Pe=kn);else if(bn<pe&&0>i(Nn,te))K[Pe]=Nn,K[bn]=te,Pe=bn;else break e}}return Z}function i(K,Z){var te=K.sortIndex-Z.sortIndex;return te!==0?te:K.id-Z.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();t.unstable_now=function(){return o.now()-a}}var u=[],c=[],d=1,f=null,m=3,v=!1,S=!1,P=!1,C=typeof setTimeout=="function"?setTimeout:null,w=typeof clearTimeout=="function"?clearTimeout:null,y=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function E(K){for(var Z=n(c);Z!==null;){if(Z.callback===null)r(c);else if(Z.startTime<=K)r(c),Z.sortIndex=Z.expirationTime,e(u,Z);else break;Z=n(c)}}function x(K){if(P=!1,E(K),!S)if(n(u)!==null)S=!0,No(M);else{var Z=n(c);Z!==null&&Cn(x,Z.startTime-K)}}function M(K,Z){S=!1,P&&(P=!1,w(_),_=-1),v=!0;var te=m;try{for(E(Z),f=n(u);f!==null&&(!(f.expirationTime>Z)||K&&!k());){var Pe=f.callback;if(typeof Pe=="function"){f.callback=null,m=f.priorityLevel;var pe=Pe(f.expirationTime<=Z);Z=t.unstable_now(),typeof pe=="function"?f.callback=pe:f===n(u)&&r(u),E(Z)}else r(u);f=n(u)}if(f!==null)var Be=!0;else{var kn=n(c);kn!==null&&Cn(x,kn.startTime-Z),Be=!1}return Be}finally{f=null,m=te,v=!1}}var F=!1,I=null,_=-1,T=5,A=-1;function k(){return!(t.unstable_now()-A<T)}function N(){if(I!==null){var K=t.unstable_now();A=K;var Z=!0;try{Z=I(!0,K)}finally{Z?R():(F=!1,I=null)}}else F=!1}var R;if(typeof y=="function")R=function(){y(N)};else if(typeof MessageChannel<"u"){var Ze=new MessageChannel,hi=Ze.port2;Ze.port1.onmessage=N,R=function(){hi.postMessage(null)}}else R=function(){C(N,0)};function No(K){I=K,F||(F=!0,R())}function Cn(K,Z){_=C(function(){K(t.unstable_now())},Z)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(K){K.callback=null},t.unstable_continueExecution=function(){S||v||(S=!0,No(M))},t.unstable_forceFrameRate=function(K){0>K||125<K?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):T=0<K?Math.floor(1e3/K):5},t.unstable_getCurrentPriorityLevel=function(){return m},t.unstable_getFirstCallbackNode=function(){return n(u)},t.unstable_next=function(K){switch(m){case 1:case 2:case 3:var Z=3;break;default:Z=m}var te=m;m=Z;try{return K()}finally{m=te}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(K,Z){switch(K){case 1:case 2:case 3:case 4:case 5:break;default:K=3}var te=m;m=K;try{return Z()}finally{m=te}},t.unstable_scheduleCallback=function(K,Z,te){var Pe=t.unstable_now();switch(typeof te=="object"&&te!==null?(te=te.delay,te=typeof te=="number"&&0<te?Pe+te:Pe):te=Pe,K){case 1:var pe=-1;break;case 2:pe=250;break;case 5:pe=1073741823;break;case 4:pe=1e4;break;default:pe=5e3}return pe=te+pe,K={id:d++,callback:Z,priorityLevel:K,startTime:te,expirationTime:pe,sortIndex:-1},te>Pe?(K.sortIndex=te,e(c,K),n(u)===null&&K===n(c)&&(P?(w(_),_=-1):P=!0,Cn(x,te-Pe))):(K.sortIndex=pe,e(u,K),S||v||(S=!0,No(M))),K},t.unstable_shouldYield=k,t.unstable_wrapCallback=function(K){var Z=m;return function(){var te=m;m=Z;try{return K.apply(this,arguments)}finally{m=te}}}})(yE);_E.exports=yE;var uP=_E.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var cP=B,qt=uP;function z(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var vE=new Set,Na={};function Zi(t,e){Ws(t,e),Ws(t+"Capture",e)}function Ws(t,e){for(Na[t]=e,t=0;t<e.length;t++)vE.add(e[t])}var Gn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ef=Object.prototype.hasOwnProperty,hP=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,K_={},W_={};function dP(t){return ef.call(W_,t)?!0:ef.call(K_,t)?!1:hP.test(t)?W_[t]=!0:(K_[t]=!0,!1)}function fP(t,e,n,r){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function pP(t,e,n,r){if(e===null||typeof e>"u"||fP(t,e,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function kt(t,e,n,r,i,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var ct={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){ct[t]=new kt(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];ct[e]=new kt(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){ct[t]=new kt(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){ct[t]=new kt(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){ct[t]=new kt(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){ct[t]=new kt(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){ct[t]=new kt(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){ct[t]=new kt(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){ct[t]=new kt(t,5,!1,t.toLowerCase(),null,!1,!1)});var xp=/[\-:]([a-z])/g;function bp(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(xp,bp);ct[e]=new kt(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(xp,bp);ct[e]=new kt(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(xp,bp);ct[e]=new kt(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){ct[t]=new kt(t,1,!1,t.toLowerCase(),null,!1,!1)});ct.xlinkHref=new kt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){ct[t]=new kt(t,1,!1,t.toLowerCase(),null,!0,!0)});function Np(t,e,n,r){var i=ct.hasOwnProperty(e)?ct[e]:null;(i!==null?i.type!==0:r||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(pP(e,n,i,r)&&(n=null),r||i===null?dP(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):i.mustUseProperty?t[i.propertyName]=n===null?i.type===3?!1:"":n:(e=i.attributeName,r=i.attributeNamespace,n===null?t.removeAttribute(e):(i=i.type,n=i===3||i===4&&n===!0?"":""+n,r?t.setAttributeNS(r,e,n):t.setAttribute(e,n))))}var Zn=cP.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,nu=Symbol.for("react.element"),Ts=Symbol.for("react.portal"),Ss=Symbol.for("react.fragment"),Dp=Symbol.for("react.strict_mode"),tf=Symbol.for("react.profiler"),wE=Symbol.for("react.provider"),EE=Symbol.for("react.context"),Vp=Symbol.for("react.forward_ref"),nf=Symbol.for("react.suspense"),rf=Symbol.for("react.suspense_list"),Op=Symbol.for("react.memo"),fr=Symbol.for("react.lazy"),IE=Symbol.for("react.offscreen"),H_=Symbol.iterator;function Ko(t){return t===null||typeof t!="object"?null:(t=H_&&t[H_]||t["@@iterator"],typeof t=="function"?t:null)}var be=Object.assign,cd;function oa(t){if(cd===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);cd=e&&e[1]||""}return`
`+cd+t}var hd=!1;function dd(t,e){if(!t||hd)return"";hd=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var r=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){r=c}t.call(e.prototype)}else{try{throw Error()}catch(c){r=c}t()}}catch(c){if(c&&r&&typeof c.stack=="string"){for(var i=c.stack.split(`
`),s=r.stack.split(`
`),o=i.length-1,a=s.length-1;1<=o&&0<=a&&i[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(i[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||i[o]!==s[a]){var u=`
`+i[o].replace(" at new "," at ");return t.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",t.displayName)),u}while(1<=o&&0<=a);break}}}finally{hd=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?oa(t):""}function mP(t){switch(t.tag){case 5:return oa(t.type);case 16:return oa("Lazy");case 13:return oa("Suspense");case 19:return oa("SuspenseList");case 0:case 2:case 15:return t=dd(t.type,!1),t;case 11:return t=dd(t.type.render,!1),t;case 1:return t=dd(t.type,!0),t;default:return""}}function sf(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case Ss:return"Fragment";case Ts:return"Portal";case tf:return"Profiler";case Dp:return"StrictMode";case nf:return"Suspense";case rf:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case EE:return(t.displayName||"Context")+".Consumer";case wE:return(t._context.displayName||"Context")+".Provider";case Vp:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Op:return e=t.displayName||null,e!==null?e:sf(t.type)||"Memo";case fr:e=t._payload,t=t._init;try{return sf(t(e))}catch{}}return null}function gP(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return sf(e);case 8:return e===Dp?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function Br(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function TE(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function _P(t){var e=TE(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),r=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var i=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return i.call(this)},set:function(o){r=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function ru(t){t._valueTracker||(t._valueTracker=_P(t))}function SE(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),r="";return t&&(r=TE(t)?t.checked?"true":"false":t.value),t=r,t!==n?(e.setValue(t),!0):!1}function ec(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function of(t,e){var n=e.checked;return be({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Q_(t,e){var n=e.defaultValue==null?"":e.defaultValue,r=e.checked!=null?e.checked:e.defaultChecked;n=Br(e.value!=null?e.value:n),t._wrapperState={initialChecked:r,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function AE(t,e){e=e.checked,e!=null&&Np(t,"checked",e,!1)}function af(t,e){AE(t,e);var n=Br(e.value),r=e.type;if(n!=null)r==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(r==="submit"||r==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?lf(t,e.type,n):e.hasOwnProperty("defaultValue")&&lf(t,e.type,Br(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function J_(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var r=e.type;if(!(r!=="submit"&&r!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function lf(t,e,n){(e!=="number"||ec(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var aa=Array.isArray;function Ls(t,e,n,r){if(t=t.options,e){e={};for(var i=0;i<n.length;i++)e["$"+n[i]]=!0;for(n=0;n<t.length;n++)i=e.hasOwnProperty("$"+t[n].value),t[n].selected!==i&&(t[n].selected=i),i&&r&&(t[n].defaultSelected=!0)}else{for(n=""+Br(n),e=null,i=0;i<t.length;i++){if(t[i].value===n){t[i].selected=!0,r&&(t[i].defaultSelected=!0);return}e!==null||t[i].disabled||(e=t[i])}e!==null&&(e.selected=!0)}}function uf(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(z(91));return be({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Y_(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(z(92));if(aa(n)){if(1<n.length)throw Error(z(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:Br(n)}}function RE(t,e){var n=Br(e.value),r=Br(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),r!=null&&(t.defaultValue=""+r)}function X_(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function PE(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function cf(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?PE(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var iu,CE=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,r,i){MSApp.execUnsafeLocalFunction(function(){return t(e,n,r,i)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(iu=iu||document.createElement("div"),iu.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=iu.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Da(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var ga={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},yP=["Webkit","ms","Moz","O"];Object.keys(ga).forEach(function(t){yP.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),ga[e]=ga[t]})});function kE(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||ga.hasOwnProperty(t)&&ga[t]?(""+e).trim():e+"px"}function xE(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var r=n.indexOf("--")===0,i=kE(n,e[n],r);n==="float"&&(n="cssFloat"),r?t.setProperty(n,i):t[n]=i}}var vP=be({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function hf(t,e){if(e){if(vP[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(z(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(z(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(z(61))}if(e.style!=null&&typeof e.style!="object")throw Error(z(62))}}function df(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ff=null;function Lp(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var pf=null,Ms=null,Fs=null;function Z_(t){if(t=ml(t)){if(typeof pf!="function")throw Error(z(280));var e=t.stateNode;e&&(e=Yc(e),pf(t.stateNode,t.type,e))}}function bE(t){Ms?Fs?Fs.push(t):Fs=[t]:Ms=t}function NE(){if(Ms){var t=Ms,e=Fs;if(Fs=Ms=null,Z_(t),e)for(t=0;t<e.length;t++)Z_(e[t])}}function DE(t,e){return t(e)}function VE(){}var fd=!1;function OE(t,e,n){if(fd)return t(e,n);fd=!0;try{return DE(t,e,n)}finally{fd=!1,(Ms!==null||Fs!==null)&&(VE(),NE())}}function Va(t,e){var n=t.stateNode;if(n===null)return null;var r=Yc(n);if(r===null)return null;n=r[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(t=t.type,r=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!r;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(z(231,e,typeof n));return n}var mf=!1;if(Gn)try{var Wo={};Object.defineProperty(Wo,"passive",{get:function(){mf=!0}}),window.addEventListener("test",Wo,Wo),window.removeEventListener("test",Wo,Wo)}catch{mf=!1}function wP(t,e,n,r,i,s,o,a,u){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(d){this.onError(d)}}var _a=!1,tc=null,nc=!1,gf=null,EP={onError:function(t){_a=!0,tc=t}};function IP(t,e,n,r,i,s,o,a,u){_a=!1,tc=null,wP.apply(EP,arguments)}function TP(t,e,n,r,i,s,o,a,u){if(IP.apply(this,arguments),_a){if(_a){var c=tc;_a=!1,tc=null}else throw Error(z(198));nc||(nc=!0,gf=c)}}function es(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function LE(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function ey(t){if(es(t)!==t)throw Error(z(188))}function SP(t){var e=t.alternate;if(!e){if(e=es(t),e===null)throw Error(z(188));return e!==t?null:t}for(var n=t,r=e;;){var i=n.return;if(i===null)break;var s=i.alternate;if(s===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===n)return ey(i),t;if(s===r)return ey(i),e;s=s.sibling}throw Error(z(188))}if(n.return!==r.return)n=i,r=s;else{for(var o=!1,a=i.child;a;){if(a===n){o=!0,n=i,r=s;break}if(a===r){o=!0,r=i,n=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===n){o=!0,n=s,r=i;break}if(a===r){o=!0,r=s,n=i;break}a=a.sibling}if(!o)throw Error(z(189))}}if(n.alternate!==r)throw Error(z(190))}if(n.tag!==3)throw Error(z(188));return n.stateNode.current===n?t:e}function ME(t){return t=SP(t),t!==null?FE(t):null}function FE(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=FE(t);if(e!==null)return e;t=t.sibling}return null}var UE=qt.unstable_scheduleCallback,ty=qt.unstable_cancelCallback,AP=qt.unstable_shouldYield,RP=qt.unstable_requestPaint,je=qt.unstable_now,PP=qt.unstable_getCurrentPriorityLevel,Mp=qt.unstable_ImmediatePriority,BE=qt.unstable_UserBlockingPriority,rc=qt.unstable_NormalPriority,CP=qt.unstable_LowPriority,jE=qt.unstable_IdlePriority,Wc=null,wn=null;function kP(t){if(wn&&typeof wn.onCommitFiberRoot=="function")try{wn.onCommitFiberRoot(Wc,t,void 0,(t.current.flags&128)===128)}catch{}}var ln=Math.clz32?Math.clz32:NP,xP=Math.log,bP=Math.LN2;function NP(t){return t>>>=0,t===0?32:31-(xP(t)/bP|0)|0}var su=64,ou=4194304;function la(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function ic(t,e){var n=t.pendingLanes;if(n===0)return 0;var r=0,i=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var a=o&~i;a!==0?r=la(a):(s&=o,s!==0&&(r=la(s)))}else o=n&~i,o!==0?r=la(o):s!==0&&(r=la(s));if(r===0)return 0;if(e!==0&&e!==r&&!(e&i)&&(i=r&-r,s=e&-e,i>=s||i===16&&(s&4194240)!==0))return e;if(r&4&&(r|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=r;0<e;)n=31-ln(e),i=1<<n,r|=t[n],e&=~i;return r}function DP(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function VP(t,e){for(var n=t.suspendedLanes,r=t.pingedLanes,i=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-ln(s),a=1<<o,u=i[o];u===-1?(!(a&n)||a&r)&&(i[o]=DP(a,e)):u<=e&&(t.expiredLanes|=a),s&=~a}}function _f(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function zE(){var t=su;return su<<=1,!(su&4194240)&&(su=64),t}function pd(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function fl(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-ln(e),t[e]=n}function OP(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var r=t.eventTimes;for(t=t.expirationTimes;0<n;){var i=31-ln(n),s=1<<i;e[i]=0,r[i]=-1,t[i]=-1,n&=~s}}function Fp(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var r=31-ln(n),i=1<<r;i&e|t[r]&e&&(t[r]|=e),n&=~i}}var de=0;function $E(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var qE,Up,GE,KE,WE,yf=!1,au=[],kr=null,xr=null,br=null,Oa=new Map,La=new Map,mr=[],LP="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function ny(t,e){switch(t){case"focusin":case"focusout":kr=null;break;case"dragenter":case"dragleave":xr=null;break;case"mouseover":case"mouseout":br=null;break;case"pointerover":case"pointerout":Oa.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":La.delete(e.pointerId)}}function Ho(t,e,n,r,i,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:r,nativeEvent:s,targetContainers:[i]},e!==null&&(e=ml(e),e!==null&&Up(e)),t):(t.eventSystemFlags|=r,e=t.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),t)}function MP(t,e,n,r,i){switch(e){case"focusin":return kr=Ho(kr,t,e,n,r,i),!0;case"dragenter":return xr=Ho(xr,t,e,n,r,i),!0;case"mouseover":return br=Ho(br,t,e,n,r,i),!0;case"pointerover":var s=i.pointerId;return Oa.set(s,Ho(Oa.get(s)||null,t,e,n,r,i)),!0;case"gotpointercapture":return s=i.pointerId,La.set(s,Ho(La.get(s)||null,t,e,n,r,i)),!0}return!1}function HE(t){var e=Ri(t.target);if(e!==null){var n=es(e);if(n!==null){if(e=n.tag,e===13){if(e=LE(n),e!==null){t.blockedOn=e,WE(t.priority,function(){GE(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function xu(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=vf(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var r=new n.constructor(n.type,n);ff=r,n.target.dispatchEvent(r),ff=null}else return e=ml(n),e!==null&&Up(e),t.blockedOn=n,!1;e.shift()}return!0}function ry(t,e,n){xu(t)&&n.delete(e)}function FP(){yf=!1,kr!==null&&xu(kr)&&(kr=null),xr!==null&&xu(xr)&&(xr=null),br!==null&&xu(br)&&(br=null),Oa.forEach(ry),La.forEach(ry)}function Qo(t,e){t.blockedOn===e&&(t.blockedOn=null,yf||(yf=!0,qt.unstable_scheduleCallback(qt.unstable_NormalPriority,FP)))}function Ma(t){function e(i){return Qo(i,t)}if(0<au.length){Qo(au[0],t);for(var n=1;n<au.length;n++){var r=au[n];r.blockedOn===t&&(r.blockedOn=null)}}for(kr!==null&&Qo(kr,t),xr!==null&&Qo(xr,t),br!==null&&Qo(br,t),Oa.forEach(e),La.forEach(e),n=0;n<mr.length;n++)r=mr[n],r.blockedOn===t&&(r.blockedOn=null);for(;0<mr.length&&(n=mr[0],n.blockedOn===null);)HE(n),n.blockedOn===null&&mr.shift()}var Us=Zn.ReactCurrentBatchConfig,sc=!0;function UP(t,e,n,r){var i=de,s=Us.transition;Us.transition=null;try{de=1,Bp(t,e,n,r)}finally{de=i,Us.transition=s}}function BP(t,e,n,r){var i=de,s=Us.transition;Us.transition=null;try{de=4,Bp(t,e,n,r)}finally{de=i,Us.transition=s}}function Bp(t,e,n,r){if(sc){var i=vf(t,e,n,r);if(i===null)Sd(t,e,r,oc,n),ny(t,r);else if(MP(i,t,e,n,r))r.stopPropagation();else if(ny(t,r),e&4&&-1<LP.indexOf(t)){for(;i!==null;){var s=ml(i);if(s!==null&&qE(s),s=vf(t,e,n,r),s===null&&Sd(t,e,r,oc,n),s===i)break;i=s}i!==null&&r.stopPropagation()}else Sd(t,e,r,null,n)}}var oc=null;function vf(t,e,n,r){if(oc=null,t=Lp(r),t=Ri(t),t!==null)if(e=es(t),e===null)t=null;else if(n=e.tag,n===13){if(t=LE(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return oc=t,null}function QE(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(PP()){case Mp:return 1;case BE:return 4;case rc:case CP:return 16;case jE:return 536870912;default:return 16}default:return 16}}var Ar=null,jp=null,bu=null;function JE(){if(bu)return bu;var t,e=jp,n=e.length,r,i="value"in Ar?Ar.value:Ar.textContent,s=i.length;for(t=0;t<n&&e[t]===i[t];t++);var o=n-t;for(r=1;r<=o&&e[n-r]===i[s-r];r++);return bu=i.slice(t,1<r?1-r:void 0)}function Nu(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function lu(){return!0}function iy(){return!1}function Wt(t){function e(n,r,i,s,o){this._reactName=n,this._targetInst=i,this.type=r,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in t)t.hasOwnProperty(a)&&(n=t[a],this[a]=n?n(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?lu:iy,this.isPropagationStopped=iy,this}return be(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=lu)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=lu)},persist:function(){},isPersistent:lu}),e}var yo={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},zp=Wt(yo),pl=be({},yo,{view:0,detail:0}),jP=Wt(pl),md,gd,Jo,Hc=be({},pl,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:$p,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Jo&&(Jo&&t.type==="mousemove"?(md=t.screenX-Jo.screenX,gd=t.screenY-Jo.screenY):gd=md=0,Jo=t),md)},movementY:function(t){return"movementY"in t?t.movementY:gd}}),sy=Wt(Hc),zP=be({},Hc,{dataTransfer:0}),$P=Wt(zP),qP=be({},pl,{relatedTarget:0}),_d=Wt(qP),GP=be({},yo,{animationName:0,elapsedTime:0,pseudoElement:0}),KP=Wt(GP),WP=be({},yo,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),HP=Wt(WP),QP=be({},yo,{data:0}),oy=Wt(QP),JP={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},YP={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},XP={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function ZP(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=XP[t])?!!e[t]:!1}function $p(){return ZP}var eC=be({},pl,{key:function(t){if(t.key){var e=JP[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Nu(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?YP[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:$p,charCode:function(t){return t.type==="keypress"?Nu(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Nu(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),tC=Wt(eC),nC=be({},Hc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ay=Wt(nC),rC=be({},pl,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:$p}),iC=Wt(rC),sC=be({},yo,{propertyName:0,elapsedTime:0,pseudoElement:0}),oC=Wt(sC),aC=be({},Hc,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),lC=Wt(aC),uC=[9,13,27,32],qp=Gn&&"CompositionEvent"in window,ya=null;Gn&&"documentMode"in document&&(ya=document.documentMode);var cC=Gn&&"TextEvent"in window&&!ya,YE=Gn&&(!qp||ya&&8<ya&&11>=ya),ly=" ",uy=!1;function XE(t,e){switch(t){case"keyup":return uC.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function ZE(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var As=!1;function hC(t,e){switch(t){case"compositionend":return ZE(e);case"keypress":return e.which!==32?null:(uy=!0,ly);case"textInput":return t=e.data,t===ly&&uy?null:t;default:return null}}function dC(t,e){if(As)return t==="compositionend"||!qp&&XE(t,e)?(t=JE(),bu=jp=Ar=null,As=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return YE&&e.locale!=="ko"?null:e.data;default:return null}}var fC={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function cy(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!fC[t.type]:e==="textarea"}function eI(t,e,n,r){bE(r),e=ac(e,"onChange"),0<e.length&&(n=new zp("onChange","change",null,n,r),t.push({event:n,listeners:e}))}var va=null,Fa=null;function pC(t){hI(t,0)}function Qc(t){var e=Cs(t);if(SE(e))return t}function mC(t,e){if(t==="change")return e}var tI=!1;if(Gn){var yd;if(Gn){var vd="oninput"in document;if(!vd){var hy=document.createElement("div");hy.setAttribute("oninput","return;"),vd=typeof hy.oninput=="function"}yd=vd}else yd=!1;tI=yd&&(!document.documentMode||9<document.documentMode)}function dy(){va&&(va.detachEvent("onpropertychange",nI),Fa=va=null)}function nI(t){if(t.propertyName==="value"&&Qc(Fa)){var e=[];eI(e,Fa,t,Lp(t)),OE(pC,e)}}function gC(t,e,n){t==="focusin"?(dy(),va=e,Fa=n,va.attachEvent("onpropertychange",nI)):t==="focusout"&&dy()}function _C(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Qc(Fa)}function yC(t,e){if(t==="click")return Qc(e)}function vC(t,e){if(t==="input"||t==="change")return Qc(e)}function wC(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var hn=typeof Object.is=="function"?Object.is:wC;function Ua(t,e){if(hn(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),r=Object.keys(e);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!ef.call(e,i)||!hn(t[i],e[i]))return!1}return!0}function fy(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function py(t,e){var n=fy(t);t=0;for(var r;n;){if(n.nodeType===3){if(r=t+n.textContent.length,t<=e&&r>=e)return{node:n,offset:e-t};t=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=fy(n)}}function rI(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?rI(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function iI(){for(var t=window,e=ec();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=ec(t.document)}return e}function Gp(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function EC(t){var e=iI(),n=t.focusedElem,r=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&rI(n.ownerDocument.documentElement,n)){if(r!==null&&Gp(n)){if(e=r.start,t=r.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var i=n.textContent.length,s=Math.min(r.start,i);r=r.end===void 0?s:Math.min(r.end,i),!t.extend&&s>r&&(i=r,r=s,s=i),i=py(n,s);var o=py(n,r);i&&o&&(t.rangeCount!==1||t.anchorNode!==i.node||t.anchorOffset!==i.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(i.node,i.offset),t.removeAllRanges(),s>r?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var IC=Gn&&"documentMode"in document&&11>=document.documentMode,Rs=null,wf=null,wa=null,Ef=!1;function my(t,e,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Ef||Rs==null||Rs!==ec(r)||(r=Rs,"selectionStart"in r&&Gp(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),wa&&Ua(wa,r)||(wa=r,r=ac(wf,"onSelect"),0<r.length&&(e=new zp("onSelect","select",null,e,n),t.push({event:e,listeners:r}),e.target=Rs)))}function uu(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var Ps={animationend:uu("Animation","AnimationEnd"),animationiteration:uu("Animation","AnimationIteration"),animationstart:uu("Animation","AnimationStart"),transitionend:uu("Transition","TransitionEnd")},wd={},sI={};Gn&&(sI=document.createElement("div").style,"AnimationEvent"in window||(delete Ps.animationend.animation,delete Ps.animationiteration.animation,delete Ps.animationstart.animation),"TransitionEvent"in window||delete Ps.transitionend.transition);function Jc(t){if(wd[t])return wd[t];if(!Ps[t])return t;var e=Ps[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in sI)return wd[t]=e[n];return t}var oI=Jc("animationend"),aI=Jc("animationiteration"),lI=Jc("animationstart"),uI=Jc("transitionend"),cI=new Map,gy="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Xr(t,e){cI.set(t,e),Zi(e,[t])}for(var Ed=0;Ed<gy.length;Ed++){var Id=gy[Ed],TC=Id.toLowerCase(),SC=Id[0].toUpperCase()+Id.slice(1);Xr(TC,"on"+SC)}Xr(oI,"onAnimationEnd");Xr(aI,"onAnimationIteration");Xr(lI,"onAnimationStart");Xr("dblclick","onDoubleClick");Xr("focusin","onFocus");Xr("focusout","onBlur");Xr(uI,"onTransitionEnd");Ws("onMouseEnter",["mouseout","mouseover"]);Ws("onMouseLeave",["mouseout","mouseover"]);Ws("onPointerEnter",["pointerout","pointerover"]);Ws("onPointerLeave",["pointerout","pointerover"]);Zi("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Zi("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Zi("onBeforeInput",["compositionend","keypress","textInput","paste"]);Zi("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Zi("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Zi("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ua="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),AC=new Set("cancel close invalid load scroll toggle".split(" ").concat(ua));function _y(t,e,n){var r=t.type||"unknown-event";t.currentTarget=n,TP(r,e,void 0,t),t.currentTarget=null}function hI(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var r=t[n],i=r.event;r=r.listeners;e:{var s=void 0;if(e)for(var o=r.length-1;0<=o;o--){var a=r[o],u=a.instance,c=a.currentTarget;if(a=a.listener,u!==s&&i.isPropagationStopped())break e;_y(i,a,c),s=u}else for(o=0;o<r.length;o++){if(a=r[o],u=a.instance,c=a.currentTarget,a=a.listener,u!==s&&i.isPropagationStopped())break e;_y(i,a,c),s=u}}}if(nc)throw t=gf,nc=!1,gf=null,t}function we(t,e){var n=e[Rf];n===void 0&&(n=e[Rf]=new Set);var r=t+"__bubble";n.has(r)||(dI(e,t,2,!1),n.add(r))}function Td(t,e,n){var r=0;e&&(r|=4),dI(n,t,r,e)}var cu="_reactListening"+Math.random().toString(36).slice(2);function Ba(t){if(!t[cu]){t[cu]=!0,vE.forEach(function(n){n!=="selectionchange"&&(AC.has(n)||Td(n,!1,t),Td(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[cu]||(e[cu]=!0,Td("selectionchange",!1,e))}}function dI(t,e,n,r){switch(QE(e)){case 1:var i=UP;break;case 4:i=BP;break;default:i=Bp}n=i.bind(null,e,n,t),i=void 0,!mf||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),r?i!==void 0?t.addEventListener(e,n,{capture:!0,passive:i}):t.addEventListener(e,n,!0):i!==void 0?t.addEventListener(e,n,{passive:i}):t.addEventListener(e,n,!1)}function Sd(t,e,n,r,i){var s=r;if(!(e&1)&&!(e&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var a=r.stateNode.containerInfo;if(a===i||a.nodeType===8&&a.parentNode===i)break;if(o===4)for(o=r.return;o!==null;){var u=o.tag;if((u===3||u===4)&&(u=o.stateNode.containerInfo,u===i||u.nodeType===8&&u.parentNode===i))return;o=o.return}for(;a!==null;){if(o=Ri(a),o===null)return;if(u=o.tag,u===5||u===6){r=s=o;continue e}a=a.parentNode}}r=r.return}OE(function(){var c=s,d=Lp(n),f=[];e:{var m=cI.get(t);if(m!==void 0){var v=zp,S=t;switch(t){case"keypress":if(Nu(n)===0)break e;case"keydown":case"keyup":v=tC;break;case"focusin":S="focus",v=_d;break;case"focusout":S="blur",v=_d;break;case"beforeblur":case"afterblur":v=_d;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":v=sy;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":v=$P;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":v=iC;break;case oI:case aI:case lI:v=KP;break;case uI:v=oC;break;case"scroll":v=jP;break;case"wheel":v=lC;break;case"copy":case"cut":case"paste":v=HP;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":v=ay}var P=(e&4)!==0,C=!P&&t==="scroll",w=P?m!==null?m+"Capture":null:m;P=[];for(var y=c,E;y!==null;){E=y;var x=E.stateNode;if(E.tag===5&&x!==null&&(E=x,w!==null&&(x=Va(y,w),x!=null&&P.push(ja(y,x,E)))),C)break;y=y.return}0<P.length&&(m=new v(m,S,null,n,d),f.push({event:m,listeners:P}))}}if(!(e&7)){e:{if(m=t==="mouseover"||t==="pointerover",v=t==="mouseout"||t==="pointerout",m&&n!==ff&&(S=n.relatedTarget||n.fromElement)&&(Ri(S)||S[Kn]))break e;if((v||m)&&(m=d.window===d?d:(m=d.ownerDocument)?m.defaultView||m.parentWindow:window,v?(S=n.relatedTarget||n.toElement,v=c,S=S?Ri(S):null,S!==null&&(C=es(S),S!==C||S.tag!==5&&S.tag!==6)&&(S=null)):(v=null,S=c),v!==S)){if(P=sy,x="onMouseLeave",w="onMouseEnter",y="mouse",(t==="pointerout"||t==="pointerover")&&(P=ay,x="onPointerLeave",w="onPointerEnter",y="pointer"),C=v==null?m:Cs(v),E=S==null?m:Cs(S),m=new P(x,y+"leave",v,n,d),m.target=C,m.relatedTarget=E,x=null,Ri(d)===c&&(P=new P(w,y+"enter",S,n,d),P.target=E,P.relatedTarget=C,x=P),C=x,v&&S)t:{for(P=v,w=S,y=0,E=P;E;E=fs(E))y++;for(E=0,x=w;x;x=fs(x))E++;for(;0<y-E;)P=fs(P),y--;for(;0<E-y;)w=fs(w),E--;for(;y--;){if(P===w||w!==null&&P===w.alternate)break t;P=fs(P),w=fs(w)}P=null}else P=null;v!==null&&yy(f,m,v,P,!1),S!==null&&C!==null&&yy(f,C,S,P,!0)}}e:{if(m=c?Cs(c):window,v=m.nodeName&&m.nodeName.toLowerCase(),v==="select"||v==="input"&&m.type==="file")var M=mC;else if(cy(m))if(tI)M=vC;else{M=_C;var F=gC}else(v=m.nodeName)&&v.toLowerCase()==="input"&&(m.type==="checkbox"||m.type==="radio")&&(M=yC);if(M&&(M=M(t,c))){eI(f,M,n,d);break e}F&&F(t,m,c),t==="focusout"&&(F=m._wrapperState)&&F.controlled&&m.type==="number"&&lf(m,"number",m.value)}switch(F=c?Cs(c):window,t){case"focusin":(cy(F)||F.contentEditable==="true")&&(Rs=F,wf=c,wa=null);break;case"focusout":wa=wf=Rs=null;break;case"mousedown":Ef=!0;break;case"contextmenu":case"mouseup":case"dragend":Ef=!1,my(f,n,d);break;case"selectionchange":if(IC)break;case"keydown":case"keyup":my(f,n,d)}var I;if(qp)e:{switch(t){case"compositionstart":var _="onCompositionStart";break e;case"compositionend":_="onCompositionEnd";break e;case"compositionupdate":_="onCompositionUpdate";break e}_=void 0}else As?XE(t,n)&&(_="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(_="onCompositionStart");_&&(YE&&n.locale!=="ko"&&(As||_!=="onCompositionStart"?_==="onCompositionEnd"&&As&&(I=JE()):(Ar=d,jp="value"in Ar?Ar.value:Ar.textContent,As=!0)),F=ac(c,_),0<F.length&&(_=new oy(_,t,null,n,d),f.push({event:_,listeners:F}),I?_.data=I:(I=ZE(n),I!==null&&(_.data=I)))),(I=cC?hC(t,n):dC(t,n))&&(c=ac(c,"onBeforeInput"),0<c.length&&(d=new oy("onBeforeInput","beforeinput",null,n,d),f.push({event:d,listeners:c}),d.data=I))}hI(f,e)})}function ja(t,e,n){return{instance:t,listener:e,currentTarget:n}}function ac(t,e){for(var n=e+"Capture",r=[];t!==null;){var i=t,s=i.stateNode;i.tag===5&&s!==null&&(i=s,s=Va(t,n),s!=null&&r.unshift(ja(t,s,i)),s=Va(t,e),s!=null&&r.push(ja(t,s,i))),t=t.return}return r}function fs(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function yy(t,e,n,r,i){for(var s=e._reactName,o=[];n!==null&&n!==r;){var a=n,u=a.alternate,c=a.stateNode;if(u!==null&&u===r)break;a.tag===5&&c!==null&&(a=c,i?(u=Va(n,s),u!=null&&o.unshift(ja(n,u,a))):i||(u=Va(n,s),u!=null&&o.push(ja(n,u,a)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var RC=/\r\n?/g,PC=/\u0000|\uFFFD/g;function vy(t){return(typeof t=="string"?t:""+t).replace(RC,`
`).replace(PC,"")}function hu(t,e,n){if(e=vy(e),vy(t)!==e&&n)throw Error(z(425))}function lc(){}var If=null,Tf=null;function Sf(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Af=typeof setTimeout=="function"?setTimeout:void 0,CC=typeof clearTimeout=="function"?clearTimeout:void 0,wy=typeof Promise=="function"?Promise:void 0,kC=typeof queueMicrotask=="function"?queueMicrotask:typeof wy<"u"?function(t){return wy.resolve(null).then(t).catch(xC)}:Af;function xC(t){setTimeout(function(){throw t})}function Ad(t,e){var n=e,r=0;do{var i=n.nextSibling;if(t.removeChild(n),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(r===0){t.removeChild(i),Ma(e);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=i}while(n);Ma(e)}function Nr(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function Ey(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var vo=Math.random().toString(36).slice(2),gn="__reactFiber$"+vo,za="__reactProps$"+vo,Kn="__reactContainer$"+vo,Rf="__reactEvents$"+vo,bC="__reactListeners$"+vo,NC="__reactHandles$"+vo;function Ri(t){var e=t[gn];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Kn]||n[gn]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=Ey(t);t!==null;){if(n=t[gn])return n;t=Ey(t)}return e}t=n,n=t.parentNode}return null}function ml(t){return t=t[gn]||t[Kn],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Cs(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(z(33))}function Yc(t){return t[za]||null}var Pf=[],ks=-1;function Zr(t){return{current:t}}function Ie(t){0>ks||(t.current=Pf[ks],Pf[ks]=null,ks--)}function _e(t,e){ks++,Pf[ks]=t.current,t.current=e}var jr={},It=Zr(jr),Ot=Zr(!1),Oi=jr;function Hs(t,e){var n=t.type.contextTypes;if(!n)return jr;var r=t.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===e)return r.__reactInternalMemoizedMaskedChildContext;var i={},s;for(s in n)i[s]=e[s];return r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=i),i}function Lt(t){return t=t.childContextTypes,t!=null}function uc(){Ie(Ot),Ie(It)}function Iy(t,e,n){if(It.current!==jr)throw Error(z(168));_e(It,e),_e(Ot,n)}function fI(t,e,n){var r=t.stateNode;if(e=e.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var i in r)if(!(i in e))throw Error(z(108,gP(t)||"Unknown",i));return be({},n,r)}function cc(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||jr,Oi=It.current,_e(It,t),_e(Ot,Ot.current),!0}function Ty(t,e,n){var r=t.stateNode;if(!r)throw Error(z(169));n?(t=fI(t,e,Oi),r.__reactInternalMemoizedMergedChildContext=t,Ie(Ot),Ie(It),_e(It,t)):Ie(Ot),_e(Ot,n)}var Ln=null,Xc=!1,Rd=!1;function pI(t){Ln===null?Ln=[t]:Ln.push(t)}function DC(t){Xc=!0,pI(t)}function ei(){if(!Rd&&Ln!==null){Rd=!0;var t=0,e=de;try{var n=Ln;for(de=1;t<n.length;t++){var r=n[t];do r=r(!0);while(r!==null)}Ln=null,Xc=!1}catch(i){throw Ln!==null&&(Ln=Ln.slice(t+1)),UE(Mp,ei),i}finally{de=e,Rd=!1}}return null}var xs=[],bs=0,hc=null,dc=0,Ht=[],Qt=0,Li=null,Mn=1,Fn="";function yi(t,e){xs[bs++]=dc,xs[bs++]=hc,hc=t,dc=e}function mI(t,e,n){Ht[Qt++]=Mn,Ht[Qt++]=Fn,Ht[Qt++]=Li,Li=t;var r=Mn;t=Fn;var i=32-ln(r)-1;r&=~(1<<i),n+=1;var s=32-ln(e)+i;if(30<s){var o=i-i%5;s=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Mn=1<<32-ln(e)+i|n<<i|r,Fn=s+t}else Mn=1<<s|n<<i|r,Fn=t}function Kp(t){t.return!==null&&(yi(t,1),mI(t,1,0))}function Wp(t){for(;t===hc;)hc=xs[--bs],xs[bs]=null,dc=xs[--bs],xs[bs]=null;for(;t===Li;)Li=Ht[--Qt],Ht[Qt]=null,Fn=Ht[--Qt],Ht[Qt]=null,Mn=Ht[--Qt],Ht[Qt]=null}var $t=null,Bt=null,Se=!1,on=null;function gI(t,e){var n=Jt(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function Sy(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,$t=t,Bt=Nr(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,$t=t,Bt=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Li!==null?{id:Mn,overflow:Fn}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Jt(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,$t=t,Bt=null,!0):!1;default:return!1}}function Cf(t){return(t.mode&1)!==0&&(t.flags&128)===0}function kf(t){if(Se){var e=Bt;if(e){var n=e;if(!Sy(t,e)){if(Cf(t))throw Error(z(418));e=Nr(n.nextSibling);var r=$t;e&&Sy(t,e)?gI(r,n):(t.flags=t.flags&-4097|2,Se=!1,$t=t)}}else{if(Cf(t))throw Error(z(418));t.flags=t.flags&-4097|2,Se=!1,$t=t}}}function Ay(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;$t=t}function du(t){if(t!==$t)return!1;if(!Se)return Ay(t),Se=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!Sf(t.type,t.memoizedProps)),e&&(e=Bt)){if(Cf(t))throw _I(),Error(z(418));for(;e;)gI(t,e),e=Nr(e.nextSibling)}if(Ay(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(z(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){Bt=Nr(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}Bt=null}}else Bt=$t?Nr(t.stateNode.nextSibling):null;return!0}function _I(){for(var t=Bt;t;)t=Nr(t.nextSibling)}function Qs(){Bt=$t=null,Se=!1}function Hp(t){on===null?on=[t]:on.push(t)}var VC=Zn.ReactCurrentBatchConfig;function Yo(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(z(309));var r=n.stateNode}if(!r)throw Error(z(147,t));var i=r,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=i.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(z(284));if(!n._owner)throw Error(z(290,t))}return t}function fu(t,e){throw t=Object.prototype.toString.call(e),Error(z(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Ry(t){var e=t._init;return e(t._payload)}function yI(t){function e(w,y){if(t){var E=w.deletions;E===null?(w.deletions=[y],w.flags|=16):E.push(y)}}function n(w,y){if(!t)return null;for(;y!==null;)e(w,y),y=y.sibling;return null}function r(w,y){for(w=new Map;y!==null;)y.key!==null?w.set(y.key,y):w.set(y.index,y),y=y.sibling;return w}function i(w,y){return w=Lr(w,y),w.index=0,w.sibling=null,w}function s(w,y,E){return w.index=E,t?(E=w.alternate,E!==null?(E=E.index,E<y?(w.flags|=2,y):E):(w.flags|=2,y)):(w.flags|=1048576,y)}function o(w){return t&&w.alternate===null&&(w.flags|=2),w}function a(w,y,E,x){return y===null||y.tag!==6?(y=Dd(E,w.mode,x),y.return=w,y):(y=i(y,E),y.return=w,y)}function u(w,y,E,x){var M=E.type;return M===Ss?d(w,y,E.props.children,x,E.key):y!==null&&(y.elementType===M||typeof M=="object"&&M!==null&&M.$$typeof===fr&&Ry(M)===y.type)?(x=i(y,E.props),x.ref=Yo(w,y,E),x.return=w,x):(x=Uu(E.type,E.key,E.props,null,w.mode,x),x.ref=Yo(w,y,E),x.return=w,x)}function c(w,y,E,x){return y===null||y.tag!==4||y.stateNode.containerInfo!==E.containerInfo||y.stateNode.implementation!==E.implementation?(y=Vd(E,w.mode,x),y.return=w,y):(y=i(y,E.children||[]),y.return=w,y)}function d(w,y,E,x,M){return y===null||y.tag!==7?(y=bi(E,w.mode,x,M),y.return=w,y):(y=i(y,E),y.return=w,y)}function f(w,y,E){if(typeof y=="string"&&y!==""||typeof y=="number")return y=Dd(""+y,w.mode,E),y.return=w,y;if(typeof y=="object"&&y!==null){switch(y.$$typeof){case nu:return E=Uu(y.type,y.key,y.props,null,w.mode,E),E.ref=Yo(w,null,y),E.return=w,E;case Ts:return y=Vd(y,w.mode,E),y.return=w,y;case fr:var x=y._init;return f(w,x(y._payload),E)}if(aa(y)||Ko(y))return y=bi(y,w.mode,E,null),y.return=w,y;fu(w,y)}return null}function m(w,y,E,x){var M=y!==null?y.key:null;if(typeof E=="string"&&E!==""||typeof E=="number")return M!==null?null:a(w,y,""+E,x);if(typeof E=="object"&&E!==null){switch(E.$$typeof){case nu:return E.key===M?u(w,y,E,x):null;case Ts:return E.key===M?c(w,y,E,x):null;case fr:return M=E._init,m(w,y,M(E._payload),x)}if(aa(E)||Ko(E))return M!==null?null:d(w,y,E,x,null);fu(w,E)}return null}function v(w,y,E,x,M){if(typeof x=="string"&&x!==""||typeof x=="number")return w=w.get(E)||null,a(y,w,""+x,M);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case nu:return w=w.get(x.key===null?E:x.key)||null,u(y,w,x,M);case Ts:return w=w.get(x.key===null?E:x.key)||null,c(y,w,x,M);case fr:var F=x._init;return v(w,y,E,F(x._payload),M)}if(aa(x)||Ko(x))return w=w.get(E)||null,d(y,w,x,M,null);fu(y,x)}return null}function S(w,y,E,x){for(var M=null,F=null,I=y,_=y=0,T=null;I!==null&&_<E.length;_++){I.index>_?(T=I,I=null):T=I.sibling;var A=m(w,I,E[_],x);if(A===null){I===null&&(I=T);break}t&&I&&A.alternate===null&&e(w,I),y=s(A,y,_),F===null?M=A:F.sibling=A,F=A,I=T}if(_===E.length)return n(w,I),Se&&yi(w,_),M;if(I===null){for(;_<E.length;_++)I=f(w,E[_],x),I!==null&&(y=s(I,y,_),F===null?M=I:F.sibling=I,F=I);return Se&&yi(w,_),M}for(I=r(w,I);_<E.length;_++)T=v(I,w,_,E[_],x),T!==null&&(t&&T.alternate!==null&&I.delete(T.key===null?_:T.key),y=s(T,y,_),F===null?M=T:F.sibling=T,F=T);return t&&I.forEach(function(k){return e(w,k)}),Se&&yi(w,_),M}function P(w,y,E,x){var M=Ko(E);if(typeof M!="function")throw Error(z(150));if(E=M.call(E),E==null)throw Error(z(151));for(var F=M=null,I=y,_=y=0,T=null,A=E.next();I!==null&&!A.done;_++,A=E.next()){I.index>_?(T=I,I=null):T=I.sibling;var k=m(w,I,A.value,x);if(k===null){I===null&&(I=T);break}t&&I&&k.alternate===null&&e(w,I),y=s(k,y,_),F===null?M=k:F.sibling=k,F=k,I=T}if(A.done)return n(w,I),Se&&yi(w,_),M;if(I===null){for(;!A.done;_++,A=E.next())A=f(w,A.value,x),A!==null&&(y=s(A,y,_),F===null?M=A:F.sibling=A,F=A);return Se&&yi(w,_),M}for(I=r(w,I);!A.done;_++,A=E.next())A=v(I,w,_,A.value,x),A!==null&&(t&&A.alternate!==null&&I.delete(A.key===null?_:A.key),y=s(A,y,_),F===null?M=A:F.sibling=A,F=A);return t&&I.forEach(function(N){return e(w,N)}),Se&&yi(w,_),M}function C(w,y,E,x){if(typeof E=="object"&&E!==null&&E.type===Ss&&E.key===null&&(E=E.props.children),typeof E=="object"&&E!==null){switch(E.$$typeof){case nu:e:{for(var M=E.key,F=y;F!==null;){if(F.key===M){if(M=E.type,M===Ss){if(F.tag===7){n(w,F.sibling),y=i(F,E.props.children),y.return=w,w=y;break e}}else if(F.elementType===M||typeof M=="object"&&M!==null&&M.$$typeof===fr&&Ry(M)===F.type){n(w,F.sibling),y=i(F,E.props),y.ref=Yo(w,F,E),y.return=w,w=y;break e}n(w,F);break}else e(w,F);F=F.sibling}E.type===Ss?(y=bi(E.props.children,w.mode,x,E.key),y.return=w,w=y):(x=Uu(E.type,E.key,E.props,null,w.mode,x),x.ref=Yo(w,y,E),x.return=w,w=x)}return o(w);case Ts:e:{for(F=E.key;y!==null;){if(y.key===F)if(y.tag===4&&y.stateNode.containerInfo===E.containerInfo&&y.stateNode.implementation===E.implementation){n(w,y.sibling),y=i(y,E.children||[]),y.return=w,w=y;break e}else{n(w,y);break}else e(w,y);y=y.sibling}y=Vd(E,w.mode,x),y.return=w,w=y}return o(w);case fr:return F=E._init,C(w,y,F(E._payload),x)}if(aa(E))return S(w,y,E,x);if(Ko(E))return P(w,y,E,x);fu(w,E)}return typeof E=="string"&&E!==""||typeof E=="number"?(E=""+E,y!==null&&y.tag===6?(n(w,y.sibling),y=i(y,E),y.return=w,w=y):(n(w,y),y=Dd(E,w.mode,x),y.return=w,w=y),o(w)):n(w,y)}return C}var Js=yI(!0),vI=yI(!1),fc=Zr(null),pc=null,Ns=null,Qp=null;function Jp(){Qp=Ns=pc=null}function Yp(t){var e=fc.current;Ie(fc),t._currentValue=e}function xf(t,e,n){for(;t!==null;){var r=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,r!==null&&(r.childLanes|=e)):r!==null&&(r.childLanes&e)!==e&&(r.childLanes|=e),t===n)break;t=t.return}}function Bs(t,e){pc=t,Qp=Ns=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(bt=!0),t.firstContext=null)}function Xt(t){var e=t._currentValue;if(Qp!==t)if(t={context:t,memoizedValue:e,next:null},Ns===null){if(pc===null)throw Error(z(308));Ns=t,pc.dependencies={lanes:0,firstContext:t}}else Ns=Ns.next=t;return e}var Pi=null;function Xp(t){Pi===null?Pi=[t]:Pi.push(t)}function wI(t,e,n,r){var i=e.interleaved;return i===null?(n.next=n,Xp(e)):(n.next=i.next,i.next=n),e.interleaved=n,Wn(t,r)}function Wn(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var pr=!1;function Zp(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function EI(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function $n(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Dr(t,e,n){var r=t.updateQueue;if(r===null)return null;if(r=r.shared,le&2){var i=r.pending;return i===null?e.next=e:(e.next=i.next,i.next=e),r.pending=e,Wn(t,n)}return i=r.interleaved,i===null?(e.next=e,Xp(r)):(e.next=i.next,i.next=e),r.interleaved=e,Wn(t,n)}function Du(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,Fp(t,n)}}function Py(t,e){var n=t.updateQueue,r=t.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?i=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?i=s=e:s=s.next=e}else i=s=e;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:r.shared,effects:r.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function mc(t,e,n,r){var i=t.updateQueue;pr=!1;var s=i.firstBaseUpdate,o=i.lastBaseUpdate,a=i.shared.pending;if(a!==null){i.shared.pending=null;var u=a,c=u.next;u.next=null,o===null?s=c:o.next=c,o=u;var d=t.alternate;d!==null&&(d=d.updateQueue,a=d.lastBaseUpdate,a!==o&&(a===null?d.firstBaseUpdate=c:a.next=c,d.lastBaseUpdate=u))}if(s!==null){var f=i.baseState;o=0,d=c=u=null,a=s;do{var m=a.lane,v=a.eventTime;if((r&m)===m){d!==null&&(d=d.next={eventTime:v,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var S=t,P=a;switch(m=e,v=n,P.tag){case 1:if(S=P.payload,typeof S=="function"){f=S.call(v,f,m);break e}f=S;break e;case 3:S.flags=S.flags&-65537|128;case 0:if(S=P.payload,m=typeof S=="function"?S.call(v,f,m):S,m==null)break e;f=be({},f,m);break e;case 2:pr=!0}}a.callback!==null&&a.lane!==0&&(t.flags|=64,m=i.effects,m===null?i.effects=[a]:m.push(a))}else v={eventTime:v,lane:m,tag:a.tag,payload:a.payload,callback:a.callback,next:null},d===null?(c=d=v,u=f):d=d.next=v,o|=m;if(a=a.next,a===null){if(a=i.shared.pending,a===null)break;m=a,a=m.next,m.next=null,i.lastBaseUpdate=m,i.shared.pending=null}}while(!0);if(d===null&&(u=f),i.baseState=u,i.firstBaseUpdate=c,i.lastBaseUpdate=d,e=i.shared.interleaved,e!==null){i=e;do o|=i.lane,i=i.next;while(i!==e)}else s===null&&(i.shared.lanes=0);Fi|=o,t.lanes=o,t.memoizedState=f}}function Cy(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var r=t[e],i=r.callback;if(i!==null){if(r.callback=null,r=n,typeof i!="function")throw Error(z(191,i));i.call(r)}}}var gl={},En=Zr(gl),$a=Zr(gl),qa=Zr(gl);function Ci(t){if(t===gl)throw Error(z(174));return t}function em(t,e){switch(_e(qa,e),_e($a,t),_e(En,gl),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:cf(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=cf(e,t)}Ie(En),_e(En,e)}function Ys(){Ie(En),Ie($a),Ie(qa)}function II(t){Ci(qa.current);var e=Ci(En.current),n=cf(e,t.type);e!==n&&(_e($a,t),_e(En,n))}function tm(t){$a.current===t&&(Ie(En),Ie($a))}var Ce=Zr(0);function gc(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Pd=[];function nm(){for(var t=0;t<Pd.length;t++)Pd[t]._workInProgressVersionPrimary=null;Pd.length=0}var Vu=Zn.ReactCurrentDispatcher,Cd=Zn.ReactCurrentBatchConfig,Mi=0,ke=null,Qe=null,tt=null,_c=!1,Ea=!1,Ga=0,OC=0;function mt(){throw Error(z(321))}function rm(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!hn(t[n],e[n]))return!1;return!0}function im(t,e,n,r,i,s){if(Mi=s,ke=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Vu.current=t===null||t.memoizedState===null?UC:BC,t=n(r,i),Ea){s=0;do{if(Ea=!1,Ga=0,25<=s)throw Error(z(301));s+=1,tt=Qe=null,e.updateQueue=null,Vu.current=jC,t=n(r,i)}while(Ea)}if(Vu.current=yc,e=Qe!==null&&Qe.next!==null,Mi=0,tt=Qe=ke=null,_c=!1,e)throw Error(z(300));return t}function sm(){var t=Ga!==0;return Ga=0,t}function mn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return tt===null?ke.memoizedState=tt=t:tt=tt.next=t,tt}function Zt(){if(Qe===null){var t=ke.alternate;t=t!==null?t.memoizedState:null}else t=Qe.next;var e=tt===null?ke.memoizedState:tt.next;if(e!==null)tt=e,Qe=t;else{if(t===null)throw Error(z(310));Qe=t,t={memoizedState:Qe.memoizedState,baseState:Qe.baseState,baseQueue:Qe.baseQueue,queue:Qe.queue,next:null},tt===null?ke.memoizedState=tt=t:tt=tt.next=t}return tt}function Ka(t,e){return typeof e=="function"?e(t):e}function kd(t){var e=Zt(),n=e.queue;if(n===null)throw Error(z(311));n.lastRenderedReducer=t;var r=Qe,i=r.baseQueue,s=n.pending;if(s!==null){if(i!==null){var o=i.next;i.next=s.next,s.next=o}r.baseQueue=i=s,n.pending=null}if(i!==null){s=i.next,r=r.baseState;var a=o=null,u=null,c=s;do{var d=c.lane;if((Mi&d)===d)u!==null&&(u=u.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),r=c.hasEagerState?c.eagerState:t(r,c.action);else{var f={lane:d,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};u===null?(a=u=f,o=r):u=u.next=f,ke.lanes|=d,Fi|=d}c=c.next}while(c!==null&&c!==s);u===null?o=r:u.next=a,hn(r,e.memoizedState)||(bt=!0),e.memoizedState=r,e.baseState=o,e.baseQueue=u,n.lastRenderedState=r}if(t=n.interleaved,t!==null){i=t;do s=i.lane,ke.lanes|=s,Fi|=s,i=i.next;while(i!==t)}else i===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function xd(t){var e=Zt(),n=e.queue;if(n===null)throw Error(z(311));n.lastRenderedReducer=t;var r=n.dispatch,i=n.pending,s=e.memoizedState;if(i!==null){n.pending=null;var o=i=i.next;do s=t(s,o.action),o=o.next;while(o!==i);hn(s,e.memoizedState)||(bt=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,r]}function TI(){}function SI(t,e){var n=ke,r=Zt(),i=e(),s=!hn(r.memoizedState,i);if(s&&(r.memoizedState=i,bt=!0),r=r.queue,om(PI.bind(null,n,r,t),[t]),r.getSnapshot!==e||s||tt!==null&&tt.memoizedState.tag&1){if(n.flags|=2048,Wa(9,RI.bind(null,n,r,i,e),void 0,null),rt===null)throw Error(z(349));Mi&30||AI(n,e,i)}return i}function AI(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=ke.updateQueue,e===null?(e={lastEffect:null,stores:null},ke.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function RI(t,e,n,r){e.value=n,e.getSnapshot=r,CI(e)&&kI(t)}function PI(t,e,n){return n(function(){CI(e)&&kI(t)})}function CI(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!hn(t,n)}catch{return!0}}function kI(t){var e=Wn(t,1);e!==null&&un(e,t,1,-1)}function ky(t){var e=mn();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ka,lastRenderedState:t},e.queue=t,t=t.dispatch=FC.bind(null,ke,t),[e.memoizedState,t]}function Wa(t,e,n,r){return t={tag:t,create:e,destroy:n,deps:r,next:null},e=ke.updateQueue,e===null?(e={lastEffect:null,stores:null},ke.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(r=n.next,n.next=t,t.next=r,e.lastEffect=t)),t}function xI(){return Zt().memoizedState}function Ou(t,e,n,r){var i=mn();ke.flags|=t,i.memoizedState=Wa(1|e,n,void 0,r===void 0?null:r)}function Zc(t,e,n,r){var i=Zt();r=r===void 0?null:r;var s=void 0;if(Qe!==null){var o=Qe.memoizedState;if(s=o.destroy,r!==null&&rm(r,o.deps)){i.memoizedState=Wa(e,n,s,r);return}}ke.flags|=t,i.memoizedState=Wa(1|e,n,s,r)}function xy(t,e){return Ou(8390656,8,t,e)}function om(t,e){return Zc(2048,8,t,e)}function bI(t,e){return Zc(4,2,t,e)}function NI(t,e){return Zc(4,4,t,e)}function DI(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function VI(t,e,n){return n=n!=null?n.concat([t]):null,Zc(4,4,DI.bind(null,e,t),n)}function am(){}function OI(t,e){var n=Zt();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&rm(e,r[1])?r[0]:(n.memoizedState=[t,e],t)}function LI(t,e){var n=Zt();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&rm(e,r[1])?r[0]:(t=t(),n.memoizedState=[t,e],t)}function MI(t,e,n){return Mi&21?(hn(n,e)||(n=zE(),ke.lanes|=n,Fi|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,bt=!0),t.memoizedState=n)}function LC(t,e){var n=de;de=n!==0&&4>n?n:4,t(!0);var r=Cd.transition;Cd.transition={};try{t(!1),e()}finally{de=n,Cd.transition=r}}function FI(){return Zt().memoizedState}function MC(t,e,n){var r=Or(t);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},UI(t))BI(e,n);else if(n=wI(t,e,n,r),n!==null){var i=Pt();un(n,t,r,i),jI(n,e,r)}}function FC(t,e,n){var r=Or(t),i={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(UI(t))BI(e,i);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,n);if(i.hasEagerState=!0,i.eagerState=a,hn(a,o)){var u=e.interleaved;u===null?(i.next=i,Xp(e)):(i.next=u.next,u.next=i),e.interleaved=i;return}}catch{}finally{}n=wI(t,e,i,r),n!==null&&(i=Pt(),un(n,t,r,i),jI(n,e,r))}}function UI(t){var e=t.alternate;return t===ke||e!==null&&e===ke}function BI(t,e){Ea=_c=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function jI(t,e,n){if(n&4194240){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,Fp(t,n)}}var yc={readContext:Xt,useCallback:mt,useContext:mt,useEffect:mt,useImperativeHandle:mt,useInsertionEffect:mt,useLayoutEffect:mt,useMemo:mt,useReducer:mt,useRef:mt,useState:mt,useDebugValue:mt,useDeferredValue:mt,useTransition:mt,useMutableSource:mt,useSyncExternalStore:mt,useId:mt,unstable_isNewReconciler:!1},UC={readContext:Xt,useCallback:function(t,e){return mn().memoizedState=[t,e===void 0?null:e],t},useContext:Xt,useEffect:xy,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,Ou(4194308,4,DI.bind(null,e,t),n)},useLayoutEffect:function(t,e){return Ou(4194308,4,t,e)},useInsertionEffect:function(t,e){return Ou(4,2,t,e)},useMemo:function(t,e){var n=mn();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var r=mn();return e=n!==void 0?n(e):e,r.memoizedState=r.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},r.queue=t,t=t.dispatch=MC.bind(null,ke,t),[r.memoizedState,t]},useRef:function(t){var e=mn();return t={current:t},e.memoizedState=t},useState:ky,useDebugValue:am,useDeferredValue:function(t){return mn().memoizedState=t},useTransition:function(){var t=ky(!1),e=t[0];return t=LC.bind(null,t[1]),mn().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var r=ke,i=mn();if(Se){if(n===void 0)throw Error(z(407));n=n()}else{if(n=e(),rt===null)throw Error(z(349));Mi&30||AI(r,e,n)}i.memoizedState=n;var s={value:n,getSnapshot:e};return i.queue=s,xy(PI.bind(null,r,s,t),[t]),r.flags|=2048,Wa(9,RI.bind(null,r,s,n,e),void 0,null),n},useId:function(){var t=mn(),e=rt.identifierPrefix;if(Se){var n=Fn,r=Mn;n=(r&~(1<<32-ln(r)-1)).toString(32)+n,e=":"+e+"R"+n,n=Ga++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=OC++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},BC={readContext:Xt,useCallback:OI,useContext:Xt,useEffect:om,useImperativeHandle:VI,useInsertionEffect:bI,useLayoutEffect:NI,useMemo:LI,useReducer:kd,useRef:xI,useState:function(){return kd(Ka)},useDebugValue:am,useDeferredValue:function(t){var e=Zt();return MI(e,Qe.memoizedState,t)},useTransition:function(){var t=kd(Ka)[0],e=Zt().memoizedState;return[t,e]},useMutableSource:TI,useSyncExternalStore:SI,useId:FI,unstable_isNewReconciler:!1},jC={readContext:Xt,useCallback:OI,useContext:Xt,useEffect:om,useImperativeHandle:VI,useInsertionEffect:bI,useLayoutEffect:NI,useMemo:LI,useReducer:xd,useRef:xI,useState:function(){return xd(Ka)},useDebugValue:am,useDeferredValue:function(t){var e=Zt();return Qe===null?e.memoizedState=t:MI(e,Qe.memoizedState,t)},useTransition:function(){var t=xd(Ka)[0],e=Zt().memoizedState;return[t,e]},useMutableSource:TI,useSyncExternalStore:SI,useId:FI,unstable_isNewReconciler:!1};function rn(t,e){if(t&&t.defaultProps){e=be({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function bf(t,e,n,r){e=t.memoizedState,n=n(r,e),n=n==null?e:be({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var eh={isMounted:function(t){return(t=t._reactInternals)?es(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var r=Pt(),i=Or(t),s=$n(r,i);s.payload=e,n!=null&&(s.callback=n),e=Dr(t,s,i),e!==null&&(un(e,t,i,r),Du(e,t,i))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var r=Pt(),i=Or(t),s=$n(r,i);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=Dr(t,s,i),e!==null&&(un(e,t,i,r),Du(e,t,i))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=Pt(),r=Or(t),i=$n(n,r);i.tag=2,e!=null&&(i.callback=e),e=Dr(t,i,r),e!==null&&(un(e,t,r,n),Du(e,t,r))}};function by(t,e,n,r,i,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(r,s,o):e.prototype&&e.prototype.isPureReactComponent?!Ua(n,r)||!Ua(i,s):!0}function zI(t,e,n){var r=!1,i=jr,s=e.contextType;return typeof s=="object"&&s!==null?s=Xt(s):(i=Lt(e)?Oi:It.current,r=e.contextTypes,s=(r=r!=null)?Hs(t,i):jr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=eh,t.stateNode=e,e._reactInternals=t,r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=s),e}function Ny(t,e,n,r){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,r),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,r),e.state!==t&&eh.enqueueReplaceState(e,e.state,null)}function Nf(t,e,n,r){var i=t.stateNode;i.props=n,i.state=t.memoizedState,i.refs={},Zp(t);var s=e.contextType;typeof s=="object"&&s!==null?i.context=Xt(s):(s=Lt(e)?Oi:It.current,i.context=Hs(t,s)),i.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(bf(t,e,s,n),i.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(e=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),e!==i.state&&eh.enqueueReplaceState(i,i.state,null),mc(t,n,i,r),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308)}function Xs(t,e){try{var n="",r=e;do n+=mP(r),r=r.return;while(r);var i=n}catch(s){i=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:i,digest:null}}function bd(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function Df(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var zC=typeof WeakMap=="function"?WeakMap:Map;function $I(t,e,n){n=$n(-1,n),n.tag=3,n.payload={element:null};var r=e.value;return n.callback=function(){wc||(wc=!0,$f=r),Df(t,e)},n}function qI(t,e,n){n=$n(-1,n),n.tag=3;var r=t.type.getDerivedStateFromError;if(typeof r=="function"){var i=e.value;n.payload=function(){return r(i)},n.callback=function(){Df(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Df(t,e),typeof r!="function"&&(Vr===null?Vr=new Set([this]):Vr.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function Dy(t,e,n){var r=t.pingCache;if(r===null){r=t.pingCache=new zC;var i=new Set;r.set(e,i)}else i=r.get(e),i===void 0&&(i=new Set,r.set(e,i));i.has(n)||(i.add(n),t=nk.bind(null,t,e,n),e.then(t,t))}function Vy(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Oy(t,e,n,r,i){return t.mode&1?(t.flags|=65536,t.lanes=i,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=$n(-1,1),e.tag=2,Dr(n,e,1))),n.lanes|=1),t)}var $C=Zn.ReactCurrentOwner,bt=!1;function Rt(t,e,n,r){e.child=t===null?vI(e,null,n,r):Js(e,t.child,n,r)}function Ly(t,e,n,r,i){n=n.render;var s=e.ref;return Bs(e,i),r=im(t,e,n,r,s,i),n=sm(),t!==null&&!bt?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,Hn(t,e,i)):(Se&&n&&Kp(e),e.flags|=1,Rt(t,e,r,i),e.child)}function My(t,e,n,r,i){if(t===null){var s=n.type;return typeof s=="function"&&!mm(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,GI(t,e,s,r,i)):(t=Uu(n.type,null,r,e,e.mode,i),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&i)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:Ua,n(o,r)&&t.ref===e.ref)return Hn(t,e,i)}return e.flags|=1,t=Lr(s,r),t.ref=e.ref,t.return=e,e.child=t}function GI(t,e,n,r,i){if(t!==null){var s=t.memoizedProps;if(Ua(s,r)&&t.ref===e.ref)if(bt=!1,e.pendingProps=r=s,(t.lanes&i)!==0)t.flags&131072&&(bt=!0);else return e.lanes=t.lanes,Hn(t,e,i)}return Vf(t,e,n,r,i)}function KI(t,e,n){var r=e.pendingProps,i=r.children,s=t!==null?t.memoizedState:null;if(r.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},_e(Vs,Ut),Ut|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,_e(Vs,Ut),Ut|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=s!==null?s.baseLanes:n,_e(Vs,Ut),Ut|=r}else s!==null?(r=s.baseLanes|n,e.memoizedState=null):r=n,_e(Vs,Ut),Ut|=r;return Rt(t,e,i,n),e.child}function WI(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function Vf(t,e,n,r,i){var s=Lt(n)?Oi:It.current;return s=Hs(e,s),Bs(e,i),n=im(t,e,n,r,s,i),r=sm(),t!==null&&!bt?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,Hn(t,e,i)):(Se&&r&&Kp(e),e.flags|=1,Rt(t,e,n,i),e.child)}function Fy(t,e,n,r,i){if(Lt(n)){var s=!0;cc(e)}else s=!1;if(Bs(e,i),e.stateNode===null)Lu(t,e),zI(e,n,r),Nf(e,n,r,i),r=!0;else if(t===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var u=o.context,c=n.contextType;typeof c=="object"&&c!==null?c=Xt(c):(c=Lt(n)?Oi:It.current,c=Hs(e,c));var d=n.getDerivedStateFromProps,f=typeof d=="function"||typeof o.getSnapshotBeforeUpdate=="function";f||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==r||u!==c)&&Ny(e,o,r,c),pr=!1;var m=e.memoizedState;o.state=m,mc(e,r,o,i),u=e.memoizedState,a!==r||m!==u||Ot.current||pr?(typeof d=="function"&&(bf(e,n,d,r),u=e.memoizedState),(a=pr||by(e,n,a,r,m,u,c))?(f||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=r,e.memoizedState=u),o.props=r,o.state=u,o.context=c,r=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),r=!1)}else{o=e.stateNode,EI(t,e),a=e.memoizedProps,c=e.type===e.elementType?a:rn(e.type,a),o.props=c,f=e.pendingProps,m=o.context,u=n.contextType,typeof u=="object"&&u!==null?u=Xt(u):(u=Lt(n)?Oi:It.current,u=Hs(e,u));var v=n.getDerivedStateFromProps;(d=typeof v=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==f||m!==u)&&Ny(e,o,r,u),pr=!1,m=e.memoizedState,o.state=m,mc(e,r,o,i);var S=e.memoizedState;a!==f||m!==S||Ot.current||pr?(typeof v=="function"&&(bf(e,n,v,r),S=e.memoizedState),(c=pr||by(e,n,c,r,m,S,u)||!1)?(d||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,S,u),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,S,u)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&m===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&m===t.memoizedState||(e.flags|=1024),e.memoizedProps=r,e.memoizedState=S),o.props=r,o.state=S,o.context=u,r=c):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&m===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&m===t.memoizedState||(e.flags|=1024),r=!1)}return Of(t,e,n,r,s,i)}function Of(t,e,n,r,i,s){WI(t,e);var o=(e.flags&128)!==0;if(!r&&!o)return i&&Ty(e,n,!1),Hn(t,e,s);r=e.stateNode,$C.current=e;var a=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return e.flags|=1,t!==null&&o?(e.child=Js(e,t.child,null,s),e.child=Js(e,null,a,s)):Rt(t,e,a,s),e.memoizedState=r.state,i&&Ty(e,n,!0),e.child}function HI(t){var e=t.stateNode;e.pendingContext?Iy(t,e.pendingContext,e.pendingContext!==e.context):e.context&&Iy(t,e.context,!1),em(t,e.containerInfo)}function Uy(t,e,n,r,i){return Qs(),Hp(i),e.flags|=256,Rt(t,e,n,r),e.child}var Lf={dehydrated:null,treeContext:null,retryLane:0};function Mf(t){return{baseLanes:t,cachePool:null,transitions:null}}function QI(t,e,n){var r=e.pendingProps,i=Ce.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=t!==null&&t.memoizedState===null?!1:(i&2)!==0),a?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(i|=1),_e(Ce,i&1),t===null)return kf(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=r.children,t=r.fallback,s?(r=e.mode,s=e.child,o={mode:"hidden",children:o},!(r&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=rh(o,r,0,null),t=bi(t,r,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Mf(n),e.memoizedState=Lf,t):lm(e,o));if(i=t.memoizedState,i!==null&&(a=i.dehydrated,a!==null))return qC(t,e,o,r,a,i,n);if(s){s=r.fallback,o=e.mode,i=t.child,a=i.sibling;var u={mode:"hidden",children:r.children};return!(o&1)&&e.child!==i?(r=e.child,r.childLanes=0,r.pendingProps=u,e.deletions=null):(r=Lr(i,u),r.subtreeFlags=i.subtreeFlags&14680064),a!==null?s=Lr(a,s):(s=bi(s,o,n,null),s.flags|=2),s.return=e,r.return=e,r.sibling=s,e.child=r,r=s,s=e.child,o=t.child.memoizedState,o=o===null?Mf(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=Lf,r}return s=t.child,t=s.sibling,r=Lr(s,{mode:"visible",children:r.children}),!(e.mode&1)&&(r.lanes=n),r.return=e,r.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=r,e.memoizedState=null,r}function lm(t,e){return e=rh({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function pu(t,e,n,r){return r!==null&&Hp(r),Js(e,t.child,null,n),t=lm(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function qC(t,e,n,r,i,s,o){if(n)return e.flags&256?(e.flags&=-257,r=bd(Error(z(422))),pu(t,e,o,r)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=r.fallback,i=e.mode,r=rh({mode:"visible",children:r.children},i,0,null),s=bi(s,i,o,null),s.flags|=2,r.return=e,s.return=e,r.sibling=s,e.child=r,e.mode&1&&Js(e,t.child,null,o),e.child.memoizedState=Mf(o),e.memoizedState=Lf,s);if(!(e.mode&1))return pu(t,e,o,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var a=r.dgst;return r=a,s=Error(z(419)),r=bd(s,r,void 0),pu(t,e,o,r)}if(a=(o&t.childLanes)!==0,bt||a){if(r=rt,r!==null){switch(o&-o){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|o)?0:i,i!==0&&i!==s.retryLane&&(s.retryLane=i,Wn(t,i),un(r,t,i,-1))}return pm(),r=bd(Error(z(421))),pu(t,e,o,r)}return i.data==="$?"?(e.flags|=128,e.child=t.child,e=rk.bind(null,t),i._reactRetry=e,null):(t=s.treeContext,Bt=Nr(i.nextSibling),$t=e,Se=!0,on=null,t!==null&&(Ht[Qt++]=Mn,Ht[Qt++]=Fn,Ht[Qt++]=Li,Mn=t.id,Fn=t.overflow,Li=e),e=lm(e,r.children),e.flags|=4096,e)}function By(t,e,n){t.lanes|=e;var r=t.alternate;r!==null&&(r.lanes|=e),xf(t.return,e,n)}function Nd(t,e,n,r,i){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=r,s.tail=n,s.tailMode=i)}function JI(t,e,n){var r=e.pendingProps,i=r.revealOrder,s=r.tail;if(Rt(t,e,r.children,n),r=Ce.current,r&2)r=r&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&By(t,n,e);else if(t.tag===19)By(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}r&=1}if(_e(Ce,r),!(e.mode&1))e.memoizedState=null;else switch(i){case"forwards":for(n=e.child,i=null;n!==null;)t=n.alternate,t!==null&&gc(t)===null&&(i=n),n=n.sibling;n=i,n===null?(i=e.child,e.child=null):(i=n.sibling,n.sibling=null),Nd(e,!1,i,n,s);break;case"backwards":for(n=null,i=e.child,e.child=null;i!==null;){if(t=i.alternate,t!==null&&gc(t)===null){e.child=i;break}t=i.sibling,i.sibling=n,n=i,i=t}Nd(e,!0,n,null,s);break;case"together":Nd(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Lu(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Hn(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Fi|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(z(153));if(e.child!==null){for(t=e.child,n=Lr(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=Lr(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function GC(t,e,n){switch(e.tag){case 3:HI(e),Qs();break;case 5:II(e);break;case 1:Lt(e.type)&&cc(e);break;case 4:em(e,e.stateNode.containerInfo);break;case 10:var r=e.type._context,i=e.memoizedProps.value;_e(fc,r._currentValue),r._currentValue=i;break;case 13:if(r=e.memoizedState,r!==null)return r.dehydrated!==null?(_e(Ce,Ce.current&1),e.flags|=128,null):n&e.child.childLanes?QI(t,e,n):(_e(Ce,Ce.current&1),t=Hn(t,e,n),t!==null?t.sibling:null);_e(Ce,Ce.current&1);break;case 19:if(r=(n&e.childLanes)!==0,t.flags&128){if(r)return JI(t,e,n);e.flags|=128}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),_e(Ce,Ce.current),r)break;return null;case 22:case 23:return e.lanes=0,KI(t,e,n)}return Hn(t,e,n)}var YI,Ff,XI,ZI;YI=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Ff=function(){};XI=function(t,e,n,r){var i=t.memoizedProps;if(i!==r){t=e.stateNode,Ci(En.current);var s=null;switch(n){case"input":i=of(t,i),r=of(t,r),s=[];break;case"select":i=be({},i,{value:void 0}),r=be({},r,{value:void 0}),s=[];break;case"textarea":i=uf(t,i),r=uf(t,r),s=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(t.onclick=lc)}hf(n,r);var o;n=null;for(c in i)if(!r.hasOwnProperty(c)&&i.hasOwnProperty(c)&&i[c]!=null)if(c==="style"){var a=i[c];for(o in a)a.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Na.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in r){var u=r[c];if(a=i!=null?i[c]:void 0,r.hasOwnProperty(c)&&u!==a&&(u!=null||a!=null))if(c==="style")if(a){for(o in a)!a.hasOwnProperty(o)||u&&u.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in u)u.hasOwnProperty(o)&&a[o]!==u[o]&&(n||(n={}),n[o]=u[o])}else n||(s||(s=[]),s.push(c,n)),n=u;else c==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,a=a?a.__html:void 0,u!=null&&a!==u&&(s=s||[]).push(c,u)):c==="children"?typeof u!="string"&&typeof u!="number"||(s=s||[]).push(c,""+u):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Na.hasOwnProperty(c)?(u!=null&&c==="onScroll"&&we("scroll",t),s||a===u||(s=[])):(s=s||[]).push(c,u))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};ZI=function(t,e,n,r){n!==r&&(e.flags|=4)};function Xo(t,e){if(!Se)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:r.sibling=null}}function gt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,r=0;if(e)for(var i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=t,i=i.sibling;else for(i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=t,i=i.sibling;return t.subtreeFlags|=r,t.childLanes=n,e}function KC(t,e,n){var r=e.pendingProps;switch(Wp(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return gt(e),null;case 1:return Lt(e.type)&&uc(),gt(e),null;case 3:return r=e.stateNode,Ys(),Ie(Ot),Ie(It),nm(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(t===null||t.child===null)&&(du(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,on!==null&&(Kf(on),on=null))),Ff(t,e),gt(e),null;case 5:tm(e);var i=Ci(qa.current);if(n=e.type,t!==null&&e.stateNode!=null)XI(t,e,n,r,i),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!r){if(e.stateNode===null)throw Error(z(166));return gt(e),null}if(t=Ci(En.current),du(e)){r=e.stateNode,n=e.type;var s=e.memoizedProps;switch(r[gn]=e,r[za]=s,t=(e.mode&1)!==0,n){case"dialog":we("cancel",r),we("close",r);break;case"iframe":case"object":case"embed":we("load",r);break;case"video":case"audio":for(i=0;i<ua.length;i++)we(ua[i],r);break;case"source":we("error",r);break;case"img":case"image":case"link":we("error",r),we("load",r);break;case"details":we("toggle",r);break;case"input":Q_(r,s),we("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},we("invalid",r);break;case"textarea":Y_(r,s),we("invalid",r)}hf(n,s),i=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?r.textContent!==a&&(s.suppressHydrationWarning!==!0&&hu(r.textContent,a,t),i=["children",a]):typeof a=="number"&&r.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&hu(r.textContent,a,t),i=["children",""+a]):Na.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&we("scroll",r)}switch(n){case"input":ru(r),J_(r,s,!0);break;case"textarea":ru(r),X_(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=lc)}r=i,e.updateQueue=r,r!==null&&(e.flags|=4)}else{o=i.nodeType===9?i:i.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=PE(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof r.is=="string"?t=o.createElement(n,{is:r.is}):(t=o.createElement(n),n==="select"&&(o=t,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):t=o.createElementNS(t,n),t[gn]=e,t[za]=r,YI(t,e,!1,!1),e.stateNode=t;e:{switch(o=df(n,r),n){case"dialog":we("cancel",t),we("close",t),i=r;break;case"iframe":case"object":case"embed":we("load",t),i=r;break;case"video":case"audio":for(i=0;i<ua.length;i++)we(ua[i],t);i=r;break;case"source":we("error",t),i=r;break;case"img":case"image":case"link":we("error",t),we("load",t),i=r;break;case"details":we("toggle",t),i=r;break;case"input":Q_(t,r),i=of(t,r),we("invalid",t);break;case"option":i=r;break;case"select":t._wrapperState={wasMultiple:!!r.multiple},i=be({},r,{value:void 0}),we("invalid",t);break;case"textarea":Y_(t,r),i=uf(t,r),we("invalid",t);break;default:i=r}hf(n,i),a=i;for(s in a)if(a.hasOwnProperty(s)){var u=a[s];s==="style"?xE(t,u):s==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&CE(t,u)):s==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&Da(t,u):typeof u=="number"&&Da(t,""+u):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Na.hasOwnProperty(s)?u!=null&&s==="onScroll"&&we("scroll",t):u!=null&&Np(t,s,u,o))}switch(n){case"input":ru(t),J_(t,r,!1);break;case"textarea":ru(t),X_(t);break;case"option":r.value!=null&&t.setAttribute("value",""+Br(r.value));break;case"select":t.multiple=!!r.multiple,s=r.value,s!=null?Ls(t,!!r.multiple,s,!1):r.defaultValue!=null&&Ls(t,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(t.onclick=lc)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return gt(e),null;case 6:if(t&&e.stateNode!=null)ZI(t,e,t.memoizedProps,r);else{if(typeof r!="string"&&e.stateNode===null)throw Error(z(166));if(n=Ci(qa.current),Ci(En.current),du(e)){if(r=e.stateNode,n=e.memoizedProps,r[gn]=e,(s=r.nodeValue!==n)&&(t=$t,t!==null))switch(t.tag){case 3:hu(r.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&hu(r.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[gn]=e,e.stateNode=r}return gt(e),null;case 13:if(Ie(Ce),r=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(Se&&Bt!==null&&e.mode&1&&!(e.flags&128))_I(),Qs(),e.flags|=98560,s=!1;else if(s=du(e),r!==null&&r.dehydrated!==null){if(t===null){if(!s)throw Error(z(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(z(317));s[gn]=e}else Qs(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;gt(e),s=!1}else on!==null&&(Kf(on),on=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(r=r!==null,r!==(t!==null&&t.memoizedState!==null)&&r&&(e.child.flags|=8192,e.mode&1&&(t===null||Ce.current&1?Je===0&&(Je=3):pm())),e.updateQueue!==null&&(e.flags|=4),gt(e),null);case 4:return Ys(),Ff(t,e),t===null&&Ba(e.stateNode.containerInfo),gt(e),null;case 10:return Yp(e.type._context),gt(e),null;case 17:return Lt(e.type)&&uc(),gt(e),null;case 19:if(Ie(Ce),s=e.memoizedState,s===null)return gt(e),null;if(r=(e.flags&128)!==0,o=s.rendering,o===null)if(r)Xo(s,!1);else{if(Je!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=gc(t),o!==null){for(e.flags|=128,Xo(s,!1),r=o.updateQueue,r!==null&&(e.updateQueue=r,e.flags|=4),e.subtreeFlags=0,r=n,n=e.child;n!==null;)s=n,t=r,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return _e(Ce,Ce.current&1|2),e.child}t=t.sibling}s.tail!==null&&je()>Zs&&(e.flags|=128,r=!0,Xo(s,!1),e.lanes=4194304)}else{if(!r)if(t=gc(o),t!==null){if(e.flags|=128,r=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),Xo(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!Se)return gt(e),null}else 2*je()-s.renderingStartTime>Zs&&n!==1073741824&&(e.flags|=128,r=!0,Xo(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=je(),e.sibling=null,n=Ce.current,_e(Ce,r?n&1|2:n&1),e):(gt(e),null);case 22:case 23:return fm(),r=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==r&&(e.flags|=8192),r&&e.mode&1?Ut&1073741824&&(gt(e),e.subtreeFlags&6&&(e.flags|=8192)):gt(e),null;case 24:return null;case 25:return null}throw Error(z(156,e.tag))}function WC(t,e){switch(Wp(e),e.tag){case 1:return Lt(e.type)&&uc(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Ys(),Ie(Ot),Ie(It),nm(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return tm(e),null;case 13:if(Ie(Ce),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(z(340));Qs()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return Ie(Ce),null;case 4:return Ys(),null;case 10:return Yp(e.type._context),null;case 22:case 23:return fm(),null;case 24:return null;default:return null}}var mu=!1,vt=!1,HC=typeof WeakSet=="function"?WeakSet:Set,H=null;function Ds(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Le(t,e,r)}else n.current=null}function Uf(t,e,n){try{n()}catch(r){Le(t,e,r)}}var jy=!1;function QC(t,e){if(If=sc,t=iI(),Gp(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,a=-1,u=-1,c=0,d=0,f=t,m=null;t:for(;;){for(var v;f!==n||i!==0&&f.nodeType!==3||(a=o+i),f!==s||r!==0&&f.nodeType!==3||(u=o+r),f.nodeType===3&&(o+=f.nodeValue.length),(v=f.firstChild)!==null;)m=f,f=v;for(;;){if(f===t)break t;if(m===n&&++c===i&&(a=o),m===s&&++d===r&&(u=o),(v=f.nextSibling)!==null)break;f=m,m=f.parentNode}f=v}n=a===-1||u===-1?null:{start:a,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(Tf={focusedElem:t,selectionRange:n},sc=!1,H=e;H!==null;)if(e=H,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,H=t;else for(;H!==null;){e=H;try{var S=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(S!==null){var P=S.memoizedProps,C=S.memoizedState,w=e.stateNode,y=w.getSnapshotBeforeUpdate(e.elementType===e.type?P:rn(e.type,P),C);w.__reactInternalSnapshotBeforeUpdate=y}break;case 3:var E=e.stateNode.containerInfo;E.nodeType===1?E.textContent="":E.nodeType===9&&E.documentElement&&E.removeChild(E.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(z(163))}}catch(x){Le(e,e.return,x)}if(t=e.sibling,t!==null){t.return=e.return,H=t;break}H=e.return}return S=jy,jy=!1,S}function Ia(t,e,n){var r=e.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&t)===t){var s=i.destroy;i.destroy=void 0,s!==void 0&&Uf(e,n,s)}i=i.next}while(i!==r)}}function th(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var r=n.create;n.destroy=r()}n=n.next}while(n!==e)}}function Bf(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function eT(t){var e=t.alternate;e!==null&&(t.alternate=null,eT(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[gn],delete e[za],delete e[Rf],delete e[bC],delete e[NC])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function tT(t){return t.tag===5||t.tag===3||t.tag===4}function zy(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||tT(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function jf(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=lc));else if(r!==4&&(t=t.child,t!==null))for(jf(t,e,n),t=t.sibling;t!==null;)jf(t,e,n),t=t.sibling}function zf(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(r!==4&&(t=t.child,t!==null))for(zf(t,e,n),t=t.sibling;t!==null;)zf(t,e,n),t=t.sibling}var ot=null,sn=!1;function lr(t,e,n){for(n=n.child;n!==null;)nT(t,e,n),n=n.sibling}function nT(t,e,n){if(wn&&typeof wn.onCommitFiberUnmount=="function")try{wn.onCommitFiberUnmount(Wc,n)}catch{}switch(n.tag){case 5:vt||Ds(n,e);case 6:var r=ot,i=sn;ot=null,lr(t,e,n),ot=r,sn=i,ot!==null&&(sn?(t=ot,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):ot.removeChild(n.stateNode));break;case 18:ot!==null&&(sn?(t=ot,n=n.stateNode,t.nodeType===8?Ad(t.parentNode,n):t.nodeType===1&&Ad(t,n),Ma(t)):Ad(ot,n.stateNode));break;case 4:r=ot,i=sn,ot=n.stateNode.containerInfo,sn=!0,lr(t,e,n),ot=r,sn=i;break;case 0:case 11:case 14:case 15:if(!vt&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var s=i,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&Uf(n,e,o),i=i.next}while(i!==r)}lr(t,e,n);break;case 1:if(!vt&&(Ds(n,e),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(a){Le(n,e,a)}lr(t,e,n);break;case 21:lr(t,e,n);break;case 22:n.mode&1?(vt=(r=vt)||n.memoizedState!==null,lr(t,e,n),vt=r):lr(t,e,n);break;default:lr(t,e,n)}}function $y(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new HC),e.forEach(function(r){var i=ik.bind(null,t,r);n.has(r)||(n.add(r),r.then(i,i))})}}function nn(t,e){var n=e.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];try{var s=t,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:ot=a.stateNode,sn=!1;break e;case 3:ot=a.stateNode.containerInfo,sn=!0;break e;case 4:ot=a.stateNode.containerInfo,sn=!0;break e}a=a.return}if(ot===null)throw Error(z(160));nT(s,o,i),ot=null,sn=!1;var u=i.alternate;u!==null&&(u.return=null),i.return=null}catch(c){Le(i,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)rT(e,t),e=e.sibling}function rT(t,e){var n=t.alternate,r=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(nn(e,t),pn(t),r&4){try{Ia(3,t,t.return),th(3,t)}catch(P){Le(t,t.return,P)}try{Ia(5,t,t.return)}catch(P){Le(t,t.return,P)}}break;case 1:nn(e,t),pn(t),r&512&&n!==null&&Ds(n,n.return);break;case 5:if(nn(e,t),pn(t),r&512&&n!==null&&Ds(n,n.return),t.flags&32){var i=t.stateNode;try{Da(i,"")}catch(P){Le(t,t.return,P)}}if(r&4&&(i=t.stateNode,i!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,a=t.type,u=t.updateQueue;if(t.updateQueue=null,u!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&AE(i,s),df(a,o);var c=df(a,s);for(o=0;o<u.length;o+=2){var d=u[o],f=u[o+1];d==="style"?xE(i,f):d==="dangerouslySetInnerHTML"?CE(i,f):d==="children"?Da(i,f):Np(i,d,f,c)}switch(a){case"input":af(i,s);break;case"textarea":RE(i,s);break;case"select":var m=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!s.multiple;var v=s.value;v!=null?Ls(i,!!s.multiple,v,!1):m!==!!s.multiple&&(s.defaultValue!=null?Ls(i,!!s.multiple,s.defaultValue,!0):Ls(i,!!s.multiple,s.multiple?[]:"",!1))}i[za]=s}catch(P){Le(t,t.return,P)}}break;case 6:if(nn(e,t),pn(t),r&4){if(t.stateNode===null)throw Error(z(162));i=t.stateNode,s=t.memoizedProps;try{i.nodeValue=s}catch(P){Le(t,t.return,P)}}break;case 3:if(nn(e,t),pn(t),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Ma(e.containerInfo)}catch(P){Le(t,t.return,P)}break;case 4:nn(e,t),pn(t);break;case 13:nn(e,t),pn(t),i=t.child,i.flags&8192&&(s=i.memoizedState!==null,i.stateNode.isHidden=s,!s||i.alternate!==null&&i.alternate.memoizedState!==null||(hm=je())),r&4&&$y(t);break;case 22:if(d=n!==null&&n.memoizedState!==null,t.mode&1?(vt=(c=vt)||d,nn(e,t),vt=c):nn(e,t),pn(t),r&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!d&&t.mode&1)for(H=t,d=t.child;d!==null;){for(f=H=d;H!==null;){switch(m=H,v=m.child,m.tag){case 0:case 11:case 14:case 15:Ia(4,m,m.return);break;case 1:Ds(m,m.return);var S=m.stateNode;if(typeof S.componentWillUnmount=="function"){r=m,n=m.return;try{e=r,S.props=e.memoizedProps,S.state=e.memoizedState,S.componentWillUnmount()}catch(P){Le(r,n,P)}}break;case 5:Ds(m,m.return);break;case 22:if(m.memoizedState!==null){Gy(f);continue}}v!==null?(v.return=m,H=v):Gy(f)}d=d.sibling}e:for(d=null,f=t;;){if(f.tag===5){if(d===null){d=f;try{i=f.stateNode,c?(s=i.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=f.stateNode,u=f.memoizedProps.style,o=u!=null&&u.hasOwnProperty("display")?u.display:null,a.style.display=kE("display",o))}catch(P){Le(t,t.return,P)}}}else if(f.tag===6){if(d===null)try{f.stateNode.nodeValue=c?"":f.memoizedProps}catch(P){Le(t,t.return,P)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===t)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===t)break e;for(;f.sibling===null;){if(f.return===null||f.return===t)break e;d===f&&(d=null),f=f.return}d===f&&(d=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:nn(e,t),pn(t),r&4&&$y(t);break;case 21:break;default:nn(e,t),pn(t)}}function pn(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(tT(n)){var r=n;break e}n=n.return}throw Error(z(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(Da(i,""),r.flags&=-33);var s=zy(t);zf(t,s,i);break;case 3:case 4:var o=r.stateNode.containerInfo,a=zy(t);jf(t,a,o);break;default:throw Error(z(161))}}catch(u){Le(t,t.return,u)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function JC(t,e,n){H=t,iT(t)}function iT(t,e,n){for(var r=(t.mode&1)!==0;H!==null;){var i=H,s=i.child;if(i.tag===22&&r){var o=i.memoizedState!==null||mu;if(!o){var a=i.alternate,u=a!==null&&a.memoizedState!==null||vt;a=mu;var c=vt;if(mu=o,(vt=u)&&!c)for(H=i;H!==null;)o=H,u=o.child,o.tag===22&&o.memoizedState!==null?Ky(i):u!==null?(u.return=o,H=u):Ky(i);for(;s!==null;)H=s,iT(s),s=s.sibling;H=i,mu=a,vt=c}qy(t)}else i.subtreeFlags&8772&&s!==null?(s.return=i,H=s):qy(t)}}function qy(t){for(;H!==null;){var e=H;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:vt||th(5,e);break;case 1:var r=e.stateNode;if(e.flags&4&&!vt)if(n===null)r.componentDidMount();else{var i=e.elementType===e.type?n.memoizedProps:rn(e.type,n.memoizedProps);r.componentDidUpdate(i,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Cy(e,s,r);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}Cy(e,o,n)}break;case 5:var a=e.stateNode;if(n===null&&e.flags&4){n=a;var u=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var d=c.memoizedState;if(d!==null){var f=d.dehydrated;f!==null&&Ma(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(z(163))}vt||e.flags&512&&Bf(e)}catch(m){Le(e,e.return,m)}}if(e===t){H=null;break}if(n=e.sibling,n!==null){n.return=e.return,H=n;break}H=e.return}}function Gy(t){for(;H!==null;){var e=H;if(e===t){H=null;break}var n=e.sibling;if(n!==null){n.return=e.return,H=n;break}H=e.return}}function Ky(t){for(;H!==null;){var e=H;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{th(4,e)}catch(u){Le(e,n,u)}break;case 1:var r=e.stateNode;if(typeof r.componentDidMount=="function"){var i=e.return;try{r.componentDidMount()}catch(u){Le(e,i,u)}}var s=e.return;try{Bf(e)}catch(u){Le(e,s,u)}break;case 5:var o=e.return;try{Bf(e)}catch(u){Le(e,o,u)}}}catch(u){Le(e,e.return,u)}if(e===t){H=null;break}var a=e.sibling;if(a!==null){a.return=e.return,H=a;break}H=e.return}}var YC=Math.ceil,vc=Zn.ReactCurrentDispatcher,um=Zn.ReactCurrentOwner,Yt=Zn.ReactCurrentBatchConfig,le=0,rt=null,He=null,ut=0,Ut=0,Vs=Zr(0),Je=0,Ha=null,Fi=0,nh=0,cm=0,Ta=null,xt=null,hm=0,Zs=1/0,On=null,wc=!1,$f=null,Vr=null,gu=!1,Rr=null,Ec=0,Sa=0,qf=null,Mu=-1,Fu=0;function Pt(){return le&6?je():Mu!==-1?Mu:Mu=je()}function Or(t){return t.mode&1?le&2&&ut!==0?ut&-ut:VC.transition!==null?(Fu===0&&(Fu=zE()),Fu):(t=de,t!==0||(t=window.event,t=t===void 0?16:QE(t.type)),t):1}function un(t,e,n,r){if(50<Sa)throw Sa=0,qf=null,Error(z(185));fl(t,n,r),(!(le&2)||t!==rt)&&(t===rt&&(!(le&2)&&(nh|=n),Je===4&&gr(t,ut)),Mt(t,r),n===1&&le===0&&!(e.mode&1)&&(Zs=je()+500,Xc&&ei()))}function Mt(t,e){var n=t.callbackNode;VP(t,e);var r=ic(t,t===rt?ut:0);if(r===0)n!==null&&ty(n),t.callbackNode=null,t.callbackPriority=0;else if(e=r&-r,t.callbackPriority!==e){if(n!=null&&ty(n),e===1)t.tag===0?DC(Wy.bind(null,t)):pI(Wy.bind(null,t)),kC(function(){!(le&6)&&ei()}),n=null;else{switch($E(r)){case 1:n=Mp;break;case 4:n=BE;break;case 16:n=rc;break;case 536870912:n=jE;break;default:n=rc}n=dT(n,sT.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function sT(t,e){if(Mu=-1,Fu=0,le&6)throw Error(z(327));var n=t.callbackNode;if(js()&&t.callbackNode!==n)return null;var r=ic(t,t===rt?ut:0);if(r===0)return null;if(r&30||r&t.expiredLanes||e)e=Ic(t,r);else{e=r;var i=le;le|=2;var s=aT();(rt!==t||ut!==e)&&(On=null,Zs=je()+500,xi(t,e));do try{ek();break}catch(a){oT(t,a)}while(!0);Jp(),vc.current=s,le=i,He!==null?e=0:(rt=null,ut=0,e=Je)}if(e!==0){if(e===2&&(i=_f(t),i!==0&&(r=i,e=Gf(t,i))),e===1)throw n=Ha,xi(t,0),gr(t,r),Mt(t,je()),n;if(e===6)gr(t,r);else{if(i=t.current.alternate,!(r&30)&&!XC(i)&&(e=Ic(t,r),e===2&&(s=_f(t),s!==0&&(r=s,e=Gf(t,s))),e===1))throw n=Ha,xi(t,0),gr(t,r),Mt(t,je()),n;switch(t.finishedWork=i,t.finishedLanes=r,e){case 0:case 1:throw Error(z(345));case 2:vi(t,xt,On);break;case 3:if(gr(t,r),(r&130023424)===r&&(e=hm+500-je(),10<e)){if(ic(t,0)!==0)break;if(i=t.suspendedLanes,(i&r)!==r){Pt(),t.pingedLanes|=t.suspendedLanes&i;break}t.timeoutHandle=Af(vi.bind(null,t,xt,On),e);break}vi(t,xt,On);break;case 4:if(gr(t,r),(r&4194240)===r)break;for(e=t.eventTimes,i=-1;0<r;){var o=31-ln(r);s=1<<o,o=e[o],o>i&&(i=o),r&=~s}if(r=i,r=je()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*YC(r/1960))-r,10<r){t.timeoutHandle=Af(vi.bind(null,t,xt,On),r);break}vi(t,xt,On);break;case 5:vi(t,xt,On);break;default:throw Error(z(329))}}}return Mt(t,je()),t.callbackNode===n?sT.bind(null,t):null}function Gf(t,e){var n=Ta;return t.current.memoizedState.isDehydrated&&(xi(t,e).flags|=256),t=Ic(t,e),t!==2&&(e=xt,xt=n,e!==null&&Kf(e)),t}function Kf(t){xt===null?xt=t:xt.push.apply(xt,t)}function XC(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var i=n[r],s=i.getSnapshot;i=i.value;try{if(!hn(s(),i))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function gr(t,e){for(e&=~cm,e&=~nh,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-ln(e),r=1<<n;t[n]=-1,e&=~r}}function Wy(t){if(le&6)throw Error(z(327));js();var e=ic(t,0);if(!(e&1))return Mt(t,je()),null;var n=Ic(t,e);if(t.tag!==0&&n===2){var r=_f(t);r!==0&&(e=r,n=Gf(t,r))}if(n===1)throw n=Ha,xi(t,0),gr(t,e),Mt(t,je()),n;if(n===6)throw Error(z(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,vi(t,xt,On),Mt(t,je()),null}function dm(t,e){var n=le;le|=1;try{return t(e)}finally{le=n,le===0&&(Zs=je()+500,Xc&&ei())}}function Ui(t){Rr!==null&&Rr.tag===0&&!(le&6)&&js();var e=le;le|=1;var n=Yt.transition,r=de;try{if(Yt.transition=null,de=1,t)return t()}finally{de=r,Yt.transition=n,le=e,!(le&6)&&ei()}}function fm(){Ut=Vs.current,Ie(Vs)}function xi(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,CC(n)),He!==null)for(n=He.return;n!==null;){var r=n;switch(Wp(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&uc();break;case 3:Ys(),Ie(Ot),Ie(It),nm();break;case 5:tm(r);break;case 4:Ys();break;case 13:Ie(Ce);break;case 19:Ie(Ce);break;case 10:Yp(r.type._context);break;case 22:case 23:fm()}n=n.return}if(rt=t,He=t=Lr(t.current,null),ut=Ut=e,Je=0,Ha=null,cm=nh=Fi=0,xt=Ta=null,Pi!==null){for(e=0;e<Pi.length;e++)if(n=Pi[e],r=n.interleaved,r!==null){n.interleaved=null;var i=r.next,s=n.pending;if(s!==null){var o=s.next;s.next=i,r.next=o}n.pending=r}Pi=null}return t}function oT(t,e){do{var n=He;try{if(Jp(),Vu.current=yc,_c){for(var r=ke.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}_c=!1}if(Mi=0,tt=Qe=ke=null,Ea=!1,Ga=0,um.current=null,n===null||n.return===null){Je=1,Ha=e,He=null;break}e:{var s=t,o=n.return,a=n,u=e;if(e=ut,a.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var c=u,d=a,f=d.tag;if(!(d.mode&1)&&(f===0||f===11||f===15)){var m=d.alternate;m?(d.updateQueue=m.updateQueue,d.memoizedState=m.memoizedState,d.lanes=m.lanes):(d.updateQueue=null,d.memoizedState=null)}var v=Vy(o);if(v!==null){v.flags&=-257,Oy(v,o,a,s,e),v.mode&1&&Dy(s,c,e),e=v,u=c;var S=e.updateQueue;if(S===null){var P=new Set;P.add(u),e.updateQueue=P}else S.add(u);break e}else{if(!(e&1)){Dy(s,c,e),pm();break e}u=Error(z(426))}}else if(Se&&a.mode&1){var C=Vy(o);if(C!==null){!(C.flags&65536)&&(C.flags|=256),Oy(C,o,a,s,e),Hp(Xs(u,a));break e}}s=u=Xs(u,a),Je!==4&&(Je=2),Ta===null?Ta=[s]:Ta.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var w=$I(s,u,e);Py(s,w);break e;case 1:a=u;var y=s.type,E=s.stateNode;if(!(s.flags&128)&&(typeof y.getDerivedStateFromError=="function"||E!==null&&typeof E.componentDidCatch=="function"&&(Vr===null||!Vr.has(E)))){s.flags|=65536,e&=-e,s.lanes|=e;var x=qI(s,a,e);Py(s,x);break e}}s=s.return}while(s!==null)}uT(n)}catch(M){e=M,He===n&&n!==null&&(He=n=n.return);continue}break}while(!0)}function aT(){var t=vc.current;return vc.current=yc,t===null?yc:t}function pm(){(Je===0||Je===3||Je===2)&&(Je=4),rt===null||!(Fi&268435455)&&!(nh&268435455)||gr(rt,ut)}function Ic(t,e){var n=le;le|=2;var r=aT();(rt!==t||ut!==e)&&(On=null,xi(t,e));do try{ZC();break}catch(i){oT(t,i)}while(!0);if(Jp(),le=n,vc.current=r,He!==null)throw Error(z(261));return rt=null,ut=0,Je}function ZC(){for(;He!==null;)lT(He)}function ek(){for(;He!==null&&!AP();)lT(He)}function lT(t){var e=hT(t.alternate,t,Ut);t.memoizedProps=t.pendingProps,e===null?uT(t):He=e,um.current=null}function uT(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=WC(n,e),n!==null){n.flags&=32767,He=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Je=6,He=null;return}}else if(n=KC(n,e,Ut),n!==null){He=n;return}if(e=e.sibling,e!==null){He=e;return}He=e=t}while(e!==null);Je===0&&(Je=5)}function vi(t,e,n){var r=de,i=Yt.transition;try{Yt.transition=null,de=1,tk(t,e,n,r)}finally{Yt.transition=i,de=r}return null}function tk(t,e,n,r){do js();while(Rr!==null);if(le&6)throw Error(z(327));n=t.finishedWork;var i=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(z(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(OP(t,s),t===rt&&(He=rt=null,ut=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||gu||(gu=!0,dT(rc,function(){return js(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Yt.transition,Yt.transition=null;var o=de;de=1;var a=le;le|=4,um.current=null,QC(t,n),rT(n,t),EC(Tf),sc=!!If,Tf=If=null,t.current=n,JC(n),RP(),le=a,de=o,Yt.transition=s}else t.current=n;if(gu&&(gu=!1,Rr=t,Ec=i),s=t.pendingLanes,s===0&&(Vr=null),kP(n.stateNode),Mt(t,je()),e!==null)for(r=t.onRecoverableError,n=0;n<e.length;n++)i=e[n],r(i.value,{componentStack:i.stack,digest:i.digest});if(wc)throw wc=!1,t=$f,$f=null,t;return Ec&1&&t.tag!==0&&js(),s=t.pendingLanes,s&1?t===qf?Sa++:(Sa=0,qf=t):Sa=0,ei(),null}function js(){if(Rr!==null){var t=$E(Ec),e=Yt.transition,n=de;try{if(Yt.transition=null,de=16>t?16:t,Rr===null)var r=!1;else{if(t=Rr,Rr=null,Ec=0,le&6)throw Error(z(331));var i=le;for(le|=4,H=t.current;H!==null;){var s=H,o=s.child;if(H.flags&16){var a=s.deletions;if(a!==null){for(var u=0;u<a.length;u++){var c=a[u];for(H=c;H!==null;){var d=H;switch(d.tag){case 0:case 11:case 15:Ia(8,d,s)}var f=d.child;if(f!==null)f.return=d,H=f;else for(;H!==null;){d=H;var m=d.sibling,v=d.return;if(eT(d),d===c){H=null;break}if(m!==null){m.return=v,H=m;break}H=v}}}var S=s.alternate;if(S!==null){var P=S.child;if(P!==null){S.child=null;do{var C=P.sibling;P.sibling=null,P=C}while(P!==null)}}H=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,H=o;else e:for(;H!==null;){if(s=H,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Ia(9,s,s.return)}var w=s.sibling;if(w!==null){w.return=s.return,H=w;break e}H=s.return}}var y=t.current;for(H=y;H!==null;){o=H;var E=o.child;if(o.subtreeFlags&2064&&E!==null)E.return=o,H=E;else e:for(o=y;H!==null;){if(a=H,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:th(9,a)}}catch(M){Le(a,a.return,M)}if(a===o){H=null;break e}var x=a.sibling;if(x!==null){x.return=a.return,H=x;break e}H=a.return}}if(le=i,ei(),wn&&typeof wn.onPostCommitFiberRoot=="function")try{wn.onPostCommitFiberRoot(Wc,t)}catch{}r=!0}return r}finally{de=n,Yt.transition=e}}return!1}function Hy(t,e,n){e=Xs(n,e),e=$I(t,e,1),t=Dr(t,e,1),e=Pt(),t!==null&&(fl(t,1,e),Mt(t,e))}function Le(t,e,n){if(t.tag===3)Hy(t,t,n);else for(;e!==null;){if(e.tag===3){Hy(e,t,n);break}else if(e.tag===1){var r=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Vr===null||!Vr.has(r))){t=Xs(n,t),t=qI(e,t,1),e=Dr(e,t,1),t=Pt(),e!==null&&(fl(e,1,t),Mt(e,t));break}}e=e.return}}function nk(t,e,n){var r=t.pingCache;r!==null&&r.delete(e),e=Pt(),t.pingedLanes|=t.suspendedLanes&n,rt===t&&(ut&n)===n&&(Je===4||Je===3&&(ut&130023424)===ut&&500>je()-hm?xi(t,0):cm|=n),Mt(t,e)}function cT(t,e){e===0&&(t.mode&1?(e=ou,ou<<=1,!(ou&130023424)&&(ou=4194304)):e=1);var n=Pt();t=Wn(t,e),t!==null&&(fl(t,e,n),Mt(t,n))}function rk(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),cT(t,n)}function ik(t,e){var n=0;switch(t.tag){case 13:var r=t.stateNode,i=t.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=t.stateNode;break;default:throw Error(z(314))}r!==null&&r.delete(e),cT(t,n)}var hT;hT=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||Ot.current)bt=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return bt=!1,GC(t,e,n);bt=!!(t.flags&131072)}else bt=!1,Se&&e.flags&1048576&&mI(e,dc,e.index);switch(e.lanes=0,e.tag){case 2:var r=e.type;Lu(t,e),t=e.pendingProps;var i=Hs(e,It.current);Bs(e,n),i=im(null,e,r,t,i,n);var s=sm();return e.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,Lt(r)?(s=!0,cc(e)):s=!1,e.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,Zp(e),i.updater=eh,e.stateNode=i,i._reactInternals=e,Nf(e,r,t,n),e=Of(null,e,r,!0,s,n)):(e.tag=0,Se&&s&&Kp(e),Rt(null,e,i,n),e=e.child),e;case 16:r=e.elementType;e:{switch(Lu(t,e),t=e.pendingProps,i=r._init,r=i(r._payload),e.type=r,i=e.tag=ok(r),t=rn(r,t),i){case 0:e=Vf(null,e,r,t,n);break e;case 1:e=Fy(null,e,r,t,n);break e;case 11:e=Ly(null,e,r,t,n);break e;case 14:e=My(null,e,r,rn(r.type,t),n);break e}throw Error(z(306,r,""))}return e;case 0:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:rn(r,i),Vf(t,e,r,i,n);case 1:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:rn(r,i),Fy(t,e,r,i,n);case 3:e:{if(HI(e),t===null)throw Error(z(387));r=e.pendingProps,s=e.memoizedState,i=s.element,EI(t,e),mc(e,r,null,n);var o=e.memoizedState;if(r=o.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){i=Xs(Error(z(423)),e),e=Uy(t,e,r,n,i);break e}else if(r!==i){i=Xs(Error(z(424)),e),e=Uy(t,e,r,n,i);break e}else for(Bt=Nr(e.stateNode.containerInfo.firstChild),$t=e,Se=!0,on=null,n=vI(e,null,r,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Qs(),r===i){e=Hn(t,e,n);break e}Rt(t,e,r,n)}e=e.child}return e;case 5:return II(e),t===null&&kf(e),r=e.type,i=e.pendingProps,s=t!==null?t.memoizedProps:null,o=i.children,Sf(r,i)?o=null:s!==null&&Sf(r,s)&&(e.flags|=32),WI(t,e),Rt(t,e,o,n),e.child;case 6:return t===null&&kf(e),null;case 13:return QI(t,e,n);case 4:return em(e,e.stateNode.containerInfo),r=e.pendingProps,t===null?e.child=Js(e,null,r,n):Rt(t,e,r,n),e.child;case 11:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:rn(r,i),Ly(t,e,r,i,n);case 7:return Rt(t,e,e.pendingProps,n),e.child;case 8:return Rt(t,e,e.pendingProps.children,n),e.child;case 12:return Rt(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(r=e.type._context,i=e.pendingProps,s=e.memoizedProps,o=i.value,_e(fc,r._currentValue),r._currentValue=o,s!==null)if(hn(s.value,o)){if(s.children===i.children&&!Ot.current){e=Hn(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var u=a.firstContext;u!==null;){if(u.context===r){if(s.tag===1){u=$n(-1,n&-n),u.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var d=c.pending;d===null?u.next=u:(u.next=d.next,d.next=u),c.pending=u}}s.lanes|=n,u=s.alternate,u!==null&&(u.lanes|=n),xf(s.return,n,e),a.lanes|=n;break}u=u.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(z(341));o.lanes|=n,a=o.alternate,a!==null&&(a.lanes|=n),xf(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}Rt(t,e,i.children,n),e=e.child}return e;case 9:return i=e.type,r=e.pendingProps.children,Bs(e,n),i=Xt(i),r=r(i),e.flags|=1,Rt(t,e,r,n),e.child;case 14:return r=e.type,i=rn(r,e.pendingProps),i=rn(r.type,i),My(t,e,r,i,n);case 15:return GI(t,e,e.type,e.pendingProps,n);case 17:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:rn(r,i),Lu(t,e),e.tag=1,Lt(r)?(t=!0,cc(e)):t=!1,Bs(e,n),zI(e,r,i),Nf(e,r,i,n),Of(null,e,r,!0,t,n);case 19:return JI(t,e,n);case 22:return KI(t,e,n)}throw Error(z(156,e.tag))};function dT(t,e){return UE(t,e)}function sk(t,e,n,r){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Jt(t,e,n,r){return new sk(t,e,n,r)}function mm(t){return t=t.prototype,!(!t||!t.isReactComponent)}function ok(t){if(typeof t=="function")return mm(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Vp)return 11;if(t===Op)return 14}return 2}function Lr(t,e){var n=t.alternate;return n===null?(n=Jt(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Uu(t,e,n,r,i,s){var o=2;if(r=t,typeof t=="function")mm(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case Ss:return bi(n.children,i,s,e);case Dp:o=8,i|=8;break;case tf:return t=Jt(12,n,e,i|2),t.elementType=tf,t.lanes=s,t;case nf:return t=Jt(13,n,e,i),t.elementType=nf,t.lanes=s,t;case rf:return t=Jt(19,n,e,i),t.elementType=rf,t.lanes=s,t;case IE:return rh(n,i,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case wE:o=10;break e;case EE:o=9;break e;case Vp:o=11;break e;case Op:o=14;break e;case fr:o=16,r=null;break e}throw Error(z(130,t==null?t:typeof t,""))}return e=Jt(o,n,e,i),e.elementType=t,e.type=r,e.lanes=s,e}function bi(t,e,n,r){return t=Jt(7,t,r,e),t.lanes=n,t}function rh(t,e,n,r){return t=Jt(22,t,r,e),t.elementType=IE,t.lanes=n,t.stateNode={isHidden:!1},t}function Dd(t,e,n){return t=Jt(6,t,null,e),t.lanes=n,t}function Vd(t,e,n){return e=Jt(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function ak(t,e,n,r,i){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=pd(0),this.expirationTimes=pd(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=pd(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function gm(t,e,n,r,i,s,o,a,u){return t=new ak(t,e,n,a,u),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Jt(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Zp(s),t}function lk(t,e,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Ts,key:r==null?null:""+r,children:t,containerInfo:e,implementation:n}}function fT(t){if(!t)return jr;t=t._reactInternals;e:{if(es(t)!==t||t.tag!==1)throw Error(z(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(Lt(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(z(171))}if(t.tag===1){var n=t.type;if(Lt(n))return fI(t,n,e)}return e}function pT(t,e,n,r,i,s,o,a,u){return t=gm(n,r,!0,t,i,s,o,a,u),t.context=fT(null),n=t.current,r=Pt(),i=Or(n),s=$n(r,i),s.callback=e??null,Dr(n,s,i),t.current.lanes=i,fl(t,i,r),Mt(t,r),t}function ih(t,e,n,r){var i=e.current,s=Pt(),o=Or(i);return n=fT(n),e.context===null?e.context=n:e.pendingContext=n,e=$n(s,o),e.payload={element:t},r=r===void 0?null:r,r!==null&&(e.callback=r),t=Dr(i,e,o),t!==null&&(un(t,i,o,s),Du(t,i,o)),o}function Tc(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Qy(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function _m(t,e){Qy(t,e),(t=t.alternate)&&Qy(t,e)}function uk(){return null}var mT=typeof reportError=="function"?reportError:function(t){console.error(t)};function ym(t){this._internalRoot=t}sh.prototype.render=ym.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(z(409));ih(t,e,null,null)};sh.prototype.unmount=ym.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Ui(function(){ih(null,t,null,null)}),e[Kn]=null}};function sh(t){this._internalRoot=t}sh.prototype.unstable_scheduleHydration=function(t){if(t){var e=KE();t={blockedOn:null,target:t,priority:e};for(var n=0;n<mr.length&&e!==0&&e<mr[n].priority;n++);mr.splice(n,0,t),n===0&&HE(t)}};function vm(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function oh(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Jy(){}function ck(t,e,n,r,i){if(i){if(typeof r=="function"){var s=r;r=function(){var c=Tc(o);s.call(c)}}var o=pT(e,r,t,0,null,!1,!1,"",Jy);return t._reactRootContainer=o,t[Kn]=o.current,Ba(t.nodeType===8?t.parentNode:t),Ui(),o}for(;i=t.lastChild;)t.removeChild(i);if(typeof r=="function"){var a=r;r=function(){var c=Tc(u);a.call(c)}}var u=gm(t,0,!1,null,null,!1,!1,"",Jy);return t._reactRootContainer=u,t[Kn]=u.current,Ba(t.nodeType===8?t.parentNode:t),Ui(function(){ih(e,u,n,r)}),u}function ah(t,e,n,r,i){var s=n._reactRootContainer;if(s){var o=s;if(typeof i=="function"){var a=i;i=function(){var u=Tc(o);a.call(u)}}ih(e,o,t,i)}else o=ck(n,e,t,i,r);return Tc(o)}qE=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=la(e.pendingLanes);n!==0&&(Fp(e,n|1),Mt(e,je()),!(le&6)&&(Zs=je()+500,ei()))}break;case 13:Ui(function(){var r=Wn(t,1);if(r!==null){var i=Pt();un(r,t,1,i)}}),_m(t,1)}};Up=function(t){if(t.tag===13){var e=Wn(t,134217728);if(e!==null){var n=Pt();un(e,t,134217728,n)}_m(t,134217728)}};GE=function(t){if(t.tag===13){var e=Or(t),n=Wn(t,e);if(n!==null){var r=Pt();un(n,t,e,r)}_m(t,e)}};KE=function(){return de};WE=function(t,e){var n=de;try{return de=t,e()}finally{de=n}};pf=function(t,e,n){switch(e){case"input":if(af(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var r=n[e];if(r!==t&&r.form===t.form){var i=Yc(r);if(!i)throw Error(z(90));SE(r),af(r,i)}}}break;case"textarea":RE(t,n);break;case"select":e=n.value,e!=null&&Ls(t,!!n.multiple,e,!1)}};DE=dm;VE=Ui;var hk={usingClientEntryPoint:!1,Events:[ml,Cs,Yc,bE,NE,dm]},Zo={findFiberByHostInstance:Ri,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},dk={bundleType:Zo.bundleType,version:Zo.version,rendererPackageName:Zo.rendererPackageName,rendererConfig:Zo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Zn.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=ME(t),t===null?null:t.stateNode},findFiberByHostInstance:Zo.findFiberByHostInstance||uk,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var _u=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!_u.isDisabled&&_u.supportsFiber)try{Wc=_u.inject(dk),wn=_u}catch{}}Kt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=hk;Kt.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!vm(e))throw Error(z(200));return lk(t,e,null,n)};Kt.createRoot=function(t,e){if(!vm(t))throw Error(z(299));var n=!1,r="",i=mT;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(r=e.identifierPrefix),e.onRecoverableError!==void 0&&(i=e.onRecoverableError)),e=gm(t,1,!1,null,null,n,!1,r,i),t[Kn]=e.current,Ba(t.nodeType===8?t.parentNode:t),new ym(e)};Kt.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(z(188)):(t=Object.keys(t).join(","),Error(z(268,t)));return t=ME(e),t=t===null?null:t.stateNode,t};Kt.flushSync=function(t){return Ui(t)};Kt.hydrate=function(t,e,n){if(!oh(e))throw Error(z(200));return ah(null,t,e,!0,n)};Kt.hydrateRoot=function(t,e,n){if(!vm(t))throw Error(z(405));var r=n!=null&&n.hydratedSources||null,i=!1,s="",o=mT;if(n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=pT(e,null,t,1,n??null,i,!1,s,o),t[Kn]=e.current,Ba(t),r)for(t=0;t<r.length;t++)n=r[t],i=n._getVersion,i=i(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,i]:e.mutableSourceEagerHydrationData.push(n,i);return new sh(e)};Kt.render=function(t,e,n){if(!oh(e))throw Error(z(200));return ah(null,t,e,!1,n)};Kt.unmountComponentAtNode=function(t){if(!oh(t))throw Error(z(40));return t._reactRootContainer?(Ui(function(){ah(null,null,t,!1,function(){t._reactRootContainer=null,t[Kn]=null})}),!0):!1};Kt.unstable_batchedUpdates=dm;Kt.unstable_renderSubtreeIntoContainer=function(t,e,n,r){if(!oh(n))throw Error(z(200));if(t==null||t._reactInternals===void 0)throw Error(z(38));return ah(t,e,n,!1,r)};Kt.version="18.3.1-next-f1338f8080-20240426";function gT(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(gT)}catch(t){console.error(t)}}gT(),gE.exports=Kt;var fk=gE.exports,Yy=fk;Zd.createRoot=Yy.createRoot,Zd.hydrateRoot=Yy.hydrateRoot;/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Qa(){return Qa=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},Qa.apply(this,arguments)}var Pr;(function(t){t.Pop="POP",t.Push="PUSH",t.Replace="REPLACE"})(Pr||(Pr={}));const Xy="popstate";function pk(t){t===void 0&&(t={});function e(i,s){let{pathname:o="/",search:a="",hash:u=""}=ts(i.location.hash.substr(1));return!o.startsWith("/")&&!o.startsWith(".")&&(o="/"+o),Wf("",{pathname:o,search:a,hash:u},s.state&&s.state.usr||null,s.state&&s.state.key||"default")}function n(i,s){let o=i.document.querySelector("base"),a="";if(o&&o.getAttribute("href")){let u=i.location.href,c=u.indexOf("#");a=c===-1?u:u.slice(0,c)}return a+"#"+(typeof s=="string"?s:Sc(s))}function r(i,s){lh(i.pathname.charAt(0)==="/","relative pathnames are not supported in hash history.push("+JSON.stringify(s)+")")}return gk(e,n,r,t)}function $e(t,e){if(t===!1||t===null||typeof t>"u")throw new Error(e)}function lh(t,e){if(!t){typeof console<"u"&&console.warn(e);try{throw new Error(e)}catch{}}}function mk(){return Math.random().toString(36).substr(2,8)}function Zy(t,e){return{usr:t.state,key:t.key,idx:e}}function Wf(t,e,n,r){return n===void 0&&(n=null),Qa({pathname:typeof t=="string"?t:t.pathname,search:"",hash:""},typeof e=="string"?ts(e):e,{state:n,key:e&&e.key||r||mk()})}function Sc(t){let{pathname:e="/",search:n="",hash:r=""}=t;return n&&n!=="?"&&(e+=n.charAt(0)==="?"?n:"?"+n),r&&r!=="#"&&(e+=r.charAt(0)==="#"?r:"#"+r),e}function ts(t){let e={};if(t){let n=t.indexOf("#");n>=0&&(e.hash=t.substr(n),t=t.substr(0,n));let r=t.indexOf("?");r>=0&&(e.search=t.substr(r),t=t.substr(0,r)),t&&(e.pathname=t)}return e}function gk(t,e,n,r){r===void 0&&(r={});let{window:i=document.defaultView,v5Compat:s=!1}=r,o=i.history,a=Pr.Pop,u=null,c=d();c==null&&(c=0,o.replaceState(Qa({},o.state,{idx:c}),""));function d(){return(o.state||{idx:null}).idx}function f(){a=Pr.Pop;let C=d(),w=C==null?null:C-c;c=C,u&&u({action:a,location:P.location,delta:w})}function m(C,w){a=Pr.Push;let y=Wf(P.location,C,w);n&&n(y,C),c=d()+1;let E=Zy(y,c),x=P.createHref(y);try{o.pushState(E,"",x)}catch(M){if(M instanceof DOMException&&M.name==="DataCloneError")throw M;i.location.assign(x)}s&&u&&u({action:a,location:P.location,delta:1})}function v(C,w){a=Pr.Replace;let y=Wf(P.location,C,w);n&&n(y,C),c=d();let E=Zy(y,c),x=P.createHref(y);o.replaceState(E,"",x),s&&u&&u({action:a,location:P.location,delta:0})}function S(C){let w=i.location.origin!=="null"?i.location.origin:i.location.href,y=typeof C=="string"?C:Sc(C);return y=y.replace(/ $/,"%20"),$e(w,"No window.location.(origin|href) available to create URL for href: "+y),new URL(y,w)}let P={get action(){return a},get location(){return t(i,o)},listen(C){if(u)throw new Error("A history only accepts one active listener");return i.addEventListener(Xy,f),u=C,()=>{i.removeEventListener(Xy,f),u=null}},createHref(C){return e(i,C)},createURL:S,encodeLocation(C){let w=S(C);return{pathname:w.pathname,search:w.search,hash:w.hash}},push:m,replace:v,go(C){return o.go(C)}};return P}var ev;(function(t){t.data="data",t.deferred="deferred",t.redirect="redirect",t.error="error"})(ev||(ev={}));function _k(t,e,n){return n===void 0&&(n="/"),yk(t,e,n)}function yk(t,e,n,r){let i=typeof e=="string"?ts(e):e,s=wm(i.pathname||"/",n);if(s==null)return null;let o=_T(t);vk(o);let a=null;for(let u=0;a==null&&u<o.length;++u){let c=bk(s);a=Ck(o[u],c)}return a}function _T(t,e,n,r){e===void 0&&(e=[]),n===void 0&&(n=[]),r===void 0&&(r="");let i=(s,o,a)=>{let u={relativePath:a===void 0?s.path||"":a,caseSensitive:s.caseSensitive===!0,childrenIndex:o,route:s};u.relativePath.startsWith("/")&&($e(u.relativePath.startsWith(r),'Absolute route path "'+u.relativePath+'" nested under path '+('"'+r+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),u.relativePath=u.relativePath.slice(r.length));let c=Mr([r,u.relativePath]),d=n.concat(u);s.children&&s.children.length>0&&($e(s.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+c+'".')),_T(s.children,e,d,c)),!(s.path==null&&!s.index)&&e.push({path:c,score:Rk(c,s.index),routesMeta:d})};return t.forEach((s,o)=>{var a;if(s.path===""||!((a=s.path)!=null&&a.includes("?")))i(s,o);else for(let u of yT(s.path))i(s,o,u)}),e}function yT(t){let e=t.split("/");if(e.length===0)return[];let[n,...r]=e,i=n.endsWith("?"),s=n.replace(/\?$/,"");if(r.length===0)return i?[s,""]:[s];let o=yT(r.join("/")),a=[];return a.push(...o.map(u=>u===""?s:[s,u].join("/"))),i&&a.push(...o),a.map(u=>t.startsWith("/")&&u===""?"/":u)}function vk(t){t.sort((e,n)=>e.score!==n.score?n.score-e.score:Pk(e.routesMeta.map(r=>r.childrenIndex),n.routesMeta.map(r=>r.childrenIndex)))}const wk=/^:[\w-]+$/,Ek=3,Ik=2,Tk=1,Sk=10,Ak=-2,tv=t=>t==="*";function Rk(t,e){let n=t.split("/"),r=n.length;return n.some(tv)&&(r+=Ak),e&&(r+=Ik),n.filter(i=>!tv(i)).reduce((i,s)=>i+(wk.test(s)?Ek:s===""?Tk:Sk),r)}function Pk(t,e){return t.length===e.length&&t.slice(0,-1).every((r,i)=>r===e[i])?t[t.length-1]-e[e.length-1]:0}function Ck(t,e,n){let{routesMeta:r}=t,i={},s="/",o=[];for(let a=0;a<r.length;++a){let u=r[a],c=a===r.length-1,d=s==="/"?e:e.slice(s.length)||"/",f=kk({path:u.relativePath,caseSensitive:u.caseSensitive,end:c},d),m=u.route;if(!f)return null;Object.assign(i,f.params),o.push({params:i,pathname:Mr([s,f.pathname]),pathnameBase:Lk(Mr([s,f.pathnameBase])),route:m}),f.pathnameBase!=="/"&&(s=Mr([s,f.pathnameBase]))}return o}function kk(t,e){typeof t=="string"&&(t={path:t,caseSensitive:!1,end:!0});let[n,r]=xk(t.path,t.caseSensitive,t.end),i=e.match(n);if(!i)return null;let s=i[0],o=s.replace(/(.)\/+$/,"$1"),a=i.slice(1);return{params:r.reduce((c,d,f)=>{let{paramName:m,isOptional:v}=d;if(m==="*"){let P=a[f]||"";o=s.slice(0,s.length-P.length).replace(/(.)\/+$/,"$1")}const S=a[f];return v&&!S?c[m]=void 0:c[m]=(S||"").replace(/%2F/g,"/"),c},{}),pathname:s,pathnameBase:o,pattern:t}}function xk(t,e,n){e===void 0&&(e=!1),n===void 0&&(n=!0),lh(t==="*"||!t.endsWith("*")||t.endsWith("/*"),'Route path "'+t+'" will be treated as if it were '+('"'+t.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+t.replace(/\*$/,"/*")+'".'));let r=[],i="^"+t.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(o,a,u)=>(r.push({paramName:a,isOptional:u!=null}),u?"/?([^\\/]+)?":"/([^\\/]+)"));return t.endsWith("*")?(r.push({paramName:"*"}),i+=t==="*"||t==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?i+="\\/*$":t!==""&&t!=="/"&&(i+="(?:(?=\\/|$))"),[new RegExp(i,e?void 0:"i"),r]}function bk(t){try{return t.split("/").map(e=>decodeURIComponent(e).replace(/\//g,"%2F")).join("/")}catch(e){return lh(!1,'The URL path "'+t+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+e+").")),t}}function wm(t,e){if(e==="/")return t;if(!t.toLowerCase().startsWith(e.toLowerCase()))return null;let n=e.endsWith("/")?e.length-1:e.length,r=t.charAt(n);return r&&r!=="/"?null:t.slice(n)||"/"}const Nk=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Dk=t=>Nk.test(t);function Vk(t,e){e===void 0&&(e="/");let{pathname:n,search:r="",hash:i=""}=typeof t=="string"?ts(t):t,s;if(n)if(Dk(n))s=n;else{if(n.includes("//")){let o=n;n=n.replace(/\/\/+/g,"/"),lh(!1,"Pathnames cannot have embedded double slashes - normalizing "+(o+" -> "+n))}n.startsWith("/")?s=nv(n.substring(1),"/"):s=nv(n,e)}else s=e;return{pathname:s,search:Mk(r),hash:Fk(i)}}function nv(t,e){let n=e.replace(/\/+$/,"").split("/");return t.split("/").forEach(i=>{i===".."?n.length>1&&n.pop():i!=="."&&n.push(i)}),n.length>1?n.join("/"):"/"}function Od(t,e,n,r){return"Cannot include a '"+t+"' character in a manually specified "+("`to."+e+"` field ["+JSON.stringify(r)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function Ok(t){return t.filter((e,n)=>n===0||e.route.path&&e.route.path.length>0)}function Em(t,e){let n=Ok(t);return e?n.map((r,i)=>i===n.length-1?r.pathname:r.pathnameBase):n.map(r=>r.pathnameBase)}function Im(t,e,n,r){r===void 0&&(r=!1);let i;typeof t=="string"?i=ts(t):(i=Qa({},t),$e(!i.pathname||!i.pathname.includes("?"),Od("?","pathname","search",i)),$e(!i.pathname||!i.pathname.includes("#"),Od("#","pathname","hash",i)),$e(!i.search||!i.search.includes("#"),Od("#","search","hash",i)));let s=t===""||i.pathname==="",o=s?"/":i.pathname,a;if(o==null)a=n;else{let f=e.length-1;if(!r&&o.startsWith("..")){let m=o.split("/");for(;m[0]==="..";)m.shift(),f-=1;i.pathname=m.join("/")}a=f>=0?e[f]:"/"}let u=Vk(i,a),c=o&&o!=="/"&&o.endsWith("/"),d=(s||o===".")&&n.endsWith("/");return!u.pathname.endsWith("/")&&(c||d)&&(u.pathname+="/"),u}const Mr=t=>t.join("/").replace(/\/\/+/g,"/"),Lk=t=>t.replace(/\/+$/,"").replace(/^\/*/,"/"),Mk=t=>!t||t==="?"?"":t.startsWith("?")?t:"?"+t,Fk=t=>!t||t==="#"?"":t.startsWith("#")?t:"#"+t;function Uk(t){return t!=null&&typeof t.status=="number"&&typeof t.statusText=="string"&&typeof t.internal=="boolean"&&"data"in t}const vT=["post","put","patch","delete"];new Set(vT);const Bk=["get",...vT];new Set(Bk);/**
 * React Router v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Ja(){return Ja=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},Ja.apply(this,arguments)}const Tm=B.createContext(null),jk=B.createContext(null),ti=B.createContext(null),uh=B.createContext(null),er=B.createContext({outlet:null,matches:[],isDataRoute:!1}),wT=B.createContext(null);function zk(t,e){let{relative:n}=e===void 0?{}:e;wo()||$e(!1);let{basename:r,navigator:i}=B.useContext(ti),{hash:s,pathname:o,search:a}=IT(t,{relative:n}),u=o;return r!=="/"&&(u=o==="/"?r:Mr([r,o])),i.createHref({pathname:u,search:a,hash:s})}function wo(){return B.useContext(uh)!=null}function ns(){return wo()||$e(!1),B.useContext(uh).location}function ET(t){B.useContext(ti).static||B.useLayoutEffect(t)}function Sm(){let{isDataRoute:t}=B.useContext(er);return t?tx():$k()}function $k(){wo()||$e(!1);let t=B.useContext(Tm),{basename:e,future:n,navigator:r}=B.useContext(ti),{matches:i}=B.useContext(er),{pathname:s}=ns(),o=JSON.stringify(Em(i,n.v7_relativeSplatPath)),a=B.useRef(!1);return ET(()=>{a.current=!0}),B.useCallback(function(c,d){if(d===void 0&&(d={}),!a.current)return;if(typeof c=="number"){r.go(c);return}let f=Im(c,JSON.parse(o),s,d.relative==="path");t==null&&e!=="/"&&(f.pathname=f.pathname==="/"?e:Mr([e,f.pathname])),(d.replace?r.replace:r.push)(f,d.state,d)},[e,r,o,s,t])}function CM(){let{matches:t}=B.useContext(er),e=t[t.length-1];return e?e.params:{}}function IT(t,e){let{relative:n}=e===void 0?{}:e,{future:r}=B.useContext(ti),{matches:i}=B.useContext(er),{pathname:s}=ns(),o=JSON.stringify(Em(i,r.v7_relativeSplatPath));return B.useMemo(()=>Im(t,JSON.parse(o),s,n==="path"),[t,o,s,n])}function qk(t,e){return Gk(t,e)}function Gk(t,e,n,r){wo()||$e(!1);let{navigator:i}=B.useContext(ti),{matches:s}=B.useContext(er),o=s[s.length-1],a=o?o.params:{};o&&o.pathname;let u=o?o.pathnameBase:"/";o&&o.route;let c=ns(),d;if(e){var f;let C=typeof e=="string"?ts(e):e;u==="/"||(f=C.pathname)!=null&&f.startsWith(u)||$e(!1),d=C}else d=c;let m=d.pathname||"/",v=m;if(u!=="/"){let C=u.replace(/^\//,"").split("/");v="/"+m.replace(/^\//,"").split("/").slice(C.length).join("/")}let S=_k(t,{pathname:v}),P=Jk(S&&S.map(C=>Object.assign({},C,{params:Object.assign({},a,C.params),pathname:Mr([u,i.encodeLocation?i.encodeLocation(C.pathname).pathname:C.pathname]),pathnameBase:C.pathnameBase==="/"?u:Mr([u,i.encodeLocation?i.encodeLocation(C.pathnameBase).pathname:C.pathnameBase])})),s,n,r);return e&&P?B.createElement(uh.Provider,{value:{location:Ja({pathname:"/",search:"",hash:"",state:null,key:"default"},d),navigationType:Pr.Pop}},P):P}function Kk(){let t=ex(),e=Uk(t)?t.status+" "+t.statusText:t instanceof Error?t.message:JSON.stringify(t),n=t instanceof Error?t.stack:null,i={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return B.createElement(B.Fragment,null,B.createElement("h2",null,"Unexpected Application Error!"),B.createElement("h3",{style:{fontStyle:"italic"}},e),n?B.createElement("pre",{style:i},n):null,null)}const Wk=B.createElement(Kk,null);class Hk extends B.Component{constructor(e){super(e),this.state={location:e.location,revalidation:e.revalidation,error:e.error}}static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps(e,n){return n.location!==e.location||n.revalidation!=="idle"&&e.revalidation==="idle"?{error:e.error,location:e.location,revalidation:e.revalidation}:{error:e.error!==void 0?e.error:n.error,location:n.location,revalidation:e.revalidation||n.revalidation}}componentDidCatch(e,n){console.error("React Router caught the following error during render",e,n)}render(){return this.state.error!==void 0?B.createElement(er.Provider,{value:this.props.routeContext},B.createElement(wT.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function Qk(t){let{routeContext:e,match:n,children:r}=t,i=B.useContext(Tm);return i&&i.static&&i.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(i.staticContext._deepestRenderedBoundaryId=n.route.id),B.createElement(er.Provider,{value:e},r)}function Jk(t,e,n,r){var i;if(e===void 0&&(e=[]),n===void 0&&(n=null),r===void 0&&(r=null),t==null){var s;if(!n)return null;if(n.errors)t=n.matches;else if((s=r)!=null&&s.v7_partialHydration&&e.length===0&&!n.initialized&&n.matches.length>0)t=n.matches;else return null}let o=t,a=(i=n)==null?void 0:i.errors;if(a!=null){let d=o.findIndex(f=>f.route.id&&(a==null?void 0:a[f.route.id])!==void 0);d>=0||$e(!1),o=o.slice(0,Math.min(o.length,d+1))}let u=!1,c=-1;if(n&&r&&r.v7_partialHydration)for(let d=0;d<o.length;d++){let f=o[d];if((f.route.HydrateFallback||f.route.hydrateFallbackElement)&&(c=d),f.route.id){let{loaderData:m,errors:v}=n,S=f.route.loader&&m[f.route.id]===void 0&&(!v||v[f.route.id]===void 0);if(f.route.lazy||S){u=!0,c>=0?o=o.slice(0,c+1):o=[o[0]];break}}}return o.reduceRight((d,f,m)=>{let v,S=!1,P=null,C=null;n&&(v=a&&f.route.id?a[f.route.id]:void 0,P=f.route.errorElement||Wk,u&&(c<0&&m===0?(nx("route-fallback"),S=!0,C=null):c===m&&(S=!0,C=f.route.hydrateFallbackElement||null)));let w=e.concat(o.slice(0,m+1)),y=()=>{let E;return v?E=P:S?E=C:f.route.Component?E=B.createElement(f.route.Component,null):f.route.element?E=f.route.element:E=d,B.createElement(Qk,{match:f,routeContext:{outlet:d,matches:w,isDataRoute:n!=null},children:E})};return n&&(f.route.ErrorBoundary||f.route.errorElement||m===0)?B.createElement(Hk,{location:n.location,revalidation:n.revalidation,component:P,error:v,children:y(),routeContext:{outlet:null,matches:w,isDataRoute:!0}}):y()},null)}var TT=function(t){return t.UseBlocker="useBlocker",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t}(TT||{}),ST=function(t){return t.UseBlocker="useBlocker",t.UseLoaderData="useLoaderData",t.UseActionData="useActionData",t.UseRouteError="useRouteError",t.UseNavigation="useNavigation",t.UseRouteLoaderData="useRouteLoaderData",t.UseMatches="useMatches",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t.UseRouteId="useRouteId",t}(ST||{});function Yk(t){let e=B.useContext(Tm);return e||$e(!1),e}function Xk(t){let e=B.useContext(jk);return e||$e(!1),e}function Zk(t){let e=B.useContext(er);return e||$e(!1),e}function AT(t){let e=Zk(),n=e.matches[e.matches.length-1];return n.route.id||$e(!1),n.route.id}function ex(){var t;let e=B.useContext(wT),n=Xk(),r=AT();return e!==void 0?e:(t=n.errors)==null?void 0:t[r]}function tx(){let{router:t}=Yk(TT.UseNavigateStable),e=AT(ST.UseNavigateStable),n=B.useRef(!1);return ET(()=>{n.current=!0}),B.useCallback(function(i,s){s===void 0&&(s={}),n.current&&(typeof i=="number"?t.navigate(i):t.navigate(i,Ja({fromRouteId:e},s)))},[t,e])}const rv={};function nx(t,e,n){rv[t]||(rv[t]=!0)}function rx(t,e){t==null||t.v7_startTransition,t==null||t.v7_relativeSplatPath}function jt(t){let{to:e,replace:n,state:r,relative:i}=t;wo()||$e(!1);let{future:s,static:o}=B.useContext(ti),{matches:a}=B.useContext(er),{pathname:u}=ns(),c=Sm(),d=Im(e,Em(a,s.v7_relativeSplatPath),u,i==="path"),f=JSON.stringify(d);return B.useEffect(()=>c(JSON.parse(f),{replace:n,state:r,relative:i}),[c,f,i,n,r]),null}function Oe(t){$e(!1)}function ix(t){let{basename:e="/",children:n=null,location:r,navigationType:i=Pr.Pop,navigator:s,static:o=!1,future:a}=t;wo()&&$e(!1);let u=e.replace(/^\/*/,"/"),c=B.useMemo(()=>({basename:u,navigator:s,static:o,future:Ja({v7_relativeSplatPath:!1},a)}),[u,a,s,o]);typeof r=="string"&&(r=ts(r));let{pathname:d="/",search:f="",hash:m="",state:v=null,key:S="default"}=r,P=B.useMemo(()=>{let C=wm(d,u);return C==null?null:{location:{pathname:C,search:f,hash:m,state:v,key:S},navigationType:i}},[u,d,f,m,v,S,i]);return P==null?null:B.createElement(ti.Provider,{value:c},B.createElement(uh.Provider,{children:n,value:P}))}function sx(t){let{children:e,location:n}=t;return qk(Hf(e),n)}new Promise(()=>{});function Hf(t,e){e===void 0&&(e=[]);let n=[];return B.Children.forEach(t,(r,i)=>{if(!B.isValidElement(r))return;let s=[...e,i];if(r.type===B.Fragment){n.push.apply(n,Hf(r.props.children,s));return}r.type!==Oe&&$e(!1),!r.props.index||!r.props.children||$e(!1);let o={id:r.props.id||s.join("-"),caseSensitive:r.props.caseSensitive,element:r.props.element,Component:r.props.Component,index:r.props.index,path:r.props.path,loader:r.props.loader,action:r.props.action,errorElement:r.props.errorElement,ErrorBoundary:r.props.ErrorBoundary,hasErrorBoundary:r.props.ErrorBoundary!=null||r.props.errorElement!=null,shouldRevalidate:r.props.shouldRevalidate,handle:r.props.handle,lazy:r.props.lazy};r.props.children&&(o.children=Hf(r.props.children,s)),n.push(o)}),n}/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Qf(){return Qf=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},Qf.apply(this,arguments)}function ox(t,e){if(t==null)return{};var n={},r=Object.keys(t),i,s;for(s=0;s<r.length;s++)i=r[s],!(e.indexOf(i)>=0)&&(n[i]=t[i]);return n}function ax(t){return!!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)}function lx(t,e){return t.button===0&&(!e||e==="_self")&&!ax(t)}const ux=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],cx="6";try{window.__reactRouterVersion=cx}catch{}const hx="startTransition",iv=nP[hx];function dx(t){let{basename:e,children:n,future:r,window:i}=t,s=B.useRef();s.current==null&&(s.current=pk({window:i,v5Compat:!0}));let o=s.current,[a,u]=B.useState({action:o.action,location:o.location}),{v7_startTransition:c}=r||{},d=B.useCallback(f=>{c&&iv?iv(()=>u(f)):u(f)},[u,c]);return B.useLayoutEffect(()=>o.listen(d),[o,d]),B.useEffect(()=>rx(r),[r]),B.createElement(ix,{basename:e,children:n,location:a.location,navigationType:a.action,navigator:o,future:r})}const fx=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",px=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Ve=B.forwardRef(function(e,n){let{onClick:r,relative:i,reloadDocument:s,replace:o,state:a,target:u,to:c,preventScrollReset:d,viewTransition:f}=e,m=ox(e,ux),{basename:v}=B.useContext(ti),S,P=!1;if(typeof c=="string"&&px.test(c)&&(S=c,fx))try{let E=new URL(window.location.href),x=c.startsWith("//")?new URL(E.protocol+c):new URL(c),M=wm(x.pathname,v);x.origin===E.origin&&M!=null?c=M+x.search+x.hash:P=!0}catch{}let C=zk(c,{relative:i}),w=mx(c,{replace:o,state:a,target:u,preventScrollReset:d,relative:i,viewTransition:f});function y(E){r&&r(E),E.defaultPrevented||w(E)}return B.createElement("a",Qf({},m,{href:S||C,onClick:P||s?r:y,ref:n,target:u}))});var sv;(function(t){t.UseScrollRestoration="useScrollRestoration",t.UseSubmit="useSubmit",t.UseSubmitFetcher="useSubmitFetcher",t.UseFetcher="useFetcher",t.useViewTransitionState="useViewTransitionState"})(sv||(sv={}));var ov;(function(t){t.UseFetcher="useFetcher",t.UseFetchers="useFetchers",t.UseScrollRestoration="useScrollRestoration"})(ov||(ov={}));function mx(t,e){let{target:n,replace:r,state:i,preventScrollReset:s,relative:o,viewTransition:a}=e===void 0?{}:e,u=Sm(),c=ns(),d=IT(t,{relative:o});return B.useCallback(f=>{if(lx(f,n)){f.preventDefault();let m=r!==void 0?r:Sc(c)===Sc(d);u(t,{replace:m,state:i,preventScrollReset:s,relative:o,viewTransition:a})}},[c,u,d,r,i,n,t,s,o,a])}const gx="modulepreload",_x=function(t){return"/dermlux-waitlist/"+t},av={},Ke=function(e,n,r){let i=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),a=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));i=Promise.allSettled(n.map(u=>{if(u=_x(u),u in av)return;av[u]=!0;const c=u.endsWith(".css"),d=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${d}`))return;const f=document.createElement("link");if(f.rel=c?"stylesheet":gx,c||(f.as="script"),f.crossOrigin="",f.href=u,a&&f.setAttribute("nonce",a),document.head.appendChild(f),c)return new Promise((m,v)=>{f.addEventListener("load",m),f.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${u}`)))})}))}function s(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return i.then(o=>{for(const a of o||[])a.status==="rejected"&&s(a.reason);return e().catch(s)})};var lv={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const RT=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},yx=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],o=t[n++],a=t[n++],u=((i&7)<<18|(s&63)<<12|(o&63)<<6|a&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{const s=t[n++],o=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},PT={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],o=i+1<t.length,a=o?t[i+1]:0,u=i+2<t.length,c=u?t[i+2]:0,d=s>>2,f=(s&3)<<4|a>>4;let m=(a&15)<<2|c>>6,v=c&63;u||(v=64,o||(m=64)),r.push(n[d],n[f],n[m],n[v])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(RT(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):yx(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],a=i<t.length?n[t.charAt(i)]:0;++i;const c=i<t.length?n[t.charAt(i)]:64;++i;const f=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||a==null||c==null||f==null)throw new vx;const m=s<<2|a>>4;if(r.push(m),c!==64){const v=a<<4&240|c>>2;if(r.push(v),f!==64){const S=c<<6&192|f;r.push(S)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class vx extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const wx=function(t){const e=RT(t);return PT.encodeByteArray(e,!0)},Ac=function(t){return wx(t).replace(/\./g,"")},CT=function(t){try{return PT.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ex(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ix=()=>Ex().__FIREBASE_DEFAULTS__,Tx=()=>{if(typeof process>"u"||typeof lv>"u")return;const t=lv.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Sx=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&CT(t[1]);return e&&JSON.parse(e)},ch=()=>{try{return Ix()||Tx()||Sx()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},kT=t=>{var e,n;return(n=(e=ch())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},xT=t=>{const e=kT(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},bT=()=>{var t;return(t=ch())===null||t===void 0?void 0:t.config},NT=t=>{var e;return(e=ch())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ax{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function DT(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",i=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},t);return[Ac(JSON.stringify(n)),Ac(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ye(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Rx(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ye())}function Px(){var t;const e=(t=ch())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Cx(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function kx(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function xx(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function bx(){const t=Ye();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function VT(){return!Px()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function OT(){try{return typeof indexedDB=="object"}catch{return!1}}function Nx(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dx="FirebaseError";class fn extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=Dx,Object.setPrototypeOf(this,fn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,_l.prototype.create)}}class _l{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?Vx(s,r):"Error",a=`${this.serviceName}: ${o} (${i}).`;return new fn(i,a,r)}}function Vx(t,e){return t.replace(Ox,(n,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const Ox=/\{\$([^}]+)}/g;function Lx(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function zr(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],o=e[i];if(uv(s)&&uv(o)){if(!zr(s,o))return!1}else if(s!==o)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function uv(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yl(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function ca(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function ha(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function Mx(t,e){const n=new Fx(t,e);return n.subscribe.bind(n)}class Fx{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");Ux(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=Ld),i.error===void 0&&(i.error=Ld),i.complete===void 0&&(i.complete=Ld);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Ux(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Ld(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ce(t){return t&&t._delegate?t._delegate:t}class $r{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wi="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bx{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new Ax;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(zx(e))try{this.getOrInitializeService({instanceIdentifier:wi})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=wi){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=wi){return this.instances.has(e)}getOptions(e=wi){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(s);r===a&&o.resolve(i)}return i}onInit(e,n){var r;const i=this.normalizeInstanceIdentifier(n),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);const o=this.instances.get(i);return o&&e(o,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:jx(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=wi){return this.component?this.component.multipleInstances?e:wi:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function jx(t){return t===wi?void 0:t}function zx(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $x{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Bx(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ie;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(ie||(ie={}));const qx={debug:ie.DEBUG,verbose:ie.VERBOSE,info:ie.INFO,warn:ie.WARN,error:ie.ERROR,silent:ie.SILENT},Gx=ie.INFO,Kx={[ie.DEBUG]:"log",[ie.VERBOSE]:"log",[ie.INFO]:"info",[ie.WARN]:"warn",[ie.ERROR]:"error"},Wx=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=Kx[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Am{constructor(e){this.name=e,this._logLevel=Gx,this._logHandler=Wx,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ie))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?qx[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ie.DEBUG,...e),this._logHandler(this,ie.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ie.VERBOSE,...e),this._logHandler(this,ie.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ie.INFO,...e),this._logHandler(this,ie.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ie.WARN,...e),this._logHandler(this,ie.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ie.ERROR,...e),this._logHandler(this,ie.ERROR,...e)}}const Hx=(t,e)=>e.some(n=>t instanceof n);let cv,hv;function Qx(){return cv||(cv=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Jx(){return hv||(hv=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const LT=new WeakMap,Jf=new WeakMap,MT=new WeakMap,Md=new WeakMap,Rm=new WeakMap;function Yx(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",o)},s=()=>{n(Fr(t.result)),i()},o=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&LT.set(n,t)}).catch(()=>{}),Rm.set(e,t),e}function Xx(t){if(Jf.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",o),t.removeEventListener("abort",o)},s=()=>{n(),i()},o=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",o),t.addEventListener("abort",o)});Jf.set(t,e)}let Yf={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Jf.get(t);if(e==="objectStoreNames")return t.objectStoreNames||MT.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Fr(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Zx(t){Yf=t(Yf)}function e1(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Fd(this),e,...n);return MT.set(r,e.sort?e.sort():[e]),Fr(r)}:Jx().includes(t)?function(...e){return t.apply(Fd(this),e),Fr(LT.get(this))}:function(...e){return Fr(t.apply(Fd(this),e))}}function t1(t){return typeof t=="function"?e1(t):(t instanceof IDBTransaction&&Xx(t),Hx(t,Qx())?new Proxy(t,Yf):t)}function Fr(t){if(t instanceof IDBRequest)return Yx(t);if(Md.has(t))return Md.get(t);const e=t1(t);return e!==t&&(Md.set(t,e),Rm.set(e,t)),e}const Fd=t=>Rm.get(t);function n1(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(t,e),a=Fr(o);return r&&o.addEventListener("upgradeneeded",u=>{r(Fr(o.result),u.oldVersion,u.newVersion,Fr(o.transaction),u)}),n&&o.addEventListener("blocked",u=>n(u.oldVersion,u.newVersion,u)),a.then(u=>{s&&u.addEventListener("close",()=>s()),i&&u.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}const r1=["get","getKey","getAll","getAllKeys","count"],i1=["put","add","delete","clear"],Ud=new Map;function dv(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Ud.get(e))return Ud.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=i1.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||r1.includes(n)))return;const s=async function(o,...a){const u=this.transaction(o,i?"readwrite":"readonly");let c=u.store;return r&&(c=c.index(a.shift())),(await Promise.all([c[n](...a),i&&u.done]))[0]};return Ud.set(e,s),s}Zx(t=>({...t,get:(e,n,r)=>dv(e,n)||t.get(e,n,r),has:(e,n)=>!!dv(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class s1{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(o1(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function o1(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Xf="@firebase/app",fv="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qn=new Am("@firebase/app"),a1="@firebase/app-compat",l1="@firebase/analytics-compat",u1="@firebase/analytics",c1="@firebase/app-check-compat",h1="@firebase/app-check",d1="@firebase/auth",f1="@firebase/auth-compat",p1="@firebase/database",m1="@firebase/data-connect",g1="@firebase/database-compat",_1="@firebase/functions",y1="@firebase/functions-compat",v1="@firebase/installations",w1="@firebase/installations-compat",E1="@firebase/messaging",I1="@firebase/messaging-compat",T1="@firebase/performance",S1="@firebase/performance-compat",A1="@firebase/remote-config",R1="@firebase/remote-config-compat",P1="@firebase/storage",C1="@firebase/storage-compat",k1="@firebase/firestore",x1="@firebase/vertexai-preview",b1="@firebase/firestore-compat",N1="firebase",D1="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ya="[DEFAULT]",V1={[Xf]:"fire-core",[a1]:"fire-core-compat",[u1]:"fire-analytics",[l1]:"fire-analytics-compat",[h1]:"fire-app-check",[c1]:"fire-app-check-compat",[d1]:"fire-auth",[f1]:"fire-auth-compat",[p1]:"fire-rtdb",[m1]:"fire-data-connect",[g1]:"fire-rtdb-compat",[_1]:"fire-fn",[y1]:"fire-fn-compat",[v1]:"fire-iid",[w1]:"fire-iid-compat",[E1]:"fire-fcm",[I1]:"fire-fcm-compat",[T1]:"fire-perf",[S1]:"fire-perf-compat",[A1]:"fire-rc",[R1]:"fire-rc-compat",[P1]:"fire-gcs",[C1]:"fire-gcs-compat",[k1]:"fire-fst",[b1]:"fire-fst-compat",[x1]:"fire-vertex","fire-js":"fire-js",[N1]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bi=new Map,Rc=new Map,Pc=new Map;function Zf(t,e){try{t.container.addComponent(e)}catch(n){Qn.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function qr(t){const e=t.name;if(Pc.has(e))return Qn.debug(`There were multiple attempts to register component ${e}.`),!1;Pc.set(e,t);for(const n of Bi.values())Zf(n,t);for(const n of Rc.values())Zf(n,t);return!0}function rs(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function FT(t,e,n=Ya){rs(t,e).clearInstance(n)}function an(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const O1={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ur=new _l("app","Firebase",O1);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L1{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new $r("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ur.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ni=D1;function Pm(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=Object.assign({name:Ya,automaticDataCollectionEnabled:!1},e),i=r.name;if(typeof i!="string"||!i)throw Ur.create("bad-app-name",{appName:String(i)});if(n||(n=bT()),!n)throw Ur.create("no-options");const s=Bi.get(i);if(s){if(zr(n,s.options)&&zr(r,s.config))return s;throw Ur.create("duplicate-app",{appName:i})}const o=new $x(i);for(const u of Pc.values())o.addComponent(u);const a=new L1(n,r,o);return Bi.set(i,a),a}function hh(t=Ya){const e=Bi.get(t);if(!e&&t===Ya&&bT())return Pm();if(!e)throw Ur.create("no-app",{appName:t});return e}async function M1(t){let e=!1;const n=t.name;Bi.has(n)?(e=!0,Bi.delete(n)):Rc.has(n)&&t.decRefCount()<=0&&(Rc.delete(n),e=!0),e&&(await Promise.all(t.container.getProviders().map(r=>r.delete())),t.isDeleted=!0)}function cn(t,e,n){var r;let i=(r=V1[t])!==null&&r!==void 0?r:t;n&&(i+=`-${n}`);const s=i.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const a=[`Unable to register library "${i}" with version "${e}":`];s&&a.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Qn.warn(a.join(" "));return}qr(new $r(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const F1="firebase-heartbeat-database",U1=1,Xa="firebase-heartbeat-store";let Bd=null;function UT(){return Bd||(Bd=n1(F1,U1,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Xa)}catch(n){console.warn(n)}}}}).catch(t=>{throw Ur.create("idb-open",{originalErrorMessage:t.message})})),Bd}async function B1(t){try{const n=(await UT()).transaction(Xa),r=await n.objectStore(Xa).get(BT(t));return await n.done,r}catch(e){if(e instanceof fn)Qn.warn(e.message);else{const n=Ur.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Qn.warn(n.message)}}}async function pv(t,e){try{const r=(await UT()).transaction(Xa,"readwrite");await r.objectStore(Xa).put(e,BT(t)),await r.done}catch(n){if(n instanceof fn)Qn.warn(n.message);else{const r=Ur.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Qn.warn(r.message)}}}function BT(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const j1=1024,z1=30*24*60*60*1e3;class $1{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new G1(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=mv();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const a=new Date(o.date).valueOf();return Date.now()-a<=z1}),this._storage.overwrite(this._heartbeatsCache))}catch(r){Qn.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=mv(),{heartbeatsToSend:r,unsentEntries:i}=q1(this._heartbeatsCache.heartbeats),s=Ac(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Qn.warn(n),""}}}function mv(){return new Date().toISOString().substring(0,10)}function q1(t,e=j1){const n=[];let r=t.slice();for(const i of t){const s=n.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),gv(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),gv(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class G1{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return OT()?Nx().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await B1(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return pv(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return pv(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function gv(t){return Ac(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function K1(t){qr(new $r("platform-logger",e=>new s1(e),"PRIVATE")),qr(new $r("heartbeat",e=>new $1(e),"PRIVATE")),cn(Xf,fv,t),cn(Xf,fv,"esm2017"),cn("fire-js","")}K1("");function Cm(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(t);i<r.length;i++)e.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(t,r[i])&&(n[r[i]]=t[r[i]]);return n}function jT(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const W1=jT,zT=new _l("auth","Firebase",jT());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cc=new Am("@firebase/auth");function H1(t,...e){Cc.logLevel<=ie.WARN&&Cc.warn(`Auth (${ni}): ${t}`,...e)}function Bu(t,...e){Cc.logLevel<=ie.ERROR&&Cc.error(`Auth (${ni}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dn(t,...e){throw km(t,...e)}function In(t,...e){return km(t,...e)}function $T(t,e,n){const r=Object.assign(Object.assign({},W1()),{[e]:n});return new _l("auth","Firebase",r).create(e,{appName:t.name})}function qn(t){return $T(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function km(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return zT.create(t,...e)}function Y(t,e,...n){if(!t)throw km(e,...n)}function Un(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Bu(e),new Error(e)}function Jn(t,e){t||Un(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ep(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function Q1(){return _v()==="http:"||_v()==="https:"}function _v(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function J1(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Q1()||kx()||"connection"in navigator)?navigator.onLine:!0}function Y1(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vl{constructor(e,n){this.shortDelay=e,this.longDelay=n,Jn(n>e,"Short delay should be less than long delay!"),this.isMobile=Rx()||xx()}get(){return J1()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xm(t,e){Jn(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qT{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Un("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Un("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Un("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const X1={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Z1=new vl(3e4,6e4);function ri(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function ii(t,e,n,r,i={}){return GT(t,i,async()=>{let s={},o={};r&&(e==="GET"?o=r:s={body:JSON.stringify(r)});const a=yl(Object.assign({key:t.config.apiKey},o)).slice(1),u=await t._getAdditionalHeaders();u["Content-Type"]="application/json",t.languageCode&&(u["X-Firebase-Locale"]=t.languageCode);const c=Object.assign({method:e,headers:u},s);return Cx()||(c.referrerPolicy="no-referrer"),qT.fetch()(KT(t,t.config.apiHost,n,a),c)})}async function GT(t,e,n){t._canInitEmulator=!1;const r=Object.assign(Object.assign({},X1),e);try{const i=new tb(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw yu(t,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const a=s.ok?o.errorMessage:o.error.message,[u,c]=a.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw yu(t,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw yu(t,"email-already-in-use",o);if(u==="USER_DISABLED")throw yu(t,"user-disabled",o);const d=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw $T(t,d,c);dn(t,d)}}catch(i){if(i instanceof fn)throw i;dn(t,"network-request-failed",{message:String(i)})}}async function wl(t,e,n,r,i={}){const s=await ii(t,e,n,r,i);return"mfaPendingCredential"in s&&dn(t,"multi-factor-auth-required",{_serverResponse:s}),s}function KT(t,e,n,r){const i=`${e}${n}?${r}`;return t.config.emulator?xm(t.config,i):`${t.config.apiScheme}://${i}`}function eb(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class tb{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(In(this.auth,"network-request-failed")),Z1.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function yu(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=In(t,e,r);return i.customData._tokenResponse=n,i}function yv(t){return t!==void 0&&t.enterprise!==void 0}class nb{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return eb(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function rb(t,e){return ii(t,"GET","/v2/recaptchaConfig",ri(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ib(t,e){return ii(t,"POST","/v1/accounts:delete",e)}async function WT(t,e){return ii(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Aa(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function sb(t,e=!1){const n=ce(t),r=await n.getIdToken(e),i=bm(r);Y(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Aa(jd(i.auth_time)),issuedAtTime:Aa(jd(i.iat)),expirationTime:Aa(jd(i.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function jd(t){return Number(t)*1e3}function bm(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Bu("JWT malformed, contained fewer than 3 sections"),null;try{const i=CT(n);return i?JSON.parse(i):(Bu("Failed to decode base64 JWT payload"),null)}catch(i){return Bu("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function vv(t){const e=bm(t);return Y(e,"internal-error"),Y(typeof e.exp<"u","internal-error"),Y(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Za(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof fn&&ob(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function ob({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ab{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tp{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Aa(this.lastLoginAt),this.creationTime=Aa(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kc(t){var e;const n=t.auth,r=await t.getIdToken(),i=await Za(t,WT(n,{idToken:r}));Y(i==null?void 0:i.users.length,n,"internal-error");const s=i.users[0];t._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?HT(s.providerUserInfo):[],a=ub(t.providerData,o),u=t.isAnonymous,c=!(t.email&&s.passwordHash)&&!(a!=null&&a.length),d=u?c:!1,f={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new tp(s.createdAt,s.lastLoginAt),isAnonymous:d};Object.assign(t,f)}async function lb(t){const e=ce(t);await kc(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function ub(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function HT(t){return t.map(e=>{var{providerId:n}=e,r=Cm(e,["providerId"]);return{providerId:n,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cb(t,e){const n=await GT(t,{},async()=>{const r=yl({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,o=KT(t,i,"/v1/token",`key=${s}`),a=await t._getAdditionalHeaders();return a["Content-Type"]="application/x-www-form-urlencoded",qT.fetch()(o,{method:"POST",headers:a,body:r})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function hb(t,e){return ii(t,"POST","/v2/accounts:revokeToken",ri(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zs{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){Y(e.idToken,"internal-error"),Y(typeof e.idToken<"u","internal-error"),Y(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):vv(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){Y(e.length!==0,"internal-error");const n=vv(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(Y(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await cb(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,o=new zs;return r&&(Y(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),i&&(Y(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(Y(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new zs,this.toJSON())}_performRefresh(){return Un("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ur(t,e){Y(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class Bn{constructor(e){var{uid:n,auth:r,stsTokenManager:i}=e,s=Cm(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new ab(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new tp(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const n=await Za(this,this.stsTokenManager.getToken(this.auth,e));return Y(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return sb(this,e)}reload(){return lb(this)}_assign(e){this!==e&&(Y(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Bn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){Y(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await kc(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(an(this.auth.app))return Promise.reject(qn(this.auth));const e=await this.getIdToken();return await Za(this,ib(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var r,i,s,o,a,u,c,d;const f=(r=n.displayName)!==null&&r!==void 0?r:void 0,m=(i=n.email)!==null&&i!==void 0?i:void 0,v=(s=n.phoneNumber)!==null&&s!==void 0?s:void 0,S=(o=n.photoURL)!==null&&o!==void 0?o:void 0,P=(a=n.tenantId)!==null&&a!==void 0?a:void 0,C=(u=n._redirectEventId)!==null&&u!==void 0?u:void 0,w=(c=n.createdAt)!==null&&c!==void 0?c:void 0,y=(d=n.lastLoginAt)!==null&&d!==void 0?d:void 0,{uid:E,emailVerified:x,isAnonymous:M,providerData:F,stsTokenManager:I}=n;Y(E&&I,e,"internal-error");const _=zs.fromJSON(this.name,I);Y(typeof E=="string",e,"internal-error"),ur(f,e.name),ur(m,e.name),Y(typeof x=="boolean",e,"internal-error"),Y(typeof M=="boolean",e,"internal-error"),ur(v,e.name),ur(S,e.name),ur(P,e.name),ur(C,e.name),ur(w,e.name),ur(y,e.name);const T=new Bn({uid:E,auth:e,email:m,emailVerified:x,displayName:f,isAnonymous:M,photoURL:S,phoneNumber:v,tenantId:P,stsTokenManager:_,createdAt:w,lastLoginAt:y});return F&&Array.isArray(F)&&(T.providerData=F.map(A=>Object.assign({},A))),C&&(T._redirectEventId=C),T}static async _fromIdTokenResponse(e,n,r=!1){const i=new zs;i.updateFromServerResponse(n);const s=new Bn({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await kc(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];Y(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?HT(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),a=new zs;a.updateFromIdToken(r);const u=new Bn({uid:i.localId,auth:e,stsTokenManager:a,isAnonymous:o}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new tp(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(u,c),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wv=new Map;function jn(t){Jn(t instanceof Function,"Expected a class definition");let e=wv.get(t);return e?(Jn(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,wv.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QT{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}QT.type="NONE";const Ev=QT;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ju(t,e,n){return`firebase:${t}:${e}:${n}`}class $s{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=ju(this.userKey,i.apiKey,s),this.fullPersistenceKey=ju("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Bn._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new $s(jn(Ev),e,r);const i=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let s=i[0]||jn(Ev);const o=ju(r,e.config.apiKey,e.name);let a=null;for(const c of n)try{const d=await c._get(o);if(d){const f=Bn._fromJSON(e,d);c!==s&&(a=f),s=c;break}}catch{}const u=i.filter(c=>c._shouldAllowMigration);return!s._shouldAllowMigration||!u.length?new $s(s,e,r):(s=u[0],a&&await s._set(o,a.toJSON()),await Promise.all(n.map(async c=>{if(c!==s)try{await c._remove(o)}catch{}})),new $s(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Iv(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(ZT(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(JT(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(t0(e))return"Blackberry";if(n0(e))return"Webos";if(YT(e))return"Safari";if((e.includes("chrome/")||XT(e))&&!e.includes("edge/"))return"Chrome";if(e0(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function JT(t=Ye()){return/firefox\//i.test(t)}function YT(t=Ye()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function XT(t=Ye()){return/crios\//i.test(t)}function ZT(t=Ye()){return/iemobile/i.test(t)}function e0(t=Ye()){return/android/i.test(t)}function t0(t=Ye()){return/blackberry/i.test(t)}function n0(t=Ye()){return/webos/i.test(t)}function Nm(t=Ye()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function db(t=Ye()){var e;return Nm(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function fb(){return bx()&&document.documentMode===10}function r0(t=Ye()){return Nm(t)||e0(t)||n0(t)||t0(t)||/windows phone/i.test(t)||ZT(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function i0(t,e=[]){let n;switch(t){case"Browser":n=Iv(Ye());break;case"Worker":n=`${Iv(Ye())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${ni}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pb{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((o,a)=>{try{const u=e(s);o(u)}catch(u){a(u)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mb(t,e={}){return ii(t,"GET","/v2/passwordPolicy",ri(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gb=6;class _b{constructor(e){var n,r,i,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:gb,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,r,i,s,o,a;const u={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,u),this.validatePasswordCharacterOptions(e,u),u.isValid&&(u.isValid=(n=u.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),u.isValid&&(u.isValid=(r=u.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),u.isValid&&(u.isValid=(i=u.containsLowercaseLetter)!==null&&i!==void 0?i:!0),u.isValid&&(u.isValid=(s=u.containsUppercaseLetter)!==null&&s!==void 0?s:!0),u.isValid&&(u.isValid=(o=u.containsNumericCharacter)!==null&&o!==void 0?o:!0),u.isValid&&(u.isValid=(a=u.containsNonAlphanumericCharacter)!==null&&a!==void 0?a:!0),u}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yb{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Tv(this),this.idTokenSubscription=new Tv(this),this.beforeStateQueue=new pb(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=zT,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=jn(n)),this._initializationPromise=this.queue(async()=>{var r,i;if(!this._deleted&&(this.persistenceManager=await $s.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await WT(this,{idToken:e}),r=await Bn._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(an(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,a=i==null?void 0:i._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===a)&&(u!=null&&u.user)&&(i=u.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return Y(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await kc(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Y1()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(an(this.app))return Promise.reject(qn(this));const n=e?ce(e):null;return n&&Y(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&Y(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return an(this.app)?Promise.reject(qn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return an(this.app)?Promise.reject(qn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(jn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await mb(this),n=new _b(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new _l("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await hb(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&jn(e)||this._popupRedirectResolver;Y(n,this,"argument-error"),this.redirectPersistenceManager=await $s.create(this,[jn(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if(Y(a,this,"internal-error"),a.then(()=>{o||s(this.currentUser)}),typeof n=="function"){const u=e.addObserver(n,r,i);return()=>{o=!0,u()}}else{const u=e.addObserver(n);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return Y(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=i0(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(n["X-Firebase-Client"]=r);const i=await this._getAppCheckToken();return i&&(n["X-Firebase-AppCheck"]=i),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&H1(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function is(t){return ce(t)}class Tv{constructor(e){this.auth=e,this.observer=null,this.addObserver=Mx(n=>this.observer=n)}get next(){return Y(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let dh={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function vb(t){dh=t}function s0(t){return dh.loadJS(t)}function wb(){return dh.recaptchaEnterpriseScript}function Eb(){return dh.gapiScript}function Ib(t){return`__${t}${Math.floor(Math.random()*1e6)}`}const Tb="recaptcha-enterprise",Sb="NO_RECAPTCHA";class Ab{constructor(e){this.type=Tb,this.auth=is(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(o,a)=>{rb(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)a(new Error("recaptcha Enterprise site key undefined"));else{const c=new nb(u);return s.tenantId==null?s._agentRecaptchaConfig=c:s._tenantRecaptchaConfigs[s.tenantId]=c,o(c.siteKey)}}).catch(u=>{a(u)})})}function i(s,o,a){const u=window.grecaptcha;yv(u)?u.enterprise.ready(()=>{u.enterprise.execute(s,{action:e}).then(c=>{o(c)}).catch(()=>{o(Sb)})}):a(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((s,o)=>{r(this.auth).then(a=>{if(!n&&yv(window.grecaptcha))i(a,s,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=wb();u.length!==0&&(u+=a),s0(u).then(()=>{i(a,s,o)}).catch(c=>{o(c)})}}).catch(a=>{o(a)})})}}async function Sv(t,e,n,r=!1){const i=new Ab(t);let s;try{s=await i.verify(n)}catch{s=await i.verify(n,!0)}const o=Object.assign({},e);return r?Object.assign(o,{captchaResp:s}):Object.assign(o,{captchaResponse:s}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function np(t,e,n,r){var i;if(!((i=t._getRecaptchaConfig())===null||i===void 0)&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const s=await Sv(t,e,n,n==="getOobCode");return r(t,s)}else return r(t,e).catch(async s=>{if(s.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Sv(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(s)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rb(t,e){const n=rs(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(zr(s,e??{}))return i;dn(i,"already-initialized")}return n.initialize({options:e})}function Pb(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(jn);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Cb(t,e,n){const r=is(t);Y(r._canInitEmulator,r,"emulator-config-failed"),Y(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=o0(e),{host:o,port:a}=kb(e),u=a===null?"":`:${a}`;r.config.emulator={url:`${s}//${o}${u}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:o,port:a,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),xb()}function o0(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function kb(t){const e=o0(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Av(r.substr(s.length+1))}}else{const[s,o]=r.split(":");return{host:s,port:Av(o)}}}function Av(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function xb(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dm{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Un("not implemented")}_getIdTokenResponse(e){return Un("not implemented")}_linkToIdToken(e,n){return Un("not implemented")}_getReauthenticationResolver(e){return Un("not implemented")}}async function bb(t,e){return ii(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Nb(t,e){return wl(t,"POST","/v1/accounts:signInWithPassword",ri(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Db(t,e){return wl(t,"POST","/v1/accounts:signInWithEmailLink",ri(t,e))}async function Vb(t,e){return wl(t,"POST","/v1/accounts:signInWithEmailLink",ri(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class el extends Dm{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new el(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new el(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return np(e,n,"signInWithPassword",Nb);case"emailLink":return Db(e,{email:this._email,oobCode:this._password});default:dn(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return np(e,r,"signUpPassword",bb);case"emailLink":return Vb(e,{idToken:n,email:this._email,oobCode:this._password});default:dn(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qs(t,e){return wl(t,"POST","/v1/accounts:signInWithIdp",ri(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ob="http://localhost";class ji extends Dm{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new ji(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):dn("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=n,s=Cm(n,["providerId","signInMethod"]);if(!r||!i)return null;const o=new ji(r,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return qs(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,qs(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,qs(e,n)}buildRequest(){const e={requestUri:Ob,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=yl(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lb(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Mb(t){const e=ca(ha(t)).link,n=e?ca(ha(e)).deep_link_id:null,r=ca(ha(t)).deep_link_id;return(r?ca(ha(r)).link:null)||r||n||e||t}class Vm{constructor(e){var n,r,i,s,o,a;const u=ca(ha(e)),c=(n=u.apiKey)!==null&&n!==void 0?n:null,d=(r=u.oobCode)!==null&&r!==void 0?r:null,f=Lb((i=u.mode)!==null&&i!==void 0?i:null);Y(c&&d&&f,"argument-error"),this.apiKey=c,this.operation=f,this.code=d,this.continueUrl=(s=u.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(o=u.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(a=u.tenantId)!==null&&a!==void 0?a:null}static parseLink(e){const n=Mb(e);try{return new Vm(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eo{constructor(){this.providerId=Eo.PROVIDER_ID}static credential(e,n){return el._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=Vm.parseLink(n);return Y(r,"argument-error"),el._fromEmailAndCode(e,r.code,r.tenantId)}}Eo.PROVIDER_ID="password";Eo.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Eo.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class a0{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class El extends a0{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _r extends El{constructor(){super("facebook.com")}static credential(e){return ji._fromParams({providerId:_r.PROVIDER_ID,signInMethod:_r.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return _r.credentialFromTaggedObject(e)}static credentialFromError(e){return _r.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return _r.credential(e.oauthAccessToken)}catch{return null}}}_r.FACEBOOK_SIGN_IN_METHOD="facebook.com";_r.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yr extends El{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return ji._fromParams({providerId:yr.PROVIDER_ID,signInMethod:yr.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return yr.credentialFromTaggedObject(e)}static credentialFromError(e){return yr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return yr.credential(n,r)}catch{return null}}}yr.GOOGLE_SIGN_IN_METHOD="google.com";yr.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vr extends El{constructor(){super("github.com")}static credential(e){return ji._fromParams({providerId:vr.PROVIDER_ID,signInMethod:vr.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return vr.credentialFromTaggedObject(e)}static credentialFromError(e){return vr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return vr.credential(e.oauthAccessToken)}catch{return null}}}vr.GITHUB_SIGN_IN_METHOD="github.com";vr.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wr extends El{constructor(){super("twitter.com")}static credential(e,n){return ji._fromParams({providerId:wr.PROVIDER_ID,signInMethod:wr.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return wr.credentialFromTaggedObject(e)}static credentialFromError(e){return wr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return wr.credential(n,r)}catch{return null}}}wr.TWITTER_SIGN_IN_METHOD="twitter.com";wr.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fb(t,e){return wl(t,"POST","/v1/accounts:signUp",ri(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zi{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await Bn._fromIdTokenResponse(e,r,i),o=Rv(r);return new zi({user:s,providerId:o,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Rv(r);return new zi({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Rv(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xc extends fn{constructor(e,n,r,i){var s;super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,xc.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new xc(e,n,r,i)}}function l0(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?xc._fromErrorAndOperation(t,s,e,r):s})}async function Ub(t,e,n=!1){const r=await Za(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return zi._forOperation(t,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bb(t,e,n=!1){const{auth:r}=t;if(an(r.app))return Promise.reject(qn(r));const i="reauthenticate";try{const s=await Za(t,l0(r,i,e,t),n);Y(s.idToken,r,"internal-error");const o=bm(s.idToken);Y(o,r,"internal-error");const{sub:a}=o;return Y(t.uid===a,r,"user-mismatch"),zi._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&dn(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function u0(t,e,n=!1){if(an(t.app))return Promise.reject(qn(t));const r="signIn",i=await l0(t,r,e),s=await zi._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function jb(t,e){return u0(is(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function c0(t){const e=is(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function zb(t,e,n){if(an(t.app))return Promise.reject(qn(t));const r=is(t),o=await np(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Fb).catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&c0(t),u}),a=await zi._fromIdTokenResponse(r,"signIn",o);return await r._updateCurrentUser(a.user),a}function $b(t,e,n){return an(t.app)?Promise.reject(qn(t)):jb(ce(t),Eo.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&c0(t),r})}function qb(t,e,n,r){return ce(t).onIdTokenChanged(e,n,r)}function Gb(t,e,n){return ce(t).beforeAuthStateChanged(e,n)}function Kb(t,e,n,r){return ce(t).onAuthStateChanged(e,n,r)}function Pv(t){return ce(t).signOut()}const bc="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class h0{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(bc,"1"),this.storage.removeItem(bc),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wb=1e3,Hb=10;class d0 extends h0{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=r0(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,a,u)=>{this.notifyListeners(o,u)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(r);!n&&this.localCache[r]===o||this.notifyListeners(r,o)},s=this.storage.getItem(r);fb()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Hb):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},Wb)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}d0.type="LOCAL";const Qb=d0;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f0 extends h0{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}f0.type="SESSION";const p0=f0;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jb(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fh{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new fh(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const a=Array.from(o).map(async c=>c(n.origin,s)),u=await Jb(a);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:u})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}fh.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Om(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yb{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((a,u)=>{const c=Om("",20);i.port1.start();const d=setTimeout(()=>{u(new Error("unsupported_event"))},r);o={messageChannel:i,onMessage(f){const m=f;if(m.data.eventId===c)switch(m.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),a(m.data.response);break;default:clearTimeout(d),clearTimeout(s),u(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tn(){return window}function Xb(t){Tn().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function m0(){return typeof Tn().WorkerGlobalScope<"u"&&typeof Tn().importScripts=="function"}async function Zb(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function eN(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function tN(){return m0()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const g0="firebaseLocalStorageDb",nN=1,Nc="firebaseLocalStorage",_0="fbase_key";class Il{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function ph(t,e){return t.transaction([Nc],e?"readwrite":"readonly").objectStore(Nc)}function rN(){const t=indexedDB.deleteDatabase(g0);return new Il(t).toPromise()}function rp(){const t=indexedDB.open(g0,nN);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(Nc,{keyPath:_0})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(Nc)?e(r):(r.close(),await rN(),e(await rp()))})})}async function Cv(t,e,n){const r=ph(t,!0).put({[_0]:e,value:n});return new Il(r).toPromise()}async function iN(t,e){const n=ph(t,!1).get(e),r=await new Il(n).toPromise();return r===void 0?null:r.value}function kv(t,e){const n=ph(t,!0).delete(e);return new Il(n).toPromise()}const sN=800,oN=3;class y0{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await rp(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>oN)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return m0()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=fh._getInstance(tN()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await Zb(),!this.activeServiceWorker)return;this.sender=new Yb(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((n=r[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||eN()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await rp();return await Cv(e,bc,"1"),await kv(e,bc),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Cv(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>iN(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>kv(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=ph(i,!1).getAll();return new Il(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),sN)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}y0.type="LOCAL";const aN=y0;new vl(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lN(t,e){return e?jn(e):(Y(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lm extends Dm{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return qs(e,this._buildIdpRequest())}_linkToIdToken(e,n){return qs(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return qs(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function uN(t){return u0(t.auth,new Lm(t),t.bypassAuthState)}function cN(t){const{auth:e,user:n}=t;return Y(n,e,"internal-error"),Bb(n,new Lm(t),t.bypassAuthState)}async function hN(t){const{auth:e,user:n}=t;return Y(n,e,"internal-error"),Ub(n,new Lm(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v0{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:o,type:a}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(u))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return uN;case"linkViaPopup":case"linkViaRedirect":return hN;case"reauthViaPopup":case"reauthViaRedirect":return cN;default:dn(this.auth,"internal-error")}}resolve(e){Jn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Jn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dN=new vl(2e3,1e4);class Os extends v0{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,Os.currentPopupAction&&Os.currentPopupAction.cancel(),Os.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return Y(e,this.auth,"internal-error"),e}async onExecution(){Jn(this.filter.length===1,"Popup operations only handle one event");const e=Om();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(In(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(In(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Os.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if(!((r=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(In(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,dN.get())};e()}}Os.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fN="pendingRedirect",zu=new Map;class pN extends v0{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=zu.get(this.auth._key());if(!e){try{const r=await mN(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}zu.set(this.auth._key(),e)}return this.bypassAuthState||zu.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function mN(t,e){const n=yN(e),r=_N(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}function gN(t,e){zu.set(t._key(),e)}function _N(t){return jn(t._redirectPersistence)}function yN(t){return ju(fN,t.config.apiKey,t.name)}async function vN(t,e,n=!1){if(an(t.app))return Promise.reject(qn(t));const r=is(t),i=lN(r,e),o=await new pN(r,i,n).execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wN=10*60*1e3;class EN{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!IN(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!w0(e)){const i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";n.onError(In(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=wN&&this.cachedEventUids.clear(),this.cachedEventUids.has(xv(e))}saveEventToCache(e){this.cachedEventUids.add(xv(e)),this.lastProcessedEventTime=Date.now()}}function xv(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function w0({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function IN(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return w0(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function TN(t,e={}){return ii(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const SN=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,AN=/^https?/;async function RN(t){if(t.config.emulator)return;const{authorizedDomains:e}=await TN(t);for(const n of e)try{if(PN(n))return}catch{}dn(t,"unauthorized-domain")}function PN(t){const e=ep(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===r}if(!AN.test(n))return!1;if(SN.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const CN=new vl(3e4,6e4);function bv(){const t=Tn().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function kN(t){return new Promise((e,n)=>{var r,i,s;function o(){bv(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{bv(),n(In(t,"network-request-failed"))},timeout:CN.get()})}if(!((i=(r=Tn().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=Tn().gapi)===null||s===void 0)&&s.load)o();else{const a=Ib("iframefcb");return Tn()[a]=()=>{gapi.load?o():n(In(t,"network-request-failed"))},s0(`${Eb()}?onload=${a}`).catch(u=>n(u))}}).catch(e=>{throw $u=null,e})}let $u=null;function xN(t){return $u=$u||kN(t),$u}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bN=new vl(5e3,15e3),NN="__/auth/iframe",DN="emulator/auth/iframe",VN={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},ON=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function LN(t){const e=t.config;Y(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?xm(e,DN):`https://${t.config.authDomain}/${NN}`,r={apiKey:e.apiKey,appName:t.name,v:ni},i=ON.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${yl(r).slice(1)}`}async function MN(t){const e=await xN(t),n=Tn().gapi;return Y(n,t,"internal-error"),e.open({where:document.body,url:LN(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:VN,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const o=In(t,"network-request-failed"),a=Tn().setTimeout(()=>{s(o)},bN.get());function u(){Tn().clearTimeout(a),i(r)}r.ping(u).then(u,()=>{s(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const FN={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},UN=500,BN=600,jN="_blank",zN="http://localhost";class Nv{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function $N(t,e,n,r=UN,i=BN){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let a="";const u=Object.assign(Object.assign({},FN),{width:r.toString(),height:i.toString(),top:s,left:o}),c=Ye().toLowerCase();n&&(a=XT(c)?jN:n),JT(c)&&(e=e||zN,u.scrollbars="yes");const d=Object.entries(u).reduce((m,[v,S])=>`${m}${v}=${S},`,"");if(db(c)&&a!=="_self")return qN(e||"",a),new Nv(null);const f=window.open(e||"",a,d);Y(f,t,"popup-blocked");try{f.focus()}catch{}return new Nv(f)}function qN(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const GN="__/auth/handler",KN="emulator/auth/handler",WN=encodeURIComponent("fac");async function Dv(t,e,n,r,i,s){Y(t.config.authDomain,t,"auth-domain-config-required"),Y(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:ni,eventId:i};if(e instanceof a0){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",Lx(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,f]of Object.entries({}))o[d]=f}if(e instanceof El){const d=e.getScopes().filter(f=>f!=="");d.length>0&&(o.scopes=d.join(","))}t.tenantId&&(o.tid=t.tenantId);const a=o;for(const d of Object.keys(a))a[d]===void 0&&delete a[d];const u=await t._getAppCheckToken(),c=u?`#${WN}=${encodeURIComponent(u)}`:"";return`${HN(t)}?${yl(a).slice(1)}${c}`}function HN({config:t}){return t.emulator?xm(t,KN):`https://${t.authDomain}/${GN}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zd="webStorageSupport";class QN{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=p0,this._completeRedirectFn=vN,this._overrideRedirectResult=gN}async _openPopup(e,n,r,i){var s;Jn((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await Dv(e,n,r,ep(),i);return $N(e,o,Om())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Dv(e,n,r,ep(),i);return Xb(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(Jn(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await MN(e),r=new EN(e);return n.register("authEvent",i=>(Y(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(zd,{type:zd},i=>{var s;const o=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[zd];o!==void 0&&n(!!o),dn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=RN(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return r0()||YT()||Nm()}}const JN=QN;var Vv="@firebase/auth",Ov="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YN{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){Y(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function XN(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function ZN(t){qr(new $r("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=r.options;Y(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:o,authDomain:a,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:i0(t)},c=new yb(r,i,s,u);return Pb(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),qr(new $r("auth-internal",e=>{const n=is(e.getProvider("auth").getImmediate());return(r=>new YN(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),cn(Vv,Ov,XN(t)),cn(Vv,Ov,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eD=5*60,tD=NT("authIdTokenMaxAge")||eD;let Lv=null;const nD=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>tD)return;const i=n==null?void 0:n.token;Lv!==i&&(Lv=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function E0(t=hh()){const e=rs(t,"auth");if(e.isInitialized())return e.getImmediate();const n=Rb(t,{popupRedirectResolver:JN,persistence:[aN,Qb,p0]}),r=NT("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const o=nD(s.toString());Gb(n,o,()=>o(n.currentUser)),qb(n,a=>o(a))}}const i=kT("auth");return i&&Cb(n,`http://${i}`),n}function rD(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}vb({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=In("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",rD().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});ZN("Browser");var Mv=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ni,I0;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,_){function T(){}T.prototype=_.prototype,I.D=_.prototype,I.prototype=new T,I.prototype.constructor=I,I.C=function(A,k,N){for(var R=Array(arguments.length-2),Ze=2;Ze<arguments.length;Ze++)R[Ze-2]=arguments[Ze];return _.prototype[k].apply(A,R)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,n),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(I,_,T){T||(T=0);var A=Array(16);if(typeof _=="string")for(var k=0;16>k;++k)A[k]=_.charCodeAt(T++)|_.charCodeAt(T++)<<8|_.charCodeAt(T++)<<16|_.charCodeAt(T++)<<24;else for(k=0;16>k;++k)A[k]=_[T++]|_[T++]<<8|_[T++]<<16|_[T++]<<24;_=I.g[0],T=I.g[1],k=I.g[2];var N=I.g[3],R=_+(N^T&(k^N))+A[0]+3614090360&4294967295;_=T+(R<<7&4294967295|R>>>25),R=N+(k^_&(T^k))+A[1]+3905402710&4294967295,N=_+(R<<12&4294967295|R>>>20),R=k+(T^N&(_^T))+A[2]+606105819&4294967295,k=N+(R<<17&4294967295|R>>>15),R=T+(_^k&(N^_))+A[3]+3250441966&4294967295,T=k+(R<<22&4294967295|R>>>10),R=_+(N^T&(k^N))+A[4]+4118548399&4294967295,_=T+(R<<7&4294967295|R>>>25),R=N+(k^_&(T^k))+A[5]+1200080426&4294967295,N=_+(R<<12&4294967295|R>>>20),R=k+(T^N&(_^T))+A[6]+2821735955&4294967295,k=N+(R<<17&4294967295|R>>>15),R=T+(_^k&(N^_))+A[7]+4249261313&4294967295,T=k+(R<<22&4294967295|R>>>10),R=_+(N^T&(k^N))+A[8]+1770035416&4294967295,_=T+(R<<7&4294967295|R>>>25),R=N+(k^_&(T^k))+A[9]+2336552879&4294967295,N=_+(R<<12&4294967295|R>>>20),R=k+(T^N&(_^T))+A[10]+4294925233&4294967295,k=N+(R<<17&4294967295|R>>>15),R=T+(_^k&(N^_))+A[11]+2304563134&4294967295,T=k+(R<<22&4294967295|R>>>10),R=_+(N^T&(k^N))+A[12]+1804603682&4294967295,_=T+(R<<7&4294967295|R>>>25),R=N+(k^_&(T^k))+A[13]+4254626195&4294967295,N=_+(R<<12&4294967295|R>>>20),R=k+(T^N&(_^T))+A[14]+2792965006&4294967295,k=N+(R<<17&4294967295|R>>>15),R=T+(_^k&(N^_))+A[15]+1236535329&4294967295,T=k+(R<<22&4294967295|R>>>10),R=_+(k^N&(T^k))+A[1]+4129170786&4294967295,_=T+(R<<5&4294967295|R>>>27),R=N+(T^k&(_^T))+A[6]+3225465664&4294967295,N=_+(R<<9&4294967295|R>>>23),R=k+(_^T&(N^_))+A[11]+643717713&4294967295,k=N+(R<<14&4294967295|R>>>18),R=T+(N^_&(k^N))+A[0]+3921069994&4294967295,T=k+(R<<20&4294967295|R>>>12),R=_+(k^N&(T^k))+A[5]+3593408605&4294967295,_=T+(R<<5&4294967295|R>>>27),R=N+(T^k&(_^T))+A[10]+38016083&4294967295,N=_+(R<<9&4294967295|R>>>23),R=k+(_^T&(N^_))+A[15]+3634488961&4294967295,k=N+(R<<14&4294967295|R>>>18),R=T+(N^_&(k^N))+A[4]+3889429448&4294967295,T=k+(R<<20&4294967295|R>>>12),R=_+(k^N&(T^k))+A[9]+568446438&4294967295,_=T+(R<<5&4294967295|R>>>27),R=N+(T^k&(_^T))+A[14]+3275163606&4294967295,N=_+(R<<9&4294967295|R>>>23),R=k+(_^T&(N^_))+A[3]+4107603335&4294967295,k=N+(R<<14&4294967295|R>>>18),R=T+(N^_&(k^N))+A[8]+1163531501&4294967295,T=k+(R<<20&4294967295|R>>>12),R=_+(k^N&(T^k))+A[13]+2850285829&4294967295,_=T+(R<<5&4294967295|R>>>27),R=N+(T^k&(_^T))+A[2]+4243563512&4294967295,N=_+(R<<9&4294967295|R>>>23),R=k+(_^T&(N^_))+A[7]+1735328473&4294967295,k=N+(R<<14&4294967295|R>>>18),R=T+(N^_&(k^N))+A[12]+2368359562&4294967295,T=k+(R<<20&4294967295|R>>>12),R=_+(T^k^N)+A[5]+4294588738&4294967295,_=T+(R<<4&4294967295|R>>>28),R=N+(_^T^k)+A[8]+2272392833&4294967295,N=_+(R<<11&4294967295|R>>>21),R=k+(N^_^T)+A[11]+1839030562&4294967295,k=N+(R<<16&4294967295|R>>>16),R=T+(k^N^_)+A[14]+4259657740&4294967295,T=k+(R<<23&4294967295|R>>>9),R=_+(T^k^N)+A[1]+2763975236&4294967295,_=T+(R<<4&4294967295|R>>>28),R=N+(_^T^k)+A[4]+1272893353&4294967295,N=_+(R<<11&4294967295|R>>>21),R=k+(N^_^T)+A[7]+4139469664&4294967295,k=N+(R<<16&4294967295|R>>>16),R=T+(k^N^_)+A[10]+3200236656&4294967295,T=k+(R<<23&4294967295|R>>>9),R=_+(T^k^N)+A[13]+681279174&4294967295,_=T+(R<<4&4294967295|R>>>28),R=N+(_^T^k)+A[0]+3936430074&4294967295,N=_+(R<<11&4294967295|R>>>21),R=k+(N^_^T)+A[3]+3572445317&4294967295,k=N+(R<<16&4294967295|R>>>16),R=T+(k^N^_)+A[6]+76029189&4294967295,T=k+(R<<23&4294967295|R>>>9),R=_+(T^k^N)+A[9]+3654602809&4294967295,_=T+(R<<4&4294967295|R>>>28),R=N+(_^T^k)+A[12]+3873151461&4294967295,N=_+(R<<11&4294967295|R>>>21),R=k+(N^_^T)+A[15]+530742520&4294967295,k=N+(R<<16&4294967295|R>>>16),R=T+(k^N^_)+A[2]+3299628645&4294967295,T=k+(R<<23&4294967295|R>>>9),R=_+(k^(T|~N))+A[0]+4096336452&4294967295,_=T+(R<<6&4294967295|R>>>26),R=N+(T^(_|~k))+A[7]+1126891415&4294967295,N=_+(R<<10&4294967295|R>>>22),R=k+(_^(N|~T))+A[14]+2878612391&4294967295,k=N+(R<<15&4294967295|R>>>17),R=T+(N^(k|~_))+A[5]+4237533241&4294967295,T=k+(R<<21&4294967295|R>>>11),R=_+(k^(T|~N))+A[12]+1700485571&4294967295,_=T+(R<<6&4294967295|R>>>26),R=N+(T^(_|~k))+A[3]+2399980690&4294967295,N=_+(R<<10&4294967295|R>>>22),R=k+(_^(N|~T))+A[10]+4293915773&4294967295,k=N+(R<<15&4294967295|R>>>17),R=T+(N^(k|~_))+A[1]+2240044497&4294967295,T=k+(R<<21&4294967295|R>>>11),R=_+(k^(T|~N))+A[8]+1873313359&4294967295,_=T+(R<<6&4294967295|R>>>26),R=N+(T^(_|~k))+A[15]+4264355552&4294967295,N=_+(R<<10&4294967295|R>>>22),R=k+(_^(N|~T))+A[6]+2734768916&4294967295,k=N+(R<<15&4294967295|R>>>17),R=T+(N^(k|~_))+A[13]+1309151649&4294967295,T=k+(R<<21&4294967295|R>>>11),R=_+(k^(T|~N))+A[4]+4149444226&4294967295,_=T+(R<<6&4294967295|R>>>26),R=N+(T^(_|~k))+A[11]+3174756917&4294967295,N=_+(R<<10&4294967295|R>>>22),R=k+(_^(N|~T))+A[2]+718787259&4294967295,k=N+(R<<15&4294967295|R>>>17),R=T+(N^(k|~_))+A[9]+3951481745&4294967295,I.g[0]=I.g[0]+_&4294967295,I.g[1]=I.g[1]+(k+(R<<21&4294967295|R>>>11))&4294967295,I.g[2]=I.g[2]+k&4294967295,I.g[3]=I.g[3]+N&4294967295}r.prototype.u=function(I,_){_===void 0&&(_=I.length);for(var T=_-this.blockSize,A=this.B,k=this.h,N=0;N<_;){if(k==0)for(;N<=T;)i(this,I,N),N+=this.blockSize;if(typeof I=="string"){for(;N<_;)if(A[k++]=I.charCodeAt(N++),k==this.blockSize){i(this,A),k=0;break}}else for(;N<_;)if(A[k++]=I[N++],k==this.blockSize){i(this,A),k=0;break}}this.h=k,this.o+=_},r.prototype.v=function(){var I=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);I[0]=128;for(var _=1;_<I.length-8;++_)I[_]=0;var T=8*this.o;for(_=I.length-8;_<I.length;++_)I[_]=T&255,T/=256;for(this.u(I),I=Array(16),_=T=0;4>_;++_)for(var A=0;32>A;A+=8)I[T++]=this.g[_]>>>A&255;return I};function s(I,_){var T=a;return Object.prototype.hasOwnProperty.call(T,I)?T[I]:T[I]=_(I)}function o(I,_){this.h=_;for(var T=[],A=!0,k=I.length-1;0<=k;k--){var N=I[k]|0;A&&N==_||(T[k]=N,A=!1)}this.g=T}var a={};function u(I){return-128<=I&&128>I?s(I,function(_){return new o([_|0],0>_?-1:0)}):new o([I|0],0>I?-1:0)}function c(I){if(isNaN(I)||!isFinite(I))return f;if(0>I)return C(c(-I));for(var _=[],T=1,A=0;I>=T;A++)_[A]=I/T|0,T*=4294967296;return new o(_,0)}function d(I,_){if(I.length==0)throw Error("number format error: empty string");if(_=_||10,2>_||36<_)throw Error("radix out of range: "+_);if(I.charAt(0)=="-")return C(d(I.substring(1),_));if(0<=I.indexOf("-"))throw Error('number format error: interior "-" character');for(var T=c(Math.pow(_,8)),A=f,k=0;k<I.length;k+=8){var N=Math.min(8,I.length-k),R=parseInt(I.substring(k,k+N),_);8>N?(N=c(Math.pow(_,N)),A=A.j(N).add(c(R))):(A=A.j(T),A=A.add(c(R)))}return A}var f=u(0),m=u(1),v=u(16777216);t=o.prototype,t.m=function(){if(P(this))return-C(this).m();for(var I=0,_=1,T=0;T<this.g.length;T++){var A=this.i(T);I+=(0<=A?A:4294967296+A)*_,_*=4294967296}return I},t.toString=function(I){if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(S(this))return"0";if(P(this))return"-"+C(this).toString(I);for(var _=c(Math.pow(I,6)),T=this,A="";;){var k=x(T,_).g;T=w(T,k.j(_));var N=((0<T.g.length?T.g[0]:T.h)>>>0).toString(I);if(T=k,S(T))return N+A;for(;6>N.length;)N="0"+N;A=N+A}},t.i=function(I){return 0>I?0:I<this.g.length?this.g[I]:this.h};function S(I){if(I.h!=0)return!1;for(var _=0;_<I.g.length;_++)if(I.g[_]!=0)return!1;return!0}function P(I){return I.h==-1}t.l=function(I){return I=w(this,I),P(I)?-1:S(I)?0:1};function C(I){for(var _=I.g.length,T=[],A=0;A<_;A++)T[A]=~I.g[A];return new o(T,~I.h).add(m)}t.abs=function(){return P(this)?C(this):this},t.add=function(I){for(var _=Math.max(this.g.length,I.g.length),T=[],A=0,k=0;k<=_;k++){var N=A+(this.i(k)&65535)+(I.i(k)&65535),R=(N>>>16)+(this.i(k)>>>16)+(I.i(k)>>>16);A=R>>>16,N&=65535,R&=65535,T[k]=R<<16|N}return new o(T,T[T.length-1]&-2147483648?-1:0)};function w(I,_){return I.add(C(_))}t.j=function(I){if(S(this)||S(I))return f;if(P(this))return P(I)?C(this).j(C(I)):C(C(this).j(I));if(P(I))return C(this.j(C(I)));if(0>this.l(v)&&0>I.l(v))return c(this.m()*I.m());for(var _=this.g.length+I.g.length,T=[],A=0;A<2*_;A++)T[A]=0;for(A=0;A<this.g.length;A++)for(var k=0;k<I.g.length;k++){var N=this.i(A)>>>16,R=this.i(A)&65535,Ze=I.i(k)>>>16,hi=I.i(k)&65535;T[2*A+2*k]+=R*hi,y(T,2*A+2*k),T[2*A+2*k+1]+=N*hi,y(T,2*A+2*k+1),T[2*A+2*k+1]+=R*Ze,y(T,2*A+2*k+1),T[2*A+2*k+2]+=N*Ze,y(T,2*A+2*k+2)}for(A=0;A<_;A++)T[A]=T[2*A+1]<<16|T[2*A];for(A=_;A<2*_;A++)T[A]=0;return new o(T,0)};function y(I,_){for(;(I[_]&65535)!=I[_];)I[_+1]+=I[_]>>>16,I[_]&=65535,_++}function E(I,_){this.g=I,this.h=_}function x(I,_){if(S(_))throw Error("division by zero");if(S(I))return new E(f,f);if(P(I))return _=x(C(I),_),new E(C(_.g),C(_.h));if(P(_))return _=x(I,C(_)),new E(C(_.g),_.h);if(30<I.g.length){if(P(I)||P(_))throw Error("slowDivide_ only works with positive integers.");for(var T=m,A=_;0>=A.l(I);)T=M(T),A=M(A);var k=F(T,1),N=F(A,1);for(A=F(A,2),T=F(T,2);!S(A);){var R=N.add(A);0>=R.l(I)&&(k=k.add(T),N=R),A=F(A,1),T=F(T,1)}return _=w(I,k.j(_)),new E(k,_)}for(k=f;0<=I.l(_);){for(T=Math.max(1,Math.floor(I.m()/_.m())),A=Math.ceil(Math.log(T)/Math.LN2),A=48>=A?1:Math.pow(2,A-48),N=c(T),R=N.j(_);P(R)||0<R.l(I);)T-=A,N=c(T),R=N.j(_);S(N)&&(N=m),k=k.add(N),I=w(I,R)}return new E(k,I)}t.A=function(I){return x(this,I).h},t.and=function(I){for(var _=Math.max(this.g.length,I.g.length),T=[],A=0;A<_;A++)T[A]=this.i(A)&I.i(A);return new o(T,this.h&I.h)},t.or=function(I){for(var _=Math.max(this.g.length,I.g.length),T=[],A=0;A<_;A++)T[A]=this.i(A)|I.i(A);return new o(T,this.h|I.h)},t.xor=function(I){for(var _=Math.max(this.g.length,I.g.length),T=[],A=0;A<_;A++)T[A]=this.i(A)^I.i(A);return new o(T,this.h^I.h)};function M(I){for(var _=I.g.length+1,T=[],A=0;A<_;A++)T[A]=I.i(A)<<1|I.i(A-1)>>>31;return new o(T,I.h)}function F(I,_){var T=_>>5;_%=32;for(var A=I.g.length-T,k=[],N=0;N<A;N++)k[N]=0<_?I.i(N+T)>>>_|I.i(N+T+1)<<32-_:I.i(N+T);return new o(k,I.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,I0=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=c,o.fromString=d,Ni=o}).apply(typeof Mv<"u"?Mv:typeof self<"u"?self:typeof window<"u"?window:{});var vu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var T0,da,S0,qu,ip,A0,R0,P0;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(l,h,p){return l==Array.prototype||l==Object.prototype||(l[h]=p.value),l};function n(l){l=[typeof globalThis=="object"&&globalThis,l,typeof window=="object"&&window,typeof self=="object"&&self,typeof vu=="object"&&vu];for(var h=0;h<l.length;++h){var p=l[h];if(p&&p.Math==Math)return p}throw Error("Cannot find global object")}var r=n(this);function i(l,h){if(h)e:{var p=r;l=l.split(".");for(var g=0;g<l.length-1;g++){var D=l[g];if(!(D in p))break e;p=p[D]}l=l[l.length-1],g=p[l],h=h(g),h!=g&&h!=null&&e(p,l,{configurable:!0,writable:!0,value:h})}}function s(l,h){l instanceof String&&(l+="");var p=0,g=!1,D={next:function(){if(!g&&p<l.length){var L=p++;return{value:h(L,l[L]),done:!1}}return g=!0,{done:!0,value:void 0}}};return D[Symbol.iterator]=function(){return D},D}i("Array.prototype.values",function(l){return l||function(){return s(this,function(h,p){return p})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},a=this||self;function u(l){var h=typeof l;return h=h!="object"?h:l?Array.isArray(l)?"array":h:"null",h=="array"||h=="object"&&typeof l.length=="number"}function c(l){var h=typeof l;return h=="object"&&l!=null||h=="function"}function d(l,h,p){return l.call.apply(l.bind,arguments)}function f(l,h,p){if(!l)throw Error();if(2<arguments.length){var g=Array.prototype.slice.call(arguments,2);return function(){var D=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(D,g),l.apply(h,D)}}return function(){return l.apply(h,arguments)}}function m(l,h,p){return m=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?d:f,m.apply(null,arguments)}function v(l,h){var p=Array.prototype.slice.call(arguments,1);return function(){var g=p.slice();return g.push.apply(g,arguments),l.apply(this,g)}}function S(l,h){function p(){}p.prototype=h.prototype,l.aa=h.prototype,l.prototype=new p,l.prototype.constructor=l,l.Qb=function(g,D,L){for(var q=Array(arguments.length-2),me=2;me<arguments.length;me++)q[me-2]=arguments[me];return h.prototype[D].apply(g,q)}}function P(l){const h=l.length;if(0<h){const p=Array(h);for(let g=0;g<h;g++)p[g]=l[g];return p}return[]}function C(l,h){for(let p=1;p<arguments.length;p++){const g=arguments[p];if(u(g)){const D=l.length||0,L=g.length||0;l.length=D+L;for(let q=0;q<L;q++)l[D+q]=g[q]}else l.push(g)}}class w{constructor(h,p){this.i=h,this.j=p,this.h=0,this.g=null}get(){let h;return 0<this.h?(this.h--,h=this.g,this.g=h.next,h.next=null):h=this.i(),h}}function y(l){return/^[\s\xa0]*$/.test(l)}function E(){var l=a.navigator;return l&&(l=l.userAgent)?l:""}function x(l){return x[" "](l),l}x[" "]=function(){};var M=E().indexOf("Gecko")!=-1&&!(E().toLowerCase().indexOf("webkit")!=-1&&E().indexOf("Edge")==-1)&&!(E().indexOf("Trident")!=-1||E().indexOf("MSIE")!=-1)&&E().indexOf("Edge")==-1;function F(l,h,p){for(const g in l)h.call(p,l[g],g,l)}function I(l,h){for(const p in l)h.call(void 0,l[p],p,l)}function _(l){const h={};for(const p in l)h[p]=l[p];return h}const T="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function A(l,h){let p,g;for(let D=1;D<arguments.length;D++){g=arguments[D];for(p in g)l[p]=g[p];for(let L=0;L<T.length;L++)p=T[L],Object.prototype.hasOwnProperty.call(g,p)&&(l[p]=g[p])}}function k(l){var h=1;l=l.split(":");const p=[];for(;0<h&&l.length;)p.push(l.shift()),h--;return l.length&&p.push(l.join(":")),p}function N(l){a.setTimeout(()=>{throw l},0)}function R(){var l=Z;let h=null;return l.g&&(h=l.g,l.g=l.g.next,l.g||(l.h=null),h.next=null),h}class Ze{constructor(){this.h=this.g=null}add(h,p){const g=hi.get();g.set(h,p),this.h?this.h.next=g:this.g=g,this.h=g}}var hi=new w(()=>new No,l=>l.reset());class No{constructor(){this.next=this.g=this.h=null}set(h,p){this.h=h,this.g=p,this.next=null}reset(){this.next=this.g=this.h=null}}let Cn,K=!1,Z=new Ze,te=()=>{const l=a.Promise.resolve(void 0);Cn=()=>{l.then(Pe)}};var Pe=()=>{for(var l;l=R();){try{l.h.call(l.g)}catch(p){N(p)}var h=hi;h.j(l),100>h.h&&(h.h++,l.next=h.g,h.g=l)}K=!1};function pe(){this.s=this.s,this.C=this.C}pe.prototype.s=!1,pe.prototype.ma=function(){this.s||(this.s=!0,this.N())},pe.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Be(l,h){this.type=l,this.g=this.target=h,this.defaultPrevented=!1}Be.prototype.h=function(){this.defaultPrevented=!0};var kn=function(){if(!a.addEventListener||!Object.defineProperty)return!1;var l=!1,h=Object.defineProperty({},"passive",{get:function(){l=!0}});try{const p=()=>{};a.addEventListener("test",p,h),a.removeEventListener("test",p,h)}catch{}return l}();function xn(l,h){if(Be.call(this,l?l.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,l){var p=this.type=l.type,g=l.changedTouches&&l.changedTouches.length?l.changedTouches[0]:null;if(this.target=l.target||l.srcElement,this.g=h,h=l.relatedTarget){if(M){e:{try{x(h.nodeName);var D=!0;break e}catch{}D=!1}D||(h=null)}}else p=="mouseover"?h=l.fromElement:p=="mouseout"&&(h=l.toElement);this.relatedTarget=h,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=l.clientX!==void 0?l.clientX:l.pageX,this.clientY=l.clientY!==void 0?l.clientY:l.pageY,this.screenX=l.screenX||0,this.screenY=l.screenY||0),this.button=l.button,this.key=l.key||"",this.ctrlKey=l.ctrlKey,this.altKey=l.altKey,this.shiftKey=l.shiftKey,this.metaKey=l.metaKey,this.pointerId=l.pointerId||0,this.pointerType=typeof l.pointerType=="string"?l.pointerType:bn[l.pointerType]||"",this.state=l.state,this.i=l,l.defaultPrevented&&xn.aa.h.call(this)}}S(xn,Be);var bn={2:"touch",3:"pen",4:"mouse"};xn.prototype.h=function(){xn.aa.h.call(this);var l=this.i;l.preventDefault?l.preventDefault():l.returnValue=!1};var Nn="closure_listenable_"+(1e6*Math.random()|0),oR=0;function aR(l,h,p,g,D){this.listener=l,this.proxy=null,this.src=h,this.type=p,this.capture=!!g,this.ha=D,this.key=++oR,this.da=this.fa=!1}function Ml(l){l.da=!0,l.listener=null,l.proxy=null,l.src=null,l.ha=null}function Fl(l){this.src=l,this.g={},this.h=0}Fl.prototype.add=function(l,h,p,g,D){var L=l.toString();l=this.g[L],l||(l=this.g[L]=[],this.h++);var q=jh(l,h,g,D);return-1<q?(h=l[q],p||(h.fa=!1)):(h=new aR(h,this.src,L,!!g,D),h.fa=p,l.push(h)),h};function Bh(l,h){var p=h.type;if(p in l.g){var g=l.g[p],D=Array.prototype.indexOf.call(g,h,void 0),L;(L=0<=D)&&Array.prototype.splice.call(g,D,1),L&&(Ml(h),l.g[p].length==0&&(delete l.g[p],l.h--))}}function jh(l,h,p,g){for(var D=0;D<l.length;++D){var L=l[D];if(!L.da&&L.listener==h&&L.capture==!!p&&L.ha==g)return D}return-1}var zh="closure_lm_"+(1e6*Math.random()|0),$h={};function $g(l,h,p,g,D){if(Array.isArray(h)){for(var L=0;L<h.length;L++)$g(l,h[L],p,g,D);return null}return p=Kg(p),l&&l[Nn]?l.K(h,p,c(g)?!!g.capture:!1,D):lR(l,h,p,!1,g,D)}function lR(l,h,p,g,D,L){if(!h)throw Error("Invalid event type");var q=c(D)?!!D.capture:!!D,me=Gh(l);if(me||(l[zh]=me=new Fl(l)),p=me.add(h,p,g,q,L),p.proxy)return p;if(g=uR(),p.proxy=g,g.src=l,g.listener=p,l.addEventListener)kn||(D=q),D===void 0&&(D=!1),l.addEventListener(h.toString(),g,D);else if(l.attachEvent)l.attachEvent(Gg(h.toString()),g);else if(l.addListener&&l.removeListener)l.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return p}function uR(){function l(p){return h.call(l.src,l.listener,p)}const h=cR;return l}function qg(l,h,p,g,D){if(Array.isArray(h))for(var L=0;L<h.length;L++)qg(l,h[L],p,g,D);else g=c(g)?!!g.capture:!!g,p=Kg(p),l&&l[Nn]?(l=l.i,h=String(h).toString(),h in l.g&&(L=l.g[h],p=jh(L,p,g,D),-1<p&&(Ml(L[p]),Array.prototype.splice.call(L,p,1),L.length==0&&(delete l.g[h],l.h--)))):l&&(l=Gh(l))&&(h=l.g[h.toString()],l=-1,h&&(l=jh(h,p,g,D)),(p=-1<l?h[l]:null)&&qh(p))}function qh(l){if(typeof l!="number"&&l&&!l.da){var h=l.src;if(h&&h[Nn])Bh(h.i,l);else{var p=l.type,g=l.proxy;h.removeEventListener?h.removeEventListener(p,g,l.capture):h.detachEvent?h.detachEvent(Gg(p),g):h.addListener&&h.removeListener&&h.removeListener(g),(p=Gh(h))?(Bh(p,l),p.h==0&&(p.src=null,h[zh]=null)):Ml(l)}}}function Gg(l){return l in $h?$h[l]:$h[l]="on"+l}function cR(l,h){if(l.da)l=!0;else{h=new xn(h,this);var p=l.listener,g=l.ha||l.src;l.fa&&qh(l),l=p.call(g,h)}return l}function Gh(l){return l=l[zh],l instanceof Fl?l:null}var Kh="__closure_events_fn_"+(1e9*Math.random()>>>0);function Kg(l){return typeof l=="function"?l:(l[Kh]||(l[Kh]=function(h){return l.handleEvent(h)}),l[Kh])}function dt(){pe.call(this),this.i=new Fl(this),this.M=this,this.F=null}S(dt,pe),dt.prototype[Nn]=!0,dt.prototype.removeEventListener=function(l,h,p,g){qg(this,l,h,p,g)};function Tt(l,h){var p,g=l.F;if(g)for(p=[];g;g=g.F)p.push(g);if(l=l.M,g=h.type||h,typeof h=="string")h=new Be(h,l);else if(h instanceof Be)h.target=h.target||l;else{var D=h;h=new Be(g,l),A(h,D)}if(D=!0,p)for(var L=p.length-1;0<=L;L--){var q=h.g=p[L];D=Ul(q,g,!0,h)&&D}if(q=h.g=l,D=Ul(q,g,!0,h)&&D,D=Ul(q,g,!1,h)&&D,p)for(L=0;L<p.length;L++)q=h.g=p[L],D=Ul(q,g,!1,h)&&D}dt.prototype.N=function(){if(dt.aa.N.call(this),this.i){var l=this.i,h;for(h in l.g){for(var p=l.g[h],g=0;g<p.length;g++)Ml(p[g]);delete l.g[h],l.h--}}this.F=null},dt.prototype.K=function(l,h,p,g){return this.i.add(String(l),h,!1,p,g)},dt.prototype.L=function(l,h,p,g){return this.i.add(String(l),h,!0,p,g)};function Ul(l,h,p,g){if(h=l.i.g[String(h)],!h)return!0;h=h.concat();for(var D=!0,L=0;L<h.length;++L){var q=h[L];if(q&&!q.da&&q.capture==p){var me=q.listener,st=q.ha||q.src;q.fa&&Bh(l.i,q),D=me.call(st,g)!==!1&&D}}return D&&!g.defaultPrevented}function Wg(l,h,p){if(typeof l=="function")p&&(l=m(l,p));else if(l&&typeof l.handleEvent=="function")l=m(l.handleEvent,l);else throw Error("Invalid listener argument");return 2147483647<Number(h)?-1:a.setTimeout(l,h||0)}function Hg(l){l.g=Wg(()=>{l.g=null,l.i&&(l.i=!1,Hg(l))},l.l);const h=l.h;l.h=null,l.m.apply(null,h)}class hR extends pe{constructor(h,p){super(),this.m=h,this.l=p,this.h=null,this.i=!1,this.g=null}j(h){this.h=arguments,this.g?this.i=!0:Hg(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Do(l){pe.call(this),this.h=l,this.g={}}S(Do,pe);var Qg=[];function Jg(l){F(l.g,function(h,p){this.g.hasOwnProperty(p)&&qh(h)},l),l.g={}}Do.prototype.N=function(){Do.aa.N.call(this),Jg(this)},Do.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Wh=a.JSON.stringify,dR=a.JSON.parse,fR=class{stringify(l){return a.JSON.stringify(l,void 0)}parse(l){return a.JSON.parse(l,void 0)}};function Hh(){}Hh.prototype.h=null;function Yg(l){return l.h||(l.h=l.i())}function Xg(){}var Vo={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Qh(){Be.call(this,"d")}S(Qh,Be);function Jh(){Be.call(this,"c")}S(Jh,Be);var di={},Zg=null;function Bl(){return Zg=Zg||new dt}di.La="serverreachability";function e_(l){Be.call(this,di.La,l)}S(e_,Be);function Oo(l){const h=Bl();Tt(h,new e_(h))}di.STAT_EVENT="statevent";function t_(l,h){Be.call(this,di.STAT_EVENT,l),this.stat=h}S(t_,Be);function St(l){const h=Bl();Tt(h,new t_(h,l))}di.Ma="timingevent";function n_(l,h){Be.call(this,di.Ma,l),this.size=h}S(n_,Be);function Lo(l,h){if(typeof l!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){l()},h)}function Mo(){this.g=!0}Mo.prototype.xa=function(){this.g=!1};function pR(l,h,p,g,D,L){l.info(function(){if(l.g)if(L)for(var q="",me=L.split("&"),st=0;st<me.length;st++){var ue=me[st].split("=");if(1<ue.length){var ft=ue[0];ue=ue[1];var pt=ft.split("_");q=2<=pt.length&&pt[1]=="type"?q+(ft+"="+ue+"&"):q+(ft+"=redacted&")}}else q=null;else q=L;return"XMLHTTP REQ ("+g+") [attempt "+D+"]: "+h+`
`+p+`
`+q})}function mR(l,h,p,g,D,L,q){l.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+D+"]: "+h+`
`+p+`
`+L+" "+q})}function us(l,h,p,g){l.info(function(){return"XMLHTTP TEXT ("+h+"): "+_R(l,p)+(g?" "+g:"")})}function gR(l,h){l.info(function(){return"TIMEOUT: "+h})}Mo.prototype.info=function(){};function _R(l,h){if(!l.g)return h;if(!h)return null;try{var p=JSON.parse(h);if(p){for(l=0;l<p.length;l++)if(Array.isArray(p[l])){var g=p[l];if(!(2>g.length)){var D=g[1];if(Array.isArray(D)&&!(1>D.length)){var L=D[0];if(L!="noop"&&L!="stop"&&L!="close")for(var q=1;q<D.length;q++)D[q]=""}}}}return Wh(p)}catch{return h}}var jl={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},r_={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Yh;function zl(){}S(zl,Hh),zl.prototype.g=function(){return new XMLHttpRequest},zl.prototype.i=function(){return{}},Yh=new zl;function sr(l,h,p,g){this.j=l,this.i=h,this.l=p,this.R=g||1,this.U=new Do(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new i_}function i_(){this.i=null,this.g="",this.h=!1}var s_={},Xh={};function Zh(l,h,p){l.L=1,l.v=Kl(Dn(h)),l.m=p,l.P=!0,o_(l,null)}function o_(l,h){l.F=Date.now(),$l(l),l.A=Dn(l.v);var p=l.A,g=l.R;Array.isArray(g)||(g=[String(g)]),w_(p.i,"t",g),l.C=0,p=l.j.J,l.h=new i_,l.g=F_(l.j,p?h:null,!l.m),0<l.O&&(l.M=new hR(m(l.Y,l,l.g),l.O)),h=l.U,p=l.g,g=l.ca;var D="readystatechange";Array.isArray(D)||(D&&(Qg[0]=D.toString()),D=Qg);for(var L=0;L<D.length;L++){var q=$g(p,D[L],g||h.handleEvent,!1,h.h||h);if(!q)break;h.g[q.key]=q}h=l.H?_(l.H):{},l.m?(l.u||(l.u="POST"),h["Content-Type"]="application/x-www-form-urlencoded",l.g.ea(l.A,l.u,l.m,h)):(l.u="GET",l.g.ea(l.A,l.u,null,h)),Oo(),pR(l.i,l.u,l.A,l.l,l.R,l.m)}sr.prototype.ca=function(l){l=l.target;const h=this.M;h&&Vn(l)==3?h.j():this.Y(l)},sr.prototype.Y=function(l){try{if(l==this.g)e:{const pt=Vn(this.g);var h=this.g.Ba();const ds=this.g.Z();if(!(3>pt)&&(pt!=3||this.g&&(this.h.h||this.g.oa()||P_(this.g)))){this.J||pt!=4||h==7||(h==8||0>=ds?Oo(3):Oo(2)),ed(this);var p=this.g.Z();this.X=p;t:if(a_(this)){var g=P_(this.g);l="";var D=g.length,L=Vn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){fi(this),Fo(this);var q="";break t}this.h.i=new a.TextDecoder}for(h=0;h<D;h++)this.h.h=!0,l+=this.h.i.decode(g[h],{stream:!(L&&h==D-1)});g.length=0,this.h.g+=l,this.C=0,q=this.h.g}else q=this.g.oa();if(this.o=p==200,mR(this.i,this.u,this.A,this.l,this.R,pt,p),this.o){if(this.T&&!this.K){t:{if(this.g){var me,st=this.g;if((me=st.g?st.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!y(me)){var ue=me;break t}}ue=null}if(p=ue)us(this.i,this.l,p,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,td(this,p);else{this.o=!1,this.s=3,St(12),fi(this),Fo(this);break e}}if(this.P){p=!0;let tn;for(;!this.J&&this.C<q.length;)if(tn=yR(this,q),tn==Xh){pt==4&&(this.s=4,St(14),p=!1),us(this.i,this.l,null,"[Incomplete Response]");break}else if(tn==s_){this.s=4,St(15),us(this.i,this.l,q,"[Invalid Chunk]"),p=!1;break}else us(this.i,this.l,tn,null),td(this,tn);if(a_(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),pt!=4||q.length!=0||this.h.h||(this.s=1,St(16),p=!1),this.o=this.o&&p,!p)us(this.i,this.l,q,"[Invalid Chunked Response]"),fi(this),Fo(this);else if(0<q.length&&!this.W){this.W=!0;var ft=this.j;ft.g==this&&ft.ba&&!ft.M&&(ft.j.info("Great, no buffering proxy detected. Bytes received: "+q.length),ad(ft),ft.M=!0,St(11))}}else us(this.i,this.l,q,null),td(this,q);pt==4&&fi(this),this.o&&!this.J&&(pt==4?V_(this.j,this):(this.o=!1,$l(this)))}else OR(this.g),p==400&&0<q.indexOf("Unknown SID")?(this.s=3,St(12)):(this.s=0,St(13)),fi(this),Fo(this)}}}catch{}finally{}};function a_(l){return l.g?l.u=="GET"&&l.L!=2&&l.j.Ca:!1}function yR(l,h){var p=l.C,g=h.indexOf(`
`,p);return g==-1?Xh:(p=Number(h.substring(p,g)),isNaN(p)?s_:(g+=1,g+p>h.length?Xh:(h=h.slice(g,g+p),l.C=g+p,h)))}sr.prototype.cancel=function(){this.J=!0,fi(this)};function $l(l){l.S=Date.now()+l.I,l_(l,l.I)}function l_(l,h){if(l.B!=null)throw Error("WatchDog timer not null");l.B=Lo(m(l.ba,l),h)}function ed(l){l.B&&(a.clearTimeout(l.B),l.B=null)}sr.prototype.ba=function(){this.B=null;const l=Date.now();0<=l-this.S?(gR(this.i,this.A),this.L!=2&&(Oo(),St(17)),fi(this),this.s=2,Fo(this)):l_(this,this.S-l)};function Fo(l){l.j.G==0||l.J||V_(l.j,l)}function fi(l){ed(l);var h=l.M;h&&typeof h.ma=="function"&&h.ma(),l.M=null,Jg(l.U),l.g&&(h=l.g,l.g=null,h.abort(),h.ma())}function td(l,h){try{var p=l.j;if(p.G!=0&&(p.g==l||nd(p.h,l))){if(!l.K&&nd(p.h,l)&&p.G==3){try{var g=p.Da.g.parse(h)}catch{g=null}if(Array.isArray(g)&&g.length==3){var D=g;if(D[0]==0){e:if(!p.u){if(p.g)if(p.g.F+3e3<l.F)Xl(p),Jl(p);else break e;od(p),St(18)}}else p.za=D[1],0<p.za-p.T&&37500>D[2]&&p.F&&p.v==0&&!p.C&&(p.C=Lo(m(p.Za,p),6e3));if(1>=h_(p.h)&&p.ca){try{p.ca()}catch{}p.ca=void 0}}else mi(p,11)}else if((l.K||p.g==l)&&Xl(p),!y(h))for(D=p.Da.g.parse(h),h=0;h<D.length;h++){let ue=D[h];if(p.T=ue[0],ue=ue[1],p.G==2)if(ue[0]=="c"){p.K=ue[1],p.ia=ue[2];const ft=ue[3];ft!=null&&(p.la=ft,p.j.info("VER="+p.la));const pt=ue[4];pt!=null&&(p.Aa=pt,p.j.info("SVER="+p.Aa));const ds=ue[5];ds!=null&&typeof ds=="number"&&0<ds&&(g=1.5*ds,p.L=g,p.j.info("backChannelRequestTimeoutMs_="+g)),g=p;const tn=l.g;if(tn){const eu=tn.g?tn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(eu){var L=g.h;L.g||eu.indexOf("spdy")==-1&&eu.indexOf("quic")==-1&&eu.indexOf("h2")==-1||(L.j=L.l,L.g=new Set,L.h&&(rd(L,L.h),L.h=null))}if(g.D){const ld=tn.g?tn.g.getResponseHeader("X-HTTP-Session-Id"):null;ld&&(g.ya=ld,ve(g.I,g.D,ld))}}p.G=3,p.l&&p.l.ua(),p.ba&&(p.R=Date.now()-l.F,p.j.info("Handshake RTT: "+p.R+"ms")),g=p;var q=l;if(g.qa=M_(g,g.J?g.ia:null,g.W),q.K){d_(g.h,q);var me=q,st=g.L;st&&(me.I=st),me.B&&(ed(me),$l(me)),g.g=q}else N_(g);0<p.i.length&&Yl(p)}else ue[0]!="stop"&&ue[0]!="close"||mi(p,7);else p.G==3&&(ue[0]=="stop"||ue[0]=="close"?ue[0]=="stop"?mi(p,7):sd(p):ue[0]!="noop"&&p.l&&p.l.ta(ue),p.v=0)}}Oo(4)}catch{}}var vR=class{constructor(l,h){this.g=l,this.map=h}};function u_(l){this.l=l||10,a.PerformanceNavigationTiming?(l=a.performance.getEntriesByType("navigation"),l=0<l.length&&(l[0].nextHopProtocol=="hq"||l[0].nextHopProtocol=="h2")):l=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=l?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function c_(l){return l.h?!0:l.g?l.g.size>=l.j:!1}function h_(l){return l.h?1:l.g?l.g.size:0}function nd(l,h){return l.h?l.h==h:l.g?l.g.has(h):!1}function rd(l,h){l.g?l.g.add(h):l.h=h}function d_(l,h){l.h&&l.h==h?l.h=null:l.g&&l.g.has(h)&&l.g.delete(h)}u_.prototype.cancel=function(){if(this.i=f_(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const l of this.g.values())l.cancel();this.g.clear()}};function f_(l){if(l.h!=null)return l.i.concat(l.h.D);if(l.g!=null&&l.g.size!==0){let h=l.i;for(const p of l.g.values())h=h.concat(p.D);return h}return P(l.i)}function wR(l){if(l.V&&typeof l.V=="function")return l.V();if(typeof Map<"u"&&l instanceof Map||typeof Set<"u"&&l instanceof Set)return Array.from(l.values());if(typeof l=="string")return l.split("");if(u(l)){for(var h=[],p=l.length,g=0;g<p;g++)h.push(l[g]);return h}h=[],p=0;for(g in l)h[p++]=l[g];return h}function ER(l){if(l.na&&typeof l.na=="function")return l.na();if(!l.V||typeof l.V!="function"){if(typeof Map<"u"&&l instanceof Map)return Array.from(l.keys());if(!(typeof Set<"u"&&l instanceof Set)){if(u(l)||typeof l=="string"){var h=[];l=l.length;for(var p=0;p<l;p++)h.push(p);return h}h=[],p=0;for(const g in l)h[p++]=g;return h}}}function p_(l,h){if(l.forEach&&typeof l.forEach=="function")l.forEach(h,void 0);else if(u(l)||typeof l=="string")Array.prototype.forEach.call(l,h,void 0);else for(var p=ER(l),g=wR(l),D=g.length,L=0;L<D;L++)h.call(void 0,g[L],p&&p[L],l)}var m_=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function IR(l,h){if(l){l=l.split("&");for(var p=0;p<l.length;p++){var g=l[p].indexOf("="),D=null;if(0<=g){var L=l[p].substring(0,g);D=l[p].substring(g+1)}else L=l[p];h(L,D?decodeURIComponent(D.replace(/\+/g," ")):"")}}}function pi(l){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,l instanceof pi){this.h=l.h,ql(this,l.j),this.o=l.o,this.g=l.g,Gl(this,l.s),this.l=l.l;var h=l.i,p=new jo;p.i=h.i,h.g&&(p.g=new Map(h.g),p.h=h.h),g_(this,p),this.m=l.m}else l&&(h=String(l).match(m_))?(this.h=!1,ql(this,h[1]||"",!0),this.o=Uo(h[2]||""),this.g=Uo(h[3]||"",!0),Gl(this,h[4]),this.l=Uo(h[5]||"",!0),g_(this,h[6]||"",!0),this.m=Uo(h[7]||"")):(this.h=!1,this.i=new jo(null,this.h))}pi.prototype.toString=function(){var l=[],h=this.j;h&&l.push(Bo(h,__,!0),":");var p=this.g;return(p||h=="file")&&(l.push("//"),(h=this.o)&&l.push(Bo(h,__,!0),"@"),l.push(encodeURIComponent(String(p)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),p=this.s,p!=null&&l.push(":",String(p))),(p=this.l)&&(this.g&&p.charAt(0)!="/"&&l.push("/"),l.push(Bo(p,p.charAt(0)=="/"?AR:SR,!0))),(p=this.i.toString())&&l.push("?",p),(p=this.m)&&l.push("#",Bo(p,PR)),l.join("")};function Dn(l){return new pi(l)}function ql(l,h,p){l.j=p?Uo(h,!0):h,l.j&&(l.j=l.j.replace(/:$/,""))}function Gl(l,h){if(h){if(h=Number(h),isNaN(h)||0>h)throw Error("Bad port number "+h);l.s=h}else l.s=null}function g_(l,h,p){h instanceof jo?(l.i=h,CR(l.i,l.h)):(p||(h=Bo(h,RR)),l.i=new jo(h,l.h))}function ve(l,h,p){l.i.set(h,p)}function Kl(l){return ve(l,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),l}function Uo(l,h){return l?h?decodeURI(l.replace(/%25/g,"%2525")):decodeURIComponent(l):""}function Bo(l,h,p){return typeof l=="string"?(l=encodeURI(l).replace(h,TR),p&&(l=l.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),l):null}function TR(l){return l=l.charCodeAt(0),"%"+(l>>4&15).toString(16)+(l&15).toString(16)}var __=/[#\/\?@]/g,SR=/[#\?:]/g,AR=/[#\?]/g,RR=/[#\?@]/g,PR=/#/g;function jo(l,h){this.h=this.g=null,this.i=l||null,this.j=!!h}function or(l){l.g||(l.g=new Map,l.h=0,l.i&&IR(l.i,function(h,p){l.add(decodeURIComponent(h.replace(/\+/g," ")),p)}))}t=jo.prototype,t.add=function(l,h){or(this),this.i=null,l=cs(this,l);var p=this.g.get(l);return p||this.g.set(l,p=[]),p.push(h),this.h+=1,this};function y_(l,h){or(l),h=cs(l,h),l.g.has(h)&&(l.i=null,l.h-=l.g.get(h).length,l.g.delete(h))}function v_(l,h){return or(l),h=cs(l,h),l.g.has(h)}t.forEach=function(l,h){or(this),this.g.forEach(function(p,g){p.forEach(function(D){l.call(h,D,g,this)},this)},this)},t.na=function(){or(this);const l=Array.from(this.g.values()),h=Array.from(this.g.keys()),p=[];for(let g=0;g<h.length;g++){const D=l[g];for(let L=0;L<D.length;L++)p.push(h[g])}return p},t.V=function(l){or(this);let h=[];if(typeof l=="string")v_(this,l)&&(h=h.concat(this.g.get(cs(this,l))));else{l=Array.from(this.g.values());for(let p=0;p<l.length;p++)h=h.concat(l[p])}return h},t.set=function(l,h){return or(this),this.i=null,l=cs(this,l),v_(this,l)&&(this.h-=this.g.get(l).length),this.g.set(l,[h]),this.h+=1,this},t.get=function(l,h){return l?(l=this.V(l),0<l.length?String(l[0]):h):h};function w_(l,h,p){y_(l,h),0<p.length&&(l.i=null,l.g.set(cs(l,h),P(p)),l.h+=p.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const l=[],h=Array.from(this.g.keys());for(var p=0;p<h.length;p++){var g=h[p];const L=encodeURIComponent(String(g)),q=this.V(g);for(g=0;g<q.length;g++){var D=L;q[g]!==""&&(D+="="+encodeURIComponent(String(q[g]))),l.push(D)}}return this.i=l.join("&")};function cs(l,h){return h=String(h),l.j&&(h=h.toLowerCase()),h}function CR(l,h){h&&!l.j&&(or(l),l.i=null,l.g.forEach(function(p,g){var D=g.toLowerCase();g!=D&&(y_(this,g),w_(this,D,p))},l)),l.j=h}function kR(l,h){const p=new Mo;if(a.Image){const g=new Image;g.onload=v(ar,p,"TestLoadImage: loaded",!0,h,g),g.onerror=v(ar,p,"TestLoadImage: error",!1,h,g),g.onabort=v(ar,p,"TestLoadImage: abort",!1,h,g),g.ontimeout=v(ar,p,"TestLoadImage: timeout",!1,h,g),a.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=l}else h(!1)}function xR(l,h){const p=new Mo,g=new AbortController,D=setTimeout(()=>{g.abort(),ar(p,"TestPingServer: timeout",!1,h)},1e4);fetch(l,{signal:g.signal}).then(L=>{clearTimeout(D),L.ok?ar(p,"TestPingServer: ok",!0,h):ar(p,"TestPingServer: server error",!1,h)}).catch(()=>{clearTimeout(D),ar(p,"TestPingServer: error",!1,h)})}function ar(l,h,p,g,D){try{D&&(D.onload=null,D.onerror=null,D.onabort=null,D.ontimeout=null),g(p)}catch{}}function bR(){this.g=new fR}function NR(l,h,p){const g=p||"";try{p_(l,function(D,L){let q=D;c(D)&&(q=Wh(D)),h.push(g+L+"="+encodeURIComponent(q))})}catch(D){throw h.push(g+"type="+encodeURIComponent("_badmap")),D}}function Wl(l){this.l=l.Ub||null,this.j=l.eb||!1}S(Wl,Hh),Wl.prototype.g=function(){return new Hl(this.l,this.j)},Wl.prototype.i=function(l){return function(){return l}}({});function Hl(l,h){dt.call(this),this.D=l,this.o=h,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}S(Hl,dt),t=Hl.prototype,t.open=function(l,h){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=l,this.A=h,this.readyState=1,$o(this)},t.send=function(l){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const h={headers:this.u,method:this.B,credentials:this.m,cache:void 0};l&&(h.body=l),(this.D||a).fetch(new Request(this.A,h)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,zo(this)),this.readyState=0},t.Sa=function(l){if(this.g&&(this.l=l,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=l.headers,this.readyState=2,$o(this)),this.g&&(this.readyState=3,$o(this),this.g)))if(this.responseType==="arraybuffer")l.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in l){if(this.j=l.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;E_(this)}else l.text().then(this.Ra.bind(this),this.ga.bind(this))};function E_(l){l.j.read().then(l.Pa.bind(l)).catch(l.ga.bind(l))}t.Pa=function(l){if(this.g){if(this.o&&l.value)this.response.push(l.value);else if(!this.o){var h=l.value?l.value:new Uint8Array(0);(h=this.v.decode(h,{stream:!l.done}))&&(this.response=this.responseText+=h)}l.done?zo(this):$o(this),this.readyState==3&&E_(this)}},t.Ra=function(l){this.g&&(this.response=this.responseText=l,zo(this))},t.Qa=function(l){this.g&&(this.response=l,zo(this))},t.ga=function(){this.g&&zo(this)};function zo(l){l.readyState=4,l.l=null,l.j=null,l.v=null,$o(l)}t.setRequestHeader=function(l,h){this.u.append(l,h)},t.getResponseHeader=function(l){return this.h&&this.h.get(l.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const l=[],h=this.h.entries();for(var p=h.next();!p.done;)p=p.value,l.push(p[0]+": "+p[1]),p=h.next();return l.join(`\r
`)};function $o(l){l.onreadystatechange&&l.onreadystatechange.call(l)}Object.defineProperty(Hl.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(l){this.m=l?"include":"same-origin"}});function I_(l){let h="";return F(l,function(p,g){h+=g,h+=":",h+=p,h+=`\r
`}),h}function id(l,h,p){e:{for(g in p){var g=!1;break e}g=!0}g||(p=I_(p),typeof l=="string"?p!=null&&encodeURIComponent(String(p)):ve(l,h,p))}function De(l){dt.call(this),this.headers=new Map,this.o=l||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}S(De,dt);var DR=/^https?$/i,VR=["POST","PUT"];t=De.prototype,t.Ha=function(l){this.J=l},t.ea=function(l,h,p,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+l);h=h?h.toUpperCase():"GET",this.D=l,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Yh.g(),this.v=this.o?Yg(this.o):Yg(Yh),this.g.onreadystatechange=m(this.Ea,this);try{this.B=!0,this.g.open(h,String(l),!0),this.B=!1}catch(L){T_(this,L);return}if(l=p||"",p=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var D in g)p.set(D,g[D]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const L of g.keys())p.set(L,g.get(L));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(p.keys()).find(L=>L.toLowerCase()=="content-type"),D=a.FormData&&l instanceof a.FormData,!(0<=Array.prototype.indexOf.call(VR,h,void 0))||g||D||p.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[L,q]of p)this.g.setRequestHeader(L,q);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{R_(this),this.u=!0,this.g.send(l),this.u=!1}catch(L){T_(this,L)}};function T_(l,h){l.h=!1,l.g&&(l.j=!0,l.g.abort(),l.j=!1),l.l=h,l.m=5,S_(l),Ql(l)}function S_(l){l.A||(l.A=!0,Tt(l,"complete"),Tt(l,"error"))}t.abort=function(l){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=l||7,Tt(this,"complete"),Tt(this,"abort"),Ql(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Ql(this,!0)),De.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?A_(this):this.bb())},t.bb=function(){A_(this)};function A_(l){if(l.h&&typeof o<"u"&&(!l.v[1]||Vn(l)!=4||l.Z()!=2)){if(l.u&&Vn(l)==4)Wg(l.Ea,0,l);else if(Tt(l,"readystatechange"),Vn(l)==4){l.h=!1;try{const q=l.Z();e:switch(q){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var h=!0;break e;default:h=!1}var p;if(!(p=h)){var g;if(g=q===0){var D=String(l.D).match(m_)[1]||null;!D&&a.self&&a.self.location&&(D=a.self.location.protocol.slice(0,-1)),g=!DR.test(D?D.toLowerCase():"")}p=g}if(p)Tt(l,"complete"),Tt(l,"success");else{l.m=6;try{var L=2<Vn(l)?l.g.statusText:""}catch{L=""}l.l=L+" ["+l.Z()+"]",S_(l)}}finally{Ql(l)}}}}function Ql(l,h){if(l.g){R_(l);const p=l.g,g=l.v[0]?()=>{}:null;l.g=null,l.v=null,h||Tt(l,"ready");try{p.onreadystatechange=g}catch{}}}function R_(l){l.I&&(a.clearTimeout(l.I),l.I=null)}t.isActive=function(){return!!this.g};function Vn(l){return l.g?l.g.readyState:0}t.Z=function(){try{return 2<Vn(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(l){if(this.g){var h=this.g.responseText;return l&&h.indexOf(l)==0&&(h=h.substring(l.length)),dR(h)}};function P_(l){try{if(!l.g)return null;if("response"in l.g)return l.g.response;switch(l.H){case"":case"text":return l.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in l.g)return l.g.mozResponseArrayBuffer}return null}catch{return null}}function OR(l){const h={};l=(l.g&&2<=Vn(l)&&l.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<l.length;g++){if(y(l[g]))continue;var p=k(l[g]);const D=p[0];if(p=p[1],typeof p!="string")continue;p=p.trim();const L=h[D]||[];h[D]=L,L.push(p)}I(h,function(g){return g.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function qo(l,h,p){return p&&p.internalChannelParams&&p.internalChannelParams[l]||h}function C_(l){this.Aa=0,this.i=[],this.j=new Mo,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=qo("failFast",!1,l),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=qo("baseRetryDelayMs",5e3,l),this.cb=qo("retryDelaySeedMs",1e4,l),this.Wa=qo("forwardChannelMaxRetries",2,l),this.wa=qo("forwardChannelRequestTimeoutMs",2e4,l),this.pa=l&&l.xmlHttpFactory||void 0,this.Xa=l&&l.Tb||void 0,this.Ca=l&&l.useFetchStreams||!1,this.L=void 0,this.J=l&&l.supportsCrossDomainXhr||!1,this.K="",this.h=new u_(l&&l.concurrentRequestLimit),this.Da=new bR,this.P=l&&l.fastHandshake||!1,this.O=l&&l.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=l&&l.Rb||!1,l&&l.xa&&this.j.xa(),l&&l.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&l&&l.detectBufferingProxy||!1,this.ja=void 0,l&&l.longPollingTimeout&&0<l.longPollingTimeout&&(this.ja=l.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=C_.prototype,t.la=8,t.G=1,t.connect=function(l,h,p,g){St(0),this.W=l,this.H=h||{},p&&g!==void 0&&(this.H.OSID=p,this.H.OAID=g),this.F=this.X,this.I=M_(this,null,this.W),Yl(this)};function sd(l){if(k_(l),l.G==3){var h=l.U++,p=Dn(l.I);if(ve(p,"SID",l.K),ve(p,"RID",h),ve(p,"TYPE","terminate"),Go(l,p),h=new sr(l,l.j,h),h.L=2,h.v=Kl(Dn(p)),p=!1,a.navigator&&a.navigator.sendBeacon)try{p=a.navigator.sendBeacon(h.v.toString(),"")}catch{}!p&&a.Image&&(new Image().src=h.v,p=!0),p||(h.g=F_(h.j,null),h.g.ea(h.v)),h.F=Date.now(),$l(h)}L_(l)}function Jl(l){l.g&&(ad(l),l.g.cancel(),l.g=null)}function k_(l){Jl(l),l.u&&(a.clearTimeout(l.u),l.u=null),Xl(l),l.h.cancel(),l.s&&(typeof l.s=="number"&&a.clearTimeout(l.s),l.s=null)}function Yl(l){if(!c_(l.h)&&!l.s){l.s=!0;var h=l.Ga;Cn||te(),K||(Cn(),K=!0),Z.add(h,l),l.B=0}}function LR(l,h){return h_(l.h)>=l.h.j-(l.s?1:0)?!1:l.s?(l.i=h.D.concat(l.i),!0):l.G==1||l.G==2||l.B>=(l.Va?0:l.Wa)?!1:(l.s=Lo(m(l.Ga,l,h),O_(l,l.B)),l.B++,!0)}t.Ga=function(l){if(this.s)if(this.s=null,this.G==1){if(!l){this.U=Math.floor(1e5*Math.random()),l=this.U++;const D=new sr(this,this.j,l);let L=this.o;if(this.S&&(L?(L=_(L),A(L,this.S)):L=this.S),this.m!==null||this.O||(D.H=L,L=null),this.P)e:{for(var h=0,p=0;p<this.i.length;p++){t:{var g=this.i[p];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(h+=g,4096<h){h=p;break e}if(h===4096||p===this.i.length-1){h=p+1;break e}}h=1e3}else h=1e3;h=b_(this,D,h),p=Dn(this.I),ve(p,"RID",l),ve(p,"CVER",22),this.D&&ve(p,"X-HTTP-Session-Id",this.D),Go(this,p),L&&(this.O?h="headers="+encodeURIComponent(String(I_(L)))+"&"+h:this.m&&id(p,this.m,L)),rd(this.h,D),this.Ua&&ve(p,"TYPE","init"),this.P?(ve(p,"$req",h),ve(p,"SID","null"),D.T=!0,Zh(D,p,null)):Zh(D,p,h),this.G=2}}else this.G==3&&(l?x_(this,l):this.i.length==0||c_(this.h)||x_(this))};function x_(l,h){var p;h?p=h.l:p=l.U++;const g=Dn(l.I);ve(g,"SID",l.K),ve(g,"RID",p),ve(g,"AID",l.T),Go(l,g),l.m&&l.o&&id(g,l.m,l.o),p=new sr(l,l.j,p,l.B+1),l.m===null&&(p.H=l.o),h&&(l.i=h.D.concat(l.i)),h=b_(l,p,1e3),p.I=Math.round(.5*l.wa)+Math.round(.5*l.wa*Math.random()),rd(l.h,p),Zh(p,g,h)}function Go(l,h){l.H&&F(l.H,function(p,g){ve(h,g,p)}),l.l&&p_({},function(p,g){ve(h,g,p)})}function b_(l,h,p){p=Math.min(l.i.length,p);var g=l.l?m(l.l.Na,l.l,l):null;e:{var D=l.i;let L=-1;for(;;){const q=["count="+p];L==-1?0<p?(L=D[0].g,q.push("ofs="+L)):L=0:q.push("ofs="+L);let me=!0;for(let st=0;st<p;st++){let ue=D[st].g;const ft=D[st].map;if(ue-=L,0>ue)L=Math.max(0,D[st].g-100),me=!1;else try{NR(ft,q,"req"+ue+"_")}catch{g&&g(ft)}}if(me){g=q.join("&");break e}}}return l=l.i.splice(0,p),h.D=l,g}function N_(l){if(!l.g&&!l.u){l.Y=1;var h=l.Fa;Cn||te(),K||(Cn(),K=!0),Z.add(h,l),l.v=0}}function od(l){return l.g||l.u||3<=l.v?!1:(l.Y++,l.u=Lo(m(l.Fa,l),O_(l,l.v)),l.v++,!0)}t.Fa=function(){if(this.u=null,D_(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var l=2*this.R;this.j.info("BP detection timer enabled: "+l),this.A=Lo(m(this.ab,this),l)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,St(10),Jl(this),D_(this))};function ad(l){l.A!=null&&(a.clearTimeout(l.A),l.A=null)}function D_(l){l.g=new sr(l,l.j,"rpc",l.Y),l.m===null&&(l.g.H=l.o),l.g.O=0;var h=Dn(l.qa);ve(h,"RID","rpc"),ve(h,"SID",l.K),ve(h,"AID",l.T),ve(h,"CI",l.F?"0":"1"),!l.F&&l.ja&&ve(h,"TO",l.ja),ve(h,"TYPE","xmlhttp"),Go(l,h),l.m&&l.o&&id(h,l.m,l.o),l.L&&(l.g.I=l.L);var p=l.g;l=l.ia,p.L=1,p.v=Kl(Dn(h)),p.m=null,p.P=!0,o_(p,l)}t.Za=function(){this.C!=null&&(this.C=null,Jl(this),od(this),St(19))};function Xl(l){l.C!=null&&(a.clearTimeout(l.C),l.C=null)}function V_(l,h){var p=null;if(l.g==h){Xl(l),ad(l),l.g=null;var g=2}else if(nd(l.h,h))p=h.D,d_(l.h,h),g=1;else return;if(l.G!=0){if(h.o)if(g==1){p=h.m?h.m.length:0,h=Date.now()-h.F;var D=l.B;g=Bl(),Tt(g,new n_(g,p)),Yl(l)}else N_(l);else if(D=h.s,D==3||D==0&&0<h.X||!(g==1&&LR(l,h)||g==2&&od(l)))switch(p&&0<p.length&&(h=l.h,h.i=h.i.concat(p)),D){case 1:mi(l,5);break;case 4:mi(l,10);break;case 3:mi(l,6);break;default:mi(l,2)}}}function O_(l,h){let p=l.Ta+Math.floor(Math.random()*l.cb);return l.isActive()||(p*=2),p*h}function mi(l,h){if(l.j.info("Error code "+h),h==2){var p=m(l.fb,l),g=l.Xa;const D=!g;g=new pi(g||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||ql(g,"https"),Kl(g),D?kR(g.toString(),p):xR(g.toString(),p)}else St(2);l.G=0,l.l&&l.l.sa(h),L_(l),k_(l)}t.fb=function(l){l?(this.j.info("Successfully pinged google.com"),St(2)):(this.j.info("Failed to ping google.com"),St(1))};function L_(l){if(l.G=0,l.ka=[],l.l){const h=f_(l.h);(h.length!=0||l.i.length!=0)&&(C(l.ka,h),C(l.ka,l.i),l.h.i.length=0,P(l.i),l.i.length=0),l.l.ra()}}function M_(l,h,p){var g=p instanceof pi?Dn(p):new pi(p);if(g.g!="")h&&(g.g=h+"."+g.g),Gl(g,g.s);else{var D=a.location;g=D.protocol,h=h?h+"."+D.hostname:D.hostname,D=+D.port;var L=new pi(null);g&&ql(L,g),h&&(L.g=h),D&&Gl(L,D),p&&(L.l=p),g=L}return p=l.D,h=l.ya,p&&h&&ve(g,p,h),ve(g,"VER",l.la),Go(l,g),g}function F_(l,h,p){if(h&&!l.J)throw Error("Can't create secondary domain capable XhrIo object.");return h=l.Ca&&!l.pa?new De(new Wl({eb:p})):new De(l.pa),h.Ha(l.J),h}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function U_(){}t=U_.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function Zl(){}Zl.prototype.g=function(l,h){return new Ft(l,h)};function Ft(l,h){dt.call(this),this.g=new C_(h),this.l=l,this.h=h&&h.messageUrlParams||null,l=h&&h.messageHeaders||null,h&&h.clientProtocolHeaderRequired&&(l?l["X-Client-Protocol"]="webchannel":l={"X-Client-Protocol":"webchannel"}),this.g.o=l,l=h&&h.initMessageHeaders||null,h&&h.messageContentType&&(l?l["X-WebChannel-Content-Type"]=h.messageContentType:l={"X-WebChannel-Content-Type":h.messageContentType}),h&&h.va&&(l?l["X-WebChannel-Client-Profile"]=h.va:l={"X-WebChannel-Client-Profile":h.va}),this.g.S=l,(l=h&&h.Sb)&&!y(l)&&(this.g.m=l),this.v=h&&h.supportsCrossDomainXhr||!1,this.u=h&&h.sendRawJson||!1,(h=h&&h.httpSessionIdParam)&&!y(h)&&(this.g.D=h,l=this.h,l!==null&&h in l&&(l=this.h,h in l&&delete l[h])),this.j=new hs(this)}S(Ft,dt),Ft.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Ft.prototype.close=function(){sd(this.g)},Ft.prototype.o=function(l){var h=this.g;if(typeof l=="string"){var p={};p.__data__=l,l=p}else this.u&&(p={},p.__data__=Wh(l),l=p);h.i.push(new vR(h.Ya++,l)),h.G==3&&Yl(h)},Ft.prototype.N=function(){this.g.l=null,delete this.j,sd(this.g),delete this.g,Ft.aa.N.call(this)};function B_(l){Qh.call(this),l.__headers__&&(this.headers=l.__headers__,this.statusCode=l.__status__,delete l.__headers__,delete l.__status__);var h=l.__sm__;if(h){e:{for(const p in h){l=p;break e}l=void 0}(this.i=l)&&(l=this.i,h=h!==null&&l in h?h[l]:void 0),this.data=h}else this.data=l}S(B_,Qh);function j_(){Jh.call(this),this.status=1}S(j_,Jh);function hs(l){this.g=l}S(hs,U_),hs.prototype.ua=function(){Tt(this.g,"a")},hs.prototype.ta=function(l){Tt(this.g,new B_(l))},hs.prototype.sa=function(l){Tt(this.g,new j_)},hs.prototype.ra=function(){Tt(this.g,"b")},Zl.prototype.createWebChannel=Zl.prototype.g,Ft.prototype.send=Ft.prototype.o,Ft.prototype.open=Ft.prototype.m,Ft.prototype.close=Ft.prototype.close,P0=function(){return new Zl},R0=function(){return Bl()},A0=di,ip={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},jl.NO_ERROR=0,jl.TIMEOUT=8,jl.HTTP_ERROR=6,qu=jl,r_.COMPLETE="complete",S0=r_,Xg.EventType=Vo,Vo.OPEN="a",Vo.CLOSE="b",Vo.ERROR="c",Vo.MESSAGE="d",dt.prototype.listen=dt.prototype.K,da=Xg,De.prototype.listenOnce=De.prototype.L,De.prototype.getLastError=De.prototype.Ka,De.prototype.getLastErrorCode=De.prototype.Ba,De.prototype.getStatus=De.prototype.Z,De.prototype.getResponseJson=De.prototype.Oa,De.prototype.getResponseText=De.prototype.oa,De.prototype.send=De.prototype.ea,De.prototype.setWithCredentials=De.prototype.Ha,T0=De}).apply(typeof vu<"u"?vu:typeof self<"u"?self:typeof window<"u"?window:{});const Fv="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}nt.UNAUTHENTICATED=new nt(null),nt.GOOGLE_CREDENTIALS=new nt("google-credentials-uid"),nt.FIRST_PARTY=new nt("first-party-uid"),nt.MOCK_USER=new nt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Io="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gr=new Am("@firebase/firestore");function vs(){return Gr.logLevel}function kM(t){Gr.setLogLevel(t)}function U(t,...e){if(Gr.logLevel<=ie.DEBUG){const n=e.map(Mm);Gr.debug(`Firestore (${Io}): ${t}`,...n)}}function ze(t,...e){if(Gr.logLevel<=ie.ERROR){const n=e.map(Mm);Gr.error(`Firestore (${Io}): ${t}`,...n)}}function en(t,...e){if(Gr.logLevel<=ie.WARN){const n=e.map(Mm);Gr.warn(`Firestore (${Io}): ${t}`,...n)}}function Mm(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(n){return JSON.stringify(n)}(t)}catch{return t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W(t="Unexpected state"){const e=`FIRESTORE (${Io}) INTERNAL ASSERTION FAILED: `+t;throw ze(e),new Error(e)}function Q(t,e){t||W()}function xM(t,e){t||W()}function $(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const O={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class j extends fn{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class C0{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class iD{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(nt.UNAUTHENTICATED))}shutdown(){}}class sD{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class oD{constructor(e){this.t=e,this.currentUser=nt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){Q(this.o===void 0);let r=this.i;const i=u=>this.i!==r?(r=this.i,n(u)):Promise.resolve();let s=new it;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new it,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const u=s;e.enqueueRetryable(async()=>{await u.promise,await i(this.currentUser)})},a=u=>{U("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(u=>a(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?a(u):(U("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new it)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(r=>this.i!==e?(U("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Q(typeof r.accessToken=="string"),new C0(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Q(e===null||typeof e=="string"),new nt(e)}}class aD{constructor(e,n,r){this.l=e,this.h=n,this.P=r,this.type="FirstParty",this.user=nt.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class lD{constructor(e,n,r){this.l=e,this.h=n,this.P=r}getToken(){return Promise.resolve(new aD(this.l,this.h,this.P))}start(e,n){e.enqueueRetryable(()=>n(nt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class k0{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class uD{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,n){Q(this.o===void 0);const r=s=>{s.error!=null&&U("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.R;return this.R=s.token,U("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>r(s))};const i=s=>{U("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.A.getImmediate({optional:!0});s?i(s):U("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(Q(typeof n.token=="string"),this.R=n.token,new k0(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}class bM{getToken(){return Promise.resolve(new k0(""))}invalidateToken(){}start(e,n){}shutdown(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cD(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x0{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const i=cD(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<n&&(r+=e.charAt(i[s]%e.length))}return r}}function X(t,e){return t<e?-1:t>e?1:0}function eo(t,e,n){return t.length===e.length&&t.every((r,i)=>n(r,e[i]))}function b0(t){return t+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new j(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new j(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new j(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new j(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return xe.fromMillis(Date.now())}static fromDate(e){return xe.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*n));return new xe(n,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?X(this.nanoseconds,e.nanoseconds):X(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J{constructor(e){this.timestamp=e}static fromTimestamp(e){return new J(e)}static min(){return new J(new xe(0,0))}static max(){return new J(new xe(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tl{constructor(e,n,r){n===void 0?n=0:n>e.length&&W(),r===void 0?r=e.length-n:r>e.length-n&&W(),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return tl.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof tl?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let i=0;i<r;i++){const s=e.get(i),o=n.get(i);if(s<o)return-1;if(s>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class se extends tl{construct(e,n,r){return new se(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new j(O.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(i=>i.length>0))}return new se(n)}static emptyPath(){return new se([])}}const hD=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Ae extends tl{construct(e,n,r){return new Ae(e,n,r)}static isValidIdentifier(e){return hD.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ae.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Ae(["__name__"])}static fromServerFormat(e){const n=[];let r="",i=0;const s=()=>{if(r.length===0)throw new j(O.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let o=!1;for(;i<e.length;){const a=e[i];if(a==="\\"){if(i+1===e.length)throw new j(O.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[i+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new j(O.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,i+=2}else a==="`"?(o=!o,i++):a!=="."||o?(r+=a,i++):(s(),i++)}if(s(),o)throw new j(O.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Ae(n)}static emptyPath(){return new Ae([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(e){this.path=e}static fromPath(e){return new G(se.fromString(e))}static fromName(e){return new G(se.fromString(e).popFirst(5))}static empty(){return new G(se.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&se.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return se.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new G(new se(e.slice()))}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class to{constructor(e,n,r,i){this.indexId=e,this.collectionGroup=n,this.fields=r,this.indexState=i}}function sp(t){return t.fields.find(e=>e.kind===2)}function Ei(t){return t.fields.filter(e=>e.kind!==2)}function dD(t,e){let n=X(t.collectionGroup,e.collectionGroup);if(n!==0)return n;for(let r=0;r<Math.min(t.fields.length,e.fields.length);++r)if(n=fD(t.fields[r],e.fields[r]),n!==0)return n;return X(t.fields.length,e.fields.length)}to.UNKNOWN_ID=-1;class Di{constructor(e,n){this.fieldPath=e,this.kind=n}}function fD(t,e){const n=Ae.comparator(t.fieldPath,e.fieldPath);return n!==0?n:X(t.kind,e.kind)}class no{constructor(e,n){this.sequenceNumber=e,this.offset=n}static empty(){return new no(0,Gt.min())}}function N0(t,e){const n=t.toTimestamp().seconds,r=t.toTimestamp().nanoseconds+1,i=J.fromTimestamp(r===1e9?new xe(n+1,0):new xe(n,r));return new Gt(i,G.empty(),e)}function D0(t){return new Gt(t.readTime,t.key,-1)}class Gt{constructor(e,n,r){this.readTime=e,this.documentKey=n,this.largestBatchId=r}static min(){return new Gt(J.min(),G.empty(),-1)}static max(){return new Gt(J.max(),G.empty(),-1)}}function Fm(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=G.comparator(t.documentKey,e.documentKey),n!==0?n:X(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const V0="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class O0{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function si(t){if(t.code!==O.FAILED_PRECONDITION||t.message!==V0)throw t;U("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&W(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new b((r,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(r,i)},this.catchCallback=s=>{this.wrapFailure(n,s).next(r,i)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof b?n:b.resolve(n)}catch(n){return b.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):b.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):b.reject(n)}static resolve(e){return new b((n,r)=>{n(e)})}static reject(e){return new b((n,r)=>{r(e)})}static waitFor(e){return new b((n,r)=>{let i=0,s=0,o=!1;e.forEach(a=>{++i,a.next(()=>{++s,o&&s===i&&n()},u=>r(u))}),o=!0,s===i&&n()})}static or(e){let n=b.resolve(!1);for(const r of e)n=n.next(i=>i?b.resolve(i):r());return n}static forEach(e,n){const r=[];return e.forEach((i,s)=>{r.push(n.call(this,i,s))}),this.waitFor(r)}static mapArray(e,n){return new b((r,i)=>{const s=e.length,o=new Array(s);let a=0;for(let u=0;u<s;u++){const c=u;n(e[c]).next(d=>{o[c]=d,++a,a===s&&r(o)},d=>i(d))}})}static doWhile(e,n){return new b((r,i)=>{const s=()=>{e()===!0?n().next(()=>{s()},i):r()};s()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mh{constructor(e,n){this.action=e,this.transaction=n,this.aborted=!1,this.V=new it,this.transaction.oncomplete=()=>{this.V.resolve()},this.transaction.onabort=()=>{n.error?this.V.reject(new Ra(e,n.error)):this.V.resolve()},this.transaction.onerror=r=>{const i=Um(r.target.error);this.V.reject(new Ra(e,i))}}static open(e,n,r,i){try{return new mh(n,e.transaction(i,r))}catch(s){throw new Ra(n,s)}}get m(){return this.V.promise}abort(e){e&&this.V.reject(e),this.aborted||(U("SimpleDb","Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}g(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const n=this.transaction.objectStore(e);return new mD(n)}}class Sn{constructor(e,n,r){this.name=e,this.version=n,this.p=r,Sn.S(Ye())===12.2&&ze("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}static delete(e){return U("SimpleDb","Removing database:",e),Ii(window.indexedDB.deleteDatabase(e)).toPromise()}static D(){if(!OT())return!1;if(Sn.v())return!0;const e=Ye(),n=Sn.S(e),r=0<n&&n<10,i=L0(e),s=0<i&&i<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||r||s)}static v(){var e;return typeof process<"u"&&((e=process.__PRIVATE_env)===null||e===void 0?void 0:e.C)==="YES"}static F(e,n){return e.store(n)}static S(e){const n=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),r=n?n[1].split("_").slice(0,2).join("."):"-1";return Number(r)}async M(e){return this.db||(U("SimpleDb","Opening database:",this.name),this.db=await new Promise((n,r)=>{const i=indexedDB.open(this.name,this.version);i.onsuccess=s=>{const o=s.target.result;n(o)},i.onblocked=()=>{r(new Ra(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},i.onerror=s=>{const o=s.target.error;o.name==="VersionError"?r(new j(O.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?r(new j(O.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):r(new Ra(e,o))},i.onupgradeneeded=s=>{U("SimpleDb",'Database "'+this.name+'" requires upgrade from version:',s.oldVersion);const o=s.target.result;this.p.O(o,i.transaction,s.oldVersion,this.version).next(()=>{U("SimpleDb","Database upgrade to version "+this.version+" complete")})}})),this.N&&(this.db.onversionchange=n=>this.N(n)),this.db}L(e){this.N=e,this.db&&(this.db.onversionchange=n=>e(n))}async runTransaction(e,n,r,i){const s=n==="readonly";let o=0;for(;;){++o;try{this.db=await this.M(e);const a=mh.open(this.db,e,s?"readonly":"readwrite",r),u=i(a).next(c=>(a.g(),c)).catch(c=>(a.abort(c),b.reject(c))).toPromise();return u.catch(()=>{}),await a.m,u}catch(a){const u=a,c=u.name!=="FirebaseError"&&o<3;if(U("SimpleDb","Transaction failed with error:",u.message,"Retrying:",c),this.close(),!c)return Promise.reject(u)}}}close(){this.db&&this.db.close(),this.db=void 0}}function L0(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}class pD{constructor(e){this.B=e,this.k=!1,this.q=null}get isDone(){return this.k}get K(){return this.q}set cursor(e){this.B=e}done(){this.k=!0}$(e){this.q=e}delete(){return Ii(this.B.delete())}}class Ra extends j{constructor(e,n){super(O.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${n}`),this.name="IndexedDbTransactionError"}}function oi(t){return t.name==="IndexedDbTransactionError"}class mD{constructor(e){this.store=e}put(e,n){let r;return n!==void 0?(U("SimpleDb","PUT",this.store.name,e,n),r=this.store.put(n,e)):(U("SimpleDb","PUT",this.store.name,"<auto-key>",e),r=this.store.put(e)),Ii(r)}add(e){return U("SimpleDb","ADD",this.store.name,e,e),Ii(this.store.add(e))}get(e){return Ii(this.store.get(e)).next(n=>(n===void 0&&(n=null),U("SimpleDb","GET",this.store.name,e,n),n))}delete(e){return U("SimpleDb","DELETE",this.store.name,e),Ii(this.store.delete(e))}count(){return U("SimpleDb","COUNT",this.store.name),Ii(this.store.count())}U(e,n){const r=this.options(e,n),i=r.index?this.store.index(r.index):this.store;if(typeof i.getAll=="function"){const s=i.getAll(r.range);return new b((o,a)=>{s.onerror=u=>{a(u.target.error)},s.onsuccess=u=>{o(u.target.result)}})}{const s=this.cursor(r),o=[];return this.W(s,(a,u)=>{o.push(u)}).next(()=>o)}}G(e,n){const r=this.store.getAll(e,n===null?void 0:n);return new b((i,s)=>{r.onerror=o=>{s(o.target.error)},r.onsuccess=o=>{i(o.target.result)}})}j(e,n){U("SimpleDb","DELETE ALL",this.store.name);const r=this.options(e,n);r.H=!1;const i=this.cursor(r);return this.W(i,(s,o,a)=>a.delete())}J(e,n){let r;n?r=e:(r={},n=e);const i=this.cursor(r);return this.W(i,n)}Y(e){const n=this.cursor({});return new b((r,i)=>{n.onerror=s=>{const o=Um(s.target.error);i(o)},n.onsuccess=s=>{const o=s.target.result;o?e(o.primaryKey,o.value).next(a=>{a?o.continue():r()}):r()}})}W(e,n){const r=[];return new b((i,s)=>{e.onerror=o=>{s(o.target.error)},e.onsuccess=o=>{const a=o.target.result;if(!a)return void i();const u=new pD(a),c=n(a.primaryKey,a.value,u);if(c instanceof b){const d=c.catch(f=>(u.done(),b.reject(f)));r.push(d)}u.isDone?i():u.K===null?a.continue():a.continue(u.K)}}).next(()=>b.waitFor(r))}options(e,n){let r;return e!==void 0&&(typeof e=="string"?r=e:n=e),{index:r,range:n}}cursor(e){let n="next";if(e.reverse&&(n="prev"),e.index){const r=this.store.index(e.index);return e.H?r.openKeyCursor(e.range,n):r.openCursor(e.range,n)}return this.store.openCursor(e.range,n)}}function Ii(t){return new b((e,n)=>{t.onsuccess=r=>{const i=r.target.result;e(i)},t.onerror=r=>{const i=Um(r.target.error);n(i)}})}let Uv=!1;function Um(t){const e=Sn.S(Ye());if(e>=12.2&&e<13){const n="An internal error was encountered in the Indexed Database server";if(t.message.indexOf(n)>=0){const r=new j("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${n}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return Uv||(Uv=!0,setTimeout(()=>{throw r},0)),r}}return t}class gD{constructor(e,n){this.asyncQueue=e,this.Z=n,this.task=null}start(){this.X(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}X(e){U("IndexBackfiller",`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{U("IndexBackfiller",`Documents written: ${await this.Z.ee()}`)}catch(n){oi(n)?U("IndexBackfiller","Ignoring IndexedDB error during index backfill: ",n):await si(n)}await this.X(6e4)})}}class _D{constructor(e,n){this.localStore=e,this.persistence=n}async ee(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",n=>this.te(n,e))}te(e,n){const r=new Set;let i=n,s=!0;return b.doWhile(()=>s===!0&&i>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(o=>{if(o!==null&&!r.has(o))return U("IndexBackfiller",`Processing collection: ${o}`),this.ne(e,o,i).next(a=>{i-=a,r.add(o)});s=!1})).next(()=>n-i)}ne(e,n,r){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,n).next(i=>this.localStore.localDocuments.getNextDocuments(e,n,i,r).next(s=>{const o=s.changes;return this.localStore.indexManager.updateIndexEntries(e,o).next(()=>this.re(i,s)).next(a=>(U("IndexBackfiller",`Updating offset: ${a}`),this.localStore.indexManager.updateCollectionGroup(e,n,a))).next(()=>o.size)}))}re(e,n){let r=e;return n.changes.forEach((i,s)=>{const o=D0(s);Fm(o,r)>0&&(r=o)}),new Gt(r.readTime,r.documentKey,Math.max(n.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=r=>this.ie(r),this.se=r=>n.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Nt.oe=-1;function Tl(t){return t==null}function nl(t){return t===0&&1/t==-1/0}function M0(t){return typeof t=="number"&&Number.isInteger(t)&&!nl(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wt(t){let e="";for(let n=0;n<t.length;n++)e.length>0&&(e=Bv(e)),e=yD(t.get(n),e);return Bv(e)}function yD(t,e){let n=e;const r=t.length;for(let i=0;i<r;i++){const s=t.charAt(i);switch(s){case"\0":n+="";break;case"":n+="";break;default:n+=s}}return n}function Bv(t){return t+""}function _n(t){const e=t.length;if(Q(e>=2),e===2)return Q(t.charAt(0)===""&&t.charAt(1)===""),se.emptyPath();const n=e-2,r=[];let i="";for(let s=0;s<e;){const o=t.indexOf("",s);switch((o<0||o>n)&&W(),t.charAt(o+1)){case"":const a=t.substring(s,o);let u;i.length===0?u=a:(i+=a,u=i,i=""),r.push(u);break;case"":i+=t.substring(s,o),i+="\0";break;case"":i+=t.substring(s,o+1);break;default:W()}s=o+2}return new se(r)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jv=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gu(t,e){return[t,wt(e)]}function F0(t,e,n){return[t,wt(e),n]}const vD={},wD=["prefixPath","collectionGroup","readTime","documentId"],ED=["prefixPath","collectionGroup","documentId"],ID=["collectionGroup","readTime","prefixPath","documentId"],TD=["canonicalId","targetId"],SD=["targetId","path"],AD=["path","targetId"],RD=["collectionId","parent"],PD=["indexId","uid"],CD=["uid","sequenceNumber"],kD=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],xD=["indexId","uid","orderedDocumentKey"],bD=["userId","collectionPath","documentId"],ND=["userId","collectionPath","largestBatchId"],DD=["userId","collectionGroup","largestBatchId"],U0=["mutationQueues","mutations","documentMutations","remoteDocuments","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries"],VD=[...U0,"documentOverlays"],B0=["mutationQueues","mutations","documentMutations","remoteDocumentsV14","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries","documentOverlays"],j0=B0,Bm=[...j0,"indexConfiguration","indexState","indexEntries"],OD=Bm,LD=[...Bm,"globals"];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class op extends O0{constructor(e,n){super(),this._e=e,this.currentSequenceNumber=n}}function Xe(t,e){const n=$(t);return Sn.F(n._e,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zv(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function ai(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function z0(t,e){const n=[];for(const r in t)Object.prototype.hasOwnProperty.call(t,r)&&n.push(e(t[r],r,t));return n}function $0(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ye{constructor(e,n){this.comparator=e,this.root=n||at.EMPTY}insert(e,n){return new ye(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,at.BLACK,null,null))}remove(e){return new ye(this.comparator,this.root.remove(e,this.comparator).copy(null,null,at.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return n+r.left.size;i<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){const e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new wu(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new wu(this.root,e,this.comparator,!1)}getReverseIterator(){return new wu(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new wu(this.root,e,this.comparator,!0)}}class wu{constructor(e,n,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=n?r(e.key,n):1,n&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class at{constructor(e,n,r,i,s){this.key=e,this.value=n,this.color=r??at.RED,this.left=i??at.EMPTY,this.right=s??at.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,i,s){return new at(e??this.key,n??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,n,r),null):s===0?i.copy(null,n,null,null,null):i.copy(null,null,null,null,i.right.insert(e,n,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return at.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,i=this;if(n(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(e,i.key)===0){if(i.right.isEmpty())return at.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,at.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,at.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw W();const e=this.left.check();if(e!==this.right.check())throw W();return e+(this.isRed()?0:1)}}at.EMPTY=null,at.RED=!0,at.BLACK=!1;at.EMPTY=new class{constructor(){this.size=0}get key(){throw W()}get value(){throw W()}get color(){throw W()}get left(){throw W()}get right(){throw W()}copy(e,n,r,i,s){return this}insert(e,n,r){return new at(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fe{constructor(e){this.comparator=e,this.data=new ye(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;n(i.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new $v(this.data.getIterator())}getIteratorFrom(e){return new $v(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof fe)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new fe(this.comparator);return n.data=e,n}}class $v{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function ps(t){return t.hasNext()?t.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dt{constructor(e){this.fields=e,e.sort(Ae.comparator)}static empty(){return new Dt([])}unionWith(e){let n=new fe(Ae.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new Dt(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return eo(this.fields,e.fields,(n,r)=>n.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q0 extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function DM(){return typeof atob<"u"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Me{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new q0("Invalid base64 string: "+s):s}}(e);return new Me(n)}static fromUint8Array(e){const n=function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s}(e);return new Me(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return X(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Me.EMPTY_BYTE_STRING=new Me("");const MD=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Yn(t){if(Q(!!t),typeof t=="string"){let e=0;const n=MD.exec(t);if(Q(!!n),n[1]){let i=n[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Te(t.seconds),nanos:Te(t.nanos)}}function Te(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function Xn(t){return typeof t=="string"?Me.fromBase64String(t):Me.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gh(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function _h(t){const e=t.mapValue.fields.__previous_value__;return gh(e)?_h(e):e}function rl(t){const e=Yn(t.mapValue.fields.__local_write_time__.timestampValue);return new xe(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FD{constructor(e,n,r,i,s,o,a,u,c){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=u,this.useFetchStreams=c}}class $i{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new $i("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof $i&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cr={mapValue:{fields:{__type__:{stringValue:"__max__"}}}},Ku={nullValue:"NULL_VALUE"};function Kr(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?gh(t)?4:G0(t)?9007199254740991:yh(t)?10:11:W()}function Pn(t,e){if(t===e)return!0;const n=Kr(t);if(n!==Kr(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return rl(t).isEqual(rl(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=Yn(i.timestampValue),a=Yn(s.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(i,s){return Xn(i.bytesValue).isEqual(Xn(s.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(i,s){return Te(i.geoPointValue.latitude)===Te(s.geoPointValue.latitude)&&Te(i.geoPointValue.longitude)===Te(s.geoPointValue.longitude)}(t,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return Te(i.integerValue)===Te(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=Te(i.doubleValue),a=Te(s.doubleValue);return o===a?nl(o)===nl(a):isNaN(o)&&isNaN(a)}return!1}(t,e);case 9:return eo(t.arrayValue.values||[],e.arrayValue.values||[],Pn);case 10:case 11:return function(i,s){const o=i.mapValue.fields||{},a=s.mapValue.fields||{};if(zv(o)!==zv(a))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(a[u]===void 0||!Pn(o[u],a[u])))return!1;return!0}(t,e);default:return W()}}function il(t,e){return(t.values||[]).find(n=>Pn(n,e))!==void 0}function Wr(t,e){if(t===e)return 0;const n=Kr(t),r=Kr(e);if(n!==r)return X(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return X(t.booleanValue,e.booleanValue);case 2:return function(s,o){const a=Te(s.integerValue||s.doubleValue),u=Te(o.integerValue||o.doubleValue);return a<u?-1:a>u?1:a===u?0:isNaN(a)?isNaN(u)?0:-1:1}(t,e);case 3:return qv(t.timestampValue,e.timestampValue);case 4:return qv(rl(t),rl(e));case 5:return X(t.stringValue,e.stringValue);case 6:return function(s,o){const a=Xn(s),u=Xn(o);return a.compareTo(u)}(t.bytesValue,e.bytesValue);case 7:return function(s,o){const a=s.split("/"),u=o.split("/");for(let c=0;c<a.length&&c<u.length;c++){const d=X(a[c],u[c]);if(d!==0)return d}return X(a.length,u.length)}(t.referenceValue,e.referenceValue);case 8:return function(s,o){const a=X(Te(s.latitude),Te(o.latitude));return a!==0?a:X(Te(s.longitude),Te(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return Gv(t.arrayValue,e.arrayValue);case 10:return function(s,o){var a,u,c,d;const f=s.fields||{},m=o.fields||{},v=(a=f.value)===null||a===void 0?void 0:a.arrayValue,S=(u=m.value)===null||u===void 0?void 0:u.arrayValue,P=X(((c=v==null?void 0:v.values)===null||c===void 0?void 0:c.length)||0,((d=S==null?void 0:S.values)===null||d===void 0?void 0:d.length)||0);return P!==0?P:Gv(v,S)}(t.mapValue,e.mapValue);case 11:return function(s,o){if(s===Cr.mapValue&&o===Cr.mapValue)return 0;if(s===Cr.mapValue)return 1;if(o===Cr.mapValue)return-1;const a=s.fields||{},u=Object.keys(a),c=o.fields||{},d=Object.keys(c);u.sort(),d.sort();for(let f=0;f<u.length&&f<d.length;++f){const m=X(u[f],d[f]);if(m!==0)return m;const v=Wr(a[u[f]],c[d[f]]);if(v!==0)return v}return X(u.length,d.length)}(t.mapValue,e.mapValue);default:throw W()}}function qv(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return X(t,e);const n=Yn(t),r=Yn(e),i=X(n.seconds,r.seconds);return i!==0?i:X(n.nanos,r.nanos)}function Gv(t,e){const n=t.values||[],r=e.values||[];for(let i=0;i<n.length&&i<r.length;++i){const s=Wr(n[i],r[i]);if(s)return s}return X(n.length,r.length)}function ro(t){return ap(t)}function ap(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const r=Yn(n);return`time(${r.seconds},${r.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return Xn(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return G.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let r="[",i=!0;for(const s of n.values||[])i?i=!1:r+=",",r+=ap(s);return r+"]"}(t.arrayValue):"mapValue"in t?function(n){const r=Object.keys(n.fields||{}).sort();let i="{",s=!0;for(const o of r)s?s=!1:i+=",",i+=`${o}:${ap(n.fields[o])}`;return i+"}"}(t.mapValue):W()}function Wu(t){switch(Kr(t)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=_h(t);return e?16+Wu(e):16;case 5:return 2*t.stringValue.length;case 6:return Xn(t.bytesValue).approximateByteSize();case 7:return t.referenceValue.length;case 9:return function(r){return(r.values||[]).reduce((i,s)=>i+Wu(s),0)}(t.arrayValue);case 10:case 11:return function(r){let i=0;return ai(r.fields,(s,o)=>{i+=s.length+Wu(o)}),i}(t.mapValue);default:throw W()}}function qi(t,e){return{referenceValue:`projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`}}function lp(t){return!!t&&"integerValue"in t}function sl(t){return!!t&&"arrayValue"in t}function Kv(t){return!!t&&"nullValue"in t}function Wv(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function Hu(t){return!!t&&"mapValue"in t}function yh(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="__vector__"}function Pa(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return ai(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=Pa(r)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=Pa(t.arrayValue.values[n]);return e}return Object.assign({},t)}function G0(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}const K0={mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{}}}}};function UD(t){return"nullValue"in t?Ku:"booleanValue"in t?{booleanValue:!1}:"integerValue"in t||"doubleValue"in t?{doubleValue:NaN}:"timestampValue"in t?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in t?{stringValue:""}:"bytesValue"in t?{bytesValue:""}:"referenceValue"in t?qi($i.empty(),G.empty()):"geoPointValue"in t?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in t?{arrayValue:{}}:"mapValue"in t?yh(t)?K0:{mapValue:{}}:W()}function BD(t){return"nullValue"in t?{booleanValue:!1}:"booleanValue"in t?{doubleValue:NaN}:"integerValue"in t||"doubleValue"in t?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in t?{stringValue:""}:"stringValue"in t?{bytesValue:""}:"bytesValue"in t?qi($i.empty(),G.empty()):"referenceValue"in t?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in t?{arrayValue:{}}:"arrayValue"in t?K0:"mapValue"in t?yh(t)?{mapValue:{}}:Cr:W()}function Hv(t,e){const n=Wr(t.value,e.value);return n!==0?n:t.inclusive&&!e.inclusive?-1:!t.inclusive&&e.inclusive?1:0}function Qv(t,e){const n=Wr(t.value,e.value);return n!==0?n:t.inclusive&&!e.inclusive?1:!t.inclusive&&e.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lt{constructor(e){this.value=e}static empty(){return new lt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!Hu(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=Pa(n)}setAll(e){let n=Ae.emptyPath(),r={},i=[];e.forEach((o,a)=>{if(!n.isImmediateParentOf(a)){const u=this.getFieldsMap(n);this.applyChanges(u,r,i),r={},i=[],n=a.popLast()}o?r[a.lastSegment()]=Pa(o):i.push(a.lastSegment())});const s=this.getFieldsMap(n);this.applyChanges(s,r,i)}delete(e){const n=this.field(e.popLast());Hu(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return Pn(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=n.mapValue.fields[e.get(r)];Hu(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=i),n=i}return n.mapValue.fields}applyChanges(e,n,r){ai(n,(i,s)=>e[i]=s);for(const i of r)delete e[i]}clone(){return new lt(Pa(this.value))}}function W0(t){const e=[];return ai(t.fields,(n,r)=>{const i=new Ae([n]);if(Hu(r)){const s=W0(r.mapValue).fields;if(s.length===0)e.push(i);else for(const o of s)e.push(i.child(o))}else e.push(i)}),new Dt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ee{constructor(e,n,r,i,s,o,a){this.key=e,this.documentType=n,this.version=r,this.readTime=i,this.createTime=s,this.data=o,this.documentState=a}static newInvalidDocument(e){return new Ee(e,0,J.min(),J.min(),J.min(),lt.empty(),0)}static newFoundDocument(e,n,r,i){return new Ee(e,1,n,J.min(),r,i,0)}static newNoDocument(e,n){return new Ee(e,2,n,J.min(),J.min(),lt.empty(),0)}static newUnknownDocument(e,n){return new Ee(e,3,n,J.min(),J.min(),lt.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(J.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=lt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=lt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=J.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ee&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ee(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hr{constructor(e,n){this.position=e,this.inclusive=n}}function Jv(t,e,n){let r=0;for(let i=0;i<t.position.length;i++){const s=e[i],o=t.position[i];if(s.field.isKeyField()?r=G.comparator(G.fromName(o.referenceValue),n.key):r=Wr(o,n.data.field(s.field)),s.dir==="desc"&&(r*=-1),r!==0)break}return r}function Yv(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!Pn(t.position[n],e.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ol{constructor(e,n="asc"){this.field=e,this.dir=n}}function jD(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H0{}class oe extends H0{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new zD(e,n,r):n==="array-contains"?new GD(e,r):n==="in"?new eS(e,r):n==="not-in"?new KD(e,r):n==="array-contains-any"?new WD(e,r):new oe(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new $D(e,r):new qD(e,r)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(Wr(n,this.value)):n!==null&&Kr(this.value)===Kr(n)&&this.matchesComparison(Wr(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return W()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class he extends H0{constructor(e,n){super(),this.filters=e,this.op=n,this.ae=null}static create(e,n){return new he(e,n)}matches(e){return io(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function io(t){return t.op==="and"}function up(t){return t.op==="or"}function jm(t){return Q0(t)&&io(t)}function Q0(t){for(const e of t.filters)if(e instanceof he)return!1;return!0}function cp(t){if(t instanceof oe)return t.field.canonicalString()+t.op.toString()+ro(t.value);if(jm(t))return t.filters.map(e=>cp(e)).join(",");{const e=t.filters.map(n=>cp(n)).join(",");return`${t.op}(${e})`}}function J0(t,e){return t instanceof oe?function(r,i){return i instanceof oe&&r.op===i.op&&r.field.isEqual(i.field)&&Pn(r.value,i.value)}(t,e):t instanceof he?function(r,i){return i instanceof he&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce((s,o,a)=>s&&J0(o,i.filters[a]),!0):!1}(t,e):void W()}function Y0(t,e){const n=t.filters.concat(e);return he.create(n,t.op)}function X0(t){return t instanceof oe?function(n){return`${n.field.canonicalString()} ${n.op} ${ro(n.value)}`}(t):t instanceof he?function(n){return n.op.toString()+" {"+n.getFilters().map(X0).join(" ,")+"}"}(t):"Filter"}class zD extends oe{constructor(e,n,r){super(e,n,r),this.key=G.fromName(r.referenceValue)}matches(e){const n=G.comparator(e.key,this.key);return this.matchesComparison(n)}}class $D extends oe{constructor(e,n){super(e,"in",n),this.keys=Z0("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class qD extends oe{constructor(e,n){super(e,"not-in",n),this.keys=Z0("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function Z0(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(r=>G.fromName(r.referenceValue))}class GD extends oe{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return sl(n)&&il(n.arrayValue,this.value)}}class eS extends oe{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&il(this.value.arrayValue,n)}}class KD extends oe{constructor(e,n){super(e,"not-in",n)}matches(e){if(il(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!il(this.value.arrayValue,n)}}class WD extends oe{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!sl(n)||!n.arrayValue.values)&&n.arrayValue.values.some(r=>il(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HD{constructor(e,n=null,r=[],i=[],s=null,o=null,a=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=o,this.endAt=a,this.ue=null}}function hp(t,e=null,n=[],r=[],i=null,s=null,o=null){return new HD(t,e,n,r,i,s,o)}function Gi(t){const e=$(t);if(e.ue===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(r=>cp(r)).join(","),n+="|ob:",n+=e.orderBy.map(r=>function(s){return s.field.canonicalString()+s.dir}(r)).join(","),Tl(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(r=>ro(r)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(r=>ro(r)).join(",")),e.ue=n}return e.ue}function Sl(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!jD(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!J0(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!Yv(t.startAt,e.startAt)&&Yv(t.endAt,e.endAt)}function Dc(t){return G.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}function Vc(t,e){return t.filters.filter(n=>n instanceof oe&&n.field.isEqual(e))}function Xv(t,e,n){let r=Ku,i=!0;for(const s of Vc(t,e)){let o=Ku,a=!0;switch(s.op){case"<":case"<=":o=UD(s.value);break;case"==":case"in":case">=":o=s.value;break;case">":o=s.value,a=!1;break;case"!=":case"not-in":o=Ku}Hv({value:r,inclusive:i},{value:o,inclusive:a})<0&&(r=o,i=a)}if(n!==null){for(let s=0;s<t.orderBy.length;++s)if(t.orderBy[s].field.isEqual(e)){const o=n.position[s];Hv({value:r,inclusive:i},{value:o,inclusive:n.inclusive})<0&&(r=o,i=n.inclusive);break}}return{value:r,inclusive:i}}function Zv(t,e,n){let r=Cr,i=!0;for(const s of Vc(t,e)){let o=Cr,a=!0;switch(s.op){case">=":case">":o=BD(s.value),a=!1;break;case"==":case"in":case"<=":o=s.value;break;case"<":o=s.value,a=!1;break;case"!=":case"not-in":o=Cr}Qv({value:r,inclusive:i},{value:o,inclusive:a})>0&&(r=o,i=a)}if(n!==null){for(let s=0;s<t.orderBy.length;++s)if(t.orderBy[s].field.isEqual(e)){const o=n.position[s];Qv({value:r,inclusive:i},{value:o,inclusive:n.inclusive})>0&&(r=o,i=n.inclusive);break}}return{value:r,inclusive:i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tr{constructor(e,n=null,r=[],i=[],s=null,o="F",a=null,u=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=o,this.startAt=a,this.endAt=u,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function tS(t,e,n,r,i,s,o,a){return new tr(t,e,n,r,i,s,o,a)}function To(t){return new tr(t)}function ew(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function zm(t){return t.collectionGroup!==null}function Gs(t){const e=$(t);if(e.ce===null){e.ce=[];const n=new Set;for(const s of e.explicitOrderBy)e.ce.push(s),n.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new fe(Ae.comparator);return o.filters.forEach(u=>{u.getFlattenedFilters().forEach(c=>{c.isInequality()&&(a=a.add(c.field))})}),a})(e).forEach(s=>{n.has(s.canonicalString())||s.isKeyField()||e.ce.push(new ol(s,r))}),n.has(Ae.keyField().canonicalString())||e.ce.push(new ol(Ae.keyField(),r))}return e.ce}function Et(t){const e=$(t);return e.le||(e.le=rS(e,Gs(t))),e.le}function nS(t){const e=$(t);return e.he||(e.he=rS(e,t.explicitOrderBy)),e.he}function rS(t,e){if(t.limitType==="F")return hp(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new ol(i.field,s)});const n=t.endAt?new Hr(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new Hr(t.startAt.position,t.startAt.inclusive):null;return hp(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}function dp(t,e){const n=t.filters.concat([e]);return new tr(t.path,t.collectionGroup,t.explicitOrderBy.slice(),n,t.limit,t.limitType,t.startAt,t.endAt)}function Oc(t,e,n){return new tr(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function Al(t,e){return Sl(Et(t),Et(e))&&t.limitType===e.limitType}function iS(t){return`${Gi(Et(t))}|lt:${t.limitType}`}function ws(t){return`Query(target=${function(n){let r=n.path.canonicalString();return n.collectionGroup!==null&&(r+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(r+=`, filters: [${n.filters.map(i=>X0(i)).join(", ")}]`),Tl(n.limit)||(r+=", limit: "+n.limit),n.orderBy.length>0&&(r+=`, orderBy: [${n.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),n.startAt&&(r+=", startAt: ",r+=n.startAt.inclusive?"b:":"a:",r+=n.startAt.position.map(i=>ro(i)).join(",")),n.endAt&&(r+=", endAt: ",r+=n.endAt.inclusive?"a:":"b:",r+=n.endAt.position.map(i=>ro(i)).join(",")),`Target(${r})`}(Et(t))}; limitType=${t.limitType})`}function Rl(t,e){return e.isFoundDocument()&&function(r,i){const s=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(s):G.isDocumentKey(r.path)?r.path.isEqual(s):r.path.isImmediateParentOf(s)}(t,e)&&function(r,i){for(const s of Gs(r))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(t,e)&&function(r,i){for(const s of r.filters)if(!s.matches(i))return!1;return!0}(t,e)&&function(r,i){return!(r.startAt&&!function(o,a,u){const c=Jv(o,a,u);return o.inclusive?c<=0:c<0}(r.startAt,Gs(r),i)||r.endAt&&!function(o,a,u){const c=Jv(o,a,u);return o.inclusive?c>=0:c>0}(r.endAt,Gs(r),i))}(t,e)}function sS(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function oS(t){return(e,n)=>{let r=!1;for(const i of Gs(t)){const s=QD(i,e,n);if(s!==0)return s;r=r||i.field.isKeyField()}return 0}}function QD(t,e,n){const r=t.field.isKeyField()?G.comparator(e.key,n.key):function(s,o,a){const u=o.data.field(s),c=a.data.field(s);return u!==null&&c!==null?Wr(u,c):W()}(t.field,e,n);switch(t.dir){case"asc":return r;case"desc":return-1*r;default:return W()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nr{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r!==void 0){for(const[i,s]of r)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,n){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,n]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,n]);i.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[n]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){ai(this.inner,(n,r)=>{for(const[i,s]of r)e(i,s)})}isEmpty(){return $0(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const JD=new ye(G.comparator);function Vt(){return JD}const aS=new ye(G.comparator);function fa(...t){let e=aS;for(const n of t)e=e.insert(n.key,n);return e}function lS(t){let e=aS;return t.forEach((n,r)=>e=e.insert(n,r.overlayedDocument)),e}function yn(){return Ca()}function uS(){return Ca()}function Ca(){return new nr(t=>t.toString(),(t,e)=>t.isEqual(e))}const YD=new ye(G.comparator),XD=new fe(G.comparator);function ee(...t){let e=XD;for(const n of t)e=e.add(n);return e}const ZD=new fe(X);function $m(){return ZD}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qm(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:nl(e)?"-0":e}}function cS(t){return{integerValue:""+t}}function hS(t,e){return M0(e)?cS(e):qm(t,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vh{constructor(){this._=void 0}}function eV(t,e,n){return t instanceof so?function(i,s){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&gh(s)&&(s=_h(s)),s&&(o.fields.__previous_value__=s),{mapValue:o}}(n,e):t instanceof Ki?fS(t,e):t instanceof Wi?pS(t,e):function(i,s){const o=dS(i,s),a=tw(o)+tw(i.Pe);return lp(o)&&lp(i.Pe)?cS(a):qm(i.serializer,a)}(t,e)}function tV(t,e,n){return t instanceof Ki?fS(t,e):t instanceof Wi?pS(t,e):n}function dS(t,e){return t instanceof oo?function(r){return lp(r)||function(s){return!!s&&"doubleValue"in s}(r)}(e)?e:{integerValue:0}:null}class so extends vh{}class Ki extends vh{constructor(e){super(),this.elements=e}}function fS(t,e){const n=mS(e);for(const r of t.elements)n.some(i=>Pn(i,r))||n.push(r);return{arrayValue:{values:n}}}class Wi extends vh{constructor(e){super(),this.elements=e}}function pS(t,e){let n=mS(e);for(const r of t.elements)n=n.filter(i=>!Pn(i,r));return{arrayValue:{values:n}}}class oo extends vh{constructor(e,n){super(),this.serializer=e,this.Pe=n}}function tw(t){return Te(t.integerValue||t.doubleValue)}function mS(t){return sl(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pl{constructor(e,n){this.field=e,this.transform=n}}function nV(t,e){return t.field.isEqual(e.field)&&function(r,i){return r instanceof Ki&&i instanceof Ki||r instanceof Wi&&i instanceof Wi?eo(r.elements,i.elements,Pn):r instanceof oo&&i instanceof oo?Pn(r.Pe,i.Pe):r instanceof so&&i instanceof so}(t.transform,e.transform)}class rV{constructor(e,n){this.version=e,this.transformResults=n}}class Re{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new Re}static exists(e){return new Re(void 0,e)}static updateTime(e){return new Re(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Qu(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class wh{}function gS(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new Ao(t.key,Re.none()):new So(t.key,t.data,Re.none());{const n=t.data,r=lt.empty();let i=new fe(Ae.comparator);for(let s of e.fields)if(!i.has(s)){let o=n.field(s);o===null&&s.length>1&&(s=s.popLast(),o=n.field(s)),o===null?r.delete(s):r.set(s,o),i=i.add(s)}return new rr(t.key,r,new Dt(i.toArray()),Re.none())}}function iV(t,e,n){t instanceof So?function(i,s,o){const a=i.value.clone(),u=rw(i.fieldTransforms,s,o.transformResults);a.setAll(u),s.convertToFoundDocument(o.version,a).setHasCommittedMutations()}(t,e,n):t instanceof rr?function(i,s,o){if(!Qu(i.precondition,s))return void s.convertToUnknownDocument(o.version);const a=rw(i.fieldTransforms,s,o.transformResults),u=s.data;u.setAll(_S(i)),u.setAll(a),s.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(t,e,n):function(i,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function ka(t,e,n,r){return t instanceof So?function(s,o,a,u){if(!Qu(s.precondition,o))return a;const c=s.value.clone(),d=iw(s.fieldTransforms,u,o);return c.setAll(d),o.convertToFoundDocument(o.version,c).setHasLocalMutations(),null}(t,e,n,r):t instanceof rr?function(s,o,a,u){if(!Qu(s.precondition,o))return a;const c=iw(s.fieldTransforms,u,o),d=o.data;return d.setAll(_S(s)),d.setAll(c),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),a===null?null:a.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(f=>f.field))}(t,e,n,r):function(s,o,a){return Qu(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):a}(t,e,n)}function sV(t,e){let n=null;for(const r of t.fieldTransforms){const i=e.data.field(r.field),s=dS(r.transform,i||null);s!=null&&(n===null&&(n=lt.empty()),n.set(r.field,s))}return n||null}function nw(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&eo(r,i,(s,o)=>nV(s,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class So extends wh{constructor(e,n,r,i=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class rr extends wh{constructor(e,n,r,i,s=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function _S(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=t.data.field(n);e.set(n,r)}}),e}function rw(t,e,n){const r=new Map;Q(t.length===n.length);for(let i=0;i<n.length;i++){const s=t[i],o=s.transform,a=e.data.field(s.field);r.set(s.field,tV(o,a,n[i]))}return r}function iw(t,e,n){const r=new Map;for(const i of t){const s=i.transform,o=n.data.field(i.field);r.set(i.field,eV(s,o,e))}return r}class Ao extends wh{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Gm extends wh{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Km{constructor(e,n,r,i){this.batchId=e,this.localWriteTime=n,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,n){const r=n.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&iV(s,e,r[i])}}applyToLocalView(e,n){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(n=ka(r,e,n,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(n=ka(r,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const r=uS();return this.mutations.forEach(i=>{const s=e.get(i.key),o=s.overlayedDocument;let a=this.applyToLocalView(o,s.mutatedFields);a=n.has(i.key)?null:a;const u=gS(o,a);u!==null&&r.set(i.key,u),o.isValidDocument()||o.convertToNoDocument(J.min())}),r}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),ee())}isEqual(e){return this.batchId===e.batchId&&eo(this.mutations,e.mutations,(n,r)=>nw(n,r))&&eo(this.baseMutations,e.baseMutations,(n,r)=>nw(n,r))}}class Wm{constructor(e,n,r,i){this.batch=e,this.commitVersion=n,this.mutationResults=r,this.docVersions=i}static from(e,n,r){Q(e.mutations.length===r.length);let i=function(){return YD}();const s=e.mutations;for(let o=0;o<s.length;o++)i=i.insert(s[o].key,r[o].version);return new Wm(e,n,r,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hm{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yS{constructor(e,n,r){this.alias=e,this.aggregateType=n,this.fieldPath=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oV{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var We,ae;function vS(t){switch(t){default:return W();case O.CANCELLED:case O.UNKNOWN:case O.DEADLINE_EXCEEDED:case O.RESOURCE_EXHAUSTED:case O.INTERNAL:case O.UNAVAILABLE:case O.UNAUTHENTICATED:return!1;case O.INVALID_ARGUMENT:case O.NOT_FOUND:case O.ALREADY_EXISTS:case O.PERMISSION_DENIED:case O.FAILED_PRECONDITION:case O.ABORTED:case O.OUT_OF_RANGE:case O.UNIMPLEMENTED:case O.DATA_LOSS:return!0}}function wS(t){if(t===void 0)return ze("GRPC error has no .code"),O.UNKNOWN;switch(t){case We.OK:return O.OK;case We.CANCELLED:return O.CANCELLED;case We.UNKNOWN:return O.UNKNOWN;case We.DEADLINE_EXCEEDED:return O.DEADLINE_EXCEEDED;case We.RESOURCE_EXHAUSTED:return O.RESOURCE_EXHAUSTED;case We.INTERNAL:return O.INTERNAL;case We.UNAVAILABLE:return O.UNAVAILABLE;case We.UNAUTHENTICATED:return O.UNAUTHENTICATED;case We.INVALID_ARGUMENT:return O.INVALID_ARGUMENT;case We.NOT_FOUND:return O.NOT_FOUND;case We.ALREADY_EXISTS:return O.ALREADY_EXISTS;case We.PERMISSION_DENIED:return O.PERMISSION_DENIED;case We.FAILED_PRECONDITION:return O.FAILED_PRECONDITION;case We.ABORTED:return O.ABORTED;case We.OUT_OF_RANGE:return O.OUT_OF_RANGE;case We.UNIMPLEMENTED:return O.UNIMPLEMENTED;case We.DATA_LOSS:return O.DATA_LOSS;default:return W()}}(ae=We||(We={}))[ae.OK=0]="OK",ae[ae.CANCELLED=1]="CANCELLED",ae[ae.UNKNOWN=2]="UNKNOWN",ae[ae.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ae[ae.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ae[ae.NOT_FOUND=5]="NOT_FOUND",ae[ae.ALREADY_EXISTS=6]="ALREADY_EXISTS",ae[ae.PERMISSION_DENIED=7]="PERMISSION_DENIED",ae[ae.UNAUTHENTICATED=16]="UNAUTHENTICATED",ae[ae.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ae[ae.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ae[ae.ABORTED=10]="ABORTED",ae[ae.OUT_OF_RANGE=11]="OUT_OF_RANGE",ae[ae.UNIMPLEMENTED=12]="UNIMPLEMENTED",ae[ae.INTERNAL=13]="INTERNAL",ae[ae.UNAVAILABLE=14]="UNAVAILABLE",ae[ae.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Lc=null;/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ES(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aV=new Ni([4294967295,4294967295],0);function sw(t){const e=ES().encode(t),n=new I0;return n.update(e),new Uint8Array(n.digest())}function ow(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new Ni([n,r],0),new Ni([i,s],0)]}class Qm{constructor(e,n,r){if(this.bitmap=e,this.padding=n,this.hashCount=r,n<0||n>=8)throw new pa(`Invalid padding: ${n}`);if(r<0)throw new pa(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new pa(`Invalid hash count: ${r}`);if(e.length===0&&n!==0)throw new pa(`Invalid padding when bitmap length is 0: ${n}`);this.Ie=8*e.length-n,this.Te=Ni.fromNumber(this.Ie)}Ee(e,n,r){let i=e.add(n.multiply(Ni.fromNumber(r)));return i.compare(aV)===1&&(i=new Ni([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const n=sw(e),[r,i]=ow(n);for(let s=0;s<this.hashCount;s++){const o=this.Ee(r,i,s);if(!this.de(o))return!1}return!0}static create(e,n,r){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new Qm(s,i,n);return r.forEach(a=>o.insert(a)),o}insert(e){if(this.Ie===0)return;const n=sw(e),[r,i]=ow(n);for(let s=0;s<this.hashCount;s++){const o=this.Ee(r,i,s);this.Ae(o)}}Ae(e){const n=Math.floor(e/8),r=e%8;this.bitmap[n]|=1<<r}}class pa extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cl{constructor(e,n,r,i,s){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=r,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,n,r){const i=new Map;return i.set(e,kl.createSynthesizedTargetChangeForCurrentChange(e,n,r)),new Cl(J.min(),i,new ye(X),Vt(),ee())}}class kl{constructor(e,n,r,i,s){this.resumeToken=e,this.current=n,this.addedDocuments=r,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,n,r){return new kl(r,n,ee(),ee(),ee())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ju{constructor(e,n,r,i){this.Re=e,this.removedTargetIds=n,this.key=r,this.Ve=i}}class IS{constructor(e,n){this.targetId=e,this.me=n}}class TS{constructor(e,n,r=Me.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=n,this.resumeToken=r,this.cause=i}}class aw{constructor(){this.fe=0,this.ge=uw(),this.pe=Me.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=ee(),n=ee(),r=ee();return this.ge.forEach((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:n=n.add(i);break;case 1:r=r.add(i);break;default:W()}}),new kl(this.pe,this.ye,e,n,r)}Ce(){this.we=!1,this.ge=uw()}Fe(e,n){this.we=!0,this.ge=this.ge.insert(e,n)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,Q(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class lV{constructor(e){this.Le=e,this.Be=new Map,this.ke=Vt(),this.qe=lw(),this.Qe=new ye(X)}Ke(e){for(const n of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(n,e.Ve):this.Ue(n,e.key,e.Ve);for(const n of e.removedTargetIds)this.Ue(n,e.key,e.Ve)}We(e){this.forEachTarget(e,n=>{const r=this.Ge(n);switch(e.state){case 0:this.ze(n)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(n);break;case 3:this.ze(n)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.ze(n)&&(this.je(n),r.De(e.resumeToken));break;default:W()}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.Be.forEach((r,i)=>{this.ze(i)&&n(i)})}He(e){const n=e.targetId,r=e.me.count,i=this.Je(n);if(i){const s=i.target;if(Dc(s))if(r===0){const o=new G(s.path);this.Ue(n,o,Ee.newNoDocument(o,J.min()))}else Q(r===1);else{const o=this.Ye(n);if(o!==r){const a=this.Ze(e),u=a?this.Xe(a,e,o):1;if(u!==0){this.je(n);const c=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(n,c)}Lc==null||Lc.et(function(d,f,m,v,S){var P,C,w,y,E,x;const M={localCacheCount:d,existenceFilterCount:f.count,databaseId:m.database,projectId:m.projectId},F=f.unchangedNames;return F&&(M.bloomFilter={applied:S===0,hashCount:(P=F==null?void 0:F.hashCount)!==null&&P!==void 0?P:0,bitmapLength:(y=(w=(C=F==null?void 0:F.bits)===null||C===void 0?void 0:C.bitmap)===null||w===void 0?void 0:w.length)!==null&&y!==void 0?y:0,padding:(x=(E=F==null?void 0:F.bits)===null||E===void 0?void 0:E.padding)!==null&&x!==void 0?x:0,mightContain:I=>{var _;return(_=v==null?void 0:v.mightContain(I))!==null&&_!==void 0&&_}}),M}(o,e.me,this.Le.tt(),a,u))}}}}Ze(e){const n=e.me.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:r="",padding:i=0},hashCount:s=0}=n;let o,a;try{o=Xn(r).toUint8Array()}catch(u){if(u instanceof q0)return en("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{a=new Qm(o,i,s)}catch(u){return en(u instanceof pa?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return a.Ie===0?null:a}Xe(e,n,r){return n.me.count===r-this.nt(e,n.targetId)?0:2}nt(e,n){const r=this.Le.getRemoteKeysForTarget(n);let i=0;return r.forEach(s=>{const o=this.Le.tt(),a=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(a)||(this.Ue(n,s,null),i++)}),i}rt(e){const n=new Map;this.Be.forEach((s,o)=>{const a=this.Je(o);if(a){if(s.current&&Dc(a.target)){const u=new G(a.target.path);this.ke.get(u)!==null||this.it(o,u)||this.Ue(o,u,Ee.newNoDocument(u,e))}s.be&&(n.set(o,s.ve()),s.Ce())}});let r=ee();this.qe.forEach((s,o)=>{let a=!0;o.forEachWhile(u=>{const c=this.Je(u);return!c||c.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)}),a&&(r=r.add(s))}),this.ke.forEach((s,o)=>o.setReadTime(e));const i=new Cl(e,n,this.Qe,this.ke,r);return this.ke=Vt(),this.qe=lw(),this.Qe=new ye(X),i}$e(e,n){if(!this.ze(e))return;const r=this.it(e,n.key)?2:0;this.Ge(e).Fe(n.key,r),this.ke=this.ke.insert(n.key,n),this.qe=this.qe.insert(n.key,this.st(n.key).add(e))}Ue(e,n,r){if(!this.ze(e))return;const i=this.Ge(e);this.it(e,n)?i.Fe(n,1):i.Me(n),this.qe=this.qe.insert(n,this.st(n).delete(e)),r&&(this.ke=this.ke.insert(n,r))}removeTarget(e){this.Be.delete(e)}Ye(e){const n=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let n=this.Be.get(e);return n||(n=new aw,this.Be.set(e,n)),n}st(e){let n=this.qe.get(e);return n||(n=new fe(X),this.qe=this.qe.insert(e,n)),n}ze(e){const n=this.Je(e)!==null;return n||U("WatchChangeAggregator","Detected inactive target",e),n}Je(e){const n=this.Be.get(e);return n&&n.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new aw),this.Le.getRemoteKeysForTarget(e).forEach(n=>{this.Ue(e,n,null)})}it(e,n){return this.Le.getRemoteKeysForTarget(e).has(n)}}function lw(){return new ye(G.comparator)}function uw(){return new ye(G.comparator)}const uV={asc:"ASCENDING",desc:"DESCENDING"},cV={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},hV={and:"AND",or:"OR"};class dV{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function fp(t,e){return t.useProto3Json||Tl(e)?e:{value:e}}function ao(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function SS(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function fV(t,e){return ao(t,e.toTimestamp())}function qe(t){return Q(!!t),J.fromTimestamp(function(n){const r=Yn(n);return new xe(r.seconds,r.nanos)}(t))}function Jm(t,e){return pp(t,e).canonicalString()}function pp(t,e){const n=function(i){return new se(["projects",i.projectId,"databases",i.database])}(t).child("documents");return e===void 0?n:n.child(e)}function AS(t){const e=se.fromString(t);return Q(OS(e)),e}function al(t,e){return Jm(t.databaseId,e.path)}function An(t,e){const n=AS(e);if(n.get(1)!==t.databaseId.projectId)throw new j(O.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new j(O.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new G(CS(n))}function RS(t,e){return Jm(t.databaseId,e)}function PS(t){const e=AS(t);return e.length===4?se.emptyPath():CS(e)}function mp(t){return new se(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function CS(t){return Q(t.length>4&&t.get(4)==="documents"),t.popFirst(5)}function cw(t,e,n){return{name:al(t,e),fields:n.value.mapValue.fields}}function kS(t,e,n){const r=An(t,e.name),i=qe(e.updateTime),s=e.createTime?qe(e.createTime):J.min(),o=new lt({mapValue:{fields:e.fields}}),a=Ee.newFoundDocument(r,i,s,o);return n&&a.setHasCommittedMutations(),n?a.setHasCommittedMutations():a}function pV(t,e){return"found"in e?function(r,i){Q(!!i.found),i.found.name,i.found.updateTime;const s=An(r,i.found.name),o=qe(i.found.updateTime),a=i.found.createTime?qe(i.found.createTime):J.min(),u=new lt({mapValue:{fields:i.found.fields}});return Ee.newFoundDocument(s,o,a,u)}(t,e):"missing"in e?function(r,i){Q(!!i.missing),Q(!!i.readTime);const s=An(r,i.missing),o=qe(i.readTime);return Ee.newNoDocument(s,o)}(t,e):W()}function mV(t,e){let n;if("targetChange"in e){e.targetChange;const r=function(c){return c==="NO_CHANGE"?0:c==="ADD"?1:c==="REMOVE"?2:c==="CURRENT"?3:c==="RESET"?4:W()}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=function(c,d){return c.useProto3Json?(Q(d===void 0||typeof d=="string"),Me.fromBase64String(d||"")):(Q(d===void 0||d instanceof Buffer||d instanceof Uint8Array),Me.fromUint8Array(d||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&function(c){const d=c.code===void 0?O.UNKNOWN:wS(c.code);return new j(d,c.message||"")}(o);n=new TS(r,i,s,a||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=An(t,r.document.name),s=qe(r.document.updateTime),o=r.document.createTime?qe(r.document.createTime):J.min(),a=new lt({mapValue:{fields:r.document.fields}}),u=Ee.newFoundDocument(i,s,o,a),c=r.targetIds||[],d=r.removedTargetIds||[];n=new Ju(c,d,u.key,u)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=An(t,r.document),s=r.readTime?qe(r.readTime):J.min(),o=Ee.newNoDocument(i,s),a=r.removedTargetIds||[];n=new Ju([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=An(t,r.document),s=r.removedTargetIds||[];n=new Ju([],s,i,null)}else{if(!("filter"in e))return W();{e.filter;const r=e.filter;r.targetId;const{count:i=0,unchangedNames:s}=r,o=new oV(i,s),a=r.targetId;n=new IS(a,o)}}return n}function ll(t,e){let n;if(e instanceof So)n={update:cw(t,e.key,e.value)};else if(e instanceof Ao)n={delete:al(t,e.key)};else if(e instanceof rr)n={update:cw(t,e.key,e.data),updateMask:EV(e.fieldMask)};else{if(!(e instanceof Gm))return W();n={verify:al(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(r=>function(s,o){const a=o.transform;if(a instanceof so)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof Ki)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof Wi)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof oo)return{fieldPath:o.field.canonicalString(),increment:a.Pe};throw W()}(0,r))),e.precondition.isNone||(n.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:fV(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:W()}(t,e.precondition)),n}function gp(t,e){const n=e.currentDocument?function(s){return s.updateTime!==void 0?Re.updateTime(qe(s.updateTime)):s.exists!==void 0?Re.exists(s.exists):Re.none()}(e.currentDocument):Re.none(),r=e.updateTransforms?e.updateTransforms.map(i=>function(o,a){let u=null;if("setToServerValue"in a)Q(a.setToServerValue==="REQUEST_TIME"),u=new so;else if("appendMissingElements"in a){const d=a.appendMissingElements.values||[];u=new Ki(d)}else if("removeAllFromArray"in a){const d=a.removeAllFromArray.values||[];u=new Wi(d)}else"increment"in a?u=new oo(o,a.increment):W();const c=Ae.fromServerFormat(a.fieldPath);return new Pl(c,u)}(t,i)):[];if(e.update){e.update.name;const i=An(t,e.update.name),s=new lt({mapValue:{fields:e.update.fields}});if(e.updateMask){const o=function(u){const c=u.fieldPaths||[];return new Dt(c.map(d=>Ae.fromServerFormat(d)))}(e.updateMask);return new rr(i,s,o,n,r)}return new So(i,s,n,r)}if(e.delete){const i=An(t,e.delete);return new Ao(i,n)}if(e.verify){const i=An(t,e.verify);return new Gm(i,n)}return W()}function gV(t,e){return t&&t.length>0?(Q(e!==void 0),t.map(n=>function(i,s){let o=i.updateTime?qe(i.updateTime):qe(s);return o.isEqual(J.min())&&(o=qe(s)),new rV(o,i.transformResults||[])}(n,e))):[]}function xS(t,e){return{documents:[RS(t,e.path)]}}function Eh(t,e){const n={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=RS(t,i);const s=function(c){if(c.length!==0)return VS(he.create(c,"and"))}(e.filters);s&&(n.structuredQuery.where=s);const o=function(c){if(c.length!==0)return c.map(d=>function(m){return{field:Er(m.field),direction:yV(m.dir)}}(d))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const a=fp(t,e.limit);return a!==null&&(n.structuredQuery.limit=a),e.startAt&&(n.structuredQuery.startAt=function(c){return{before:c.inclusive,values:c.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(c){return{before:!c.inclusive,values:c.position}}(e.endAt)),{_t:n,parent:i}}function bS(t,e,n,r){const{_t:i,parent:s}=Eh(t,e),o={},a=[];let u=0;return n.forEach(c=>{const d=r?c.alias:"aggregate_"+u++;o[d]=c.alias,c.aggregateType==="count"?a.push({alias:d,count:{}}):c.aggregateType==="avg"?a.push({alias:d,avg:{field:Er(c.fieldPath)}}):c.aggregateType==="sum"&&a.push({alias:d,sum:{field:Er(c.fieldPath)}})}),{request:{structuredAggregationQuery:{aggregations:a,structuredQuery:i.structuredQuery},parent:i.parent},ut:o,parent:s}}function NS(t){let e=PS(t.parent);const n=t.structuredQuery,r=n.from?n.from.length:0;let i=null;if(r>0){Q(r===1);const d=n.from[0];d.allDescendants?i=d.collectionId:e=e.child(d.collectionId)}let s=[];n.where&&(s=function(f){const m=DS(f);return m instanceof he&&jm(m)?m.getFilters():[m]}(n.where));let o=[];n.orderBy&&(o=function(f){return f.map(m=>function(S){return new ol(Es(S.field),function(C){switch(C){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(S.direction))}(m))}(n.orderBy));let a=null;n.limit&&(a=function(f){let m;return m=typeof f=="object"?f.value:f,Tl(m)?null:m}(n.limit));let u=null;n.startAt&&(u=function(f){const m=!!f.before,v=f.values||[];return new Hr(v,m)}(n.startAt));let c=null;return n.endAt&&(c=function(f){const m=!f.before,v=f.values||[];return new Hr(v,m)}(n.endAt)),tS(e,i,o,s,a,"F",u,c)}function _V(t,e){const n=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return W()}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function DS(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const r=Es(n.unaryFilter.field);return oe.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=Es(n.unaryFilter.field);return oe.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=Es(n.unaryFilter.field);return oe.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Es(n.unaryFilter.field);return oe.create(o,"!=",{nullValue:"NULL_VALUE"});default:return W()}}(t):t.fieldFilter!==void 0?function(n){return oe.create(Es(n.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return W()}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return he.create(n.compositeFilter.filters.map(r=>DS(r)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return W()}}(n.compositeFilter.op))}(t):W()}function yV(t){return uV[t]}function vV(t){return cV[t]}function wV(t){return hV[t]}function Er(t){return{fieldPath:t.canonicalString()}}function Es(t){return Ae.fromServerFormat(t.fieldPath)}function VS(t){return t instanceof oe?function(n){if(n.op==="=="){if(Wv(n.value))return{unaryFilter:{field:Er(n.field),op:"IS_NAN"}};if(Kv(n.value))return{unaryFilter:{field:Er(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(Wv(n.value))return{unaryFilter:{field:Er(n.field),op:"IS_NOT_NAN"}};if(Kv(n.value))return{unaryFilter:{field:Er(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Er(n.field),op:vV(n.op),value:n.value}}}(t):t instanceof he?function(n){const r=n.getFilters().map(i=>VS(i));return r.length===1?r[0]:{compositeFilter:{op:wV(n.op),filters:r}}}(t):W()}function EV(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function OS(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zn{constructor(e,n,r,i,s=J.min(),o=J.min(),a=Me.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=n,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=u}withSequenceNumber(e){return new zn(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new zn(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new zn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new zn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LS{constructor(e){this.ct=e}}function IV(t,e){let n;if(e.document)n=kS(t.ct,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const r=G.fromSegments(e.noDocument.path),i=Qi(e.noDocument.readTime);n=Ee.newNoDocument(r,i),e.hasCommittedMutations&&n.setHasCommittedMutations()}else{if(!e.unknownDocument)return W();{const r=G.fromSegments(e.unknownDocument.path),i=Qi(e.unknownDocument.version);n=Ee.newUnknownDocument(r,i)}}return e.readTime&&n.setReadTime(function(i){const s=new xe(i[0],i[1]);return J.fromTimestamp(s)}(e.readTime)),n}function hw(t,e){const n=e.key,r={prefixPath:n.getCollectionPath().popLast().toArray(),collectionGroup:n.collectionGroup,documentId:n.path.lastSegment(),readTime:Mc(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())r.document=function(s,o){return{name:al(s,o.key),fields:o.data.value.mapValue.fields,updateTime:ao(s,o.version.toTimestamp()),createTime:ao(s,o.createTime.toTimestamp())}}(t.ct,e);else if(e.isNoDocument())r.noDocument={path:n.path.toArray(),readTime:Hi(e.version)};else{if(!e.isUnknownDocument())return W();r.unknownDocument={path:n.path.toArray(),version:Hi(e.version)}}return r}function Mc(t){const e=t.toTimestamp();return[e.seconds,e.nanoseconds]}function Hi(t){const e=t.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function Qi(t){const e=new xe(t.seconds,t.nanoseconds);return J.fromTimestamp(e)}function Ti(t,e){const n=(e.baseMutations||[]).map(s=>gp(t.ct,s));for(let s=0;s<e.mutations.length-1;++s){const o=e.mutations[s];if(s+1<e.mutations.length&&e.mutations[s+1].transform!==void 0){const a=e.mutations[s+1];o.updateTransforms=a.transform.fieldTransforms,e.mutations.splice(s+1,1),++s}}const r=e.mutations.map(s=>gp(t.ct,s)),i=xe.fromMillis(e.localWriteTimeMs);return new Km(e.batchId,i,n,r)}function ma(t){const e=Qi(t.readTime),n=t.lastLimboFreeSnapshotVersion!==void 0?Qi(t.lastLimboFreeSnapshotVersion):J.min();let r;return r=function(s){return s.documents!==void 0}(t.query)?function(s){return Q(s.documents.length===1),Et(To(PS(s.documents[0])))}(t.query):function(s){return Et(NS(s))}(t.query),new zn(r,t.targetId,"TargetPurposeListen",t.lastListenSequenceNumber,e,n,Me.fromBase64String(t.resumeToken))}function MS(t,e){const n=Hi(e.snapshotVersion),r=Hi(e.lastLimboFreeSnapshotVersion);let i;i=Dc(e.target)?xS(t.ct,e.target):Eh(t.ct,e.target)._t;const s=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:Gi(e.target),readTime:n,resumeToken:s,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:r,query:i}}function Ym(t){const e=NS({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?Oc(e,e.limit,"L"):e}function $d(t,e){return new Hm(e.largestBatchId,gp(t.ct,e.overlayMutation))}function dw(t,e){const n=e.path.lastSegment();return[t,wt(e.path.popLast()),n]}function fw(t,e,n,r){return{indexId:t,uid:e,sequenceNumber:n,readTime:Hi(r.readTime),documentKey:wt(r.documentKey.path),largestBatchId:r.largestBatchId}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TV{getBundleMetadata(e,n){return pw(e).get(n).next(r=>{if(r)return function(s){return{id:s.bundleId,createTime:Qi(s.createTime),version:s.version}}(r)})}saveBundleMetadata(e,n){return pw(e).put(function(i){return{bundleId:i.id,createTime:Hi(qe(i.createTime)),version:i.version}}(n))}getNamedQuery(e,n){return mw(e).get(n).next(r=>{if(r)return function(s){return{name:s.name,query:Ym(s.bundledQuery),readTime:Qi(s.readTime)}}(r)})}saveNamedQuery(e,n){return mw(e).put(function(i){return{name:i.name,readTime:Hi(qe(i.readTime)),bundledQuery:i.bundledQuery}}(n))}}function pw(t){return Xe(t,"bundles")}function mw(t){return Xe(t,"namedQueries")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ih{constructor(e,n){this.serializer=e,this.userId=n}static lt(e,n){const r=n.uid||"";return new Ih(e,r)}getOverlay(e,n){return ea(e).get(dw(this.userId,n)).next(r=>r?$d(this.serializer,r):null)}getOverlays(e,n){const r=yn();return b.forEach(n,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,n,r){const i=[];return r.forEach((s,o)=>{const a=new Hm(n,o);i.push(this.ht(e,a))}),b.waitFor(i)}removeOverlaysForBatchId(e,n,r){const i=new Set;n.forEach(o=>i.add(wt(o.getCollectionPath())));const s=[];return i.forEach(o=>{const a=IDBKeyRange.bound([this.userId,o,r],[this.userId,o,r+1],!1,!0);s.push(ea(e).j("collectionPathOverlayIndex",a))}),b.waitFor(s)}getOverlaysForCollection(e,n,r){const i=yn(),s=wt(n),o=IDBKeyRange.bound([this.userId,s,r],[this.userId,s,Number.POSITIVE_INFINITY],!0);return ea(e).U("collectionPathOverlayIndex",o).next(a=>{for(const u of a){const c=$d(this.serializer,u);i.set(c.getKey(),c)}return i})}getOverlaysForCollectionGroup(e,n,r,i){const s=yn();let o;const a=IDBKeyRange.bound([this.userId,n,r],[this.userId,n,Number.POSITIVE_INFINITY],!0);return ea(e).J({index:"collectionGroupOverlayIndex",range:a},(u,c,d)=>{const f=$d(this.serializer,c);s.size()<i||f.largestBatchId===o?(s.set(f.getKey(),f),o=f.largestBatchId):d.done()}).next(()=>s)}ht(e,n){return ea(e).put(function(i,s,o){const[a,u,c]=dw(s,o.mutation.key);return{userId:s,collectionPath:u,documentId:c,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:ll(i.ct,o.mutation)}}(this.serializer,this.userId,n))}}function ea(t){return Xe(t,"documentOverlays")}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SV{Pt(e){return Xe(e,"globals")}getSessionToken(e){return this.Pt(e).get("sessionToken").next(n=>{const r=n==null?void 0:n.value;return r?Me.fromUint8Array(r):Me.EMPTY_BYTE_STRING})}setSessionToken(e,n){return this.Pt(e).put({name:"sessionToken",value:n.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Si{constructor(){}It(e,n){this.Tt(e,n),n.Et()}Tt(e,n){if("nullValue"in e)this.dt(n,5);else if("booleanValue"in e)this.dt(n,10),n.At(e.booleanValue?1:0);else if("integerValue"in e)this.dt(n,15),n.At(Te(e.integerValue));else if("doubleValue"in e){const r=Te(e.doubleValue);isNaN(r)?this.dt(n,13):(this.dt(n,15),nl(r)?n.At(0):n.At(r))}else if("timestampValue"in e){let r=e.timestampValue;this.dt(n,20),typeof r=="string"&&(r=Yn(r)),n.Rt(`${r.seconds||""}`),n.At(r.nanos||0)}else if("stringValue"in e)this.Vt(e.stringValue,n),this.ft(n);else if("bytesValue"in e)this.dt(n,30),n.gt(Xn(e.bytesValue)),this.ft(n);else if("referenceValue"in e)this.yt(e.referenceValue,n);else if("geoPointValue"in e){const r=e.geoPointValue;this.dt(n,45),n.At(r.latitude||0),n.At(r.longitude||0)}else"mapValue"in e?G0(e)?this.dt(n,Number.MAX_SAFE_INTEGER):yh(e)?this.wt(e.mapValue,n):(this.St(e.mapValue,n),this.ft(n)):"arrayValue"in e?(this.bt(e.arrayValue,n),this.ft(n)):W()}Vt(e,n){this.dt(n,25),this.Dt(e,n)}Dt(e,n){n.Rt(e)}St(e,n){const r=e.fields||{};this.dt(n,55);for(const i of Object.keys(r))this.Vt(i,n),this.Tt(r[i],n)}wt(e,n){var r,i;const s=e.fields||{};this.dt(n,53);const o="value",a=((i=(r=s[o].arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.length)||0;this.dt(n,15),n.At(Te(a)),this.Vt(o,n),this.Tt(s[o],n)}bt(e,n){const r=e.values||[];this.dt(n,50);for(const i of r)this.Tt(i,n)}yt(e,n){this.dt(n,37),G.fromName(e).path.forEach(r=>{this.dt(n,60),this.Dt(r,n)})}dt(e,n){e.At(n)}ft(e){e.At(2)}}Si.vt=new Si;function AV(t){if(t===0)return 8;let e=0;return!(t>>4)&&(e+=4,t<<=4),!(t>>6)&&(e+=2,t<<=2),!(t>>7)&&(e+=1),e}function gw(t){const e=64-function(r){let i=0;for(let s=0;s<8;++s){const o=AV(255&r[s]);if(i+=o,o!==8)break}return i}(t);return Math.ceil(e/8)}class RV{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Ct(e){const n=e[Symbol.iterator]();let r=n.next();for(;!r.done;)this.Ft(r.value),r=n.next();this.Mt()}xt(e){const n=e[Symbol.iterator]();let r=n.next();for(;!r.done;)this.Ot(r.value),r=n.next();this.Nt()}Lt(e){for(const n of e){const r=n.charCodeAt(0);if(r<128)this.Ft(r);else if(r<2048)this.Ft(960|r>>>6),this.Ft(128|63&r);else if(n<"\uD800"||"\uDBFF"<n)this.Ft(480|r>>>12),this.Ft(128|63&r>>>6),this.Ft(128|63&r);else{const i=n.codePointAt(0);this.Ft(240|i>>>18),this.Ft(128|63&i>>>12),this.Ft(128|63&i>>>6),this.Ft(128|63&i)}}this.Mt()}Bt(e){for(const n of e){const r=n.charCodeAt(0);if(r<128)this.Ot(r);else if(r<2048)this.Ot(960|r>>>6),this.Ot(128|63&r);else if(n<"\uD800"||"\uDBFF"<n)this.Ot(480|r>>>12),this.Ot(128|63&r>>>6),this.Ot(128|63&r);else{const i=n.codePointAt(0);this.Ot(240|i>>>18),this.Ot(128|63&i>>>12),this.Ot(128|63&i>>>6),this.Ot(128|63&i)}}this.Nt()}kt(e){const n=this.qt(e),r=gw(n);this.Qt(1+r),this.buffer[this.position++]=255&r;for(let i=n.length-r;i<n.length;++i)this.buffer[this.position++]=255&n[i]}Kt(e){const n=this.qt(e),r=gw(n);this.Qt(1+r),this.buffer[this.position++]=~(255&r);for(let i=n.length-r;i<n.length;++i)this.buffer[this.position++]=~(255&n[i])}$t(){this.Ut(255),this.Ut(255)}Wt(){this.Gt(255),this.Gt(255)}reset(){this.position=0}seed(e){this.Qt(e.length),this.buffer.set(e,this.position),this.position+=e.length}zt(){return this.buffer.slice(0,this.position)}qt(e){const n=function(s){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,s,!1),new Uint8Array(o.buffer)}(e),r=(128&n[0])!=0;n[0]^=r?255:128;for(let i=1;i<n.length;++i)n[i]^=r?255:0;return n}Ft(e){const n=255&e;n===0?(this.Ut(0),this.Ut(255)):n===255?(this.Ut(255),this.Ut(0)):this.Ut(n)}Ot(e){const n=255&e;n===0?(this.Gt(0),this.Gt(255)):n===255?(this.Gt(255),this.Gt(0)):this.Gt(e)}Mt(){this.Ut(0),this.Ut(1)}Nt(){this.Gt(0),this.Gt(1)}Ut(e){this.Qt(1),this.buffer[this.position++]=e}Gt(e){this.Qt(1),this.buffer[this.position++]=~e}Qt(e){const n=e+this.position;if(n<=this.buffer.length)return;let r=2*this.buffer.length;r<n&&(r=n);const i=new Uint8Array(r);i.set(this.buffer),this.buffer=i}}class PV{constructor(e){this.jt=e}gt(e){this.jt.Ct(e)}Rt(e){this.jt.Lt(e)}At(e){this.jt.kt(e)}Et(){this.jt.$t()}}class CV{constructor(e){this.jt=e}gt(e){this.jt.xt(e)}Rt(e){this.jt.Bt(e)}At(e){this.jt.Kt(e)}Et(){this.jt.Wt()}}class ta{constructor(){this.jt=new RV,this.Ht=new PV(this.jt),this.Jt=new CV(this.jt)}seed(e){this.jt.seed(e)}Yt(e){return e===0?this.Ht:this.Jt}zt(){return this.jt.zt()}reset(){this.jt.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ai{constructor(e,n,r,i){this.indexId=e,this.documentKey=n,this.arrayValue=r,this.directionalValue=i}Zt(){const e=this.directionalValue.length,n=e===0||this.directionalValue[e-1]===255?e+1:e,r=new Uint8Array(n);return r.set(this.directionalValue,0),n!==e?r.set([0],this.directionalValue.length):++r[r.length-1],new Ai(this.indexId,this.documentKey,this.arrayValue,r)}}function cr(t,e){let n=t.indexId-e.indexId;return n!==0?n:(n=_w(t.arrayValue,e.arrayValue),n!==0?n:(n=_w(t.directionalValue,e.directionalValue),n!==0?n:G.comparator(t.documentKey,e.documentKey)))}function _w(t,e){for(let n=0;n<t.length&&n<e.length;++n){const r=t[n]-e[n];if(r!==0)return r}return t.length-e.length}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yw{constructor(e){this.Xt=new fe((n,r)=>Ae.comparator(n.field,r.field)),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.en=e.orderBy,this.tn=[];for(const n of e.filters){const r=n;r.isInequality()?this.Xt=this.Xt.add(r):this.tn.push(r)}}get nn(){return this.Xt.size>1}rn(e){if(Q(e.collectionGroup===this.collectionId),this.nn)return!1;const n=sp(e);if(n!==void 0&&!this.sn(n))return!1;const r=Ei(e);let i=new Set,s=0,o=0;for(;s<r.length&&this.sn(r[s]);++s)i=i.add(r[s].fieldPath.canonicalString());if(s===r.length)return!0;if(this.Xt.size>0){const a=this.Xt.getIterator().getNext();if(!i.has(a.field.canonicalString())){const u=r[s];if(!this.on(a,u)||!this._n(this.en[o++],u))return!1}++s}for(;s<r.length;++s){const a=r[s];if(o>=this.en.length||!this._n(this.en[o++],a))return!1}return!0}an(){if(this.nn)return null;let e=new fe(Ae.comparator);const n=[];for(const r of this.tn)if(!r.field.isKeyField())if(r.op==="array-contains"||r.op==="array-contains-any")n.push(new Di(r.field,2));else{if(e.has(r.field))continue;e=e.add(r.field),n.push(new Di(r.field,0))}for(const r of this.en)r.field.isKeyField()||e.has(r.field)||(e=e.add(r.field),n.push(new Di(r.field,r.dir==="asc"?0:1)));return new to(to.UNKNOWN_ID,this.collectionId,n,no.empty())}sn(e){for(const n of this.tn)if(this.on(n,e))return!0;return!1}on(e,n){if(e===void 0||!e.field.isEqual(n.fieldPath))return!1;const r=e.op==="array-contains"||e.op==="array-contains-any";return n.kind===2===r}_n(e,n){return!!e.field.isEqual(n.fieldPath)&&(n.kind===0&&e.dir==="asc"||n.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function FS(t){var e,n;if(Q(t instanceof oe||t instanceof he),t instanceof oe){if(t instanceof eS){const i=((n=(e=t.value.arrayValue)===null||e===void 0?void 0:e.values)===null||n===void 0?void 0:n.map(s=>oe.create(t.field,"==",s)))||[];return he.create(i,"or")}return t}const r=t.filters.map(i=>FS(i));return he.create(r,t.op)}function kV(t){if(t.getFilters().length===0)return[];const e=vp(FS(t));return Q(US(e)),_p(e)||yp(e)?[e]:e.getFilters()}function _p(t){return t instanceof oe}function yp(t){return t instanceof he&&jm(t)}function US(t){return _p(t)||yp(t)||function(n){if(n instanceof he&&up(n)){for(const r of n.getFilters())if(!_p(r)&&!yp(r))return!1;return!0}return!1}(t)}function vp(t){if(Q(t instanceof oe||t instanceof he),t instanceof oe)return t;if(t.filters.length===1)return vp(t.filters[0]);const e=t.filters.map(r=>vp(r));let n=he.create(e,t.op);return n=Fc(n),US(n)?n:(Q(n instanceof he),Q(io(n)),Q(n.filters.length>1),n.filters.reduce((r,i)=>Xm(r,i)))}function Xm(t,e){let n;return Q(t instanceof oe||t instanceof he),Q(e instanceof oe||e instanceof he),n=t instanceof oe?e instanceof oe?function(i,s){return he.create([i,s],"and")}(t,e):vw(t,e):e instanceof oe?vw(e,t):function(i,s){if(Q(i.filters.length>0&&s.filters.length>0),io(i)&&io(s))return Y0(i,s.getFilters());const o=up(i)?i:s,a=up(i)?s:i,u=o.filters.map(c=>Xm(c,a));return he.create(u,"or")}(t,e),Fc(n)}function vw(t,e){if(io(e))return Y0(e,t.getFilters());{const n=e.filters.map(r=>Xm(t,r));return he.create(n,"or")}}function Fc(t){if(Q(t instanceof oe||t instanceof he),t instanceof oe)return t;const e=t.getFilters();if(e.length===1)return Fc(e[0]);if(Q0(t))return t;const n=e.map(i=>Fc(i)),r=[];return n.forEach(i=>{i instanceof oe?r.push(i):i instanceof he&&(i.op===t.op?r.push(...i.filters):r.push(i))}),r.length===1?r[0]:he.create(r,t.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xV{constructor(){this.un=new Zm}addToCollectionParentIndex(e,n){return this.un.add(n),b.resolve()}getCollectionParents(e,n){return b.resolve(this.un.getEntries(n))}addFieldIndex(e,n){return b.resolve()}deleteFieldIndex(e,n){return b.resolve()}deleteAllFieldIndexes(e){return b.resolve()}createTargetIndexes(e,n){return b.resolve()}getDocumentsMatchingTarget(e,n){return b.resolve(null)}getIndexType(e,n){return b.resolve(0)}getFieldIndexes(e,n){return b.resolve([])}getNextCollectionGroupToUpdate(e){return b.resolve(null)}getMinOffset(e,n){return b.resolve(Gt.min())}getMinOffsetFromCollectionGroup(e,n){return b.resolve(Gt.min())}updateCollectionGroup(e,n,r){return b.resolve()}updateIndexEntries(e,n){return b.resolve()}}class Zm{constructor(){this.index={}}add(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n]||new fe(se.comparator),s=!i.has(r);return this.index[n]=i.add(r),s}has(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n];return i&&i.has(r)}getEntries(e){return(this.index[e]||new fe(se.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Eu=new Uint8Array(0);class bV{constructor(e,n){this.databaseId=n,this.cn=new Zm,this.ln=new nr(r=>Gi(r),(r,i)=>Sl(r,i)),this.uid=e.uid||""}addToCollectionParentIndex(e,n){if(!this.cn.has(n)){const r=n.lastSegment(),i=n.popLast();e.addOnCommittedListener(()=>{this.cn.add(n)});const s={collectionId:r,parent:wt(i)};return ww(e).put(s)}return b.resolve()}getCollectionParents(e,n){const r=[],i=IDBKeyRange.bound([n,""],[b0(n),""],!1,!0);return ww(e).U(i).next(s=>{for(const o of s){if(o.collectionId!==n)break;r.push(_n(o.parent))}return r})}addFieldIndex(e,n){const r=na(e),i=function(a){return{indexId:a.indexId,collectionGroup:a.collectionGroup,fields:a.fields.map(u=>[u.fieldPath.canonicalString(),u.kind])}}(n);delete i.indexId;const s=r.add(i);if(n.indexState){const o=gs(e);return s.next(a=>{o.put(fw(a,this.uid,n.indexState.sequenceNumber,n.indexState.offset))})}return s.next()}deleteFieldIndex(e,n){const r=na(e),i=gs(e),s=ms(e);return r.delete(n.indexId).next(()=>i.delete(IDBKeyRange.bound([n.indexId],[n.indexId+1],!1,!0))).next(()=>s.delete(IDBKeyRange.bound([n.indexId],[n.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){const n=na(e),r=ms(e),i=gs(e);return n.j().next(()=>r.j()).next(()=>i.j())}createTargetIndexes(e,n){return b.forEach(this.hn(n),r=>this.getIndexType(e,r).next(i=>{if(i===0||i===1){const s=new yw(r).an();if(s!=null)return this.addFieldIndex(e,s)}}))}getDocumentsMatchingTarget(e,n){const r=ms(e);let i=!0;const s=new Map;return b.forEach(this.hn(n),o=>this.Pn(e,o).next(a=>{i&&(i=!!a),s.set(o,a)})).next(()=>{if(i){let o=ee();const a=[];return b.forEach(s,(u,c)=>{U("IndexedDbIndexManager",`Using index ${function(E){return`id=${E.indexId}|cg=${E.collectionGroup}|f=${E.fields.map(x=>`${x.fieldPath}:${x.kind}`).join(",")}`}(u)} to execute ${Gi(n)}`);const d=function(E,x){const M=sp(x);if(M===void 0)return null;for(const F of Vc(E,M.fieldPath))switch(F.op){case"array-contains-any":return F.value.arrayValue.values||[];case"array-contains":return[F.value]}return null}(c,u),f=function(E,x){const M=new Map;for(const F of Ei(x))for(const I of Vc(E,F.fieldPath))switch(I.op){case"==":case"in":M.set(F.fieldPath.canonicalString(),I.value);break;case"not-in":case"!=":return M.set(F.fieldPath.canonicalString(),I.value),Array.from(M.values())}return null}(c,u),m=function(E,x){const M=[];let F=!0;for(const I of Ei(x)){const _=I.kind===0?Xv(E,I.fieldPath,E.startAt):Zv(E,I.fieldPath,E.startAt);M.push(_.value),F&&(F=_.inclusive)}return new Hr(M,F)}(c,u),v=function(E,x){const M=[];let F=!0;for(const I of Ei(x)){const _=I.kind===0?Zv(E,I.fieldPath,E.endAt):Xv(E,I.fieldPath,E.endAt);M.push(_.value),F&&(F=_.inclusive)}return new Hr(M,F)}(c,u),S=this.In(u,c,m),P=this.In(u,c,v),C=this.Tn(u,c,f),w=this.En(u.indexId,d,S,m.inclusive,P,v.inclusive,C);return b.forEach(w,y=>r.G(y,n.limit).next(E=>{E.forEach(x=>{const M=G.fromSegments(x.documentKey);o.has(M)||(o=o.add(M),a.push(M))})}))}).next(()=>a)}return b.resolve(null)})}hn(e){let n=this.ln.get(e);return n||(e.filters.length===0?n=[e]:n=kV(he.create(e.filters,"and")).map(r=>hp(e.path,e.collectionGroup,e.orderBy,r.getFilters(),e.limit,e.startAt,e.endAt)),this.ln.set(e,n),n)}En(e,n,r,i,s,o,a){const u=(n!=null?n.length:1)*Math.max(r.length,s.length),c=u/(n!=null?n.length:1),d=[];for(let f=0;f<u;++f){const m=n?this.dn(n[f/c]):Eu,v=this.An(e,m,r[f%c],i),S=this.Rn(e,m,s[f%c],o),P=a.map(C=>this.An(e,m,C,!0));d.push(...this.createRange(v,S,P))}return d}An(e,n,r,i){const s=new Ai(e,G.empty(),n,r);return i?s:s.Zt()}Rn(e,n,r,i){const s=new Ai(e,G.empty(),n,r);return i?s.Zt():s}Pn(e,n){const r=new yw(n),i=n.collectionGroup!=null?n.collectionGroup:n.path.lastSegment();return this.getFieldIndexes(e,i).next(s=>{let o=null;for(const a of s)r.rn(a)&&(!o||a.fields.length>o.fields.length)&&(o=a);return o})}getIndexType(e,n){let r=2;const i=this.hn(n);return b.forEach(i,s=>this.Pn(e,s).next(o=>{o?r!==0&&o.fields.length<function(u){let c=new fe(Ae.comparator),d=!1;for(const f of u.filters)for(const m of f.getFlattenedFilters())m.field.isKeyField()||(m.op==="array-contains"||m.op==="array-contains-any"?d=!0:c=c.add(m.field));for(const f of u.orderBy)f.field.isKeyField()||(c=c.add(f.field));return c.size+(d?1:0)}(s)&&(r=1):r=0})).next(()=>function(o){return o.limit!==null}(n)&&i.length>1&&r===2?1:r)}Vn(e,n){const r=new ta;for(const i of Ei(e)){const s=n.data.field(i.fieldPath);if(s==null)return null;const o=r.Yt(i.kind);Si.vt.It(s,o)}return r.zt()}dn(e){const n=new ta;return Si.vt.It(e,n.Yt(0)),n.zt()}mn(e,n){const r=new ta;return Si.vt.It(qi(this.databaseId,n),r.Yt(function(s){const o=Ei(s);return o.length===0?0:o[o.length-1].kind}(e))),r.zt()}Tn(e,n,r){if(r===null)return[];let i=[];i.push(new ta);let s=0;for(const o of Ei(e)){const a=r[s++];for(const u of i)if(this.fn(n,o.fieldPath)&&sl(a))i=this.gn(i,o,a);else{const c=u.Yt(o.kind);Si.vt.It(a,c)}}return this.pn(i)}In(e,n,r){return this.Tn(e,n,r.position)}pn(e){const n=[];for(let r=0;r<e.length;++r)n[r]=e[r].zt();return n}gn(e,n,r){const i=[...e],s=[];for(const o of r.arrayValue.values||[])for(const a of i){const u=new ta;u.seed(a.zt()),Si.vt.It(o,u.Yt(n.kind)),s.push(u)}return s}fn(e,n){return!!e.filters.find(r=>r instanceof oe&&r.field.isEqual(n)&&(r.op==="in"||r.op==="not-in"))}getFieldIndexes(e,n){const r=na(e),i=gs(e);return(n?r.U("collectionGroupIndex",IDBKeyRange.bound(n,n)):r.U()).next(s=>{const o=[];return b.forEach(s,a=>i.get([a.indexId,this.uid]).next(u=>{o.push(function(d,f){const m=f?new no(f.sequenceNumber,new Gt(Qi(f.readTime),new G(_n(f.documentKey)),f.largestBatchId)):no.empty(),v=d.fields.map(([S,P])=>new Di(Ae.fromServerFormat(S),P));return new to(d.indexId,d.collectionGroup,v,m)}(a,u))})).next(()=>o)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(n=>n.length===0?null:(n.sort((r,i)=>{const s=r.indexState.sequenceNumber-i.indexState.sequenceNumber;return s!==0?s:X(r.collectionGroup,i.collectionGroup)}),n[0].collectionGroup))}updateCollectionGroup(e,n,r){const i=na(e),s=gs(e);return this.yn(e).next(o=>i.U("collectionGroupIndex",IDBKeyRange.bound(n,n)).next(a=>b.forEach(a,u=>s.put(fw(u.indexId,this.uid,o,r)))))}updateIndexEntries(e,n){const r=new Map;return b.forEach(n,(i,s)=>{const o=r.get(i.collectionGroup);return(o?b.resolve(o):this.getFieldIndexes(e,i.collectionGroup)).next(a=>(r.set(i.collectionGroup,a),b.forEach(a,u=>this.wn(e,i,u).next(c=>{const d=this.Sn(s,u);return c.isEqual(d)?b.resolve():this.bn(e,s,u,c,d)}))))})}Dn(e,n,r,i){return ms(e).put({indexId:i.indexId,uid:this.uid,arrayValue:i.arrayValue,directionalValue:i.directionalValue,orderedDocumentKey:this.mn(r,n.key),documentKey:n.key.path.toArray()})}vn(e,n,r,i){return ms(e).delete([i.indexId,this.uid,i.arrayValue,i.directionalValue,this.mn(r,n.key),n.key.path.toArray()])}wn(e,n,r){const i=ms(e);let s=new fe(cr);return i.J({index:"documentKeyIndex",range:IDBKeyRange.only([r.indexId,this.uid,this.mn(r,n)])},(o,a)=>{s=s.add(new Ai(r.indexId,n,a.arrayValue,a.directionalValue))}).next(()=>s)}Sn(e,n){let r=new fe(cr);const i=this.Vn(n,e);if(i==null)return r;const s=sp(n);if(s!=null){const o=e.data.field(s.fieldPath);if(sl(o))for(const a of o.arrayValue.values||[])r=r.add(new Ai(n.indexId,e.key,this.dn(a),i))}else r=r.add(new Ai(n.indexId,e.key,Eu,i));return r}bn(e,n,r,i,s){U("IndexedDbIndexManager","Updating index entries for document '%s'",n.key);const o=[];return function(u,c,d,f,m){const v=u.getIterator(),S=c.getIterator();let P=ps(v),C=ps(S);for(;P||C;){let w=!1,y=!1;if(P&&C){const E=d(P,C);E<0?y=!0:E>0&&(w=!0)}else P!=null?y=!0:w=!0;w?(f(C),C=ps(S)):y?(m(P),P=ps(v)):(P=ps(v),C=ps(S))}}(i,s,cr,a=>{o.push(this.Dn(e,n,r,a))},a=>{o.push(this.vn(e,n,r,a))}),b.waitFor(o)}yn(e){let n=1;return gs(e).J({index:"sequenceNumberIndex",reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(r,i,s)=>{s.done(),n=i.sequenceNumber+1}).next(()=>n)}createRange(e,n,r){r=r.sort((o,a)=>cr(o,a)).filter((o,a,u)=>!a||cr(o,u[a-1])!==0);const i=[];i.push(e);for(const o of r){const a=cr(o,e),u=cr(o,n);if(a===0)i[0]=e.Zt();else if(a>0&&u<0)i.push(o),i.push(o.Zt());else if(u>0)break}i.push(n);const s=[];for(let o=0;o<i.length;o+=2){if(this.Cn(i[o],i[o+1]))return[];const a=[i[o].indexId,this.uid,i[o].arrayValue,i[o].directionalValue,Eu,[]],u=[i[o+1].indexId,this.uid,i[o+1].arrayValue,i[o+1].directionalValue,Eu,[]];s.push(IDBKeyRange.bound(a,u))}return s}Cn(e,n){return cr(e,n)>0}getMinOffsetFromCollectionGroup(e,n){return this.getFieldIndexes(e,n).next(Ew)}getMinOffset(e,n){return b.mapArray(this.hn(n),r=>this.Pn(e,r).next(i=>i||W())).next(Ew)}}function ww(t){return Xe(t,"collectionParents")}function ms(t){return Xe(t,"indexEntries")}function na(t){return Xe(t,"indexConfiguration")}function gs(t){return Xe(t,"indexState")}function Ew(t){Q(t.length!==0);let e=t[0].indexState.offset,n=e.largestBatchId;for(let r=1;r<t.length;r++){const i=t[r].indexState.offset;Fm(i,e)<0&&(e=i),n<i.largestBatchId&&(n=i.largestBatchId)}return new Gt(e.readTime,e.documentKey,n)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Iw={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0};class yt{constructor(e,n,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=n,this.maximumSequenceNumbersToCollect=r}static withCacheSize(e){return new yt(e,yt.DEFAULT_COLLECTION_PERCENTILE,yt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function BS(t,e,n){const r=t.store("mutations"),i=t.store("documentMutations"),s=[],o=IDBKeyRange.only(n.batchId);let a=0;const u=r.J({range:o},(d,f,m)=>(a++,m.delete()));s.push(u.next(()=>{Q(a===1)}));const c=[];for(const d of n.mutations){const f=F0(e,d.key.path,n.batchId);s.push(i.delete(f)),c.push(d.key)}return b.waitFor(s).next(()=>c)}function Uc(t){if(!t)return 0;let e;if(t.document)e=t.document;else if(t.unknownDocument)e=t.unknownDocument;else{if(!t.noDocument)throw W();e=t.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */yt.DEFAULT_COLLECTION_PERCENTILE=10,yt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,yt.DEFAULT=new yt(41943040,yt.DEFAULT_COLLECTION_PERCENTILE,yt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),yt.DISABLED=new yt(-1,0,0);class Th{constructor(e,n,r,i){this.userId=e,this.serializer=n,this.indexManager=r,this.referenceDelegate=i,this.Fn={}}static lt(e,n,r,i){Q(e.uid!=="");const s=e.isAuthenticated()?e.uid:"";return new Th(s,n,r,i)}checkEmpty(e){let n=!0;const r=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return hr(e).J({index:"userMutationsIndex",range:r},(i,s,o)=>{n=!1,o.done()}).next(()=>n)}addMutationBatch(e,n,r,i){const s=Is(e),o=hr(e);return o.add({}).next(a=>{Q(typeof a=="number");const u=new Km(a,n,r,i),c=function(v,S,P){const C=P.baseMutations.map(y=>ll(v.ct,y)),w=P.mutations.map(y=>ll(v.ct,y));return{userId:S,batchId:P.batchId,localWriteTimeMs:P.localWriteTime.toMillis(),baseMutations:C,mutations:w}}(this.serializer,this.userId,u),d=[];let f=new fe((m,v)=>X(m.canonicalString(),v.canonicalString()));for(const m of i){const v=F0(this.userId,m.key.path,a);f=f.add(m.key.path.popLast()),d.push(o.put(c)),d.push(s.put(v,vD))}return f.forEach(m=>{d.push(this.indexManager.addToCollectionParentIndex(e,m))}),e.addOnCommittedListener(()=>{this.Fn[a]=u.keys()}),b.waitFor(d).next(()=>u)})}lookupMutationBatch(e,n){return hr(e).get(n).next(r=>r?(Q(r.userId===this.userId),Ti(this.serializer,r)):null)}Mn(e,n){return this.Fn[n]?b.resolve(this.Fn[n]):this.lookupMutationBatch(e,n).next(r=>{if(r){const i=r.keys();return this.Fn[n]=i,i}return null})}getNextMutationBatchAfterBatchId(e,n){const r=n+1,i=IDBKeyRange.lowerBound([this.userId,r]);let s=null;return hr(e).J({index:"userMutationsIndex",range:i},(o,a,u)=>{a.userId===this.userId&&(Q(a.batchId>=r),s=Ti(this.serializer,a)),u.done()}).next(()=>s)}getHighestUnacknowledgedBatchId(e){const n=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let r=-1;return hr(e).J({index:"userMutationsIndex",range:n,reverse:!0},(i,s,o)=>{r=s.batchId,o.done()}).next(()=>r)}getAllMutationBatches(e){const n=IDBKeyRange.bound([this.userId,-1],[this.userId,Number.POSITIVE_INFINITY]);return hr(e).U("userMutationsIndex",n).next(r=>r.map(i=>Ti(this.serializer,i)))}getAllMutationBatchesAffectingDocumentKey(e,n){const r=Gu(this.userId,n.path),i=IDBKeyRange.lowerBound(r),s=[];return Is(e).J({range:i},(o,a,u)=>{const[c,d,f]=o,m=_n(d);if(c===this.userId&&n.path.isEqual(m))return hr(e).get(f).next(v=>{if(!v)throw W();Q(v.userId===this.userId),s.push(Ti(this.serializer,v))});u.done()}).next(()=>s)}getAllMutationBatchesAffectingDocumentKeys(e,n){let r=new fe(X);const i=[];return n.forEach(s=>{const o=Gu(this.userId,s.path),a=IDBKeyRange.lowerBound(o),u=Is(e).J({range:a},(c,d,f)=>{const[m,v,S]=c,P=_n(v);m===this.userId&&s.path.isEqual(P)?r=r.add(S):f.done()});i.push(u)}),b.waitFor(i).next(()=>this.xn(e,r))}getAllMutationBatchesAffectingQuery(e,n){const r=n.path,i=r.length+1,s=Gu(this.userId,r),o=IDBKeyRange.lowerBound(s);let a=new fe(X);return Is(e).J({range:o},(u,c,d)=>{const[f,m,v]=u,S=_n(m);f===this.userId&&r.isPrefixOf(S)?S.length===i&&(a=a.add(v)):d.done()}).next(()=>this.xn(e,a))}xn(e,n){const r=[],i=[];return n.forEach(s=>{i.push(hr(e).get(s).next(o=>{if(o===null)throw W();Q(o.userId===this.userId),r.push(Ti(this.serializer,o))}))}),b.waitFor(i).next(()=>r)}removeMutationBatch(e,n){return BS(e._e,this.userId,n).next(r=>(e.addOnCommittedListener(()=>{this.On(n.batchId)}),b.forEach(r,i=>this.referenceDelegate.markPotentiallyOrphaned(e,i))))}On(e){delete this.Fn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(n=>{if(!n)return b.resolve();const r=IDBKeyRange.lowerBound(function(o){return[o]}(this.userId)),i=[];return Is(e).J({range:r},(s,o,a)=>{if(s[0]===this.userId){const u=_n(s[1]);i.push(u)}else a.done()}).next(()=>{Q(i.length===0)})})}containsKey(e,n){return jS(e,this.userId,n)}Nn(e){return zS(e).get(this.userId).next(n=>n||{userId:this.userId,lastAcknowledgedBatchId:-1,lastStreamToken:""})}}function jS(t,e,n){const r=Gu(e,n.path),i=r[1],s=IDBKeyRange.lowerBound(r);let o=!1;return Is(t).J({range:s,H:!0},(a,u,c)=>{const[d,f,m]=a;d===e&&f===i&&(o=!0),c.done()}).next(()=>o)}function hr(t){return Xe(t,"mutations")}function Is(t){return Xe(t,"documentMutations")}function zS(t){return Xe(t,"mutationQueues")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ji{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Ji(0)}static kn(){return new Ji(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NV{constructor(e,n){this.referenceDelegate=e,this.serializer=n}allocateTargetId(e){return this.qn(e).next(n=>{const r=new Ji(n.highestTargetId);return n.highestTargetId=r.next(),this.Qn(e,n).next(()=>n.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.qn(e).next(n=>J.fromTimestamp(new xe(n.lastRemoteSnapshotVersion.seconds,n.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.qn(e).next(n=>n.highestListenSequenceNumber)}setTargetsMetadata(e,n,r){return this.qn(e).next(i=>(i.highestListenSequenceNumber=n,r&&(i.lastRemoteSnapshotVersion=r.toTimestamp()),n>i.highestListenSequenceNumber&&(i.highestListenSequenceNumber=n),this.Qn(e,i)))}addTargetData(e,n){return this.Kn(e,n).next(()=>this.qn(e).next(r=>(r.targetCount+=1,this.$n(n,r),this.Qn(e,r))))}updateTargetData(e,n){return this.Kn(e,n)}removeTargetData(e,n){return this.removeMatchingKeysForTargetId(e,n.targetId).next(()=>_s(e).delete(n.targetId)).next(()=>this.qn(e)).next(r=>(Q(r.targetCount>0),r.targetCount-=1,this.Qn(e,r)))}removeTargets(e,n,r){let i=0;const s=[];return _s(e).J((o,a)=>{const u=ma(a);u.sequenceNumber<=n&&r.get(u.targetId)===null&&(i++,s.push(this.removeTargetData(e,u)))}).next(()=>b.waitFor(s)).next(()=>i)}forEachTarget(e,n){return _s(e).J((r,i)=>{const s=ma(i);n(s)})}qn(e){return Tw(e).get("targetGlobalKey").next(n=>(Q(n!==null),n))}Qn(e,n){return Tw(e).put("targetGlobalKey",n)}Kn(e,n){return _s(e).put(MS(this.serializer,n))}$n(e,n){let r=!1;return e.targetId>n.highestTargetId&&(n.highestTargetId=e.targetId,r=!0),e.sequenceNumber>n.highestListenSequenceNumber&&(n.highestListenSequenceNumber=e.sequenceNumber,r=!0),r}getTargetCount(e){return this.qn(e).next(n=>n.targetCount)}getTargetData(e,n){const r=Gi(n),i=IDBKeyRange.bound([r,Number.NEGATIVE_INFINITY],[r,Number.POSITIVE_INFINITY]);let s=null;return _s(e).J({range:i,index:"queryTargetsIndex"},(o,a,u)=>{const c=ma(a);Sl(n,c.target)&&(s=c,u.done())}).next(()=>s)}addMatchingKeys(e,n,r){const i=[],s=Ir(e);return n.forEach(o=>{const a=wt(o.path);i.push(s.put({targetId:r,path:a})),i.push(this.referenceDelegate.addReference(e,r,o))}),b.waitFor(i)}removeMatchingKeys(e,n,r){const i=Ir(e);return b.forEach(n,s=>{const o=wt(s.path);return b.waitFor([i.delete([r,o]),this.referenceDelegate.removeReference(e,r,s)])})}removeMatchingKeysForTargetId(e,n){const r=Ir(e),i=IDBKeyRange.bound([n],[n+1],!1,!0);return r.delete(i)}getMatchingKeysForTargetId(e,n){const r=IDBKeyRange.bound([n],[n+1],!1,!0),i=Ir(e);let s=ee();return i.J({range:r,H:!0},(o,a,u)=>{const c=_n(o[1]),d=new G(c);s=s.add(d)}).next(()=>s)}containsKey(e,n){const r=wt(n.path),i=IDBKeyRange.bound([r],[b0(r)],!1,!0);let s=0;return Ir(e).J({index:"documentTargetsIndex",H:!0,range:i},([o,a],u,c)=>{o!==0&&(s++,c.done())}).next(()=>s>0)}ot(e,n){return _s(e).get(n).next(r=>r?ma(r):null)}}function _s(t){return Xe(t,"targets")}function Tw(t){return Xe(t,"targetGlobal")}function Ir(t){return Xe(t,"targetDocuments")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sw([t,e],[n,r]){const i=X(t,n);return i===0?X(e,r):i}class DV{constructor(e){this.Un=e,this.buffer=new fe(Sw),this.Wn=0}Gn(){return++this.Wn}zn(e){const n=[e,this.Gn()];if(this.buffer.size<this.Un)this.buffer=this.buffer.add(n);else{const r=this.buffer.last();Sw(n,r)<0&&(this.buffer=this.buffer.delete(r).add(n))}}get maxValue(){return this.buffer.last()[0]}}class $S{constructor(e,n,r){this.garbageCollector=e,this.asyncQueue=n,this.localStore=r,this.jn=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Hn(6e4)}stop(){this.jn&&(this.jn.cancel(),this.jn=null)}get started(){return this.jn!==null}Hn(e){U("LruGarbageCollector",`Garbage collection scheduled in ${e}ms`),this.jn=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.jn=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(n){oi(n)?U("LruGarbageCollector","Ignoring IndexedDB error during garbage collection: ",n):await si(n)}await this.Hn(3e5)})}}class VV{constructor(e,n){this.Jn=e,this.params=n}calculateTargetCount(e,n){return this.Jn.Yn(e).next(r=>Math.floor(n/100*r))}nthSequenceNumber(e,n){if(n===0)return b.resolve(Nt.oe);const r=new DV(n);return this.Jn.forEachTarget(e,i=>r.zn(i.sequenceNumber)).next(()=>this.Jn.Zn(e,i=>r.zn(i))).next(()=>r.maxValue)}removeTargets(e,n,r){return this.Jn.removeTargets(e,n,r)}removeOrphanedDocuments(e,n){return this.Jn.removeOrphanedDocuments(e,n)}collect(e,n){return this.params.cacheSizeCollectionThreshold===-1?(U("LruGarbageCollector","Garbage collection skipped; disabled"),b.resolve(Iw)):this.getCacheSize(e).next(r=>r<this.params.cacheSizeCollectionThreshold?(U("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Iw):this.Xn(e,n))}getCacheSize(e){return this.Jn.getCacheSize(e)}Xn(e,n){let r,i,s,o,a,u,c;const d=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(f=>(f>this.params.maximumSequenceNumbersToCollect?(U("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${f}`),i=this.params.maximumSequenceNumbersToCollect):i=f,o=Date.now(),this.nthSequenceNumber(e,i))).next(f=>(r=f,a=Date.now(),this.removeTargets(e,r,n))).next(f=>(s=f,u=Date.now(),this.removeOrphanedDocuments(e,r))).next(f=>(c=Date.now(),vs()<=ie.DEBUG&&U("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-d}ms
	Determined least recently used ${i} in `+(a-o)+`ms
	Removed ${s} targets in `+(u-a)+`ms
	Removed ${f} documents in `+(c-u)+`ms
Total Duration: ${c-d}ms`),b.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:s,documentsRemoved:f})))}}function qS(t,e){return new VV(t,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OV{constructor(e,n){this.db=e,this.garbageCollector=qS(this,n)}Yn(e){const n=this.er(e);return this.db.getTargetCache().getTargetCount(e).next(r=>n.next(i=>r+i))}er(e){let n=0;return this.Zn(e,r=>{n++}).next(()=>n)}forEachTarget(e,n){return this.db.getTargetCache().forEachTarget(e,n)}Zn(e,n){return this.tr(e,(r,i)=>n(i))}addReference(e,n,r){return Iu(e,r)}removeReference(e,n,r){return Iu(e,r)}removeTargets(e,n,r){return this.db.getTargetCache().removeTargets(e,n,r)}markPotentiallyOrphaned(e,n){return Iu(e,n)}nr(e,n){return function(i,s){let o=!1;return zS(i).Y(a=>jS(i,a,s).next(u=>(u&&(o=!0),b.resolve(!u)))).next(()=>o)}(e,n)}removeOrphanedDocuments(e,n){const r=this.db.getRemoteDocumentCache().newChangeBuffer(),i=[];let s=0;return this.tr(e,(o,a)=>{if(a<=n){const u=this.nr(e,o).next(c=>{if(!c)return s++,r.getEntry(e,o).next(()=>(r.removeEntry(o,J.min()),Ir(e).delete(function(f){return[0,wt(f.path)]}(o))))});i.push(u)}}).next(()=>b.waitFor(i)).next(()=>r.apply(e)).next(()=>s)}removeTarget(e,n){const r=n.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,r)}updateLimboDocument(e,n){return Iu(e,n)}tr(e,n){const r=Ir(e);let i,s=Nt.oe;return r.J({index:"documentTargetsIndex"},([o,a],{path:u,sequenceNumber:c})=>{o===0?(s!==Nt.oe&&n(new G(_n(i)),s),s=c,i=u):s=Nt.oe}).next(()=>{s!==Nt.oe&&n(new G(_n(i)),s)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function Iu(t,e){return Ir(t).put(function(r,i){return{targetId:0,path:wt(r.path),sequenceNumber:i}}(e,t.currentSequenceNumber))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GS{constructor(){this.changes=new nr(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,Ee.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const r=this.changes.get(n);return r!==void 0?b.resolve(r):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LV{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,n,r){return gi(e).put(r)}removeEntry(e,n,r){return gi(e).delete(function(s,o){const a=s.path.toArray();return[a.slice(0,a.length-2),a[a.length-2],Mc(o),a[a.length-1]]}(n,r))}updateMetadata(e,n){return this.getMetadata(e).next(r=>(r.byteSize+=n,this.rr(e,r)))}getEntry(e,n){let r=Ee.newInvalidDocument(n);return gi(e).J({index:"documentKeyIndex",range:IDBKeyRange.only(ra(n))},(i,s)=>{r=this.ir(n,s)}).next(()=>r)}sr(e,n){let r={size:0,document:Ee.newInvalidDocument(n)};return gi(e).J({index:"documentKeyIndex",range:IDBKeyRange.only(ra(n))},(i,s)=>{r={document:this.ir(n,s),size:Uc(s)}}).next(()=>r)}getEntries(e,n){let r=Vt();return this._r(e,n,(i,s)=>{const o=this.ir(i,s);r=r.insert(i,o)}).next(()=>r)}ar(e,n){let r=Vt(),i=new ye(G.comparator);return this._r(e,n,(s,o)=>{const a=this.ir(s,o);r=r.insert(s,a),i=i.insert(s,Uc(o))}).next(()=>({documents:r,ur:i}))}_r(e,n,r){if(n.isEmpty())return b.resolve();let i=new fe(Pw);n.forEach(u=>i=i.add(u));const s=IDBKeyRange.bound(ra(i.first()),ra(i.last())),o=i.getIterator();let a=o.getNext();return gi(e).J({index:"documentKeyIndex",range:s},(u,c,d)=>{const f=G.fromSegments([...c.prefixPath,c.collectionGroup,c.documentId]);for(;a&&Pw(a,f)<0;)r(a,null),a=o.getNext();a&&a.isEqual(f)&&(r(a,c),a=o.hasNext()?o.getNext():null),a?d.$(ra(a)):d.done()}).next(()=>{for(;a;)r(a,null),a=o.hasNext()?o.getNext():null})}getDocumentsMatchingQuery(e,n,r,i,s){const o=n.path,a=[o.popLast().toArray(),o.lastSegment(),Mc(r.readTime),r.documentKey.path.isEmpty()?"":r.documentKey.path.lastSegment()],u=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return gi(e).U(IDBKeyRange.bound(a,u,!0)).next(c=>{s==null||s.incrementDocumentReadCount(c.length);let d=Vt();for(const f of c){const m=this.ir(G.fromSegments(f.prefixPath.concat(f.collectionGroup,f.documentId)),f);m.isFoundDocument()&&(Rl(n,m)||i.has(m.key))&&(d=d.insert(m.key,m))}return d})}getAllFromCollectionGroup(e,n,r,i){let s=Vt();const o=Rw(n,r),a=Rw(n,Gt.max());return gi(e).J({index:"collectionGroupIndex",range:IDBKeyRange.bound(o,a,!0)},(u,c,d)=>{const f=this.ir(G.fromSegments(c.prefixPath.concat(c.collectionGroup,c.documentId)),c);s=s.insert(f.key,f),s.size===i&&d.done()}).next(()=>s)}newChangeBuffer(e){return new MV(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(n=>n.byteSize)}getMetadata(e){return Aw(e).get("remoteDocumentGlobalKey").next(n=>(Q(!!n),n))}rr(e,n){return Aw(e).put("remoteDocumentGlobalKey",n)}ir(e,n){if(n){const r=IV(this.serializer,n);if(!(r.isNoDocument()&&r.version.isEqual(J.min())))return r}return Ee.newInvalidDocument(e)}}function KS(t){return new LV(t)}class MV extends GS{constructor(e,n){super(),this.cr=e,this.trackRemovals=n,this.lr=new nr(r=>r.toString(),(r,i)=>r.isEqual(i))}applyChanges(e){const n=[];let r=0,i=new fe((s,o)=>X(s.canonicalString(),o.canonicalString()));return this.changes.forEach((s,o)=>{const a=this.lr.get(s);if(n.push(this.cr.removeEntry(e,s,a.readTime)),o.isValidDocument()){const u=hw(this.cr.serializer,o);i=i.add(s.path.popLast());const c=Uc(u);r+=c-a.size,n.push(this.cr.addEntry(e,s,u))}else if(r-=a.size,this.trackRemovals){const u=hw(this.cr.serializer,o.convertToNoDocument(J.min()));n.push(this.cr.addEntry(e,s,u))}}),i.forEach(s=>{n.push(this.cr.indexManager.addToCollectionParentIndex(e,s))}),n.push(this.cr.updateMetadata(e,r)),b.waitFor(n)}getFromCache(e,n){return this.cr.sr(e,n).next(r=>(this.lr.set(n,{size:r.size,readTime:r.document.readTime}),r.document))}getAllFromCache(e,n){return this.cr.ar(e,n).next(({documents:r,ur:i})=>(i.forEach((s,o)=>{this.lr.set(s,{size:o,readTime:r.get(s).readTime})}),r))}}function Aw(t){return Xe(t,"remoteDocumentGlobal")}function gi(t){return Xe(t,"remoteDocumentsV14")}function ra(t){const e=t.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function Rw(t,e){const n=e.documentKey.path.toArray();return[t,Mc(e.readTime),n.slice(0,n.length-2),n.length>0?n[n.length-1]:""]}function Pw(t,e){const n=t.path.toArray(),r=e.path.toArray();let i=0;for(let s=0;s<n.length-2&&s<r.length-2;++s)if(i=X(n[s],r[s]),i)return i;return i=X(n.length,r.length),i||(i=X(n[n.length-2],r[r.length-2]),i||X(n[n.length-1],r[r.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FV{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WS{constructor(e,n,r,i){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,n){let r=null;return this.documentOverlayCache.getOverlay(e,n).next(i=>(r=i,this.remoteDocumentCache.getEntry(e,n))).next(i=>(r!==null&&ka(r.mutation,i,Dt.empty(),xe.now()),i))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.getLocalViewOfDocuments(e,r,ee()).next(()=>r))}getLocalViewOfDocuments(e,n,r=ee()){const i=yn();return this.populateOverlays(e,i,n).next(()=>this.computeViews(e,n,i,r).next(s=>{let o=fa();return s.forEach((a,u)=>{o=o.insert(a,u.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const r=yn();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,ee()))}populateOverlays(e,n,r){const i=[];return r.forEach(s=>{n.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((o,a)=>{n.set(o,a)})})}computeViews(e,n,r,i){let s=Vt();const o=Ca(),a=function(){return Ca()}();return n.forEach((u,c)=>{const d=r.get(c.key);i.has(c.key)&&(d===void 0||d.mutation instanceof rr)?s=s.insert(c.key,c):d!==void 0?(o.set(c.key,d.mutation.getFieldMask()),ka(d.mutation,c,d.mutation.getFieldMask(),xe.now())):o.set(c.key,Dt.empty())}),this.recalculateAndSaveOverlays(e,s).next(u=>(u.forEach((c,d)=>o.set(c,d)),n.forEach((c,d)=>{var f;return a.set(c,new FV(d,(f=o.get(c))!==null&&f!==void 0?f:null))}),a))}recalculateAndSaveOverlays(e,n){const r=Ca();let i=new ye((o,a)=>o-a),s=ee();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const a of o)a.keys().forEach(u=>{const c=n.get(u);if(c===null)return;let d=r.get(u)||Dt.empty();d=a.applyToLocalView(c,d),r.set(u,d);const f=(i.get(a.batchId)||ee()).add(u);i=i.insert(a.batchId,f)})}).next(()=>{const o=[],a=i.getReverseIterator();for(;a.hasNext();){const u=a.getNext(),c=u.key,d=u.value,f=uS();d.forEach(m=>{if(!s.has(m)){const v=gS(n.get(m),r.get(m));v!==null&&f.set(m,v),s=s.add(m)}}),o.push(this.documentOverlayCache.saveOverlays(e,c,f))}return b.waitFor(o)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,n,r,i){return function(o){return G.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):zm(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,r,i):this.getDocumentsMatchingCollectionQuery(e,n,r,i)}getNextDocuments(e,n,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,r,i).next(s=>{const o=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,r.largestBatchId,i-s.size):b.resolve(yn());let a=-1,u=s;return o.next(c=>b.forEach(c,(d,f)=>(a<f.largestBatchId&&(a=f.largestBatchId),s.get(d)?b.resolve():this.remoteDocumentCache.getEntry(e,d).next(m=>{u=u.insert(d,m)}))).next(()=>this.populateOverlays(e,c,s)).next(()=>this.computeViews(e,u,c,ee())).next(d=>({batchId:a,changes:lS(d)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new G(n)).next(r=>{let i=fa();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i})}getDocumentsMatchingCollectionGroupQuery(e,n,r,i){const s=n.collectionGroup;let o=fa();return this.indexManager.getCollectionParents(e,s).next(a=>b.forEach(a,u=>{const c=function(f,m){return new tr(m,null,f.explicitOrderBy.slice(),f.filters.slice(),f.limit,f.limitType,f.startAt,f.endAt)}(n,u.child(s));return this.getDocumentsMatchingCollectionQuery(e,c,r,i).next(d=>{d.forEach((f,m)=>{o=o.insert(f,m)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,r,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,r.largestBatchId).next(o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,r,s,i))).next(o=>{s.forEach((u,c)=>{const d=c.getKey();o.get(d)===null&&(o=o.insert(d,Ee.newInvalidDocument(d)))});let a=fa();return o.forEach((u,c)=>{const d=s.get(u);d!==void 0&&ka(d.mutation,c,Dt.empty(),xe.now()),Rl(n,c)&&(a=a.insert(u,c))}),a})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UV{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,n){return b.resolve(this.hr.get(n))}saveBundleMetadata(e,n){return this.hr.set(n.id,function(i){return{id:i.id,version:i.version,createTime:qe(i.createTime)}}(n)),b.resolve()}getNamedQuery(e,n){return b.resolve(this.Pr.get(n))}saveNamedQuery(e,n){return this.Pr.set(n.name,function(i){return{name:i.name,query:Ym(i.bundledQuery),readTime:qe(i.readTime)}}(n)),b.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BV{constructor(){this.overlays=new ye(G.comparator),this.Ir=new Map}getOverlay(e,n){return b.resolve(this.overlays.get(n))}getOverlays(e,n){const r=yn();return b.forEach(n,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,n,r){return r.forEach((i,s)=>{this.ht(e,n,s)}),b.resolve()}removeOverlaysForBatchId(e,n,r){const i=this.Ir.get(r);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.Ir.delete(r)),b.resolve()}getOverlaysForCollection(e,n,r){const i=yn(),s=n.length+1,o=new G(n.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const u=a.getNext().value,c=u.getKey();if(!n.isPrefixOf(c.path))break;c.path.length===s&&u.largestBatchId>r&&i.set(u.getKey(),u)}return b.resolve(i)}getOverlaysForCollectionGroup(e,n,r,i){let s=new ye((c,d)=>c-d);const o=this.overlays.getIterator();for(;o.hasNext();){const c=o.getNext().value;if(c.getKey().getCollectionGroup()===n&&c.largestBatchId>r){let d=s.get(c.largestBatchId);d===null&&(d=yn(),s=s.insert(c.largestBatchId,d)),d.set(c.getKey(),c)}}const a=yn(),u=s.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((c,d)=>a.set(c,d)),!(a.size()>=i)););return b.resolve(a)}ht(e,n,r){const i=this.overlays.get(r.key);if(i!==null){const o=this.Ir.get(i.largestBatchId).delete(r.key);this.Ir.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new Hm(n,r));let s=this.Ir.get(n);s===void 0&&(s=ee(),this.Ir.set(n,s)),this.Ir.set(n,s.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jV{constructor(){this.sessionToken=Me.EMPTY_BYTE_STRING}getSessionToken(e){return b.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,b.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eg{constructor(){this.Tr=new fe(et.Er),this.dr=new fe(et.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,n){const r=new et(e,n);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,n){e.forEach(r=>this.addReference(r,n))}removeReference(e,n){this.Vr(new et(e,n))}mr(e,n){e.forEach(r=>this.removeReference(r,n))}gr(e){const n=new G(new se([])),r=new et(n,e),i=new et(n,e+1),s=[];return this.dr.forEachInRange([r,i],o=>{this.Vr(o),s.push(o.key)}),s}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const n=new G(new se([])),r=new et(n,e),i=new et(n,e+1);let s=ee();return this.dr.forEachInRange([r,i],o=>{s=s.add(o.key)}),s}containsKey(e){const n=new et(e,0),r=this.Tr.firstAfterOrEqual(n);return r!==null&&e.isEqual(r.key)}}class et{constructor(e,n){this.key=e,this.wr=n}static Er(e,n){return G.comparator(e.key,n.key)||X(e.wr,n.wr)}static Ar(e,n){return X(e.wr,n.wr)||G.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zV{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.Sr=1,this.br=new fe(et.Er)}checkEmpty(e){return b.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,r,i){const s=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new Km(s,n,r,i);this.mutationQueue.push(o);for(const a of i)this.br=this.br.add(new et(a.key,s)),this.indexManager.addToCollectionParentIndex(e,a.key.path.popLast());return b.resolve(o)}lookupMutationBatch(e,n){return b.resolve(this.Dr(n))}getNextMutationBatchAfterBatchId(e,n){const r=n+1,i=this.vr(r),s=i<0?0:i;return b.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return b.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return b.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const r=new et(n,0),i=new et(n,Number.POSITIVE_INFINITY),s=[];return this.br.forEachInRange([r,i],o=>{const a=this.Dr(o.wr);s.push(a)}),b.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,n){let r=new fe(X);return n.forEach(i=>{const s=new et(i,0),o=new et(i,Number.POSITIVE_INFINITY);this.br.forEachInRange([s,o],a=>{r=r.add(a.wr)})}),b.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,n){const r=n.path,i=r.length+1;let s=r;G.isDocumentKey(s)||(s=s.child(""));const o=new et(new G(s),0);let a=new fe(X);return this.br.forEachWhile(u=>{const c=u.key.path;return!!r.isPrefixOf(c)&&(c.length===i&&(a=a.add(u.wr)),!0)},o),b.resolve(this.Cr(a))}Cr(e){const n=[];return e.forEach(r=>{const i=this.Dr(r);i!==null&&n.push(i)}),n}removeMutationBatch(e,n){Q(this.Fr(n.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return b.forEach(n.mutations,i=>{const s=new et(i.key,n.batchId);return r=r.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.br=r})}On(e){}containsKey(e,n){const r=new et(n,0),i=this.br.firstAfterOrEqual(r);return b.resolve(n.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,b.resolve()}Fr(e,n){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const n=this.vr(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $V{constructor(e){this.Mr=e,this.docs=function(){return new ye(G.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const r=n.key,i=this.docs.get(r),s=i?i.size:0,o=this.Mr(n);return this.docs=this.docs.insert(r,{document:n.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const r=this.docs.get(n);return b.resolve(r?r.document.mutableCopy():Ee.newInvalidDocument(n))}getEntries(e,n){let r=Vt();return n.forEach(i=>{const s=this.docs.get(i);r=r.insert(i,s?s.document.mutableCopy():Ee.newInvalidDocument(i))}),b.resolve(r)}getDocumentsMatchingQuery(e,n,r,i){let s=Vt();const o=n.path,a=new G(o.child("")),u=this.docs.getIteratorFrom(a);for(;u.hasNext();){const{key:c,value:{document:d}}=u.getNext();if(!o.isPrefixOf(c.path))break;c.path.length>o.length+1||Fm(D0(d),r)<=0||(i.has(d.key)||Rl(n,d))&&(s=s.insert(d.key,d.mutableCopy()))}return b.resolve(s)}getAllFromCollectionGroup(e,n,r,i){W()}Or(e,n){return b.forEach(this.docs,r=>n(r))}newChangeBuffer(e){return new qV(this)}getSize(e){return b.resolve(this.size)}}class qV extends GS{constructor(e){super(),this.cr=e}applyChanges(e){const n=[];return this.changes.forEach((r,i)=>{i.isValidDocument()?n.push(this.cr.addEntry(e,i)):this.cr.removeEntry(r)}),b.waitFor(n)}getFromCache(e,n){return this.cr.getEntry(e,n)}getAllFromCache(e,n){return this.cr.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GV{constructor(e){this.persistence=e,this.Nr=new nr(n=>Gi(n),Sl),this.lastRemoteSnapshotVersion=J.min(),this.highestTargetId=0,this.Lr=0,this.Br=new eg,this.targetCount=0,this.kr=Ji.Bn()}forEachTarget(e,n){return this.Nr.forEach((r,i)=>n(i)),b.resolve()}getLastRemoteSnapshotVersion(e){return b.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return b.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),b.resolve(this.highestTargetId)}setTargetsMetadata(e,n,r){return r&&(this.lastRemoteSnapshotVersion=r),n>this.Lr&&(this.Lr=n),b.resolve()}Kn(e){this.Nr.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.kr=new Ji(n),this.highestTargetId=n),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,n){return this.Kn(n),this.targetCount+=1,b.resolve()}updateTargetData(e,n){return this.Kn(n),b.resolve()}removeTargetData(e,n){return this.Nr.delete(n.target),this.Br.gr(n.targetId),this.targetCount-=1,b.resolve()}removeTargets(e,n,r){let i=0;const s=[];return this.Nr.forEach((o,a)=>{a.sequenceNumber<=n&&r.get(a.targetId)===null&&(this.Nr.delete(o),s.push(this.removeMatchingKeysForTargetId(e,a.targetId)),i++)}),b.waitFor(s).next(()=>i)}getTargetCount(e){return b.resolve(this.targetCount)}getTargetData(e,n){const r=this.Nr.get(n)||null;return b.resolve(r)}addMatchingKeys(e,n,r){return this.Br.Rr(n,r),b.resolve()}removeMatchingKeys(e,n,r){this.Br.mr(n,r);const i=this.persistence.referenceDelegate,s=[];return i&&n.forEach(o=>{s.push(i.markPotentiallyOrphaned(e,o))}),b.waitFor(s)}removeMatchingKeysForTargetId(e,n){return this.Br.gr(n),b.resolve()}getMatchingKeysForTargetId(e,n){const r=this.Br.yr(n);return b.resolve(r)}containsKey(e,n){return b.resolve(this.Br.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tg{constructor(e,n){this.qr={},this.overlays={},this.Qr=new Nt(0),this.Kr=!1,this.Kr=!0,this.$r=new jV,this.referenceDelegate=e(this),this.Ur=new GV(this),this.indexManager=new xV,this.remoteDocumentCache=function(i){return new $V(i)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new LS(n),this.Gr=new UV(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new BV,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let r=this.qr[e.toKey()];return r||(r=new zV(n,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,n,r){U("MemoryPersistence","Starting transaction:",e);const i=new KV(this.Qr.next());return this.referenceDelegate.zr(),r(i).next(s=>this.referenceDelegate.jr(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Hr(e,n){return b.or(Object.values(this.qr).map(r=>()=>r.containsKey(e,n)))}}class KV extends O0{constructor(e){super(),this.currentSequenceNumber=e}}class Sh{constructor(e){this.persistence=e,this.Jr=new eg,this.Yr=null}static Zr(e){return new Sh(e)}get Xr(){if(this.Yr)return this.Yr;throw W()}addReference(e,n,r){return this.Jr.addReference(r,n),this.Xr.delete(r.toString()),b.resolve()}removeReference(e,n,r){return this.Jr.removeReference(r,n),this.Xr.add(r.toString()),b.resolve()}markPotentiallyOrphaned(e,n){return this.Xr.add(n.toString()),b.resolve()}removeTarget(e,n){this.Jr.gr(n.targetId).forEach(i=>this.Xr.add(i.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,n.targetId).next(i=>{i.forEach(s=>this.Xr.add(s.toString()))}).next(()=>r.removeTargetData(e,n))}zr(){this.Yr=new Set}jr(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return b.forEach(this.Xr,r=>{const i=G.fromPath(r);return this.ei(e,i).next(s=>{s||n.removeEntry(i,J.min())})}).next(()=>(this.Yr=null,n.apply(e)))}updateLimboDocument(e,n){return this.ei(e,n).next(r=>{r?this.Xr.delete(n.toString()):this.Xr.add(n.toString())})}Wr(e){return 0}ei(e,n){return b.or([()=>b.resolve(this.Jr.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Hr(e,n)])}}class Bc{constructor(e,n){this.persistence=e,this.ti=new nr(r=>wt(r.path),(r,i)=>r.isEqual(i)),this.garbageCollector=qS(this,n)}static Zr(e,n){return new Bc(e,n)}zr(){}jr(e){return b.resolve()}forEachTarget(e,n){return this.persistence.getTargetCache().forEachTarget(e,n)}Yn(e){const n=this.er(e);return this.persistence.getTargetCache().getTargetCount(e).next(r=>n.next(i=>r+i))}er(e){let n=0;return this.Zn(e,r=>{n++}).next(()=>n)}Zn(e,n){return b.forEach(this.ti,(r,i)=>this.nr(e,r,i).next(s=>s?b.resolve():n(i)))}removeTargets(e,n,r){return this.persistence.getTargetCache().removeTargets(e,n,r)}removeOrphanedDocuments(e,n){let r=0;const i=this.persistence.getRemoteDocumentCache(),s=i.newChangeBuffer();return i.Or(e,o=>this.nr(e,o,n).next(a=>{a||(r++,s.removeEntry(o,J.min()))})).next(()=>s.apply(e)).next(()=>r)}markPotentiallyOrphaned(e,n){return this.ti.set(n,e.currentSequenceNumber),b.resolve()}removeTarget(e,n){const r=n.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,n,r){return this.ti.set(r,e.currentSequenceNumber),b.resolve()}removeReference(e,n,r){return this.ti.set(r,e.currentSequenceNumber),b.resolve()}updateLimboDocument(e,n){return this.ti.set(n,e.currentSequenceNumber),b.resolve()}Wr(e){let n=e.key.toString().length;return e.isFoundDocument()&&(n+=Wu(e.data.value)),n}nr(e,n,r){return b.or([()=>this.persistence.Hr(e,n),()=>this.persistence.getTargetCache().containsKey(e,n),()=>{const i=this.ti.get(n);return b.resolve(i!==void 0&&i>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WV{constructor(e){this.serializer=e}O(e,n,r,i){const s=new mh("createOrUpgrade",n);r<1&&i>=1&&(function(u){u.createObjectStore("owner")}(e),function(u){u.createObjectStore("mutationQueues",{keyPath:"userId"}),u.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",jv,{unique:!0}),u.createObjectStore("documentMutations")}(e),Cw(e),function(u){u.createObjectStore("remoteDocuments")}(e));let o=b.resolve();return r<3&&i>=3&&(r!==0&&(function(u){u.deleteObjectStore("targetDocuments"),u.deleteObjectStore("targets"),u.deleteObjectStore("targetGlobal")}(e),Cw(e)),o=o.next(()=>function(u){const c=u.store("targetGlobal"),d={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:J.min().toTimestamp(),targetCount:0};return c.put("targetGlobalKey",d)}(s))),r<4&&i>=4&&(r!==0&&(o=o.next(()=>function(u,c){return c.store("mutations").U().next(d=>{u.deleteObjectStore("mutations"),u.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",jv,{unique:!0});const f=c.store("mutations"),m=d.map(v=>f.put(v));return b.waitFor(m)})}(e,s))),o=o.next(()=>{(function(u){u.createObjectStore("clientMetadata",{keyPath:"clientId"})})(e)})),r<5&&i>=5&&(o=o.next(()=>this.ni(s))),r<6&&i>=6&&(o=o.next(()=>(function(u){u.createObjectStore("remoteDocumentGlobal")}(e),this.ri(s)))),r<7&&i>=7&&(o=o.next(()=>this.ii(s))),r<8&&i>=8&&(o=o.next(()=>this.si(e,s))),r<9&&i>=9&&(o=o.next(()=>{(function(u){u.objectStoreNames.contains("remoteDocumentChanges")&&u.deleteObjectStore("remoteDocumentChanges")})(e)})),r<10&&i>=10&&(o=o.next(()=>this.oi(s))),r<11&&i>=11&&(o=o.next(()=>{(function(u){u.createObjectStore("bundles",{keyPath:"bundleId"})})(e),function(u){u.createObjectStore("namedQueries",{keyPath:"name"})}(e)})),r<12&&i>=12&&(o=o.next(()=>{(function(u){const c=u.createObjectStore("documentOverlays",{keyPath:bD});c.createIndex("collectionPathOverlayIndex",ND,{unique:!1}),c.createIndex("collectionGroupOverlayIndex",DD,{unique:!1})})(e)})),r<13&&i>=13&&(o=o.next(()=>function(u){const c=u.createObjectStore("remoteDocumentsV14",{keyPath:wD});c.createIndex("documentKeyIndex",ED),c.createIndex("collectionGroupIndex",ID)}(e)).next(()=>this._i(e,s)).next(()=>e.deleteObjectStore("remoteDocuments"))),r<14&&i>=14&&(o=o.next(()=>this.ai(e,s))),r<15&&i>=15&&(o=o.next(()=>function(u){u.createObjectStore("indexConfiguration",{keyPath:"indexId",autoIncrement:!0}).createIndex("collectionGroupIndex","collectionGroup",{unique:!1}),u.createObjectStore("indexState",{keyPath:PD}).createIndex("sequenceNumberIndex",CD,{unique:!1}),u.createObjectStore("indexEntries",{keyPath:kD}).createIndex("documentKeyIndex",xD,{unique:!1})}(e))),r<16&&i>=16&&(o=o.next(()=>{n.objectStore("indexState").clear()}).next(()=>{n.objectStore("indexEntries").clear()})),r<17&&i>=17&&(o=o.next(()=>{(function(u){u.createObjectStore("globals",{keyPath:"name"})})(e)})),o}ri(e){let n=0;return e.store("remoteDocuments").J((r,i)=>{n+=Uc(i)}).next(()=>{const r={byteSize:n};return e.store("remoteDocumentGlobal").put("remoteDocumentGlobalKey",r)})}ni(e){const n=e.store("mutationQueues"),r=e.store("mutations");return n.U().next(i=>b.forEach(i,s=>{const o=IDBKeyRange.bound([s.userId,-1],[s.userId,s.lastAcknowledgedBatchId]);return r.U("userMutationsIndex",o).next(a=>b.forEach(a,u=>{Q(u.userId===s.userId);const c=Ti(this.serializer,u);return BS(e,s.userId,c).next(()=>{})}))}))}ii(e){const n=e.store("targetDocuments"),r=e.store("remoteDocuments");return e.store("targetGlobal").get("targetGlobalKey").next(i=>{const s=[];return r.J((o,a)=>{const u=new se(o),c=function(f){return[0,wt(f)]}(u);s.push(n.get(c).next(d=>d?b.resolve():(f=>n.put({targetId:0,path:wt(f),sequenceNumber:i.highestListenSequenceNumber}))(u)))}).next(()=>b.waitFor(s))})}si(e,n){e.createObjectStore("collectionParents",{keyPath:RD});const r=n.store("collectionParents"),i=new Zm,s=o=>{if(i.add(o)){const a=o.lastSegment(),u=o.popLast();return r.put({collectionId:a,parent:wt(u)})}};return n.store("remoteDocuments").J({H:!0},(o,a)=>{const u=new se(o);return s(u.popLast())}).next(()=>n.store("documentMutations").J({H:!0},([o,a,u],c)=>{const d=_n(a);return s(d.popLast())}))}oi(e){const n=e.store("targets");return n.J((r,i)=>{const s=ma(i),o=MS(this.serializer,s);return n.put(o)})}_i(e,n){const r=n.store("remoteDocuments"),i=[];return r.J((s,o)=>{const a=n.store("remoteDocumentsV14"),u=function(f){return f.document?new G(se.fromString(f.document.name).popFirst(5)):f.noDocument?G.fromSegments(f.noDocument.path):f.unknownDocument?G.fromSegments(f.unknownDocument.path):W()}(o).path.toArray(),c={prefixPath:u.slice(0,u.length-2),collectionGroup:u[u.length-2],documentId:u[u.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};i.push(a.put(c))}).next(()=>b.waitFor(i))}ai(e,n){const r=n.store("mutations"),i=KS(this.serializer),s=new tg(Sh.Zr,this.serializer.ct);return r.U().next(o=>{const a=new Map;return o.forEach(u=>{var c;let d=(c=a.get(u.userId))!==null&&c!==void 0?c:ee();Ti(this.serializer,u).keys().forEach(f=>d=d.add(f)),a.set(u.userId,d)}),b.forEach(a,(u,c)=>{const d=new nt(c),f=Ih.lt(this.serializer,d),m=s.getIndexManager(d),v=Th.lt(d,this.serializer,m,s.referenceDelegate);return new WS(i,v,f,m).recalculateAndSaveOverlaysForDocumentKeys(new op(n,Nt.oe),u).next()})})}}function Cw(t){t.createObjectStore("targetDocuments",{keyPath:SD}).createIndex("documentTargetsIndex",AD,{unique:!0}),t.createObjectStore("targets",{keyPath:"targetId"}).createIndex("queryTargetsIndex",TD,{unique:!0}),t.createObjectStore("targetGlobal")}const qd="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";class ng{constructor(e,n,r,i,s,o,a,u,c,d,f=17){if(this.allowTabSynchronization=e,this.persistenceKey=n,this.clientId=r,this.ui=s,this.window=o,this.document=a,this.ci=c,this.li=d,this.hi=f,this.Qr=null,this.Kr=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Pi=null,this.inForeground=!1,this.Ii=null,this.Ti=null,this.Ei=Number.NEGATIVE_INFINITY,this.di=m=>Promise.resolve(),!ng.D())throw new j(O.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new OV(this,i),this.Ai=n+"main",this.serializer=new LS(u),this.Ri=new Sn(this.Ai,this.hi,new WV(this.serializer)),this.$r=new SV,this.Ur=new NV(this.referenceDelegate,this.serializer),this.remoteDocumentCache=KS(this.serializer),this.Gr=new TV,this.window&&this.window.localStorage?this.Vi=this.window.localStorage:(this.Vi=null,d===!1&&ze("IndexedDbPersistence","LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.mi().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new j(O.FAILED_PRECONDITION,qd);return this.fi(),this.gi(),this.pi(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.Ur.getHighestSequenceNumber(e))}).then(e=>{this.Qr=new Nt(e,this.ci)}).then(()=>{this.Kr=!0}).catch(e=>(this.Ri&&this.Ri.close(),Promise.reject(e)))}yi(e){return this.di=async n=>{if(this.started)return e(n)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.Ri.L(async n=>{n.newVersion===null&&await e()})}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.ui.enqueueAndForget(async()=>{this.started&&await this.mi()}))}mi(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>Tu(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.wi(e).next(n=>{n||(this.isPrimary=!1,this.ui.enqueueRetryable(()=>this.di(!1)))})}).next(()=>this.Si(e)).next(n=>this.isPrimary&&!n?this.bi(e).next(()=>!1):!!n&&this.Di(e).next(()=>!0))).catch(e=>{if(oi(e))return U("IndexedDbPersistence","Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return U("IndexedDbPersistence","Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.ui.enqueueRetryable(()=>this.di(e)),this.isPrimary=e})}wi(e){return ia(e).get("owner").next(n=>b.resolve(this.vi(n)))}Ci(e){return Tu(e).delete(this.clientId)}async Fi(){if(this.isPrimary&&!this.Mi(this.Ei,18e5)){this.Ei=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",n=>{const r=Xe(n,"clientMetadata");return r.U().next(i=>{const s=this.xi(i,18e5),o=i.filter(a=>s.indexOf(a)===-1);return b.forEach(o,a=>r.delete(a.clientId)).next(()=>o)})}).catch(()=>[]);if(this.Vi)for(const n of e)this.Vi.removeItem(this.Oi(n.clientId))}}pi(){this.Ti=this.ui.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.mi().then(()=>this.Fi()).then(()=>this.pi()))}vi(e){return!!e&&e.ownerId===this.clientId}Si(e){return this.li?b.resolve(!0):ia(e).get("owner").next(n=>{if(n!==null&&this.Mi(n.leaseTimestampMs,5e3)&&!this.Ni(n.ownerId)){if(this.vi(n)&&this.networkEnabled)return!0;if(!this.vi(n)){if(!n.allowTabSynchronization)throw new j(O.FAILED_PRECONDITION,qd);return!1}}return!(!this.networkEnabled||!this.inForeground)||Tu(e).U().next(r=>this.xi(r,5e3).find(i=>{if(this.clientId!==i.clientId){const s=!this.networkEnabled&&i.networkEnabled,o=!this.inForeground&&i.inForeground,a=this.networkEnabled===i.networkEnabled;if(s||o&&a)return!0}return!1})===void 0)}).next(n=>(this.isPrimary!==n&&U("IndexedDbPersistence",`Client ${n?"is":"is not"} eligible for a primary lease.`),n))}async shutdown(){this.Kr=!1,this.Li(),this.Ti&&(this.Ti.cancel(),this.Ti=null),this.Bi(),this.ki(),await this.Ri.runTransaction("shutdown","readwrite",["owner","clientMetadata"],e=>{const n=new op(e,Nt.oe);return this.bi(n).next(()=>this.Ci(n))}),this.Ri.close(),this.qi()}xi(e,n){return e.filter(r=>this.Mi(r.updateTimeMs,n)&&!this.Ni(r.clientId))}Qi(){return this.runTransaction("getActiveClients","readonly",e=>Tu(e).U().next(n=>this.xi(n,18e5).map(r=>r.clientId)))}get started(){return this.Kr}getGlobalsCache(){return this.$r}getMutationQueue(e,n){return Th.lt(e,this.serializer,n,this.referenceDelegate)}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new bV(e,this.serializer.ct.databaseId)}getDocumentOverlayCache(e){return Ih.lt(this.serializer,e)}getBundleCache(){return this.Gr}runTransaction(e,n,r){U("IndexedDbPersistence","Starting transaction:",e);const i=n==="readonly"?"readonly":"readwrite",s=function(u){return u===17?LD:u===16?OD:u===15?Bm:u===14?j0:u===13?B0:u===12?VD:u===11?U0:void W()}(this.hi);let o;return this.Ri.runTransaction(e,i,s,a=>(o=new op(a,this.Qr?this.Qr.next():Nt.oe),n==="readwrite-primary"?this.wi(o).next(u=>!!u||this.Si(o)).next(u=>{if(!u)throw ze(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.ui.enqueueRetryable(()=>this.di(!1)),new j(O.FAILED_PRECONDITION,V0);return r(o)}).next(u=>this.Di(o).next(()=>u)):this.Ki(o).next(()=>r(o)))).then(a=>(o.raiseOnCommittedEvent(),a))}Ki(e){return ia(e).get("owner").next(n=>{if(n!==null&&this.Mi(n.leaseTimestampMs,5e3)&&!this.Ni(n.ownerId)&&!this.vi(n)&&!(this.li||this.allowTabSynchronization&&n.allowTabSynchronization))throw new j(O.FAILED_PRECONDITION,qd)})}Di(e){const n={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return ia(e).put("owner",n)}static D(){return Sn.D()}bi(e){const n=ia(e);return n.get("owner").next(r=>this.vi(r)?(U("IndexedDbPersistence","Releasing primary lease."),n.delete("owner")):b.resolve())}Mi(e,n){const r=Date.now();return!(e<r-n)&&(!(e>r)||(ze(`Detected an update time that is in the future: ${e} > ${r}`),!1))}fi(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.Ii=()=>{this.ui.enqueueAndForget(()=>(this.inForeground=this.document.visibilityState==="visible",this.mi()))},this.document.addEventListener("visibilitychange",this.Ii),this.inForeground=this.document.visibilityState==="visible")}Bi(){this.Ii&&(this.document.removeEventListener("visibilitychange",this.Ii),this.Ii=null)}gi(){var e;typeof((e=this.window)===null||e===void 0?void 0:e.addEventListener)=="function"&&(this.Pi=()=>{this.Li();const n=/(?:Version|Mobile)\/1[456]/;VT()&&(navigator.appVersion.match(n)||navigator.userAgent.match(n))&&this.ui.enterRestrictedMode(!0),this.ui.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Pi))}ki(){this.Pi&&(this.window.removeEventListener("pagehide",this.Pi),this.Pi=null)}Ni(e){var n;try{const r=((n=this.Vi)===null||n===void 0?void 0:n.getItem(this.Oi(e)))!==null;return U("IndexedDbPersistence",`Client '${e}' ${r?"is":"is not"} zombied in LocalStorage`),r}catch(r){return ze("IndexedDbPersistence","Failed to get zombied client id.",r),!1}}Li(){if(this.Vi)try{this.Vi.setItem(this.Oi(this.clientId),String(Date.now()))}catch(e){ze("Failed to set zombie client id.",e)}}qi(){if(this.Vi)try{this.Vi.removeItem(this.Oi(this.clientId))}catch{}}Oi(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function ia(t){return Xe(t,"owner")}function Tu(t){return Xe(t,"clientMetadata")}function rg(t,e){let n=t.projectId;return t.isDefaultDatabase||(n+="."+t.database),"firestore/"+e+"/"+n+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ig{constructor(e,n,r,i){this.targetId=e,this.fromCache=n,this.$i=r,this.Ui=i}static Wi(e,n){let r=ee(),i=ee();for(const s of n.docChanges)switch(s.type){case 0:r=r.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new ig(e,n.fromCache,r,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HV{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HS{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return VT()?8:L0(Ye())>0?6:4}()}initialize(e,n){this.Ji=e,this.indexManager=n,this.Gi=!0}getDocumentsMatchingQuery(e,n,r,i){const s={result:null};return this.Yi(e,n).next(o=>{s.result=o}).next(()=>{if(!s.result)return this.Zi(e,n,i,r).next(o=>{s.result=o})}).next(()=>{if(s.result)return;const o=new HV;return this.Xi(e,n,o).next(a=>{if(s.result=a,this.zi)return this.es(e,n,o,a.size)})}).next(()=>s.result)}es(e,n,r,i){return r.documentReadCount<this.ji?(vs()<=ie.DEBUG&&U("QueryEngine","SDK will not create cache indexes for query:",ws(n),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),b.resolve()):(vs()<=ie.DEBUG&&U("QueryEngine","Query:",ws(n),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.Hi*i?(vs()<=ie.DEBUG&&U("QueryEngine","The SDK decides to create cache indexes for query:",ws(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Et(n))):b.resolve())}Yi(e,n){if(ew(n))return b.resolve(null);let r=Et(n);return this.indexManager.getIndexType(e,r).next(i=>i===0?null:(n.limit!==null&&i===1&&(n=Oc(n,null,"F"),r=Et(n)),this.indexManager.getDocumentsMatchingTarget(e,r).next(s=>{const o=ee(...s);return this.Ji.getDocuments(e,o).next(a=>this.indexManager.getMinOffset(e,r).next(u=>{const c=this.ts(n,a);return this.ns(n,c,o,u.readTime)?this.Yi(e,Oc(n,null,"F")):this.rs(e,c,n,u)}))})))}Zi(e,n,r,i){return ew(n)||i.isEqual(J.min())?b.resolve(null):this.Ji.getDocuments(e,r).next(s=>{const o=this.ts(n,s);return this.ns(n,o,r,i)?b.resolve(null):(vs()<=ie.DEBUG&&U("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),ws(n)),this.rs(e,o,n,N0(i,-1)).next(a=>a))})}ts(e,n){let r=new fe(oS(e));return n.forEach((i,s)=>{Rl(e,s)&&(r=r.add(s))}),r}ns(e,n,r,i){if(e.limit===null)return!1;if(r.size!==n.size)return!0;const s=e.limitType==="F"?n.last():n.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}Xi(e,n,r){return vs()<=ie.DEBUG&&U("QueryEngine","Using full collection scan to execute query:",ws(n)),this.Ji.getDocumentsMatchingQuery(e,n,Gt.min(),r)}rs(e,n,r,i){return this.Ji.getDocumentsMatchingQuery(e,r,i).next(s=>(n.forEach(o=>{s=s.insert(o.key,o)}),s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QV{constructor(e,n,r,i){this.persistence=e,this.ss=n,this.serializer=i,this.os=new ye(X),this._s=new nr(s=>Gi(s),Sl),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new WS(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.os))}}function QS(t,e,n,r){return new QV(t,e,n,r)}async function JS(t,e){const n=$(t);return await n.persistence.runTransaction("Handle user change","readonly",r=>{let i;return n.mutationQueue.getAllMutationBatches(r).next(s=>(i=s,n.ls(e),n.mutationQueue.getAllMutationBatches(r))).next(s=>{const o=[],a=[];let u=ee();for(const c of i){o.push(c.batchId);for(const d of c.mutations)u=u.add(d.key)}for(const c of s){a.push(c.batchId);for(const d of c.mutations)u=u.add(d.key)}return n.localDocuments.getDocuments(r,u).next(c=>({hs:c,removedBatchIds:o,addedBatchIds:a}))})})}function JV(t,e){const n=$(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const i=e.batch.keys(),s=n.cs.newChangeBuffer({trackRemovals:!0});return function(a,u,c,d){const f=c.batch,m=f.keys();let v=b.resolve();return m.forEach(S=>{v=v.next(()=>d.getEntry(u,S)).next(P=>{const C=c.docVersions.get(S);Q(C!==null),P.version.compareTo(C)<0&&(f.applyToRemoteDocument(P,c),P.isValidDocument()&&(P.setReadTime(c.commitVersion),d.addEntry(P)))})}),v.next(()=>a.mutationQueue.removeMutationBatch(u,f))}(n,r,e,s).next(()=>s.apply(r)).next(()=>n.mutationQueue.performConsistencyCheck(r)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(a){let u=ee();for(let c=0;c<a.mutationResults.length;++c)a.mutationResults[c].transformResults.length>0&&(u=u.add(a.batch.mutations[c].key));return u}(e))).next(()=>n.localDocuments.getDocuments(r,i))})}function YS(t){const e=$(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Ur.getLastRemoteSnapshotVersion(n))}function YV(t,e){const n=$(t),r=e.snapshotVersion;let i=n.os;return n.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const o=n.cs.newChangeBuffer({trackRemovals:!0});i=n.os;const a=[];e.targetChanges.forEach((d,f)=>{const m=i.get(f);if(!m)return;a.push(n.Ur.removeMatchingKeys(s,d.removedDocuments,f).next(()=>n.Ur.addMatchingKeys(s,d.addedDocuments,f)));let v=m.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(f)!==null?v=v.withResumeToken(Me.EMPTY_BYTE_STRING,J.min()).withLastLimboFreeSnapshotVersion(J.min()):d.resumeToken.approximateByteSize()>0&&(v=v.withResumeToken(d.resumeToken,r)),i=i.insert(f,v),function(P,C,w){return P.resumeToken.approximateByteSize()===0||C.snapshotVersion.toMicroseconds()-P.snapshotVersion.toMicroseconds()>=3e8?!0:w.addedDocuments.size+w.modifiedDocuments.size+w.removedDocuments.size>0}(m,v,d)&&a.push(n.Ur.updateTargetData(s,v))});let u=Vt(),c=ee();if(e.documentUpdates.forEach(d=>{e.resolvedLimboDocuments.has(d)&&a.push(n.persistence.referenceDelegate.updateLimboDocument(s,d))}),a.push(XS(s,o,e.documentUpdates).next(d=>{u=d.Ps,c=d.Is})),!r.isEqual(J.min())){const d=n.Ur.getLastRemoteSnapshotVersion(s).next(f=>n.Ur.setTargetsMetadata(s,s.currentSequenceNumber,r));a.push(d)}return b.waitFor(a).next(()=>o.apply(s)).next(()=>n.localDocuments.getLocalViewOfDocuments(s,u,c)).next(()=>u)}).then(s=>(n.os=i,s))}function XS(t,e,n){let r=ee(),i=ee();return n.forEach(s=>r=r.add(s)),e.getEntries(t,r).next(s=>{let o=Vt();return n.forEach((a,u)=>{const c=s.get(a);u.isFoundDocument()!==c.isFoundDocument()&&(i=i.add(a)),u.isNoDocument()&&u.version.isEqual(J.min())?(e.removeEntry(a,u.readTime),o=o.insert(a,u)):!c.isValidDocument()||u.version.compareTo(c.version)>0||u.version.compareTo(c.version)===0&&c.hasPendingWrites?(e.addEntry(u),o=o.insert(a,u)):U("LocalStore","Ignoring outdated watch update for ",a,". Current version:",c.version," Watch version:",u.version)}),{Ps:o,Is:i}})}function XV(t,e){const n=$(t);return n.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),n.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function lo(t,e){const n=$(t);return n.persistence.runTransaction("Allocate target","readwrite",r=>{let i;return n.Ur.getTargetData(r,e).next(s=>s?(i=s,b.resolve(i)):n.Ur.allocateTargetId(r).next(o=>(i=new zn(e,o,"TargetPurposeListen",r.currentSequenceNumber),n.Ur.addTargetData(r,i).next(()=>i))))}).then(r=>{const i=n.os.get(r.targetId);return(i===null||r.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(n.os=n.os.insert(r.targetId,r),n._s.set(e,r.targetId)),r})}async function uo(t,e,n){const r=$(t),i=r.os.get(e),s=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",s,o=>r.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!oi(o))throw o;U("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}r.os=r.os.remove(e),r._s.delete(i.target)}function jc(t,e,n){const r=$(t);let i=J.min(),s=ee();return r.persistence.runTransaction("Execute query","readwrite",o=>function(u,c,d){const f=$(u),m=f._s.get(d);return m!==void 0?b.resolve(f.os.get(m)):f.Ur.getTargetData(c,d)}(r,o,Et(e)).next(a=>{if(a)return i=a.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(o,a.targetId).next(u=>{s=u})}).next(()=>r.ss.getDocumentsMatchingQuery(o,e,n?i:J.min(),n?s:ee())).next(a=>(tA(r,sS(e),a),{documents:a,Ts:s})))}function ZS(t,e){const n=$(t),r=$(n.Ur),i=n.os.get(e);return i?Promise.resolve(i.target):n.persistence.runTransaction("Get target data","readonly",s=>r.ot(s,e).next(o=>o?o.target:null))}function eA(t,e){const n=$(t),r=n.us.get(e)||J.min();return n.persistence.runTransaction("Get new document changes","readonly",i=>n.cs.getAllFromCollectionGroup(i,e,N0(r,-1),Number.MAX_SAFE_INTEGER)).then(i=>(tA(n,e,i),i))}function tA(t,e,n){let r=t.us.get(e)||J.min();n.forEach((i,s)=>{s.readTime.compareTo(r)>0&&(r=s.readTime)}),t.us.set(e,r)}async function ZV(t,e,n,r){const i=$(t);let s=ee(),o=Vt();for(const c of n){const d=e.Es(c.metadata.name);c.document&&(s=s.add(d));const f=e.ds(c);f.setReadTime(e.As(c.metadata.readTime)),o=o.insert(d,f)}const a=i.cs.newChangeBuffer({trackRemovals:!0}),u=await lo(i,function(d){return Et(To(se.fromString(`__bundle__/docs/${d}`)))}(r));return i.persistence.runTransaction("Apply bundle documents","readwrite",c=>XS(c,a,o).next(d=>(a.apply(c),d)).next(d=>i.Ur.removeMatchingKeysForTargetId(c,u.targetId).next(()=>i.Ur.addMatchingKeys(c,s,u.targetId)).next(()=>i.localDocuments.getLocalViewOfDocuments(c,d.Ps,d.Is)).next(()=>d.Ps)))}async function eO(t,e,n=ee()){const r=await lo(t,Et(Ym(e.bundledQuery))),i=$(t);return i.persistence.runTransaction("Save named query","readwrite",s=>{const o=qe(e.readTime);if(r.snapshotVersion.compareTo(o)>=0)return i.Gr.saveNamedQuery(s,e);const a=r.withResumeToken(Me.EMPTY_BYTE_STRING,o);return i.os=i.os.insert(a.targetId,a),i.Ur.updateTargetData(s,a).next(()=>i.Ur.removeMatchingKeysForTargetId(s,r.targetId)).next(()=>i.Ur.addMatchingKeys(s,n,r.targetId)).next(()=>i.Gr.saveNamedQuery(s,e))})}function kw(t,e){return`firestore_clients_${t}_${e}`}function xw(t,e,n){let r=`firestore_mutations_${t}_${n}`;return e.isAuthenticated()&&(r+=`_${e.uid}`),r}function Gd(t,e){return`firestore_targets_${t}_${e}`}class zc{constructor(e,n,r,i){this.user=e,this.batchId=n,this.state=r,this.error=i}static Rs(e,n,r){const i=JSON.parse(r);let s,o=typeof i=="object"&&["pending","acknowledged","rejected"].indexOf(i.state)!==-1&&(i.error===void 0||typeof i.error=="object");return o&&i.error&&(o=typeof i.error.message=="string"&&typeof i.error.code=="string",o&&(s=new j(i.error.code,i.error.message))),o?new zc(e,n,i.state,s):(ze("SharedClientState",`Failed to parse mutation state for ID '${n}': ${r}`),null)}Vs(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class xa{constructor(e,n,r){this.targetId=e,this.state=n,this.error=r}static Rs(e,n){const r=JSON.parse(n);let i,s=typeof r=="object"&&["not-current","current","rejected"].indexOf(r.state)!==-1&&(r.error===void 0||typeof r.error=="object");return s&&r.error&&(s=typeof r.error.message=="string"&&typeof r.error.code=="string",s&&(i=new j(r.error.code,r.error.message))),s?new xa(e,r.state,i):(ze("SharedClientState",`Failed to parse target state for ID '${e}': ${n}`),null)}Vs(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class $c{constructor(e,n){this.clientId=e,this.activeTargetIds=n}static Rs(e,n){const r=JSON.parse(n);let i=typeof r=="object"&&r.activeTargetIds instanceof Array,s=$m();for(let o=0;i&&o<r.activeTargetIds.length;++o)i=M0(r.activeTargetIds[o]),s=s.add(r.activeTargetIds[o]);return i?new $c(e,s):(ze("SharedClientState",`Failed to parse client data for instance '${e}': ${n}`),null)}}class sg{constructor(e,n){this.clientId=e,this.onlineState=n}static Rs(e){const n=JSON.parse(e);return typeof n=="object"&&["Unknown","Online","Offline"].indexOf(n.onlineState)!==-1&&typeof n.clientId=="string"?new sg(n.clientId,n.onlineState):(ze("SharedClientState",`Failed to parse online state: ${e}`),null)}}class wp{constructor(){this.activeTargetIds=$m()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Kd{constructor(e,n,r,i,s){this.window=e,this.ui=n,this.persistenceKey=r,this.ps=i,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.ys=this.ws.bind(this),this.Ss=new ye(X),this.started=!1,this.bs=[];const o=r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=s,this.Ds=kw(this.persistenceKey,this.ps),this.vs=function(u){return`firestore_sequence_number_${u}`}(this.persistenceKey),this.Ss=this.Ss.insert(this.ps,new wp),this.Cs=new RegExp(`^firestore_clients_${o}_([^_]*)$`),this.Fs=new RegExp(`^firestore_mutations_${o}_(\\d+)(?:_(.*))?$`),this.Ms=new RegExp(`^firestore_targets_${o}_(\\d+)$`),this.xs=function(u){return`firestore_online_state_${u}`}(this.persistenceKey),this.Os=function(u){return`firestore_bundle_loaded_v2_${u}`}(this.persistenceKey),this.window.addEventListener("storage",this.ys)}static D(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.Qi();for(const r of e){if(r===this.ps)continue;const i=this.getItem(kw(this.persistenceKey,r));if(i){const s=$c.Rs(r,i);s&&(this.Ss=this.Ss.insert(s.clientId,s))}}this.Ns();const n=this.storage.getItem(this.xs);if(n){const r=this.Ls(n);r&&this.Bs(r)}for(const r of this.bs)this.ws(r);this.bs=[],this.window.addEventListener("pagehide",()=>this.shutdown()),this.started=!0}writeSequenceNumber(e){this.setItem(this.vs,JSON.stringify(e))}getAllActiveQueryTargets(){return this.ks(this.Ss)}isActiveQueryTarget(e){let n=!1;return this.Ss.forEach((r,i)=>{i.activeTargetIds.has(e)&&(n=!0)}),n}addPendingMutation(e){this.qs(e,"pending")}updateMutationState(e,n,r){this.qs(e,n,r),this.Qs(e)}addLocalQueryTarget(e,n=!0){let r="not-current";if(this.isActiveQueryTarget(e)){const i=this.storage.getItem(Gd(this.persistenceKey,e));if(i){const s=xa.Rs(e,i);s&&(r=s.state)}}return n&&this.Ks.fs(e),this.Ns(),r}removeLocalQueryTarget(e){this.Ks.gs(e),this.Ns()}isLocalQueryTarget(e){return this.Ks.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(Gd(this.persistenceKey,e))}updateQueryState(e,n,r){this.$s(e,n,r)}handleUserChange(e,n,r){n.forEach(i=>{this.Qs(i)}),this.currentUser=e,r.forEach(i=>{this.addPendingMutation(i)})}setOnlineState(e){this.Us(e)}notifyBundleLoaded(e){this.Ws(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.ys),this.removeItem(this.Ds),this.started=!1)}getItem(e){const n=this.storage.getItem(e);return U("SharedClientState","READ",e,n),n}setItem(e,n){U("SharedClientState","SET",e,n),this.storage.setItem(e,n)}removeItem(e){U("SharedClientState","REMOVE",e),this.storage.removeItem(e)}ws(e){const n=e;if(n.storageArea===this.storage){if(U("SharedClientState","EVENT",n.key,n.newValue),n.key===this.Ds)return void ze("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.ui.enqueueRetryable(async()=>{if(this.started){if(n.key!==null){if(this.Cs.test(n.key)){if(n.newValue==null){const r=this.Gs(n.key);return this.zs(r,null)}{const r=this.js(n.key,n.newValue);if(r)return this.zs(r.clientId,r)}}else if(this.Fs.test(n.key)){if(n.newValue!==null){const r=this.Hs(n.key,n.newValue);if(r)return this.Js(r)}}else if(this.Ms.test(n.key)){if(n.newValue!==null){const r=this.Ys(n.key,n.newValue);if(r)return this.Zs(r)}}else if(n.key===this.xs){if(n.newValue!==null){const r=this.Ls(n.newValue);if(r)return this.Bs(r)}}else if(n.key===this.vs){const r=function(s){let o=Nt.oe;if(s!=null)try{const a=JSON.parse(s);Q(typeof a=="number"),o=a}catch(a){ze("SharedClientState","Failed to read sequence number from WebStorage",a)}return o}(n.newValue);r!==Nt.oe&&this.sequenceNumberHandler(r)}else if(n.key===this.Os){const r=this.Xs(n.newValue);await Promise.all(r.map(i=>this.syncEngine.eo(i)))}}}else this.bs.push(n)})}}get Ks(){return this.Ss.get(this.ps)}Ns(){this.setItem(this.Ds,this.Ks.Vs())}qs(e,n,r){const i=new zc(this.currentUser,e,n,r),s=xw(this.persistenceKey,this.currentUser,e);this.setItem(s,i.Vs())}Qs(e){const n=xw(this.persistenceKey,this.currentUser,e);this.removeItem(n)}Us(e){const n={clientId:this.ps,onlineState:e};this.storage.setItem(this.xs,JSON.stringify(n))}$s(e,n,r){const i=Gd(this.persistenceKey,e),s=new xa(e,n,r);this.setItem(i,s.Vs())}Ws(e){const n=JSON.stringify(Array.from(e));this.setItem(this.Os,n)}Gs(e){const n=this.Cs.exec(e);return n?n[1]:null}js(e,n){const r=this.Gs(e);return $c.Rs(r,n)}Hs(e,n){const r=this.Fs.exec(e),i=Number(r[1]),s=r[2]!==void 0?r[2]:null;return zc.Rs(new nt(s),i,n)}Ys(e,n){const r=this.Ms.exec(e),i=Number(r[1]);return xa.Rs(i,n)}Ls(e){return sg.Rs(e)}Xs(e){return JSON.parse(e)}async Js(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.no(e.batchId,e.state,e.error);U("SharedClientState",`Ignoring mutation for non-active user ${e.user.uid}`)}Zs(e){return this.syncEngine.ro(e.targetId,e.state,e.error)}zs(e,n){const r=n?this.Ss.insert(e,n):this.Ss.remove(e),i=this.ks(this.Ss),s=this.ks(r),o=[],a=[];return s.forEach(u=>{i.has(u)||o.push(u)}),i.forEach(u=>{s.has(u)||a.push(u)}),this.syncEngine.io(o,a).then(()=>{this.Ss=r})}Bs(e){this.Ss.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}ks(e){let n=$m();return e.forEach((r,i)=>{n=n.unionWith(i.activeTargetIds)}),n}}class nA{constructor(){this.so=new wp,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,r){}addLocalQueryTarget(e,n=!0){return n&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,n,r){this.oo[e]=n}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new wp,Promise.resolve()}handleUserChange(e,n,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tO{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bw{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){U("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){U("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Su=null;function Wd(){return Su===null?Su=function(){return 268435456+Math.round(2147483648*Math.random())}():Su++,"0x"+Su.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nO={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rO{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _t="WebChannelConnection";class iO extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const r=n.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+n.host,this.vo=`projects/${i}/databases/${s}`,this.Co=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${s}`}get Fo(){return!1}Mo(n,r,i,s,o){const a=Wd(),u=this.xo(n,r.toUriEncodedString());U("RestConnection",`Sending RPC '${n}' ${a}:`,u,i);const c={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(c,s,o),this.No(n,u,c,i).then(d=>(U("RestConnection",`Received RPC '${n}' ${a}: `,d),d),d=>{throw en("RestConnection",`RPC '${n}' ${a} failed with error: `,d,"url: ",u,"request:",i),d})}Lo(n,r,i,s,o,a){return this.Mo(n,r,i,s,o)}Oo(n,r,i){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Io}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((s,o)=>n[o]=s),i&&i.headers.forEach((s,o)=>n[o]=s)}xo(n,r){const i=nO[n];return`${this.Do}/v1/${r}:${i}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,n,r,i){const s=Wd();return new Promise((o,a)=>{const u=new T0;u.setWithCredentials(!0),u.listenOnce(S0.COMPLETE,()=>{try{switch(u.getLastErrorCode()){case qu.NO_ERROR:const d=u.getResponseJson();U(_t,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(d)),o(d);break;case qu.TIMEOUT:U(_t,`RPC '${e}' ${s} timed out`),a(new j(O.DEADLINE_EXCEEDED,"Request time out"));break;case qu.HTTP_ERROR:const f=u.getStatus();if(U(_t,`RPC '${e}' ${s} failed with status:`,f,"response text:",u.getResponseText()),f>0){let m=u.getResponseJson();Array.isArray(m)&&(m=m[0]);const v=m==null?void 0:m.error;if(v&&v.status&&v.message){const S=function(C){const w=C.toLowerCase().replace(/_/g,"-");return Object.values(O).indexOf(w)>=0?w:O.UNKNOWN}(v.status);a(new j(S,v.message))}else a(new j(O.UNKNOWN,"Server responded with status "+u.getStatus()))}else a(new j(O.UNAVAILABLE,"Connection failed."));break;default:W()}}finally{U(_t,`RPC '${e}' ${s} completed.`)}});const c=JSON.stringify(i);U(_t,`RPC '${e}' ${s} sending request:`,i),u.send(n,"POST",c,r,15)})}Bo(e,n,r){const i=Wd(),s=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=P0(),a=R0(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;c!==void 0&&(u.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Oo(u.initMessageHeaders,n,r),u.encodeInitMessageHeaders=!0;const d=s.join("");U(_t,`Creating RPC '${e}' stream ${i}: ${d}`,u);const f=o.createWebChannel(d,u);let m=!1,v=!1;const S=new rO({Io:C=>{v?U(_t,`Not sending because RPC '${e}' stream ${i} is closed:`,C):(m||(U(_t,`Opening RPC '${e}' stream ${i} transport.`),f.open(),m=!0),U(_t,`RPC '${e}' stream ${i} sending:`,C),f.send(C))},To:()=>f.close()}),P=(C,w,y)=>{C.listen(w,E=>{try{y(E)}catch(x){setTimeout(()=>{throw x},0)}})};return P(f,da.EventType.OPEN,()=>{v||(U(_t,`RPC '${e}' stream ${i} transport opened.`),S.yo())}),P(f,da.EventType.CLOSE,()=>{v||(v=!0,U(_t,`RPC '${e}' stream ${i} transport closed`),S.So())}),P(f,da.EventType.ERROR,C=>{v||(v=!0,en(_t,`RPC '${e}' stream ${i} transport errored:`,C),S.So(new j(O.UNAVAILABLE,"The operation could not be completed")))}),P(f,da.EventType.MESSAGE,C=>{var w;if(!v){const y=C.data[0];Q(!!y);const E=y,x=E.error||((w=E[0])===null||w===void 0?void 0:w.error);if(x){U(_t,`RPC '${e}' stream ${i} received error:`,x);const M=x.status;let F=function(T){const A=We[T];if(A!==void 0)return wS(A)}(M),I=x.message;F===void 0&&(F=O.INTERNAL,I="Unknown error status: "+M+" with message "+x.message),v=!0,S.So(new j(F,I)),f.close()}else U(_t,`RPC '${e}' stream ${i} received:`,y),S.bo(y)}}),P(a,A0.STAT_EVENT,C=>{C.stat===ip.PROXY?U(_t,`RPC '${e}' stream ${i} detected buffering proxy`):C.stat===ip.NOPROXY&&U(_t,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{S.wo()},0),S}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rA(){return typeof window<"u"?window:null}function Yu(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xl(t){return new dV(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class og{constructor(e,n,r=1e3,i=1.5,s=6e4){this.ui=e,this.timerId=n,this.ko=r,this.qo=i,this.Qo=s,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const n=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),i=Math.max(0,n-r);i>0&&U("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Ko} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,i,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iA{constructor(e,n,r,i,s,o,a,u){this.ui=e,this.Ho=r,this.Jo=i,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=u,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new og(e,n)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,n){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():n&&n.code===O.RESOURCE_EXHAUSTED?(ze(n.toString()),ze("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):n&&n.code===O.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(n)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),n=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,i])=>{this.Yo===n&&this.P_(r,i)},r=>{e(()=>{const i=new j(O.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(i)})})}P_(e,n){const r=this.h_(this.Yo);this.stream=this.T_(e,n),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(i=>{r(()=>this.I_(i))}),this.stream.onMessage(i=>{r(()=>++this.e_==1?this.E_(i):this.onNext(i))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return U("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return n=>{this.ui.enqueueAndForget(()=>this.Yo===e?n():(U("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class sO extends iA{constructor(e,n,r,i,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,r,i,o),this.serializer=s}T_(e,n){return this.connection.Bo("Listen",e,n)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const n=mV(this.serializer,e),r=function(s){if(!("targetChange"in s))return J.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?J.min():o.readTime?qe(o.readTime):J.min()}(e);return this.listener.d_(n,r)}A_(e){const n={};n.database=mp(this.serializer),n.addTarget=function(s,o){let a;const u=o.target;if(a=Dc(u)?{documents:xS(s,u)}:{query:Eh(s,u)._t},a.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){a.resumeToken=SS(s,o.resumeToken);const c=fp(s,o.expectedCount);c!==null&&(a.expectedCount=c)}else if(o.snapshotVersion.compareTo(J.min())>0){a.readTime=ao(s,o.snapshotVersion.toTimestamp());const c=fp(s,o.expectedCount);c!==null&&(a.expectedCount=c)}return a}(this.serializer,e);const r=_V(this.serializer,e);r&&(n.labels=r),this.a_(n)}R_(e){const n={};n.database=mp(this.serializer),n.removeTarget=e,this.a_(n)}}class oO extends iA{constructor(e,n,r,i,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,r,i,o),this.serializer=s}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,n){return this.connection.Bo("Write",e,n)}E_(e){return Q(!!e.streamToken),this.lastStreamToken=e.streamToken,Q(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){Q(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const n=gV(e.writeResults,e.commitTime),r=qe(e.commitTime);return this.listener.g_(r,n)}p_(){const e={};e.database=mp(this.serializer),this.a_(e)}m_(e){const n={streamToken:this.lastStreamToken,writes:e.map(r=>ll(this.serializer,r))};this.a_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aO extends class{}{constructor(e,n,r,i){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=i,this.y_=!1}w_(){if(this.y_)throw new j(O.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,n,r,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Mo(e,pp(n,r),i,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===O.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new j(O.UNKNOWN,s.toString())})}Lo(e,n,r,i,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Lo(e,pp(n,r),i,o,a,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===O.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new j(O.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class lO{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(ze(n),this.D_=!1):U("OnlineStateTracker",n)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uO{constructor(e,n,r,i,s){this.localStore=e,this.datastore=n,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=s,this.k_._o(o=>{r.enqueueAndForget(async()=>{li(this)&&(U("RemoteStore","Restarting streams for network reachability change."),await async function(u){const c=$(u);c.L_.add(4),await Ro(c),c.q_.set("Unknown"),c.L_.delete(4),await bl(c)}(this))})}),this.q_=new lO(r,i)}}async function bl(t){if(li(t))for(const e of t.B_)await e(!0)}async function Ro(t){for(const e of t.B_)await e(!1)}function Ah(t,e){const n=$(t);n.N_.has(e.targetId)||(n.N_.set(e.targetId,e),ug(n)?lg(n):Co(n).r_()&&ag(n,e))}function co(t,e){const n=$(t),r=Co(n);n.N_.delete(e),r.r_()&&sA(n,e),n.N_.size===0&&(r.r_()?r.o_():li(n)&&n.q_.set("Unknown"))}function ag(t,e){if(t.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(J.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}Co(t).A_(e)}function sA(t,e){t.Q_.xe(e),Co(t).R_(e)}function lg(t){t.Q_=new lV({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>t.N_.get(e)||null,tt:()=>t.datastore.serializer.databaseId}),Co(t).start(),t.q_.v_()}function ug(t){return li(t)&&!Co(t).n_()&&t.N_.size>0}function li(t){return $(t).L_.size===0}function oA(t){t.Q_=void 0}async function cO(t){t.q_.set("Online")}async function hO(t){t.N_.forEach((e,n)=>{ag(t,e)})}async function dO(t,e){oA(t),ug(t)?(t.q_.M_(e),lg(t)):t.q_.set("Unknown")}async function fO(t,e,n){if(t.q_.set("Online"),e instanceof TS&&e.state===2&&e.cause)try{await async function(i,s){const o=s.cause;for(const a of s.targetIds)i.N_.has(a)&&(await i.remoteSyncer.rejectListen(a,o),i.N_.delete(a),i.Q_.removeTarget(a))}(t,e)}catch(r){U("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await qc(t,r)}else if(e instanceof Ju?t.Q_.Ke(e):e instanceof IS?t.Q_.He(e):t.Q_.We(e),!n.isEqual(J.min()))try{const r=await YS(t.localStore);n.compareTo(r)>=0&&await function(s,o){const a=s.Q_.rt(o);return a.targetChanges.forEach((u,c)=>{if(u.resumeToken.approximateByteSize()>0){const d=s.N_.get(c);d&&s.N_.set(c,d.withResumeToken(u.resumeToken,o))}}),a.targetMismatches.forEach((u,c)=>{const d=s.N_.get(u);if(!d)return;s.N_.set(u,d.withResumeToken(Me.EMPTY_BYTE_STRING,d.snapshotVersion)),sA(s,u);const f=new zn(d.target,u,c,d.sequenceNumber);ag(s,f)}),s.remoteSyncer.applyRemoteEvent(a)}(t,n)}catch(r){U("RemoteStore","Failed to raise snapshot:",r),await qc(t,r)}}async function qc(t,e,n){if(!oi(e))throw e;t.L_.add(1),await Ro(t),t.q_.set("Offline"),n||(n=()=>YS(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{U("RemoteStore","Retrying IndexedDB access"),await n(),t.L_.delete(1),await bl(t)})}function aA(t,e){return e().catch(n=>qc(t,n,e))}async function Po(t){const e=$(t),n=Qr(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;pO(e);)try{const i=await XV(e.localStore,r);if(i===null){e.O_.length===0&&n.o_();break}r=i.batchId,mO(e,i)}catch(i){await qc(e,i)}lA(e)&&uA(e)}function pO(t){return li(t)&&t.O_.length<10}function mO(t,e){t.O_.push(e);const n=Qr(t);n.r_()&&n.V_&&n.m_(e.mutations)}function lA(t){return li(t)&&!Qr(t).n_()&&t.O_.length>0}function uA(t){Qr(t).start()}async function gO(t){Qr(t).p_()}async function _O(t){const e=Qr(t);for(const n of t.O_)e.m_(n.mutations)}async function yO(t,e,n){const r=t.O_.shift(),i=Wm.from(r,e,n);await aA(t,()=>t.remoteSyncer.applySuccessfulWrite(i)),await Po(t)}async function vO(t,e){e&&Qr(t).V_&&await async function(r,i){if(function(o){return vS(o)&&o!==O.ABORTED}(i.code)){const s=r.O_.shift();Qr(r).s_(),await aA(r,()=>r.remoteSyncer.rejectFailedWrite(s.batchId,i)),await Po(r)}}(t,e),lA(t)&&uA(t)}async function Nw(t,e){const n=$(t);n.asyncQueue.verifyOperationInProgress(),U("RemoteStore","RemoteStore received new credentials");const r=li(n);n.L_.add(3),await Ro(n),r&&n.q_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.L_.delete(3),await bl(n)}async function Ep(t,e){const n=$(t);e?(n.L_.delete(2),await bl(n)):e||(n.L_.add(2),await Ro(n),n.q_.set("Unknown"))}function Co(t){return t.K_||(t.K_=function(n,r,i){const s=$(n);return s.w_(),new sO(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(t.datastore,t.asyncQueue,{Eo:cO.bind(null,t),Ro:hO.bind(null,t),mo:dO.bind(null,t),d_:fO.bind(null,t)}),t.B_.push(async e=>{e?(t.K_.s_(),ug(t)?lg(t):t.q_.set("Unknown")):(await t.K_.stop(),oA(t))})),t.K_}function Qr(t){return t.U_||(t.U_=function(n,r,i){const s=$(n);return s.w_(),new oO(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(t.datastore,t.asyncQueue,{Eo:()=>Promise.resolve(),Ro:gO.bind(null,t),mo:vO.bind(null,t),f_:_O.bind(null,t),g_:yO.bind(null,t)}),t.B_.push(async e=>{e?(t.U_.s_(),await Po(t)):(await t.U_.stop(),t.O_.length>0&&(U("RemoteStore",`Stopping write stream with ${t.O_.length} pending writes`),t.O_=[]))})),t.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cg{constructor(e,n,r,i,s){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new it,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,r,i,s){const o=Date.now()+r,a=new cg(e,n,o,i,s);return a.start(r),a}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new j(O.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function ko(t,e){if(ze("AsyncQueue",`${e}: ${t}`),oi(t))return new j(O.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ks{constructor(e){this.comparator=e?(n,r)=>e(n,r)||G.comparator(n.key,r.key):(n,r)=>G.comparator(n.key,r.key),this.keyedMap=fa(),this.sortedSet=new ye(this.comparator)}static emptySet(e){return new Ks(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,r)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof Ks)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const r=new Ks;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=n,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dw{constructor(){this.W_=new ye(G.comparator)}track(e){const n=e.doc.key,r=this.W_.get(n);r?e.type!==0&&r.type===3?this.W_=this.W_.insert(n,e):e.type===3&&r.type!==1?this.W_=this.W_.insert(n,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.W_=this.W_.insert(n,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.W_=this.W_.remove(n):e.type===1&&r.type===2?this.W_=this.W_.insert(n,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):W():this.W_=this.W_.insert(n,e)}G_(){const e=[];return this.W_.inorderTraversal((n,r)=>{e.push(r)}),e}}class ho{constructor(e,n,r,i,s,o,a,u,c){this.query=e,this.docs=n,this.oldDocs=r,this.docChanges=i,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=u,this.hasCachedResults=c}static fromInitialDocuments(e,n,r,i,s){const o=[];return n.forEach(a=>{o.push({type:0,doc:a})}),new ho(e,n,Ks.emptySet(n),o,r,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Al(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,r=e.docChanges;if(n.length!==r.length)return!1;for(let i=0;i<n.length;i++)if(n[i].type!==r[i].type||!n[i].doc.isEqual(r[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wO{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class EO{constructor(){this.queries=Vw(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(n,r){const i=$(n),s=i.queries;i.queries=Vw(),s.forEach((o,a)=>{for(const u of a.j_)u.onError(r)})})(this,new j(O.ABORTED,"Firestore shutting down"))}}function Vw(){return new nr(t=>iS(t),Al)}async function hg(t,e){const n=$(t);let r=3;const i=e.query;let s=n.queries.get(i);s?!s.H_()&&e.J_()&&(r=2):(s=new wO,r=e.J_()?0:1);try{switch(r){case 0:s.z_=await n.onListen(i,!0);break;case 1:s.z_=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(o){const a=ko(o,`Initialization of query '${ws(e.query)}' failed`);return void e.onError(a)}n.queries.set(i,s),s.j_.push(e),e.Z_(n.onlineState),s.z_&&e.X_(s.z_)&&fg(n)}async function dg(t,e){const n=$(t),r=e.query;let i=3;const s=n.queries.get(r);if(s){const o=s.j_.indexOf(e);o>=0&&(s.j_.splice(o,1),s.j_.length===0?i=e.J_()?0:1:!s.H_()&&e.J_()&&(i=2))}switch(i){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function IO(t,e){const n=$(t);let r=!1;for(const i of e){const s=i.query,o=n.queries.get(s);if(o){for(const a of o.j_)a.X_(i)&&(r=!0);o.z_=i}}r&&fg(n)}function TO(t,e,n){const r=$(t),i=r.queries.get(e);if(i)for(const s of i.j_)s.onError(n);r.queries.delete(e)}function fg(t){t.Y_.forEach(e=>{e.next()})}var Ip,Ow;(Ow=Ip||(Ip={})).ea="default",Ow.Cache="cache";class pg{constructor(e,n,r){this.query=e,this.ta=n,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=r||{}}X_(e){if(!this.options.includeMetadataChanges){const r=[];for(const i of e.docChanges)i.type!==3&&r.push(i);e=new ho(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.na?this.ia(e)&&(this.ta.next(e),n=!0):this.sa(e,this.onlineState)&&(this.oa(e),n=!0),this.ra=e,n}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let n=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),n=!0),n}sa(e,n){if(!e.fromCache||!this.J_())return!0;const r=n!=="Offline";return(!this.options._a||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const n=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}oa(e){e=ho.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==Ip.Cache}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SO{constructor(e,n){this.aa=e,this.byteLength=n}ua(){return"metadata"in this.aa}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lw{constructor(e){this.serializer=e}Es(e){return An(this.serializer,e)}ds(e){return e.metadata.exists?kS(this.serializer,e.document,!1):Ee.newNoDocument(this.Es(e.metadata.name),this.As(e.metadata.readTime))}As(e){return qe(e)}}class AO{constructor(e,n,r){this.ca=e,this.localStore=n,this.serializer=r,this.queries=[],this.documents=[],this.collectionGroups=new Set,this.progress=cA(e)}la(e){this.progress.bytesLoaded+=e.byteLength;let n=this.progress.documentsLoaded;if(e.aa.namedQuery)this.queries.push(e.aa.namedQuery);else if(e.aa.documentMetadata){this.documents.push({metadata:e.aa.documentMetadata}),e.aa.documentMetadata.exists||++n;const r=se.fromString(e.aa.documentMetadata.name);this.collectionGroups.add(r.get(r.length-2))}else e.aa.document&&(this.documents[this.documents.length-1].document=e.aa.document,++n);return n!==this.progress.documentsLoaded?(this.progress.documentsLoaded=n,Object.assign({},this.progress)):null}ha(e){const n=new Map,r=new Lw(this.serializer);for(const i of e)if(i.metadata.queries){const s=r.Es(i.metadata.name);for(const o of i.metadata.queries){const a=(n.get(o)||ee()).add(s);n.set(o,a)}}return n}async complete(){const e=await ZV(this.localStore,new Lw(this.serializer),this.documents,this.ca.id),n=this.ha(this.documents);for(const r of this.queries)await eO(this.localStore,r,n.get(r.name));return this.progress.taskState="Success",{progress:this.progress,Pa:this.collectionGroups,Ia:e}}}function cA(t){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:t.totalDocuments,totalBytes:t.totalBytes}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hA{constructor(e){this.key=e}}class dA{constructor(e){this.key=e}}class fA{constructor(e,n){this.query=e,this.Ta=n,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=ee(),this.mutatedKeys=ee(),this.Aa=oS(e),this.Ra=new Ks(this.Aa)}get Va(){return this.Ta}ma(e,n){const r=n?n.fa:new Dw,i=n?n.Ra:this.Ra;let s=n?n.mutatedKeys:this.mutatedKeys,o=i,a=!1;const u=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,c=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((d,f)=>{const m=i.get(d),v=Rl(this.query,f)?f:null,S=!!m&&this.mutatedKeys.has(m.key),P=!!v&&(v.hasLocalMutations||this.mutatedKeys.has(v.key)&&v.hasCommittedMutations);let C=!1;m&&v?m.data.isEqual(v.data)?S!==P&&(r.track({type:3,doc:v}),C=!0):this.ga(m,v)||(r.track({type:2,doc:v}),C=!0,(u&&this.Aa(v,u)>0||c&&this.Aa(v,c)<0)&&(a=!0)):!m&&v?(r.track({type:0,doc:v}),C=!0):m&&!v&&(r.track({type:1,doc:m}),C=!0,(u||c)&&(a=!0)),C&&(v?(o=o.add(v),s=P?s.add(d):s.delete(d)):(o=o.delete(d),s=s.delete(d)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const d=this.query.limitType==="F"?o.last():o.first();o=o.delete(d.key),s=s.delete(d.key),r.track({type:1,doc:d})}return{Ra:o,fa:r,ns:a,mutatedKeys:s}}ga(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,r,i){const s=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((d,f)=>function(v,S){const P=C=>{switch(C){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return W()}};return P(v)-P(S)}(d.type,f.type)||this.Aa(d.doc,f.doc)),this.pa(r),i=i!=null&&i;const a=n&&!i?this.ya():[],u=this.da.size===0&&this.current&&!i?1:0,c=u!==this.Ea;return this.Ea=u,o.length!==0||c?{snapshot:new ho(this.query,e.Ra,s,o,e.mutatedKeys,u===0,c,!1,!!r&&r.resumeToken.approximateByteSize()>0),wa:a}:{wa:a}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new Dw,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(n=>this.Ta=this.Ta.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Ta=this.Ta.delete(n)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=ee(),this.Ra.forEach(r=>{this.Sa(r.key)&&(this.da=this.da.add(r.key))});const n=[];return e.forEach(r=>{this.da.has(r)||n.push(new dA(r))}),this.da.forEach(r=>{e.has(r)||n.push(new hA(r))}),n}ba(e){this.Ta=e.Ts,this.da=ee();const n=this.ma(e.documents);return this.applyChanges(n,!0)}Da(){return ho.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class RO{constructor(e,n,r){this.query=e,this.targetId=n,this.view=r}}class PO{constructor(e){this.key=e,this.va=!1}}class CO{constructor(e,n,r,i,s,o){this.localStore=e,this.remoteStore=n,this.eventManager=r,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new nr(a=>iS(a),Al),this.Ma=new Map,this.xa=new Set,this.Oa=new ye(G.comparator),this.Na=new Map,this.La=new eg,this.Ba={},this.ka=new Map,this.qa=Ji.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function kO(t,e,n=!0){const r=Rh(t);let i;const s=r.Fa.get(e);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.Da()):i=await pA(r,e,n,!0),i}async function xO(t,e){const n=Rh(t);await pA(n,e,!0,!1)}async function pA(t,e,n,r){const i=await lo(t.localStore,Et(e)),s=i.targetId,o=t.sharedClientState.addLocalQueryTarget(s,n);let a;return r&&(a=await mg(t,e,s,o==="current",i.resumeToken)),t.isPrimaryClient&&n&&Ah(t.remoteStore,i),a}async function mg(t,e,n,r,i){t.Ka=(f,m,v)=>async function(P,C,w,y){let E=C.view.ma(w);E.ns&&(E=await jc(P.localStore,C.query,!1).then(({documents:I})=>C.view.ma(I,E)));const x=y&&y.targetChanges.get(C.targetId),M=y&&y.targetMismatches.get(C.targetId)!=null,F=C.view.applyChanges(E,P.isPrimaryClient,x,M);return Tp(P,C.targetId,F.wa),F.snapshot}(t,f,m,v);const s=await jc(t.localStore,e,!0),o=new fA(e,s.Ts),a=o.ma(s.documents),u=kl.createSynthesizedTargetChangeForCurrentChange(n,r&&t.onlineState!=="Offline",i),c=o.applyChanges(a,t.isPrimaryClient,u);Tp(t,n,c.wa);const d=new RO(e,n,o);return t.Fa.set(e,d),t.Ma.has(n)?t.Ma.get(n).push(e):t.Ma.set(n,[e]),c.snapshot}async function bO(t,e,n){const r=$(t),i=r.Fa.get(e),s=r.Ma.get(i.targetId);if(s.length>1)return r.Ma.set(i.targetId,s.filter(o=>!Al(o,e))),void r.Fa.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await uo(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),n&&co(r.remoteStore,i.targetId),fo(r,i.targetId)}).catch(si)):(fo(r,i.targetId),await uo(r.localStore,i.targetId,!0))}async function NO(t,e){const n=$(t),r=n.Fa.get(e),i=n.Ma.get(r.targetId);n.isPrimaryClient&&i.length===1&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),co(n.remoteStore,r.targetId))}async function DO(t,e,n){const r=vg(t);try{const i=await function(o,a){const u=$(o),c=xe.now(),d=a.reduce((v,S)=>v.add(S.key),ee());let f,m;return u.persistence.runTransaction("Locally write mutations","readwrite",v=>{let S=Vt(),P=ee();return u.cs.getEntries(v,d).next(C=>{S=C,S.forEach((w,y)=>{y.isValidDocument()||(P=P.add(w))})}).next(()=>u.localDocuments.getOverlayedDocuments(v,S)).next(C=>{f=C;const w=[];for(const y of a){const E=sV(y,f.get(y.key).overlayedDocument);E!=null&&w.push(new rr(y.key,E,W0(E.value.mapValue),Re.exists(!0)))}return u.mutationQueue.addMutationBatch(v,c,w,a)}).next(C=>{m=C;const w=C.applyToLocalDocumentSet(f,P);return u.documentOverlayCache.saveOverlays(v,C.batchId,w)})}).then(()=>({batchId:m.batchId,changes:lS(f)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(i.batchId),function(o,a,u){let c=o.Ba[o.currentUser.toKey()];c||(c=new ye(X)),c=c.insert(a,u),o.Ba[o.currentUser.toKey()]=c}(r,i.batchId,n),await ir(r,i.changes),await Po(r.remoteStore)}catch(i){const s=ko(i,"Failed to persist write");n.reject(s)}}async function mA(t,e){const n=$(t);try{const r=await YV(n.localStore,e);e.targetChanges.forEach((i,s)=>{const o=n.Na.get(s);o&&(Q(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1),i.addedDocuments.size>0?o.va=!0:i.modifiedDocuments.size>0?Q(o.va):i.removedDocuments.size>0&&(Q(o.va),o.va=!1))}),await ir(n,r,e)}catch(r){await si(r)}}function Mw(t,e,n){const r=$(t);if(r.isPrimaryClient&&n===0||!r.isPrimaryClient&&n===1){const i=[];r.Fa.forEach((s,o)=>{const a=o.view.Z_(e);a.snapshot&&i.push(a.snapshot)}),function(o,a){const u=$(o);u.onlineState=a;let c=!1;u.queries.forEach((d,f)=>{for(const m of f.j_)m.Z_(a)&&(c=!0)}),c&&fg(u)}(r.eventManager,e),i.length&&r.Ca.d_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function VO(t,e,n){const r=$(t);r.sharedClientState.updateQueryState(e,"rejected",n);const i=r.Na.get(e),s=i&&i.key;if(s){let o=new ye(G.comparator);o=o.insert(s,Ee.newNoDocument(s,J.min()));const a=ee().add(s),u=new Cl(J.min(),new Map,new ye(X),o,a);await mA(r,u),r.Oa=r.Oa.remove(s),r.Na.delete(e),yg(r)}else await uo(r.localStore,e,!1).then(()=>fo(r,e,n)).catch(si)}async function OO(t,e){const n=$(t),r=e.batch.batchId;try{const i=await JV(n.localStore,e);_g(n,r,null),gg(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await ir(n,i)}catch(i){await si(i)}}async function LO(t,e,n){const r=$(t);try{const i=await function(o,a){const u=$(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",c=>{let d;return u.mutationQueue.lookupMutationBatch(c,a).next(f=>(Q(f!==null),d=f.keys(),u.mutationQueue.removeMutationBatch(c,f))).next(()=>u.mutationQueue.performConsistencyCheck(c)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(c,d,a)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(c,d)).next(()=>u.localDocuments.getDocuments(c,d))})}(r.localStore,e);_g(r,e,n),gg(r,e),r.sharedClientState.updateMutationState(e,"rejected",n),await ir(r,i)}catch(i){await si(i)}}async function MO(t,e){const n=$(t);li(n.remoteStore)||U("SyncEngine","The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{const r=await function(o){const a=$(o);return a.persistence.runTransaction("Get highest unacknowledged batch id","readonly",u=>a.mutationQueue.getHighestUnacknowledgedBatchId(u))}(n.localStore);if(r===-1)return void e.resolve();const i=n.ka.get(r)||[];i.push(e),n.ka.set(r,i)}catch(r){const i=ko(r,"Initialization of waitForPendingWrites() operation failed");e.reject(i)}}function gg(t,e){(t.ka.get(e)||[]).forEach(n=>{n.resolve()}),t.ka.delete(e)}function _g(t,e,n){const r=$(t);let i=r.Ba[r.currentUser.toKey()];if(i){const s=i.get(e);s&&(n?s.reject(n):s.resolve(),i=i.remove(e)),r.Ba[r.currentUser.toKey()]=i}}function fo(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const r of t.Ma.get(e))t.Fa.delete(r),n&&t.Ca.$a(r,n);t.Ma.delete(e),t.isPrimaryClient&&t.La.gr(e).forEach(r=>{t.La.containsKey(r)||gA(t,r)})}function gA(t,e){t.xa.delete(e.path.canonicalString());const n=t.Oa.get(e);n!==null&&(co(t.remoteStore,n),t.Oa=t.Oa.remove(e),t.Na.delete(n),yg(t))}function Tp(t,e,n){for(const r of n)r instanceof hA?(t.La.addReference(r.key,e),FO(t,r)):r instanceof dA?(U("SyncEngine","Document no longer in limbo: "+r.key),t.La.removeReference(r.key,e),t.La.containsKey(r.key)||gA(t,r.key)):W()}function FO(t,e){const n=e.key,r=n.path.canonicalString();t.Oa.get(n)||t.xa.has(r)||(U("SyncEngine","New document in limbo: "+n),t.xa.add(r),yg(t))}function yg(t){for(;t.xa.size>0&&t.Oa.size<t.maxConcurrentLimboResolutions;){const e=t.xa.values().next().value;t.xa.delete(e);const n=new G(se.fromString(e)),r=t.qa.next();t.Na.set(r,new PO(n)),t.Oa=t.Oa.insert(n,r),Ah(t.remoteStore,new zn(Et(To(n.path)),r,"TargetPurposeLimboResolution",Nt.oe))}}async function ir(t,e,n){const r=$(t),i=[],s=[],o=[];r.Fa.isEmpty()||(r.Fa.forEach((a,u)=>{o.push(r.Ka(u,e,n).then(c=>{var d;if((c||n)&&r.isPrimaryClient){const f=c?!c.fromCache:(d=n==null?void 0:n.targetChanges.get(u.targetId))===null||d===void 0?void 0:d.current;r.sharedClientState.updateQueryState(u.targetId,f?"current":"not-current")}if(c){i.push(c);const f=ig.Wi(u.targetId,c);s.push(f)}}))}),await Promise.all(o),r.Ca.d_(i),await async function(u,c){const d=$(u);try{await d.persistence.runTransaction("notifyLocalViewChanges","readwrite",f=>b.forEach(c,m=>b.forEach(m.$i,v=>d.persistence.referenceDelegate.addReference(f,m.targetId,v)).next(()=>b.forEach(m.Ui,v=>d.persistence.referenceDelegate.removeReference(f,m.targetId,v)))))}catch(f){if(!oi(f))throw f;U("LocalStore","Failed to update sequence numbers: "+f)}for(const f of c){const m=f.targetId;if(!f.fromCache){const v=d.os.get(m),S=v.snapshotVersion,P=v.withLastLimboFreeSnapshotVersion(S);d.os=d.os.insert(m,P)}}}(r.localStore,s))}async function UO(t,e){const n=$(t);if(!n.currentUser.isEqual(e)){U("SyncEngine","User change. New user:",e.toKey());const r=await JS(n.localStore,e);n.currentUser=e,function(s,o){s.ka.forEach(a=>{a.forEach(u=>{u.reject(new j(O.CANCELLED,o))})}),s.ka.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await ir(n,r.hs)}}function BO(t,e){const n=$(t),r=n.Na.get(e);if(r&&r.va)return ee().add(r.key);{let i=ee();const s=n.Ma.get(e);if(!s)return i;for(const o of s){const a=n.Fa.get(o);i=i.unionWith(a.view.Va)}return i}}async function jO(t,e){const n=$(t),r=await jc(n.localStore,e.query,!0),i=e.view.ba(r);return n.isPrimaryClient&&Tp(n,e.targetId,i.wa),i}async function zO(t,e){const n=$(t);return eA(n.localStore,e).then(r=>ir(n,r))}async function $O(t,e,n,r){const i=$(t),s=await function(a,u){const c=$(a),d=$(c.mutationQueue);return c.persistence.runTransaction("Lookup mutation documents","readonly",f=>d.Mn(f,u).next(m=>m?c.localDocuments.getDocuments(f,m):b.resolve(null)))}(i.localStore,e);s!==null?(n==="pending"?await Po(i.remoteStore):n==="acknowledged"||n==="rejected"?(_g(i,e,r||null),gg(i,e),function(a,u){$($(a).mutationQueue).On(u)}(i.localStore,e)):W(),await ir(i,s)):U("SyncEngine","Cannot apply mutation batch with id: "+e)}async function qO(t,e){const n=$(t);if(Rh(n),vg(n),e===!0&&n.Qa!==!0){const r=n.sharedClientState.getAllActiveQueryTargets(),i=await Fw(n,r.toArray());n.Qa=!0,await Ep(n.remoteStore,!0);for(const s of i)Ah(n.remoteStore,s)}else if(e===!1&&n.Qa!==!1){const r=[];let i=Promise.resolve();n.Ma.forEach((s,o)=>{n.sharedClientState.isLocalQueryTarget(o)?r.push(o):i=i.then(()=>(fo(n,o),uo(n.localStore,o,!0))),co(n.remoteStore,o)}),await i,await Fw(n,r),function(o){const a=$(o);a.Na.forEach((u,c)=>{co(a.remoteStore,c)}),a.La.pr(),a.Na=new Map,a.Oa=new ye(G.comparator)}(n),n.Qa=!1,await Ep(n.remoteStore,!1)}}async function Fw(t,e,n){const r=$(t),i=[],s=[];for(const o of e){let a;const u=r.Ma.get(o);if(u&&u.length!==0){a=await lo(r.localStore,Et(u[0]));for(const c of u){const d=r.Fa.get(c),f=await jO(r,d);f.snapshot&&s.push(f.snapshot)}}else{const c=await ZS(r.localStore,o);a=await lo(r.localStore,c),await mg(r,_A(c),o,!1,a.resumeToken)}i.push(a)}return r.Ca.d_(s),i}function _A(t){return tS(t.path,t.collectionGroup,t.orderBy,t.filters,t.limit,"F",t.startAt,t.endAt)}function GO(t){return function(n){return $($(n).persistence).Qi()}($(t).localStore)}async function KO(t,e,n,r){const i=$(t);if(i.Qa)return void U("SyncEngine","Ignoring unexpected query state notification.");const s=i.Ma.get(e);if(s&&s.length>0)switch(n){case"current":case"not-current":{const o=await eA(i.localStore,sS(s[0])),a=Cl.createSynthesizedRemoteEventForCurrentChange(e,n==="current",Me.EMPTY_BYTE_STRING);await ir(i,o,a);break}case"rejected":await uo(i.localStore,e,!0),fo(i,e,r);break;default:W()}}async function WO(t,e,n){const r=Rh(t);if(r.Qa){for(const i of e){if(r.Ma.has(i)&&r.sharedClientState.isActiveQueryTarget(i)){U("SyncEngine","Adding an already active target "+i);continue}const s=await ZS(r.localStore,i),o=await lo(r.localStore,s);await mg(r,_A(s),o.targetId,!1,o.resumeToken),Ah(r.remoteStore,o)}for(const i of n)r.Ma.has(i)&&await uo(r.localStore,i,!1).then(()=>{co(r.remoteStore,i),fo(r,i)}).catch(si)}}function Rh(t){const e=$(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=mA.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=BO.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=VO.bind(null,e),e.Ca.d_=IO.bind(null,e.eventManager),e.Ca.$a=TO.bind(null,e.eventManager),e}function vg(t){const e=$(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=OO.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=LO.bind(null,e),e}function HO(t,e,n){const r=$(t);(async function(s,o,a){try{const u=await o.getMetadata();if(await function(v,S){const P=$(v),C=qe(S.createTime);return P.persistence.runTransaction("hasNewerBundle","readonly",w=>P.Gr.getBundleMetadata(w,S.id)).then(w=>!!w&&w.createTime.compareTo(C)>=0)}(s.localStore,u))return await o.close(),a._completeWith(function(v){return{taskState:"Success",documentsLoaded:v.totalDocuments,bytesLoaded:v.totalBytes,totalDocuments:v.totalDocuments,totalBytes:v.totalBytes}}(u)),Promise.resolve(new Set);a._updateProgress(cA(u));const c=new AO(u,s.localStore,o.serializer);let d=await o.Ua();for(;d;){const m=await c.la(d);m&&a._updateProgress(m),d=await o.Ua()}const f=await c.complete();return await ir(s,f.Ia,void 0),await function(v,S){const P=$(v);return P.persistence.runTransaction("Save bundle","readwrite",C=>P.Gr.saveBundleMetadata(C,S))}(s.localStore,u),a._completeWith(f.progress),Promise.resolve(f.Pa)}catch(u){return en("SyncEngine",`Loading bundle failed with ${u}`),a._failWith(u),Promise.resolve(new Set)}})(r,e,n).then(i=>{r.sharedClientState.notifyBundleLoaded(i)})}class Jr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=xl(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,n){return null}Ha(e,n){return null}za(e){return QS(this.persistence,new HS,e.initialUser,this.serializer)}Ga(e){return new tg(Sh.Zr,this.serializer)}Wa(e){return new nA}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Jr.provider={build:()=>new Jr};class QO extends Jr{constructor(e){super(),this.cacheSizeBytes=e}ja(e,n){Q(this.persistence.referenceDelegate instanceof Bc);const r=this.persistence.referenceDelegate.garbageCollector;return new $S(r,e.asyncQueue,n)}Ga(e){const n=this.cacheSizeBytes!==void 0?yt.withCacheSize(this.cacheSizeBytes):yt.DEFAULT;return new tg(r=>Bc.Zr(r,n),this.serializer)}}class wg extends Jr{constructor(e,n,r){super(),this.Ja=e,this.cacheSizeBytes=n,this.forceOwnership=r,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Ja.initialize(this,e),await vg(this.Ja.syncEngine),await Po(this.Ja.remoteStore),await this.persistence.yi(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}za(e){return QS(this.persistence,new HS,e.initialUser,this.serializer)}ja(e,n){const r=this.persistence.referenceDelegate.garbageCollector;return new $S(r,e.asyncQueue,n)}Ha(e,n){const r=new _D(n,this.persistence);return new gD(e.asyncQueue,r)}Ga(e){const n=rg(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),r=this.cacheSizeBytes!==void 0?yt.withCacheSize(this.cacheSizeBytes):yt.DEFAULT;return new ng(this.synchronizeTabs,n,e.clientId,r,e.asyncQueue,rA(),Yu(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Wa(e){return new nA}}class yA extends wg{constructor(e,n){super(e,n,!1),this.Ja=e,this.cacheSizeBytes=n,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const n=this.Ja.syncEngine;this.sharedClientState instanceof Kd&&(this.sharedClientState.syncEngine={no:$O.bind(null,n),ro:KO.bind(null,n),io:WO.bind(null,n),Qi:GO.bind(null,n),eo:zO.bind(null,n)},await this.sharedClientState.start()),await this.persistence.yi(async r=>{await qO(this.Ja.syncEngine,r),this.gcScheduler&&(r&&!this.gcScheduler.started?this.gcScheduler.start():r||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(r&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():r||this.indexBackfillerScheduler.stop())})}Wa(e){const n=rA();if(!Kd.D(n))throw new j(O.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const r=rg(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new Kd(n,e.asyncQueue,r,e.clientId,e.initialUser)}}class Yr{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Mw(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=UO.bind(null,this.syncEngine),await Ep(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new EO}()}createDatastore(e){const n=xl(e.databaseInfo.databaseId),r=function(s){return new iO(s)}(e.databaseInfo);return function(s,o,a,u){return new aO(s,o,a,u)}(e.authCredentials,e.appCheckCredentials,r,n)}createRemoteStore(e){return function(r,i,s,o,a){return new uO(r,i,s,o,a)}(this.localStore,this.datastore,e.asyncQueue,n=>Mw(this.syncEngine,n,0),function(){return bw.D()?new bw:new tO}())}createSyncEngine(e,n){return function(i,s,o,a,u,c,d){const f=new CO(i,s,o,a,u,c);return d&&(f.Qa=!0),f}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(i){const s=$(i);U("RemoteStore","RemoteStore shutting down."),s.L_.add(5),await Ro(s),s.k_.shutdown(),s.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}Yr.provider={build:()=>new Yr};function Uw(t,e=10240){let n=0;return{async read(){if(n<t.byteLength){const r={value:t.slice(n,n+e),done:!1};return n+=e,r}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ph{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):ze("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JO{constructor(e,n){this.Xa=e,this.serializer=n,this.metadata=new it,this.buffer=new Uint8Array,this.eu=function(){return new TextDecoder("utf-8")}(),this.tu().then(r=>{r&&r.ua()?this.metadata.resolve(r.aa.metadata):this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is
             ${JSON.stringify(r==null?void 0:r.aa)}`))},r=>this.metadata.reject(r))}close(){return this.Xa.cancel()}async getMetadata(){return this.metadata.promise}async Ua(){return await this.getMetadata(),this.tu()}async tu(){const e=await this.nu();if(e===null)return null;const n=this.eu.decode(e),r=Number(n);isNaN(r)&&this.ru(`length string (${n}) is not valid number`);const i=await this.iu(r);return new SO(JSON.parse(i),e.length+r)}su(){return this.buffer.findIndex(e=>e===123)}async nu(){for(;this.su()<0&&!await this.ou(););if(this.buffer.length===0)return null;const e=this.su();e<0&&this.ru("Reached the end of bundle when a length string is expected.");const n=this.buffer.slice(0,e);return this.buffer=this.buffer.slice(e),n}async iu(e){for(;this.buffer.length<e;)await this.ou()&&this.ru("Reached the end of bundle when more is expected.");const n=this.eu.decode(this.buffer.slice(0,e));return this.buffer=this.buffer.slice(e),n}ru(e){throw this.Xa.cancel(),new Error(`Invalid bundle format: ${e}`)}async ou(){const e=await this.Xa.read();if(!e.done){const n=new Uint8Array(this.buffer.length+e.value.length);n.set(this.buffer),n.set(e.value,this.buffer.length),this.buffer=n}return e.done}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YO{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new j(O.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const n=await async function(i,s){const o=$(i),a={documents:s.map(f=>al(o.serializer,f))},u=await o.Lo("BatchGetDocuments",o.serializer.databaseId,se.emptyPath(),a,s.length),c=new Map;u.forEach(f=>{const m=pV(o.serializer,f);c.set(m.key.toString(),m)});const d=[];return s.forEach(f=>{const m=c.get(f.toString());Q(!!m),d.push(m)}),d}(this.datastore,e);return n.forEach(r=>this.recordVersion(r)),n}set(e,n){this.write(n.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,n){try{this.write(n.toMutation(e,this.preconditionForUpdate(e)))}catch(r){this.lastTransactionError=r}this.writtenDocs.add(e.toString())}delete(e){this.write(new Ao(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach(n=>{e.delete(n.key.toString())}),e.forEach((n,r)=>{const i=G.fromPath(r);this.mutations.push(new Gm(i,this.precondition(i)))}),await async function(r,i){const s=$(r),o={writes:i.map(a=>ll(s.serializer,a))};await s.Mo("Commit",s.serializer.databaseId,se.emptyPath(),o)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let n;if(e.isFoundDocument())n=e.version;else{if(!e.isNoDocument())throw W();n=J.min()}const r=this.readVersions.get(e.key.toString());if(r){if(!n.isEqual(r))throw new j(O.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),n)}precondition(e){const n=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&n?n.isEqual(J.min())?Re.exists(!1):Re.updateTime(n):Re.none()}preconditionForUpdate(e){const n=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&n){if(n.isEqual(J.min()))throw new j(O.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return Re.updateTime(n)}return Re.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XO{constructor(e,n,r,i,s){this.asyncQueue=e,this.datastore=n,this.options=r,this.updateFunction=i,this.deferred=s,this._u=r.maxAttempts,this.t_=new og(this.asyncQueue,"transaction_retry")}au(){this._u-=1,this.uu()}uu(){this.t_.Go(async()=>{const e=new YO(this.datastore),n=this.cu(e);n&&n.then(r=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(r)}).catch(i=>{this.lu(i)}))}).catch(r=>{this.lu(r)})})}cu(e){try{const n=this.updateFunction(e);return!Tl(n)&&n.catch&&n.then?n:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(n){return this.deferred.reject(n),null}}lu(e){this._u>0&&this.hu(e)?(this._u-=1,this.asyncQueue.enqueueAndForget(()=>(this.uu(),Promise.resolve()))):this.deferred.reject(e)}hu(e){if(e.name==="FirebaseError"){const n=e.code;return n==="aborted"||n==="failed-precondition"||n==="already-exists"||!vS(n)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ZO{constructor(e,n,r,i,s){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=r,this.databaseInfo=i,this.user=nt.UNAUTHENTICATED,this.clientId=x0.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(r,async o=>{U("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(r,o=>(U("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new it;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const r=ko(n,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function Hd(t,e){t.asyncQueue.verifyOperationInProgress(),U("FirestoreClient","Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let r=n.initialUser;t.setCredentialChangeListener(async i=>{r.isEqual(i)||(await JS(e.localStore,i),r=i)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function Bw(t,e){t.asyncQueue.verifyOperationInProgress();const n=await Eg(t);U("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(r=>Nw(e.remoteStore,r)),t.setAppCheckTokenChangeListener((r,i)=>Nw(e.remoteStore,i)),t._onlineComponents=e}async function Eg(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){U("FirestoreClient","Using user provided OfflineComponentProvider");try{await Hd(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(i){return i.name==="FirebaseError"?i.code===O.FAILED_PRECONDITION||i.code===O.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(n))throw n;en("Error using user provided cache. Falling back to memory cache: "+n),await Hd(t,new Jr)}}else U("FirestoreClient","Using default OfflineComponentProvider"),await Hd(t,new Jr);return t._offlineComponents}async function Ch(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(U("FirestoreClient","Using user provided OnlineComponentProvider"),await Bw(t,t._uninitializedComponentsProvider._online)):(U("FirestoreClient","Using default OnlineComponentProvider"),await Bw(t,new Yr))),t._onlineComponents}function vA(t){return Eg(t).then(e=>e.persistence)}function xo(t){return Eg(t).then(e=>e.localStore)}function wA(t){return Ch(t).then(e=>e.remoteStore)}function Ig(t){return Ch(t).then(e=>e.syncEngine)}function EA(t){return Ch(t).then(e=>e.datastore)}async function po(t){const e=await Ch(t),n=e.eventManager;return n.onListen=kO.bind(null,e.syncEngine),n.onUnlisten=bO.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=xO.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=NO.bind(null,e.syncEngine),n}function eL(t){return t.asyncQueue.enqueue(async()=>{const e=await vA(t),n=await wA(t);return e.setNetworkEnabled(!0),function(i){const s=$(i);return s.L_.delete(0),bl(s)}(n)})}function tL(t){return t.asyncQueue.enqueue(async()=>{const e=await vA(t),n=await wA(t);return e.setNetworkEnabled(!1),async function(i){const s=$(i);s.L_.add(0),await Ro(s),s.q_.set("Offline")}(n)})}function nL(t,e){const n=new it;return t.asyncQueue.enqueueAndForget(async()=>async function(i,s,o){try{const a=await function(c,d){const f=$(c);return f.persistence.runTransaction("read document","readonly",m=>f.localDocuments.getDocument(m,d))}(i,s);a.isFoundDocument()?o.resolve(a):a.isNoDocument()?o.resolve(null):o.reject(new j(O.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(a){const u=ko(a,`Failed to get document '${s} from cache`);o.reject(u)}}(await xo(t),e,n)),n.promise}function IA(t,e,n={}){const r=new it;return t.asyncQueue.enqueueAndForget(async()=>function(s,o,a,u,c){const d=new Ph({next:m=>{d.Za(),o.enqueueAndForget(()=>dg(s,f));const v=m.docs.has(a);!v&&m.fromCache?c.reject(new j(O.UNAVAILABLE,"Failed to get document because the client is offline.")):v&&m.fromCache&&u&&u.source==="server"?c.reject(new j(O.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):c.resolve(m)},error:m=>c.reject(m)}),f=new pg(To(a.path),d,{includeMetadataChanges:!0,_a:!0});return hg(s,f)}(await po(t),t.asyncQueue,e,n,r)),r.promise}function rL(t,e){const n=new it;return t.asyncQueue.enqueueAndForget(async()=>async function(i,s,o){try{const a=await jc(i,s,!0),u=new fA(s,a.Ts),c=u.ma(a.documents),d=u.applyChanges(c,!1);o.resolve(d.snapshot)}catch(a){const u=ko(a,`Failed to execute query '${s} against cache`);o.reject(u)}}(await xo(t),e,n)),n.promise}function TA(t,e,n={}){const r=new it;return t.asyncQueue.enqueueAndForget(async()=>function(s,o,a,u,c){const d=new Ph({next:m=>{d.Za(),o.enqueueAndForget(()=>dg(s,f)),m.fromCache&&u.source==="server"?c.reject(new j(O.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):c.resolve(m)},error:m=>c.reject(m)}),f=new pg(a,d,{includeMetadataChanges:!0,_a:!0});return hg(s,f)}(await po(t),t.asyncQueue,e,n,r)),r.promise}function iL(t,e,n){const r=new it;return t.asyncQueue.enqueueAndForget(async()=>{try{const i=await EA(t);r.resolve(async function(o,a,u){var c;const d=$(o),{request:f,ut:m,parent:v}=bS(d.serializer,nS(a),u);d.connection.Fo||delete f.parent;const S=(await d.Lo("RunAggregationQuery",d.serializer.databaseId,v,f,1)).filter(C=>!!C.result);Q(S.length===1);const P=(c=S[0].result)===null||c===void 0?void 0:c.aggregateFields;return Object.keys(P).reduce((C,w)=>(C[m[w]]=P[w],C),{})}(i,e,n))}catch(i){r.reject(i)}}),r.promise}function sL(t,e){const n=new Ph(e);return t.asyncQueue.enqueueAndForget(async()=>function(i,s){$(i).Y_.add(s),s.next()}(await po(t),n)),()=>{n.Za(),t.asyncQueue.enqueueAndForget(async()=>function(i,s){$(i).Y_.delete(s)}(await po(t),n))}}function oL(t,e,n,r){const i=function(o,a){let u;return u=typeof o=="string"?ES().encode(o):o,function(d,f){return new JO(d,f)}(function(d,f){if(d instanceof Uint8Array)return Uw(d,f);if(d instanceof ArrayBuffer)return Uw(new Uint8Array(d),f);if(d instanceof ReadableStream)return d.getReader();throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")}(u),a)}(n,xl(e));t.asyncQueue.enqueueAndForget(async()=>{HO(await Ig(t),i,r)})}function aL(t,e){return t.asyncQueue.enqueue(async()=>function(r,i){const s=$(r);return s.persistence.runTransaction("Get named query","readonly",o=>s.Gr.getNamedQuery(o,i))}(await xo(t),e))}function lL(t,e){return t.asyncQueue.enqueue(async()=>async function(r,i){const s=$(r),o=s.indexManager,a=[];return s.persistence.runTransaction("Configure indexes","readwrite",u=>o.getFieldIndexes(u).next(c=>function(f,m,v,S,P){f=[...f],m=[...m],f.sort(v),m.sort(v);const C=f.length,w=m.length;let y=0,E=0;for(;y<w&&E<C;){const x=v(f[E],m[y]);x<0?P(f[E++]):x>0?S(m[y++]):(y++,E++)}for(;y<w;)S(m[y++]);for(;E<C;)P(f[E++])}(c,i,dD,d=>{a.push(o.addFieldIndex(u,d))},d=>{a.push(o.deleteFieldIndex(u,d))})).next(()=>b.waitFor(a)))}(await xo(t),e))}function uL(t,e){return t.asyncQueue.enqueue(async()=>function(r,i){$(r).ss.zi=i}(await xo(t),e))}function cL(t){return t.asyncQueue.enqueue(async()=>function(n){const r=$(n),i=r.indexManager;return r.persistence.runTransaction("Delete All Indexes","readwrite",s=>i.deleteAllFieldIndexes(s))}(await xo(t)))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function SA(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jw=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tg(t,e,n){if(!n)throw new j(O.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function hL(t,e,n,r){if(e===!0&&r===!0)throw new j(O.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function zw(t){if(!G.isDocumentKey(t))throw new j(O.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function $w(t){if(G.isDocumentKey(t))throw new j(O.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function kh(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":W()}function ne(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new j(O.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=kh(t);throw new j(O.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}function AA(t,e){if(e<=0)throw new j(O.INVALID_ARGUMENT,`Function ${t}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qw{constructor(e){var n,r;if(e.host===void 0){if(e.ssl!==void 0)throw new j(O.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new j(O.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}hL("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=SA((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new j(O.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new j(O.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new j(O.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Nl{constructor(e,n,r,i){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new qw({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new j(O.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new j(O.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new qw(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new iD;switch(r.type){case"firstParty":return new lD(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new j(O.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=jw.get(n);r&&(U("ComponentProvider","Removing Datastore"),jw.delete(n),r.terminate())}(this),Promise.resolve()}}function dL(t,e,n,r={}){var i;const s=(t=ne(t,Nl))._getSettings(),o=`${e}:${n}`;if(s.host!=="firestore.googleapis.com"&&s.host!==o&&en("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},s),{host:o,ssl:!1})),r.mockUserToken){let a,u;if(typeof r.mockUserToken=="string")a=r.mockUserToken,u=nt.MOCK_USER;else{a=DT(r.mockUserToken,(i=t._app)===null||i===void 0?void 0:i.options.projectId);const c=r.mockUserToken.sub||r.mockUserToken.user_id;if(!c)throw new j(O.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");u=new nt(c)}t._authCredentials=new sD(new C0(a,u))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ht{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new ht(this.firestore,e,this._query)}}class Ge{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Rn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Ge(this.firestore,e,this._key)}}class Rn extends ht{constructor(e,n,r){super(e,n,To(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Ge(this.firestore,null,new G(e))}withConverter(e){return new Rn(this.firestore,e,this._path)}}function LM(t,e,...n){if(t=ce(t),Tg("collection","path",e),t instanceof Nl){const r=se.fromString(e,...n);return $w(r),new Rn(t,null,r)}{if(!(t instanceof Ge||t instanceof Rn))throw new j(O.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(se.fromString(e,...n));return $w(r),new Rn(t.firestore,null,r)}}function MM(t,e){if(t=ne(t,Nl),Tg("collectionGroup","collection id",e),e.indexOf("/")>=0)throw new j(O.INVALID_ARGUMENT,`Invalid collection ID '${e}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new ht(t,null,function(r){return new tr(se.emptyPath(),r)}(e))}function Xu(t,e,...n){if(t=ce(t),arguments.length===1&&(e=x0.newId()),Tg("doc","path",e),t instanceof Nl){const r=se.fromString(e,...n);return zw(r),new Ge(t,null,new G(r))}{if(!(t instanceof Ge||t instanceof Rn))throw new j(O.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(se.fromString(e,...n));return zw(r),new Ge(t.firestore,t instanceof Rn?t.converter:null,new G(r))}}function FM(t,e){return t=ce(t),e=ce(e),(t instanceof Ge||t instanceof Rn)&&(e instanceof Ge||e instanceof Rn)&&t.firestore===e.firestore&&t.path===e.path&&t.converter===e.converter}function RA(t,e){return t=ce(t),e=ce(e),t instanceof ht&&e instanceof ht&&t.firestore===e.firestore&&Al(t._query,e._query)&&t.converter===e.converter}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gw{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new og(this,"async_queue_retry"),this.Vu=()=>{const r=Yu();r&&U("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const n=Yu();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const n=Yu();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const n=new it;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!oi(e))throw e;U("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const n=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const i=function(o){let a=o.message||"";return o.stack&&(a=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),a}(r);throw ze("INTERNAL UNHANDLED ERROR: ",i),r}).then(r=>(this.du=!1,r))));return this.mu=n,n}enqueueAfterDelay(e,n,r){this.fu(),this.Ru.indexOf(e)>-1&&(n=0);const i=cg.createAndSchedule(this,e,n,r,s=>this.yu(s));return this.Tu.push(i),i}fu(){this.Eu&&W()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const n of this.Tu)if(n.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((n,r)=>n.targetTimeMs-r.targetTimeMs);for(const n of this.Tu)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const n=this.Tu.indexOf(e);this.Tu.splice(n,1)}}function Sp(t){return function(n,r){if(typeof n!="object"||n===null)return!1;const i=n;for(const s of r)if(s in i&&typeof i[s]=="function")return!0;return!1}(t,["next","error","complete"])}class fL{constructor(){this._progressObserver={},this._taskCompletionResolver=new it,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(e,n,r){this._progressObserver={next:e,error:n,complete:r}}catch(e){return this._taskCompletionResolver.promise.catch(e)}then(e,n){return this._taskCompletionResolver.promise.then(e,n)}_completeWith(e){this._updateProgress(e),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(e)}_failWith(e){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(e),this._taskCompletionResolver.reject(e)}_updateProgress(e){this._lastProgress=e,this._progressObserver.next&&this._progressObserver.next(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const UM=-1;class ge extends Nl{constructor(e,n,r,i){super(e,n,r,i),this.type="firestore",this._queue=new Gw,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Gw(e),this._firestoreClient=void 0,await e}}}function BM(t,e,n){n||(n="(default)");const r=rs(t,"firestore");if(r.isInitialized(n)){const i=r.getImmediate({identifier:n}),s=r.getOptions(n);if(zr(s,e))return i;throw new j(O.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new j(O.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new j(O.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return r.initialize({options:e,instanceIdentifier:n})}function pL(t,e){const n=typeof t=="object"?t:hh(),r=typeof t=="string"?t:e||"(default)",i=rs(n,"firestore").getImmediate({identifier:r});if(!i._initialized){const s=xT("firestore");s&&dL(i,...s)}return i}function Ne(t){if(t._terminated)throw new j(O.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||PA(t),t._firestoreClient}function PA(t){var e,n,r;const i=t._freezeSettings(),s=function(a,u,c,d){return new FD(a,u,c,d.host,d.ssl,d.experimentalForceLongPolling,d.experimentalAutoDetectLongPolling,SA(d.experimentalLongPollingOptions),d.useFetchStreams)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,i);t._componentsProvider||!((n=i.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((r=i.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(t._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),t._firestoreClient=new ZO(t._authCredentials,t._appCheckCredentials,t._queue,s,t._componentsProvider&&function(a){const u=a==null?void 0:a._online.build();return{_offline:a==null?void 0:a._offline.build(u),_online:u}}(t._componentsProvider))}function jM(t,e){en("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const n=t._freezeSettings();return CA(t,Yr.provider,{build:r=>new wg(r,n.cacheSizeBytes,e==null?void 0:e.forceOwnership)}),Promise.resolve()}async function zM(t){en("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const e=t._freezeSettings();CA(t,Yr.provider,{build:n=>new yA(n,e.cacheSizeBytes)})}function CA(t,e,n){if((t=ne(t,ge))._firestoreClient||t._terminated)throw new j(O.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(t._componentsProvider||t._getSettings().localCache)throw new j(O.FAILED_PRECONDITION,"SDK cache is already specified.");t._componentsProvider={_online:e,_offline:n},PA(t)}function $M(t){if(t._initialized&&!t._terminated)throw new j(O.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");const e=new it;return t._queue.enqueueAndForgetEvenWhileRestricted(async()=>{try{await async function(r){if(!Sn.D())return Promise.resolve();const i=r+"main";await Sn.delete(i)}(rg(t._databaseId,t._persistenceKey)),e.resolve()}catch(n){e.reject(n)}}),e.promise}function qM(t){return function(n){const r=new it;return n.asyncQueue.enqueueAndForget(async()=>MO(await Ig(n),r)),r.promise}(Ne(t=ne(t,ge)))}function GM(t){return eL(Ne(t=ne(t,ge)))}function KM(t){return tL(Ne(t=ne(t,ge)))}function WM(t){return FT(t.app,"firestore",t._databaseId.database),t._delete()}function HM(t,e){const n=Ne(t=ne(t,ge)),r=new fL;return oL(n,t._databaseId,e,r),r}function QM(t,e){return aL(Ne(t=ne(t,ge)),e).then(n=>n?new ht(t,null,n.query):null)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ul{constructor(e="count",n){this._internalFieldPath=n,this.type="AggregateField",this.aggregateType=e}}class mL{constructor(e,n,r){this._userDataWriter=n,this._data=r,this.type="AggregateQuerySnapshot",this.query=e}data(){return this._userDataWriter.convertObjectMap(this._data)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yi{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Yi(Me.fromBase64String(e))}catch(n){throw new j(O.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Yi(Me.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ss{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new j(O.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ae(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function JM(){return new ss("__name__")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class os{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sg{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new j(O.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new j(O.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return X(this._lat,e._lat)||X(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xh{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gL=/^__.*__$/;class _L{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return this.fieldMask!==null?new rr(e,this.data,this.fieldMask,n,this.fieldTransforms):new So(e,this.data,n,this.fieldTransforms)}}class kA{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return new rr(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function xA(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw W()}}class bh{constructor(e,n,r,i,s,o){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.vu(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new bh(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.Fu({path:r,xu:!1});return i.Ou(e),i}Nu(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.Fu({path:r,xu:!1});return i.vu(),i}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return Gc(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(xA(this.Cu)&&gL.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class yL{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||xl(e)}Qu(e,n,r,i=!1){return new bh({Cu:e,methodName:n,qu:r,path:Ae.emptyPath(),xu:!1,ku:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function as(t){const e=t._freezeSettings(),n=xl(t._databaseId);return new yL(t._databaseId,!!e.ignoreUndefinedProperties,n)}function Nh(t,e,n,r,i,s={}){const o=t.Qu(s.merge||s.mergeFields?2:0,e,n,i);bg("Data must be an object, but it was:",o,r);const a=DA(r,o);let u,c;if(s.merge)u=new Dt(o.fieldMask),c=o.fieldTransforms;else if(s.mergeFields){const d=[];for(const f of s.mergeFields){const m=cl(e,f,n);if(!o.contains(m))throw new j(O.INVALID_ARGUMENT,`Field '${m}' is specified in your field mask but missing from your input data.`);OA(d,m)||d.push(m)}u=new Dt(d),c=o.fieldTransforms.filter(f=>u.covers(f.field))}else u=null,c=o.fieldTransforms;return new _L(new lt(a),u,c)}class Dl extends os{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Dl}}function bA(t,e,n){return new bh({Cu:3,qu:e.settings.qu,methodName:t._methodName,xu:n},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class Ag extends os{_toFieldTransform(e){return new Pl(e.path,new so)}isEqual(e){return e instanceof Ag}}class Rg extends os{constructor(e,n){super(e),this.Ku=n}_toFieldTransform(e){const n=bA(this,e,!0),r=this.Ku.map(s=>ls(s,n)),i=new Ki(r);return new Pl(e.path,i)}isEqual(e){return e instanceof Rg&&zr(this.Ku,e.Ku)}}class Pg extends os{constructor(e,n){super(e),this.Ku=n}_toFieldTransform(e){const n=bA(this,e,!0),r=this.Ku.map(s=>ls(s,n)),i=new Wi(r);return new Pl(e.path,i)}isEqual(e){return e instanceof Pg&&zr(this.Ku,e.Ku)}}class Cg extends os{constructor(e,n){super(e),this.$u=n}_toFieldTransform(e){const n=new oo(e.serializer,hS(e.serializer,this.$u));return new Pl(e.path,n)}isEqual(e){return e instanceof Cg&&this.$u===e.$u}}function kg(t,e,n,r){const i=t.Qu(1,e,n);bg("Data must be an object, but it was:",i,r);const s=[],o=lt.empty();ai(r,(u,c)=>{const d=Dh(e,u,n);c=ce(c);const f=i.Nu(d);if(c instanceof Dl)s.push(d);else{const m=ls(c,f);m!=null&&(s.push(d),o.set(d,m))}});const a=new Dt(s);return new kA(o,a,i.fieldTransforms)}function xg(t,e,n,r,i,s){const o=t.Qu(1,e,n),a=[cl(e,r,n)],u=[i];if(s.length%2!=0)throw new j(O.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let m=0;m<s.length;m+=2)a.push(cl(e,s[m])),u.push(s[m+1]);const c=[],d=lt.empty();for(let m=a.length-1;m>=0;--m)if(!OA(c,a[m])){const v=a[m];let S=u[m];S=ce(S);const P=o.Nu(v);if(S instanceof Dl)c.push(v);else{const C=ls(S,P);C!=null&&(c.push(v),d.set(v,C))}}const f=new Dt(c);return new kA(d,f,o.fieldTransforms)}function NA(t,e,n,r=!1){return ls(n,t.Qu(r?4:3,e))}function ls(t,e){if(VA(t=ce(t)))return bg("Unsupported field value:",e,t),DA(t,e);if(t instanceof os)return function(r,i){if(!xA(i.Cu))throw i.Bu(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Bu(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(r,i){const s=[];let o=0;for(const a of r){let u=ls(a,i.Lu(o));u==null&&(u={nullValue:"NULL_VALUE"}),s.push(u),o++}return{arrayValue:{values:s}}}(t,e)}return function(r,i){if((r=ce(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return hS(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=xe.fromDate(r);return{timestampValue:ao(i.serializer,s)}}if(r instanceof xe){const s=new xe(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:ao(i.serializer,s)}}if(r instanceof Sg)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Yi)return{bytesValue:SS(i.serializer,r._byteString)};if(r instanceof Ge){const s=i.databaseId,o=r.firestore._databaseId;if(!o.isEqual(s))throw i.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:Jm(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof xh)return function(o,a){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(u=>{if(typeof u!="number")throw a.Bu("VectorValues must only contain numeric values.");return qm(a.serializer,u)})}}}}}}(r,i);throw i.Bu(`Unsupported field value: ${kh(r)}`)}(t,e)}function DA(t,e){const n={};return $0(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ai(t,(r,i)=>{const s=ls(i,e.Mu(r));s!=null&&(n[r]=s)}),{mapValue:{fields:n}}}function VA(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof xe||t instanceof Sg||t instanceof Yi||t instanceof Ge||t instanceof os||t instanceof xh)}function bg(t,e,n){if(!VA(n)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(n)){const r=kh(n);throw r==="an object"?e.Bu(t+" a custom object"):e.Bu(t+" "+r)}}function cl(t,e,n){if((e=ce(e))instanceof ss)return e._internalPath;if(typeof e=="string")return Dh(t,e);throw Gc("Field path arguments must be of type string or ",t,!1,void 0,n)}const vL=new RegExp("[~\\*/\\[\\]]");function Dh(t,e,n){if(e.search(vL)>=0)throw Gc(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new ss(...e.split("."))._internalPath}catch{throw Gc(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function Gc(t,e,n,r,i){const s=r&&!r.isEmpty(),o=i!==void 0;let a=`Function ${e}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let u="";return(s||o)&&(u+=" (found",s&&(u+=` in field ${r}`),o&&(u+=` in document ${i}`),u+=")"),new j(O.INVALID_ARGUMENT,a+t+u)}function OA(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hl{constructor(e,n,r,i,s){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new Ge(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new wL(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(Vh("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class wL extends hl{data(){return super.data()}}function Vh(t,e){return typeof e=="string"?Dh(t,e):e instanceof ss?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function LA(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new j(O.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Ng{}class Vl extends Ng{}function YM(t,e,...n){let r=[];e instanceof Ng&&r.push(e),r=r.concat(n),function(s){const o=s.filter(u=>u instanceof bo).length,a=s.filter(u=>u instanceof Ol).length;if(o>1||o>0&&a>0)throw new j(O.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const i of r)t=i._apply(t);return t}class Ol extends Vl{constructor(e,n,r){super(),this._field=e,this._op=n,this._value=r,this.type="where"}static _create(e,n,r){return new Ol(e,n,r)}_apply(e){const n=this._parse(e);return FA(e._query,n),new ht(e.firestore,e.converter,dp(e._query,n))}_parse(e){const n=as(e.firestore);return function(s,o,a,u,c,d,f){let m;if(c.isKeyField()){if(d==="array-contains"||d==="array-contains-any")throw new j(O.INVALID_ARGUMENT,`Invalid Query. You can't perform '${d}' queries on documentId().`);if(d==="in"||d==="not-in"){Ww(f,d);const v=[];for(const S of f)v.push(Kw(u,s,S));m={arrayValue:{values:v}}}else m=Kw(u,s,f)}else d!=="in"&&d!=="not-in"&&d!=="array-contains-any"||Ww(f,d),m=NA(a,o,f,d==="in"||d==="not-in");return oe.create(c,d,m)}(e._query,"where",n,e.firestore._databaseId,this._field,this._op,this._value)}}function XM(t,e,n){const r=e,i=Vh("where",t);return Ol._create(i,r,n)}class bo extends Ng{constructor(e,n){super(),this.type=e,this._queryConstraints=n}static _create(e,n){return new bo(e,n)}_parse(e){const n=this._queryConstraints.map(r=>r._parse(e)).filter(r=>r.getFilters().length>0);return n.length===1?n[0]:he.create(n,this._getOperator())}_apply(e){const n=this._parse(e);return n.getFilters().length===0?e:(function(i,s){let o=i;const a=s.getFlattenedFilters();for(const u of a)FA(o,u),o=dp(o,u)}(e._query,n),new ht(e.firestore,e.converter,dp(e._query,n)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function ZM(...t){return t.forEach(e=>UA("or",e)),bo._create("or",t)}function eF(...t){return t.forEach(e=>UA("and",e)),bo._create("and",t)}class Dg extends Vl{constructor(e,n){super(),this._field=e,this._direction=n,this.type="orderBy"}static _create(e,n){return new Dg(e,n)}_apply(e){const n=function(i,s,o){if(i.startAt!==null)throw new j(O.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new j(O.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new ol(s,o)}(e._query,this._field,this._direction);return new ht(e.firestore,e.converter,function(i,s){const o=i.explicitOrderBy.concat([s]);return new tr(i.path,i.collectionGroup,o,i.filters.slice(),i.limit,i.limitType,i.startAt,i.endAt)}(e._query,n))}}function tF(t,e="asc"){const n=e,r=Vh("orderBy",t);return Dg._create(r,n)}class Oh extends Vl{constructor(e,n,r){super(),this.type=e,this._limit=n,this._limitType=r}static _create(e,n,r){return new Oh(e,n,r)}_apply(e){return new ht(e.firestore,e.converter,Oc(e._query,this._limit,this._limitType))}}function nF(t){return AA("limit",t),Oh._create("limit",t,"F")}function rF(t){return AA("limitToLast",t),Oh._create("limitToLast",t,"L")}class Lh extends Vl{constructor(e,n,r){super(),this.type=e,this._docOrFields=n,this._inclusive=r}static _create(e,n,r){return new Lh(e,n,r)}_apply(e){const n=MA(e,this.type,this._docOrFields,this._inclusive);return new ht(e.firestore,e.converter,function(i,s){return new tr(i.path,i.collectionGroup,i.explicitOrderBy.slice(),i.filters.slice(),i.limit,i.limitType,s,i.endAt)}(e._query,n))}}function iF(...t){return Lh._create("startAt",t,!0)}function sF(...t){return Lh._create("startAfter",t,!1)}class Mh extends Vl{constructor(e,n,r){super(),this.type=e,this._docOrFields=n,this._inclusive=r}static _create(e,n,r){return new Mh(e,n,r)}_apply(e){const n=MA(e,this.type,this._docOrFields,this._inclusive);return new ht(e.firestore,e.converter,function(i,s){return new tr(i.path,i.collectionGroup,i.explicitOrderBy.slice(),i.filters.slice(),i.limit,i.limitType,i.startAt,s)}(e._query,n))}}function oF(...t){return Mh._create("endBefore",t,!1)}function aF(...t){return Mh._create("endAt",t,!0)}function MA(t,e,n,r){if(n[0]=ce(n[0]),n[0]instanceof hl)return function(s,o,a,u,c){if(!u)throw new j(O.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${a}().`);const d=[];for(const f of Gs(s))if(f.field.isKeyField())d.push(qi(o,u.key));else{const m=u.data.field(f.field);if(gh(m))throw new j(O.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+f.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(m===null){const v=f.field.canonicalString();throw new j(O.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${v}' (used as the orderBy) does not exist.`)}d.push(m)}return new Hr(d,c)}(t._query,t.firestore._databaseId,e,n[0]._document,r);{const i=as(t.firestore);return function(o,a,u,c,d,f){const m=o.explicitOrderBy;if(d.length>m.length)throw new j(O.INVALID_ARGUMENT,`Too many arguments provided to ${c}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const v=[];for(let S=0;S<d.length;S++){const P=d[S];if(m[S].field.isKeyField()){if(typeof P!="string")throw new j(O.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${c}(), but got a ${typeof P}`);if(!zm(o)&&P.indexOf("/")!==-1)throw new j(O.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${c}() must be a plain document ID, but '${P}' contains a slash.`);const C=o.path.child(se.fromString(P));if(!G.isDocumentKey(C))throw new j(O.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${c}() must result in a valid document path, but '${C}' is not because it contains an odd number of segments.`);const w=new G(C);v.push(qi(a,w))}else{const C=NA(u,c,P);v.push(C)}}return new Hr(v,f)}(t._query,t.firestore._databaseId,i,e,n,r)}}function Kw(t,e,n){if(typeof(n=ce(n))=="string"){if(n==="")throw new j(O.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!zm(e)&&n.indexOf("/")!==-1)throw new j(O.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const r=e.path.child(se.fromString(n));if(!G.isDocumentKey(r))throw new j(O.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return qi(t,new G(r))}if(n instanceof Ge)return qi(t,n._key);throw new j(O.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${kh(n)}.`)}function Ww(t,e){if(!Array.isArray(t)||t.length===0)throw new j(O.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function FA(t,e){const n=function(i,s){for(const o of i)for(const a of o.getFlattenedFilters())if(s.indexOf(a.op)>=0)return a.op;return null}(t.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(n!==null)throw n===e.op?new j(O.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new j(O.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`)}function UA(t,e){if(!(e instanceof Ol||e instanceof bo))throw new j(O.INVALID_ARGUMENT,`Function ${t}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`)}class BA{convertValue(e,n="none"){switch(Kr(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Te(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(Xn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw W()}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const r={};return ai(e,(i,s)=>{r[i]=this.convertValue(s,n)}),r}convertVectorValue(e){var n,r,i;const s=(i=(r=(n=e.fields)===null||n===void 0?void 0:n.value.arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.map(o=>Te(o.doubleValue));return new xh(s)}convertGeoPoint(e){return new Sg(Te(e.latitude),Te(e.longitude))}convertArray(e,n){return(e.values||[]).map(r=>this.convertValue(r,n))}convertServerTimestamp(e,n){switch(n){case"previous":const r=_h(e);return r==null?null:this.convertValue(r,n);case"estimate":return this.convertTimestamp(rl(e));default:return null}}convertTimestamp(e){const n=Yn(e);return new xe(n.seconds,n.nanos)}convertDocumentKey(e,n){const r=se.fromString(e);Q(OS(r));const i=new $i(r.get(1),r.get(3)),s=new G(r.popFirst(5));return i.isEqual(n)||ze(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fh(t,e,n){let r;return r=t?n&&(n.merge||n.mergeFields)?t.toFirestore(e,n):t.toFirestore(e):e,r}class EL extends BA{constructor(e){super(),this.firestore=e}convertBytes(e){return new Yi(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new Ge(this.firestore,null,n)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lF(t){return new ul("sum",cl("sum",t))}function uF(t){return new ul("avg",cl("average",t))}function IL(){return new ul("count")}function cF(t,e){var n,r;return t instanceof ul&&e instanceof ul&&t.aggregateType===e.aggregateType&&((n=t._internalFieldPath)===null||n===void 0?void 0:n.canonicalString())===((r=e._internalFieldPath)===null||r===void 0?void 0:r.canonicalString())}function hF(t,e){return RA(t.query,e.query)&&zr(t.data(),e.data())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ki{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class mo extends hl{constructor(e,n,r,i,s,o){super(e,n,r,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new Zu(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const r=this._document.data.field(Vh("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,n.serverTimestamps)}}}class Zu extends mo{data(e={}){return super.data(e)}}class go{constructor(e,n,r,i){this._firestore=e,this._userDataWriter=n,this._snapshot=i,this.metadata=new ki(i.hasPendingWrites,i.fromCache),this.query=r}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(r=>{e.call(n,new Zu(this._firestore,this._userDataWriter,r.key,r,new ki(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new j(O.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(a=>{const u=new Zu(i._firestore,i._userDataWriter,a.doc.key,a.doc,new ki(i._snapshot.mutatedKeys.has(a.doc.key),i._snapshot.fromCache),i.query.converter);return a.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(a=>s||a.type!==3).map(a=>{const u=new Zu(i._firestore,i._userDataWriter,a.doc.key,a.doc,new ki(i._snapshot.mutatedKeys.has(a.doc.key),i._snapshot.fromCache),i.query.converter);let c=-1,d=-1;return a.type!==0&&(c=o.indexOf(a.doc.key),o=o.delete(a.doc.key)),a.type!==1&&(o=o.add(a.doc),d=o.indexOf(a.doc.key)),{type:TL(a.type),doc:u,oldIndex:c,newIndex:d}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}}function TL(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return W()}}function dF(t,e){return t instanceof mo&&e instanceof mo?t._firestore===e._firestore&&t._key.isEqual(e._key)&&(t._document===null?e._document===null:t._document.isEqual(e._document))&&t._converter===e._converter:t instanceof go&&e instanceof go&&t._firestore===e._firestore&&RA(t.query,e.query)&&t.metadata.isEqual(e.metadata)&&t._snapshot.isEqual(e._snapshot)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function SL(t){t=ne(t,Ge);const e=ne(t.firestore,ge);return IA(Ne(e),t._key).then(n=>Vg(e,t,n))}class ui extends BA{constructor(e){super(),this.firestore=e}convertBytes(e){return new Yi(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new Ge(this.firestore,null,n)}}function fF(t){t=ne(t,Ge);const e=ne(t.firestore,ge),n=Ne(e),r=new ui(e);return nL(n,t._key).then(i=>new mo(e,r,t._key,i,new ki(i!==null&&i.hasLocalMutations,!0),t.converter))}function pF(t){t=ne(t,Ge);const e=ne(t.firestore,ge);return IA(Ne(e),t._key,{source:"server"}).then(n=>Vg(e,t,n))}function mF(t){t=ne(t,ht);const e=ne(t.firestore,ge),n=Ne(e),r=new ui(e);return LA(t._query),TA(n,t._query).then(i=>new go(e,r,t,i))}function gF(t){t=ne(t,ht);const e=ne(t.firestore,ge),n=Ne(e),r=new ui(e);return rL(n,t._query).then(i=>new go(e,r,t,i))}function _F(t){t=ne(t,ht);const e=ne(t.firestore,ge),n=Ne(e),r=new ui(e);return TA(n,t._query,{source:"server"}).then(i=>new go(e,r,t,i))}function Hw(t,e,n){t=ne(t,Ge);const r=ne(t.firestore,ge),i=Fh(t.converter,e,n);return Ll(r,[Nh(as(r),"setDoc",t._key,i,t.converter!==null,n).toMutation(t._key,Re.none())])}function yF(t,e,n,...r){t=ne(t,Ge);const i=ne(t.firestore,ge),s=as(i);let o;return o=typeof(e=ce(e))=="string"||e instanceof ss?xg(s,"updateDoc",t._key,e,n,r):kg(s,"updateDoc",t._key,e),Ll(i,[o.toMutation(t._key,Re.exists(!0))])}function vF(t){return Ll(ne(t.firestore,ge),[new Ao(t._key,Re.none())])}function wF(t,e){const n=ne(t.firestore,ge),r=Xu(t),i=Fh(t.converter,e);return Ll(n,[Nh(as(t.firestore),"addDoc",r._key,i,t.converter!==null,{}).toMutation(r._key,Re.exists(!1))]).then(()=>r)}function EF(t,...e){var n,r,i;t=ce(t);let s={includeMetadataChanges:!1,source:"default"},o=0;typeof e[o]!="object"||Sp(e[o])||(s=e[o],o++);const a={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(Sp(e[o])){const f=e[o];e[o]=(n=f.next)===null||n===void 0?void 0:n.bind(f),e[o+1]=(r=f.error)===null||r===void 0?void 0:r.bind(f),e[o+2]=(i=f.complete)===null||i===void 0?void 0:i.bind(f)}let u,c,d;if(t instanceof Ge)c=ne(t.firestore,ge),d=To(t._key.path),u={next:f=>{e[o]&&e[o](Vg(c,t,f))},error:e[o+1],complete:e[o+2]};else{const f=ne(t,ht);c=ne(f.firestore,ge),d=f._query;const m=new ui(c);u={next:v=>{e[o]&&e[o](new go(c,m,f,v))},error:e[o+1],complete:e[o+2]},LA(t._query)}return function(m,v,S,P){const C=new Ph(P),w=new pg(v,C,S);return m.asyncQueue.enqueueAndForget(async()=>hg(await po(m),w)),()=>{C.Za(),m.asyncQueue.enqueueAndForget(async()=>dg(await po(m),w))}}(Ne(c),d,a,u)}function IF(t,e){return sL(Ne(t=ne(t,ge)),Sp(e)?e:{next:e})}function Ll(t,e){return function(r,i){const s=new it;return r.asyncQueue.enqueueAndForget(async()=>DO(await Ig(r),i,s)),s.promise}(Ne(t),e)}function Vg(t,e,n){const r=n.docs.get(e._key),i=new ui(t);return new mo(t,i,e._key,r,new ki(n.hasPendingWrites,n.fromCache),e.converter)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function TF(t){return AL(t,{count:IL()})}function AL(t,e){const n=ne(t.firestore,ge),r=Ne(n),i=z0(e,(s,o)=>new yS(o,s.aggregateType,s._internalFieldPath));return iL(r,t._query,i).then(s=>function(a,u,c){const d=new ui(a);return new mL(u,d,c)}(n,t,s))}class RL{constructor(e){this.kind="memory",this._onlineComponentProvider=Yr.provider,e!=null&&e.garbageCollector?this._offlineComponentProvider=e.garbageCollector._offlineComponentProvider:this._offlineComponentProvider=Jr.provider}toJSON(){return{kind:this.kind}}}class PL{constructor(e){let n;this.kind="persistent",e!=null&&e.tabManager?(e.tabManager._initialize(e),n=e.tabManager):(n=NL(void 0),n._initialize(e)),this._onlineComponentProvider=n._onlineComponentProvider,this._offlineComponentProvider=n._offlineComponentProvider}toJSON(){return{kind:this.kind}}}class CL{constructor(){this.kind="memoryEager",this._offlineComponentProvider=Jr.provider}toJSON(){return{kind:this.kind}}}class kL{constructor(e){this.kind="memoryLru",this._offlineComponentProvider={build:()=>new QO(e)}}toJSON(){return{kind:this.kind}}}function SF(){return new CL}function AF(t){return new kL(t==null?void 0:t.cacheSizeBytes)}function RF(t){return new RL(t)}function PF(t){return new PL(t)}class xL{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Yr.provider,this._offlineComponentProvider={build:n=>new wg(n,e==null?void 0:e.cacheSizeBytes,this.forceOwnership)}}}class bL{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Yr.provider,this._offlineComponentProvider={build:n=>new yA(n,e==null?void 0:e.cacheSizeBytes)}}}function NL(t){return new xL(t==null?void 0:t.forceOwnership)}function CF(){return new bL}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const DL={maxAttempts:5};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VL{constructor(e,n){this._firestore=e,this._commitHandler=n,this._mutations=[],this._committed=!1,this._dataReader=as(e)}set(e,n,r){this._verifyNotCommitted();const i=Tr(e,this._firestore),s=Fh(i.converter,n,r),o=Nh(this._dataReader,"WriteBatch.set",i._key,s,i.converter!==null,r);return this._mutations.push(o.toMutation(i._key,Re.none())),this}update(e,n,r,...i){this._verifyNotCommitted();const s=Tr(e,this._firestore);let o;return o=typeof(n=ce(n))=="string"||n instanceof ss?xg(this._dataReader,"WriteBatch.update",s._key,n,r,i):kg(this._dataReader,"WriteBatch.update",s._key,n),this._mutations.push(o.toMutation(s._key,Re.exists(!0))),this}delete(e){this._verifyNotCommitted();const n=Tr(e,this._firestore);return this._mutations=this._mutations.concat(new Ao(n._key,Re.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new j(O.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Tr(t,e){if((t=ce(t)).firestore!==e)throw new j(O.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OL extends class{constructor(n,r){this._firestore=n,this._transaction=r,this._dataReader=as(n)}get(n){const r=Tr(n,this._firestore),i=new EL(this._firestore);return this._transaction.lookup([r._key]).then(s=>{if(!s||s.length!==1)return W();const o=s[0];if(o.isFoundDocument())return new hl(this._firestore,i,o.key,o,r.converter);if(o.isNoDocument())return new hl(this._firestore,i,r._key,null,r.converter);throw W()})}set(n,r,i){const s=Tr(n,this._firestore),o=Fh(s.converter,r,i),a=Nh(this._dataReader,"Transaction.set",s._key,o,s.converter!==null,i);return this._transaction.set(s._key,a),this}update(n,r,i,...s){const o=Tr(n,this._firestore);let a;return a=typeof(r=ce(r))=="string"||r instanceof ss?xg(this._dataReader,"Transaction.update",o._key,r,i,s):kg(this._dataReader,"Transaction.update",o._key,r),this._transaction.update(o._key,a),this}delete(n){const r=Tr(n,this._firestore);return this._transaction.delete(r._key),this}}{constructor(e,n){super(e,n),this._firestore=e}get(e){const n=Tr(e,this._firestore),r=new ui(this._firestore);return super.get(e).then(i=>new mo(this._firestore,r,n._key,i._document,new ki(!1,!1),n.converter))}}function xF(t,e,n){t=ne(t,ge);const r=Object.assign(Object.assign({},DL),n);return function(s){if(s.maxAttempts<1)throw new j(O.INVALID_ARGUMENT,"Max attempts must be at least 1")}(r),function(s,o,a){const u=new it;return s.asyncQueue.enqueueAndForget(async()=>{const c=await EA(s);new XO(s.asyncQueue,c,a,o,u).au()}),u.promise}(Ne(t),i=>e(new OL(t,i)),r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bF(){return new Dl("deleteField")}function Qw(){return new Ag("serverTimestamp")}function NF(...t){return new Rg("arrayUnion",t)}function DF(...t){return new Pg("arrayRemove",t)}function VF(t){return new Cg("increment",t)}function OF(t){return new xh(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function LF(t){return Ne(t=ne(t,ge)),new VL(t,e=>Ll(t,e))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function MF(t,e){const n=Ne(t=ne(t,ge));if(!n._uninitializedComponentsProvider||n._uninitializedComponentsProvider._offline.kind==="memory")return en("Cannot enable indexes when persistence is disabled"),Promise.resolve();const r=function(s){const o=typeof s=="string"?function(c){try{return JSON.parse(c)}catch(d){throw new j(O.INVALID_ARGUMENT,"Failed to parse JSON: "+(d==null?void 0:d.message))}}(s):s,a=[];if(Array.isArray(o.indexes))for(const u of o.indexes){const c=Jw(u,"collectionGroup"),d=[];if(Array.isArray(u.fields))for(const f of u.fields){const m=Dh("setIndexConfiguration",Jw(f,"fieldPath"));f.arrayConfig==="CONTAINS"?d.push(new Di(m,2)):f.order==="ASCENDING"?d.push(new Di(m,0)):f.order==="DESCENDING"&&d.push(new Di(m,1))}a.push(new to(to.UNKNOWN_ID,c,d,no.empty()))}return a}(e);return lL(n,r)}function Jw(t,e){if(typeof t[e]!="string")throw new j(O.INVALID_ARGUMENT,"Missing string value for: "+e);return t[e]}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LL{constructor(e){this._firestore=e,this.type="PersistentCacheIndexManager"}}function FF(t){var e;t=ne(t,ge);const n=Yw.get(t);if(n)return n;if(((e=Ne(t)._uninitializedComponentsProvider)===null||e===void 0?void 0:e._offline.kind)!=="persistent")return null;const r=new LL(t);return Yw.set(t,r),r}function UF(t){jA(t,!0)}function BF(t){jA(t,!1)}function jF(t){cL(Ne(t._firestore)).then(e=>U("deleting all persistent cache indexes succeeded")).catch(e=>en("deleting all persistent cache indexes failed",e))}function jA(t,e){uL(Ne(t._firestore),e).then(n=>U(`setting persistent cache index auto creation isEnabled=${e} succeeded`)).catch(n=>en(`setting persistent cache index auto creation isEnabled=${e} failed`,n))}const Yw=new WeakMap;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zF(t){var e;const n=(e=Ne(ne(t.firestore,ge))._onlineComponents)===null||e===void 0?void 0:e.datastore.serializer;return n===void 0?null:Eh(n,Et(t._query))._t}function $F(t,e){var n;const r=z0(e,(s,o)=>new yS(o,s.aggregateType,s._internalFieldPath)),i=(n=Ne(ne(t.firestore,ge))._onlineComponents)===null||n===void 0?void 0:n.datastore.serializer;return i===void 0?null:bS(i,nS(t._query),r,!0).request}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qF{constructor(){throw new Error("instances of this class should not be created")}static onExistenceFilterMismatch(e){return Og.instance.onExistenceFilterMismatch(e)}}class Og{constructor(){this.Uu=new Map}static get instance(){return Au||(Au=new Og,function(n){if(Lc)throw new Error("a TestingHooksSpi instance is already set");Lc=n}(Au)),Au}et(e){this.Uu.forEach(n=>n(e))}onExistenceFilterMismatch(e){const n=Symbol(),r=this.Uu;return r.set(n,e),()=>r.delete(n)}}let Au=null;(function(e,n=!0){(function(i){Io=i})(ni),qr(new $r("firestore",(r,{instanceIdentifier:i,options:s})=>{const o=r.getProvider("app").getImmediate(),a=new ge(new oD(r.getProvider("auth-internal")),new uD(r.getProvider("app-check-internal")),function(c,d){if(!Object.prototype.hasOwnProperty.apply(c.options,["projectId"]))throw new j(O.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new $i(c.options.projectId,d)}(o,i),o);return s=Object.assign({useFetchStreams:n},s),a._setSettings(s),a},"PUBLIC").setMultipleInstances(!0)),cn(Fv,"4.7.3",e),cn(Fv,"4.7.3","esm2017")})();var ML="firebase",FL="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */cn(ML,FL,"app");const UL=Object.freeze(Object.defineProperty({__proto__:null,FirebaseError:fn,SDK_VERSION:ni,_DEFAULT_ENTRY_NAME:Ya,_addComponent:Zf,_apps:Bi,_components:Pc,_getProvider:rs,_isFirebaseServerApp:an,_registerComponent:qr,_removeServiceInstance:FT,_serverApps:Rc,deleteApp:M1,getApp:hh,initializeApp:Pm,registerVersion:cn},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zA="firebasestorage.googleapis.com",$A="storageBucket",BL=2*60*1e3,jL=10*60*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ue extends fn{constructor(e,n,r=0){super(Qd(e),`Firebase Storage: ${n} (${Qd(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,Ue.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return Qd(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var Fe;(function(t){t.UNKNOWN="unknown",t.OBJECT_NOT_FOUND="object-not-found",t.BUCKET_NOT_FOUND="bucket-not-found",t.PROJECT_NOT_FOUND="project-not-found",t.QUOTA_EXCEEDED="quota-exceeded",t.UNAUTHENTICATED="unauthenticated",t.UNAUTHORIZED="unauthorized",t.UNAUTHORIZED_APP="unauthorized-app",t.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",t.INVALID_CHECKSUM="invalid-checksum",t.CANCELED="canceled",t.INVALID_EVENT_NAME="invalid-event-name",t.INVALID_URL="invalid-url",t.INVALID_DEFAULT_BUCKET="invalid-default-bucket",t.NO_DEFAULT_BUCKET="no-default-bucket",t.CANNOT_SLICE_BLOB="cannot-slice-blob",t.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",t.NO_DOWNLOAD_URL="no-download-url",t.INVALID_ARGUMENT="invalid-argument",t.INVALID_ARGUMENT_COUNT="invalid-argument-count",t.APP_DELETED="app-deleted",t.INVALID_ROOT_OPERATION="invalid-root-operation",t.INVALID_FORMAT="invalid-format",t.INTERNAL_ERROR="internal-error",t.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(Fe||(Fe={}));function Qd(t){return"storage/"+t}function Lg(){const t="An unknown error occurred, please check the error payload for server response.";return new Ue(Fe.UNKNOWN,t)}function zL(t){return new Ue(Fe.OBJECT_NOT_FOUND,"Object '"+t+"' does not exist.")}function $L(t){return new Ue(Fe.QUOTA_EXCEEDED,"Quota for bucket '"+t+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function qL(){const t="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new Ue(Fe.UNAUTHENTICATED,t)}function GL(){return new Ue(Fe.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function KL(t){return new Ue(Fe.UNAUTHORIZED,"User does not have permission to access '"+t+"'.")}function WL(){return new Ue(Fe.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function HL(){return new Ue(Fe.CANCELED,"User canceled the upload/download.")}function QL(t){return new Ue(Fe.INVALID_URL,"Invalid URL '"+t+"'.")}function JL(t){return new Ue(Fe.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+t+"'.")}function YL(){return new Ue(Fe.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+$A+"' property when initializing the app?")}function XL(){return new Ue(Fe.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function ZL(){return new Ue(Fe.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function e2(t){return new Ue(Fe.UNSUPPORTED_ENVIRONMENT,`${t} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function Ap(t){return new Ue(Fe.INVALID_ARGUMENT,t)}function qA(){return new Ue(Fe.APP_DELETED,"The Firebase app was deleted.")}function t2(t){return new Ue(Fe.INVALID_ROOT_OPERATION,"The operation '"+t+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function ba(t,e){return new Ue(Fe.INVALID_FORMAT,"String does not match format '"+t+"': "+e)}function sa(t){throw new Ue(Fe.INTERNAL_ERROR,"Internal error: "+t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zt{constructor(e,n){this.bucket=e,this.path_=n}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,n){let r;try{r=zt.makeFromUrl(e,n)}catch{return new zt(e,"")}if(r.path==="")return r;throw JL(e)}static makeFromUrl(e,n){let r=null;const i="([A-Za-z0-9.\\-_]+)";function s(x){x.path.charAt(x.path.length-1)==="/"&&(x.path_=x.path_.slice(0,-1))}const o="(/(.*))?$",a=new RegExp("^gs://"+i+o,"i"),u={bucket:1,path:3};function c(x){x.path_=decodeURIComponent(x.path)}const d="v[A-Za-z0-9_]+",f=n.replace(/[.]/g,"\\."),m="(/([^?#]*).*)?$",v=new RegExp(`^https?://${f}/${d}/b/${i}/o${m}`,"i"),S={bucket:1,path:3},P=n===zA?"(?:storage.googleapis.com|storage.cloud.google.com)":n,C="([^?#]*)",w=new RegExp(`^https?://${P}/${i}/${C}`,"i"),E=[{regex:a,indices:u,postModify:s},{regex:v,indices:S,postModify:c},{regex:w,indices:{bucket:1,path:2},postModify:c}];for(let x=0;x<E.length;x++){const M=E[x],F=M.regex.exec(e);if(F){const I=F[M.indices.bucket];let _=F[M.indices.path];_||(_=""),r=new zt(I,_),M.postModify(r);break}}if(r==null)throw QL(e);return r}}class n2{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function r2(t,e,n){let r=1,i=null,s=null,o=!1,a=0;function u(){return a===2}let c=!1;function d(...C){c||(c=!0,e.apply(null,C))}function f(C){i=setTimeout(()=>{i=null,t(v,u())},C)}function m(){s&&clearTimeout(s)}function v(C,...w){if(c){m();return}if(C){m(),d.call(null,C,...w);return}if(u()||o){m(),d.call(null,C,...w);return}r<64&&(r*=2);let E;a===1?(a=2,E=0):E=(r+Math.random())*1e3,f(E)}let S=!1;function P(C){S||(S=!0,m(),!c&&(i!==null?(C||(a=2),clearTimeout(i),f(0)):C||(a=1)))}return f(0),s=setTimeout(()=>{o=!0,P(!0)},n),P}function i2(t){t(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function s2(t){return t!==void 0}function o2(t){return typeof t=="object"&&!Array.isArray(t)}function Mg(t){return typeof t=="string"||t instanceof String}function Xw(t){return Fg()&&t instanceof Blob}function Fg(){return typeof Blob<"u"}function Zw(t,e,n,r){if(r<e)throw Ap(`Invalid value for '${t}'. Expected ${e} or greater.`);if(r>n)throw Ap(`Invalid value for '${t}'. Expected ${n} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uh(t,e,n){let r=e;return n==null&&(r=`https://${e}`),`${n}://${r}/v0${t}`}function GA(t){const e=encodeURIComponent;let n="?";for(const r in t)if(t.hasOwnProperty(r)){const i=e(r)+"="+e(t[r]);n=n+i+"&"}return n=n.slice(0,-1),n}var Vi;(function(t){t[t.NO_ERROR=0]="NO_ERROR",t[t.NETWORK_ERROR=1]="NETWORK_ERROR",t[t.ABORT=2]="ABORT"})(Vi||(Vi={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function a2(t,e){const n=t>=500&&t<600,i=[408,429].indexOf(t)!==-1,s=e.indexOf(t)!==-1;return n||i||s}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class l2{constructor(e,n,r,i,s,o,a,u,c,d,f,m=!0){this.url_=e,this.method_=n,this.headers_=r,this.body_=i,this.successCodes_=s,this.additionalRetryCodes_=o,this.callback_=a,this.errorCallback_=u,this.timeout_=c,this.progressCallback_=d,this.connectionFactory_=f,this.retry=m,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((v,S)=>{this.resolve_=v,this.reject_=S,this.start_()})}start_(){const e=(r,i)=>{if(i){r(!1,new Ru(!1,null,!0));return}const s=this.connectionFactory_();this.pendingConnection_=s;const o=a=>{const u=a.loaded,c=a.lengthComputable?a.total:-1;this.progressCallback_!==null&&this.progressCallback_(u,c)};this.progressCallback_!==null&&s.addUploadProgressListener(o),s.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&s.removeUploadProgressListener(o),this.pendingConnection_=null;const a=s.getErrorCode()===Vi.NO_ERROR,u=s.getStatus();if(!a||a2(u,this.additionalRetryCodes_)&&this.retry){const d=s.getErrorCode()===Vi.ABORT;r(!1,new Ru(!1,null,d));return}const c=this.successCodes_.indexOf(u)!==-1;r(!0,new Ru(c,s))})},n=(r,i)=>{const s=this.resolve_,o=this.reject_,a=i.connection;if(i.wasSuccessCode)try{const u=this.callback_(a,a.getResponse());s2(u)?s(u):s()}catch(u){o(u)}else if(a!==null){const u=Lg();u.serverResponse=a.getErrorText(),this.errorCallback_?o(this.errorCallback_(a,u)):o(u)}else if(i.canceled){const u=this.appDelete_?qA():HL();o(u)}else{const u=WL();o(u)}};this.canceled_?n(!1,new Ru(!1,null,!0)):this.backoffId_=r2(e,n,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&i2(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class Ru{constructor(e,n,r){this.wasSuccessCode=e,this.connection=n,this.canceled=!!r}}function u2(t,e){e!==null&&e.length>0&&(t.Authorization="Firebase "+e)}function c2(t,e){t["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function h2(t,e){e&&(t["X-Firebase-GMPID"]=e)}function d2(t,e){e!==null&&(t["X-Firebase-AppCheck"]=e)}function f2(t,e,n,r,i,s,o=!0){const a=GA(t.urlParams),u=t.url+a,c=Object.assign({},t.headers);return h2(c,e),u2(c,n),c2(c,s),d2(c,r),new l2(u,t.method,c,t.body,t.successCodes,t.additionalRetryCodes,t.handler,t.errorHandler,t.timeout,t.progressCallback,i,o)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function p2(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function m2(...t){const e=p2();if(e!==void 0){const n=new e;for(let r=0;r<t.length;r++)n.append(t[r]);return n.getBlob()}else{if(Fg())return new Blob(t);throw new Ue(Fe.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function g2(t,e,n){return t.webkitSlice?t.webkitSlice(e,n):t.mozSlice?t.mozSlice(e,n):t.slice?t.slice(e,n):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _2(t){if(typeof atob>"u")throw e2("base-64");return atob(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vn={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class Jd{constructor(e,n){this.data=e,this.contentType=n||null}}function y2(t,e){switch(t){case vn.RAW:return new Jd(KA(e));case vn.BASE64:case vn.BASE64URL:return new Jd(WA(t,e));case vn.DATA_URL:return new Jd(w2(e),E2(e))}throw Lg()}function KA(t){const e=[];for(let n=0;n<t.length;n++){let r=t.charCodeAt(n);if(r<=127)e.push(r);else if(r<=2047)e.push(192|r>>6,128|r&63);else if((r&64512)===55296)if(!(n<t.length-1&&(t.charCodeAt(n+1)&64512)===56320))e.push(239,191,189);else{const s=r,o=t.charCodeAt(++n);r=65536|(s&1023)<<10|o&1023,e.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|r&63)}else(r&64512)===56320?e.push(239,191,189):e.push(224|r>>12,128|r>>6&63,128|r&63)}return new Uint8Array(e)}function v2(t){let e;try{e=decodeURIComponent(t)}catch{throw ba(vn.DATA_URL,"Malformed data URL.")}return KA(e)}function WA(t,e){switch(t){case vn.BASE64:{const i=e.indexOf("-")!==-1,s=e.indexOf("_")!==-1;if(i||s)throw ba(t,"Invalid character '"+(i?"-":"_")+"' found: is it base64url encoded?");break}case vn.BASE64URL:{const i=e.indexOf("+")!==-1,s=e.indexOf("/")!==-1;if(i||s)throw ba(t,"Invalid character '"+(i?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let n;try{n=_2(e)}catch(i){throw i.message.includes("polyfill")?i:ba(t,"Invalid character found")}const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}class HA{constructor(e){this.base64=!1,this.contentType=null;const n=e.match(/^data:([^,]+)?,/);if(n===null)throw ba(vn.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const r=n[1]||null;r!=null&&(this.base64=I2(r,";base64"),this.contentType=this.base64?r.substring(0,r.length-7):r),this.rest=e.substring(e.indexOf(",")+1)}}function w2(t){const e=new HA(t);return e.base64?WA(vn.BASE64,e.rest):v2(e.rest)}function E2(t){return new HA(t).contentType}function I2(t,e){return t.length>=e.length?t.substring(t.length-e.length)===e:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sr{constructor(e,n){let r=0,i="";Xw(e)?(this.data_=e,r=e.size,i=e.type):e instanceof ArrayBuffer?(n?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),r=this.data_.length):e instanceof Uint8Array&&(n?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),r=e.length),this.size_=r,this.type_=i}size(){return this.size_}type(){return this.type_}slice(e,n){if(Xw(this.data_)){const r=this.data_,i=g2(r,e,n);return i===null?null:new Sr(i)}else{const r=new Uint8Array(this.data_.buffer,e,n-e);return new Sr(r,!0)}}static getBlob(...e){if(Fg()){const n=e.map(r=>r instanceof Sr?r.data_:r);return new Sr(m2.apply(null,n))}else{const n=e.map(o=>Mg(o)?y2(vn.RAW,o).data:o.data_);let r=0;n.forEach(o=>{r+=o.byteLength});const i=new Uint8Array(r);let s=0;return n.forEach(o=>{for(let a=0;a<o.length;a++)i[s++]=o[a]}),new Sr(i,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function QA(t){let e;try{e=JSON.parse(t)}catch{return null}return o2(e)?e:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function T2(t){if(t.length===0)return null;const e=t.lastIndexOf("/");return e===-1?"":t.slice(0,e)}function S2(t,e){const n=e.split("/").filter(r=>r.length>0).join("/");return t.length===0?n:t+"/"+n}function JA(t){const e=t.lastIndexOf("/",t.length-2);return e===-1?t:t.slice(e+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function A2(t,e){return e}class At{constructor(e,n,r,i){this.server=e,this.local=n||e,this.writable=!!r,this.xform=i||A2}}let Pu=null;function R2(t){return!Mg(t)||t.length<2?t:JA(t)}function YA(){if(Pu)return Pu;const t=[];t.push(new At("bucket")),t.push(new At("generation")),t.push(new At("metageneration")),t.push(new At("name","fullPath",!0));function e(s,o){return R2(o)}const n=new At("name");n.xform=e,t.push(n);function r(s,o){return o!==void 0?Number(o):o}const i=new At("size");return i.xform=r,t.push(i),t.push(new At("timeCreated")),t.push(new At("updated")),t.push(new At("md5Hash",null,!0)),t.push(new At("cacheControl",null,!0)),t.push(new At("contentDisposition",null,!0)),t.push(new At("contentEncoding",null,!0)),t.push(new At("contentLanguage",null,!0)),t.push(new At("contentType",null,!0)),t.push(new At("metadata","customMetadata",!0)),Pu=t,Pu}function P2(t,e){function n(){const r=t.bucket,i=t.fullPath,s=new zt(r,i);return e._makeStorageReference(s)}Object.defineProperty(t,"ref",{get:n})}function C2(t,e,n){const r={};r.type="file";const i=n.length;for(let s=0;s<i;s++){const o=n[s];r[o.local]=o.xform(r,e[o.server])}return P2(r,t),r}function XA(t,e,n){const r=QA(e);return r===null?null:C2(t,r,n)}function k2(t,e,n,r){const i=QA(e);if(i===null||!Mg(i.downloadTokens))return null;const s=i.downloadTokens;if(s.length===0)return null;const o=encodeURIComponent;return s.split(",").map(c=>{const d=t.bucket,f=t.fullPath,m="/b/"+o(d)+"/o/"+o(f),v=Uh(m,n,r),S=GA({alt:"media",token:c});return v+S})[0]}function x2(t,e){const n={},r=e.length;for(let i=0;i<r;i++){const s=e[i];s.writable&&(n[s.server]=t[s.local])}return JSON.stringify(n)}class Ug{constructor(e,n,r,i){this.url=e,this.method=n,this.handler=r,this.timeout=i,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ZA(t){if(!t)throw Lg()}function b2(t,e){function n(r,i){const s=XA(t,i,e);return ZA(s!==null),s}return n}function N2(t,e){function n(r,i){const s=XA(t,i,e);return ZA(s!==null),k2(s,i,t.host,t._protocol)}return n}function eR(t){function e(n,r){let i;return n.getStatus()===401?n.getErrorText().includes("Firebase App Check token is invalid")?i=GL():i=qL():n.getStatus()===402?i=$L(t.bucket):n.getStatus()===403?i=KL(t.path):i=r,i.status=n.getStatus(),i.serverResponse=r.serverResponse,i}return e}function tR(t){const e=eR(t);function n(r,i){let s=e(r,i);return r.getStatus()===404&&(s=zL(t.path)),s.serverResponse=i.serverResponse,s}return n}function D2(t,e,n){const r=e.fullServerUrl(),i=Uh(r,t.host,t._protocol),s="GET",o=t.maxOperationRetryTime,a=new Ug(i,s,N2(t,n),o);return a.errorHandler=tR(e),a}function V2(t,e){const n=e.fullServerUrl(),r=Uh(n,t.host,t._protocol),i="DELETE",s=t.maxOperationRetryTime;function o(u,c){}const a=new Ug(r,i,o,s);return a.successCodes=[200,204],a.errorHandler=tR(e),a}function O2(t,e){return t&&t.contentType||e&&e.type()||"application/octet-stream"}function L2(t,e,n){const r=Object.assign({},n);return r.fullPath=t.path,r.size=e.size(),r.contentType||(r.contentType=O2(null,e)),r}function M2(t,e,n,r,i){const s=e.bucketOnlyServerUrl(),o={"X-Goog-Upload-Protocol":"multipart"};function a(){let E="";for(let x=0;x<2;x++)E=E+Math.random().toString().slice(2);return E}const u=a();o["Content-Type"]="multipart/related; boundary="+u;const c=L2(e,r,i),d=x2(c,n),f="--"+u+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+d+`\r
--`+u+`\r
Content-Type: `+c.contentType+`\r
\r
`,m=`\r
--`+u+"--",v=Sr.getBlob(f,r,m);if(v===null)throw XL();const S={name:c.fullPath},P=Uh(s,t.host,t._protocol),C="POST",w=t.maxUploadRetryTime,y=new Ug(P,C,b2(t,n),w);return y.urlParams=S,y.headers=o,y.body=v.uploadData(),y.errorHandler=eR(e),y}class F2{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=Vi.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=Vi.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=Vi.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,n,r,i){if(this.sent_)throw sa("cannot .send() more than once");if(this.sent_=!0,this.xhr_.open(n,e,!0),i!==void 0)for(const s in i)i.hasOwnProperty(s)&&this.xhr_.setRequestHeader(s,i[s].toString());return r!==void 0?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw sa("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw sa("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw sa("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw sa("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class U2 extends F2{initXhr(){this.xhr_.responseType="text"}}function Bg(){return new U2}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xi{constructor(e,n){this._service=e,n instanceof zt?this._location=n:this._location=zt.makeFromUrl(n,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,n){return new Xi(e,n)}get root(){const e=new zt(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return JA(this._location.path)}get storage(){return this._service}get parent(){const e=T2(this._location.path);if(e===null)return null;const n=new zt(this._location.bucket,e);return new Xi(this._service,n)}_throwIfRoot(e){if(this._location.path==="")throw t2(e)}}function B2(t,e,n){t._throwIfRoot("uploadBytes");const r=M2(t.storage,t._location,YA(),new Sr(e,!0),n);return t.storage.makeRequestWithTokens(r,Bg).then(i=>({metadata:i,ref:t}))}function j2(t){t._throwIfRoot("getDownloadURL");const e=D2(t.storage,t._location,YA());return t.storage.makeRequestWithTokens(e,Bg).then(n=>{if(n===null)throw ZL();return n})}function z2(t){t._throwIfRoot("deleteObject");const e=V2(t.storage,t._location);return t.storage.makeRequestWithTokens(e,Bg)}function $2(t,e){const n=S2(t._location.path,e),r=new zt(t._location.bucket,n);return new Xi(t.storage,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function q2(t){return/^[A-Za-z]+:\/\//.test(t)}function G2(t,e){return new Xi(t,e)}function nR(t,e){if(t instanceof jg){const n=t;if(n._bucket==null)throw YL();const r=new Xi(n,n._bucket);return e!=null?nR(r,e):r}else return e!==void 0?$2(t,e):t}function K2(t,e){if(e&&q2(e)){if(t instanceof jg)return G2(t,e);throw Ap("To use ref(service, url), the first argument must be a Storage instance.")}else return nR(t,e)}function eE(t,e){const n=e==null?void 0:e[$A];return n==null?null:zt.makeFromBucketSpec(n,t)}function W2(t,e,n,r={}){t.host=`${e}:${n}`,t._protocol="http";const{mockUserToken:i}=r;i&&(t._overrideAuthToken=typeof i=="string"?i:DT(i,t.app.options.projectId))}class jg{constructor(e,n,r,i,s){this.app=e,this._authProvider=n,this._appCheckProvider=r,this._url=i,this._firebaseVersion=s,this._bucket=null,this._host=zA,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=BL,this._maxUploadRetryTime=jL,this._requests=new Set,i!=null?this._bucket=zt.makeFromBucketSpec(i,this._host):this._bucket=eE(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=zt.makeFromBucketSpec(this._url,e):this._bucket=eE(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){Zw("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){Zw("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const n=await e.getToken();if(n!==null)return n.accessToken}return null}async _getAppCheckToken(){const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Xi(this,e)}_makeRequest(e,n,r,i,s=!0){if(this._deleted)return new n2(qA());{const o=f2(e,this._appId,r,i,n,this._firebaseVersion,s);return this._requests.add(o),o.getPromise().then(()=>this._requests.delete(o),()=>this._requests.delete(o)),o}}async makeRequestWithTokens(e,n){const[r,i]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,n,r,i).getPromise()}}const tE="@firebase/storage",nE="0.13.2";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rR="storage";function GF(t,e,n){return t=ce(t),B2(t,e,n)}function KF(t){return t=ce(t),j2(t)}function WF(t){return t=ce(t),z2(t)}function HF(t,e){return t=ce(t),K2(t,e)}function H2(t=hh(),e){t=ce(t);const r=rs(t,rR).getImmediate({identifier:e}),i=xT("storage");return i&&Q2(r,...i),r}function Q2(t,e,n,r={}){W2(t,e,n,r)}function J2(t,{instanceIdentifier:e}){const n=t.getProvider("app").getImmediate(),r=t.getProvider("auth-internal"),i=t.getProvider("app-check-internal");return new jg(n,r,i,e,ni)}function Y2(){qr(new $r(rR,J2,"PUBLIC").setMultipleInstances(!0)),cn(tE,nE,""),cn(tE,nE,"esm2017")}Y2();const iR={apiKey:"AIzaSyBbGPFl3jKJX8n8wKl5qPC_qESqVvJc5Hs",authDomain:"dermlux-waitlist.firebaseapp.com",projectId:"dermlux-waitlist",storageBucket:"dermlux-waitlist.firebasestorage.app",messagingSenderId:"131418143547",appId:"1:131418143547:web:c70a862a161aa28b89951e"},zg=Pm(iR),dr=E0(zg),Yd=pL(zg),QF=H2(zg),sR=B.createContext(null);function X2({children:t}){const[e,n]=B.useState(null),[r,i]=B.useState(null),[s,o]=B.useState(!0);async function a(w,y){return $b(dr,w,y)}async function u(){return Pv(dr)}async function c(w,y,E,x="agent"){const{initializeApp:M,deleteApp:F}=await Ke(async()=>{const{initializeApp:T,deleteApp:A}=await Promise.resolve().then(()=>UL);return{initializeApp:T,deleteApp:A}},void 0),I=M(iR,"Secondary-"+Date.now()),_=E0(I);try{const T=await zb(_,w,y);return await Hw(Xu(Yd,"users",T.user.uid),{email:w,displayName:E,role:x,password:y,active:!0,createdAt:Qw()}),T.user}finally{await _.signOut(),await F(I)}}async function d(w){var y,E,x,M;try{const F=await SL(Xu(Yd,"users",w));F.exists()?i(F.data()):(await Hw(Xu(Yd,"users",w),{email:(y=dr.currentUser)==null?void 0:y.email,displayName:(E=dr.currentUser)==null?void 0:E.email,role:"agent",active:!0,createdAt:Qw()}),i({role:"agent",displayName:(x=dr.currentUser)==null?void 0:x.email}))}catch(F){console.error("fetchUserProfile error:",F),i({role:"agent",displayName:(M=dr.currentUser)==null?void 0:M.email})}}B.useEffect(()=>Kb(dr,async y=>{n(y),y?await d(y.uid):i(null),o(!1)}),[]),B.useEffect(()=>{if(!e)return;const w=30*60*1e3;let y;const E=()=>{clearTimeout(y),y=setTimeout(()=>{Pv(dr)},w)},x=["mousedown","keydown","touchstart","scroll"];return x.forEach(M=>window.addEventListener(M,E,{passive:!0})),E(),()=>{clearTimeout(y),x.forEach(M=>window.removeEventListener(M,E))}},[e]);const m=(r==null?void 0:r.role)==="admin"||(e==null?void 0:e.uid)==="TMgFlpv8ZcNGcgk7XKIxjDktf802",v=(r==null?void 0:r.role)==="ekloges"||m,S=(r==null?void 0:r.role)==="marketer",P=(r==null?void 0:r.role)==="expenses",C=(r==null?void 0:r.role)==="accountant";return V.jsx(sR.Provider,{value:{currentUser:e,userProfile:r,isAdmin:m,isEkloges:v,isMarketer:S,isExpenses:P,isAccountant:C,login:a,logout:u,createUser:c,loading:s},children:s?V.jsx("div",{className:"min-h-screen flex items-center justify-center bg-blue-50",children:V.jsx("div",{className:"text-blue-600 text-lg font-medium",children:"Φόρτωση…"})}):t})}function ci(){return B.useContext(sR)}const Xd=["#9D835E","#B392A4","#C9B4C0","#EEECE0","#7E88BC"];function Z2(){const{login:t}=ci(),e=Sm(),[n,r]=B.useState(""),[i,s]=B.useState(""),[o,a]=B.useState(""),[u,c]=B.useState(!1),d=B.useRef(null),f=B.useRef(null);B.useEffect(()=>{const S=d.current,P=f.current;if(!S||!P||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const C=P.offsetWidth||110;let w=Math.random()*(S.clientWidth-C),y=Math.random()*(S.clientHeight-C),E=95,x=80,M=0,F=0,I=performance.now();const _=()=>{P.style.backgroundColor=Xd[M%Xd.length]};_();const T=A=>{F=requestAnimationFrame(T);const k=Math.min((A-I)/1e3,.05);I=A;const N=S.clientWidth-C,R=S.clientHeight-C;w+=E*k,y+=x*k;let Ze=!1;w<=0?(w=0,E=Math.abs(E),Ze=!0):w>=N&&(w=N,E=-Math.abs(E),Ze=!0),y<=0?(y=0,x=Math.abs(x),Ze=!0):y>=R&&(y=R,x=-Math.abs(x),Ze=!0),Ze&&(M++,_()),P.style.transform=`translate(${w}px, ${y}px)`};return F=requestAnimationFrame(T),()=>cancelAnimationFrame(F)},[]);async function m(S){S.preventDefault(),a(""),c(!0);try{await t(n,i),e("/")}catch{a("Λάθος email ή κωδικός.")}finally{c(!1)}}const v="/dermlux-waitlist/brand/emblem-motif.png";return V.jsxs("div",{ref:d,className:"relative min-h-screen overflow-hidden flex items-center justify-center px-4",style:{background:"radial-gradient(1200px 800px at 50% -10%, #221e18 0%, transparent 60%),radial-gradient(1000px 700px at 85% 110%, rgba(38,40,61,0.85) 0%, transparent 60%),#100f0d"},children:[V.jsx("div",{ref:f,"aria-hidden":"true",className:"absolute top-0 left-0 pointer-events-none will-change-transform",style:{width:110,height:110,WebkitMaskImage:`url(${v})`,maskImage:`url(${v})`,WebkitMaskRepeat:"no-repeat",maskRepeat:"no-repeat",WebkitMaskSize:"contain",maskSize:"contain",WebkitMaskPosition:"center",maskPosition:"center",backgroundColor:Xd[0],transition:"background-color 0.4s ease",filter:"drop-shadow(0 0 14px rgba(201,180,192,0.35))",opacity:.85}}),V.jsxs("div",{className:"relative z-10 w-full max-w-md rounded-2xl p-8 backdrop-blur-md",style:{background:"rgba(238,236,224,0.06)",border:"1px solid rgba(238,236,224,0.14)",boxShadow:"0 24px 60px rgba(0,0,0,0.45)"},children:[V.jsxs("div",{className:"text-center mb-8",children:[V.jsx("div",{style:{fontFamily:"'Prata', Georgia, serif",color:"#EEECE0"},className:"text-4xl tracking-wide",children:"DermLux"}),V.jsx("div",{className:"mt-2 text-[11px] font-bold uppercase tracking-[0.35em]",style:{color:"#9D835E"},children:"Medical Aesthetics"})]}),V.jsxs("form",{onSubmit:m,className:"space-y-4",children:[o&&V.jsx("div",{className:"rounded-lg px-4 py-3 text-sm",style:{background:"rgba(220,60,60,0.12)",border:"1px solid rgba(220,60,60,0.35)",color:"#f3b4b4"},children:o}),V.jsxs("div",{children:[V.jsx("label",{className:"block text-sm font-medium mb-1",style:{color:"#C9B4C0"},children:"Email"}),V.jsx("input",{type:"email",value:n,onChange:S=>r(S.target.value),required:!0,autoFocus:!0,className:"w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2",style:{background:"rgba(238,236,224,0.07)",border:"1px solid rgba(238,236,224,0.18)",color:"#EEECE0"}})]}),V.jsxs("div",{children:[V.jsx("label",{className:"block text-sm font-medium mb-1",style:{color:"#C9B4C0"},children:"Κωδικός"}),V.jsx("input",{type:"password",value:i,onChange:S=>s(S.target.value),required:!0,className:"w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2",style:{background:"rgba(238,236,224,0.07)",border:"1px solid rgba(238,236,224,0.18)",color:"#EEECE0"}})]}),V.jsx("button",{type:"submit",disabled:u,className:"w-full mt-2 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-60",style:{background:"linear-gradient(135deg, #9D835E, #B392A4)",color:"#100f0d"},children:u?"Σύνδεση…":"Σύνδεση"})]})]})]})}function eM(){var m;const{userProfile:t,isAdmin:e,isEkloges:n,isExpenses:r,isAccountant:i,logout:s}=ci(),o=r||i,[a,u]=B.useState(!1),c=ns(),d=v=>`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${c.pathname===v?"bg-[#9D835E] text-[#161616]":"text-[#cfc9bb] hover:bg-[#2a2620] hover:text-[#EEECE0]"}`,f=v=>`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${c.pathname===v?"bg-[#9D835E] text-[#161616]":"text-[#cfc9bb] hover:bg-[#2a2620]"}`;return V.jsxs("nav",{className:"bg-[#161616] text-[#EEECE0] shadow-md relative z-50 border-b border-[#9D835E]/25",children:[V.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:V.jsxs("div",{className:"flex items-center justify-between h-14",children:[V.jsxs(Ve,{to:"/",className:"flex items-baseline gap-2 group",children:[V.jsx("span",{className:"font-serif text-xl tracking-wide text-[#EEECE0] group-hover:text-white transition-colors",style:{fontFamily:"'Prata', Georgia, serif"},children:"DermLux"}),V.jsx("span",{className:"hidden sm:block text-[8px] font-bold uppercase tracking-[2.5px] text-[#9D835E]",children:"Portal"})]}),V.jsxs("div",{className:"hidden md:flex gap-1",children:[(t==null?void 0:t.role)!=="ekloges"&&!o&&V.jsx(Ve,{to:"/waitlist",className:d("/waitlist"),children:"Λίστα Αναμονής"}),(t==null?void 0:t.role)!=="ekloges"&&!o&&V.jsx(Ve,{to:"/medical",className:d("/medical"),children:"Ασθενείς"}),e&&V.jsx(Ve,{to:"/admin",className:d("/admin"),children:"Admin"}),e&&V.jsx(Ve,{to:"/email",className:d("/email"),children:"Email"}),(e||i)&&V.jsx(Ve,{to:"/bookkeeping",className:d("/bookkeeping"),children:"Λογιστικά"}),(e||i)&&V.jsx(Ve,{to:"/banks",className:d("/banks"),children:"Τράπεζες"}),(e||r)&&V.jsx(Ve,{to:"/upload",className:d("/upload"),children:"Αποδείξεις"}),e&&V.jsx(Ve,{to:"/claude",className:d("/claude"),children:"Claude"}),e&&V.jsx(Ve,{to:"/stavri",className:d("/stavri"),children:"Σταύρη Μεταξά"}),(e||n)&&V.jsx(Ve,{to:"/election-archive",className:d("/election-archive"),children:"🗳️ Εκλογές 2026"})]}),V.jsxs("div",{className:"hidden md:flex items-center gap-4",children:[V.jsxs("span",{className:"text-[#8B8378] text-sm",children:[t==null?void 0:t.displayName,e&&V.jsx("span",{className:"ml-1 badge bg-[#9D835E] text-[#161616]",children:"Admin"})]}),V.jsx("button",{onClick:s,className:"text-[#8B8378] hover:text-[#EEECE0] text-sm transition-colors",children:"Αποσύνδεση"})]}),V.jsxs("div",{className:"flex md:hidden items-center gap-3",children:[V.jsx("span",{className:"text-[#8B8378] text-sm",children:(m=t==null?void 0:t.displayName)==null?void 0:m.split(" ")[0]}),V.jsx("button",{onClick:()=>u(v=>!v),className:"text-[#cfc9bb] hover:text-[#EEECE0] p-1.5 rounded-md transition-colors","aria-label":"Menu",children:a?V.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:V.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})}):V.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:V.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 6h16M4 12h16M4 18h16"})})})]})]})}),a&&V.jsxs("div",{className:"md:hidden bg-[#0e0d0b] px-4 pb-4 pt-2 flex flex-col gap-1",onClick:()=>u(!1),children:[(t==null?void 0:t.role)!=="ekloges"&&!o&&V.jsx(Ve,{to:"/",className:f("/"),children:"🏠 Αρχική"}),(t==null?void 0:t.role)!=="ekloges"&&!o&&V.jsx(Ve,{to:"/waitlist",className:f("/waitlist"),children:"📋 Λίστα Αναμονής"}),(t==null?void 0:t.role)!=="ekloges"&&!o&&V.jsx(Ve,{to:"/medical",className:f("/medical"),children:"🏥 Ασθενείς"}),e&&V.jsx(Ve,{to:"/admin",className:f("/admin"),children:"⚙️ Admin"}),e&&V.jsx(Ve,{to:"/email",className:f("/email"),children:"📧 Email"}),(e||i)&&V.jsx(Ve,{to:"/bookkeeping",className:f("/bookkeeping"),children:"📒 Λογιστικά"}),(e||i)&&V.jsx(Ve,{to:"/banks",className:f("/banks"),children:"🏦 Τράπεζες"}),(e||r)&&V.jsx(Ve,{to:"/upload",className:f("/upload"),children:"🧾 Αποδείξεις"}),e&&V.jsx(Ve,{to:"/claude",className:f("/claude"),children:"💻 Claude"}),e&&V.jsx(Ve,{to:"/stavri",className:f("/stavri"),children:"👩‍💻 Σταύρη Μεταξά"}),(e||n)&&V.jsx(Ve,{to:"/election-archive",className:f("/election-archive"),children:"🗳️ Εκλογές 2026"}),V.jsx("div",{className:"border-t border-[#2a2620] mt-2 pt-2",children:V.jsx("button",{onClick:s,className:"w-full text-left px-4 py-3 text-sm text-[#8B8378] hover:text-[#EEECE0] rounded-lg",children:"🚪 Αποσύνδεση"})})]})]})}class tM extends B.Component{constructor(){super(...arguments);z_(this,"state",{error:null})}static getDerivedStateFromError(n){return{error:n}}componentDidCatch(n,r){console.error("ErrorBoundary caught:",n,r)}render(){return this.state.error?V.jsx("div",{className:"min-h-screen flex items-center justify-center bg-blue-50 px-4",children:V.jsxs("div",{className:"bg-white rounded-2xl shadow-lg p-8 max-w-md text-center space-y-4",children:[V.jsx("div",{className:"text-4xl",children:"😵"}),V.jsx("h1",{className:"text-lg font-bold text-gray-800",children:"Κάτι πήγε στραβά"}),V.jsx("p",{className:"text-sm text-gray-500",children:"Παρουσιάστηκε απρόσμενο σφάλμα. Πάτησε το κουμπί για επαναφόρτωση — τα δεδομένα σου είναι ασφαλή."}),V.jsx("button",{onClick:()=>window.location.reload(),className:"px-5 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors",children:"🔄 Επαναφόρτωση"})]})}):this.props.children}}const nM=B.lazy(()=>Ke(()=>import("./Home-B9cCTbAf.js"),__vite__mapDeps([0,1]))),rM=B.lazy(()=>Ke(()=>import("./InterfaceSelector-Djc85TLH.js"),[])),iM=B.lazy(()=>Ke(()=>import("./Dashboard-DIy3O6gs.js"),__vite__mapDeps([2,3]))),sM=B.lazy(()=>Ke(()=>import("./AdminPanel-B-k7tTnb.js"),__vite__mapDeps([4,5,3]))),oM=B.lazy(()=>Ke(()=>import("./EmailMarketing-BAWWOrSJ.js"),__vite__mapDeps([6,7]))),aM=B.lazy(()=>Ke(()=>import("./VoteContacts-8wC6ia-i.js"),[])),lM=B.lazy(()=>Ke(()=>import("./EklogikáKentra-ChxEV_-1.js"),[])),uM=B.lazy(()=>Ke(()=>import("./BallotResults-B2dH_zCQ.js"),__vite__mapDeps([8,9]))),cM=B.lazy(()=>Ke(()=>import("./ElectionArchive-Dc5NdVk6.js"),__vite__mapDeps([10,11,12,8,9]))),hM=B.lazy(()=>Ke(()=>import("./MedicalRecords-HxTn_7Si.js"),[])),dM=B.lazy(()=>Ke(()=>import("./PatientProfile-BObjM11q.js"),[])),fM=B.lazy(()=>Ke(()=>import("./Bookkeeping-DRFoeRld.js"),__vite__mapDeps([13,14,15]))),pM=B.lazy(()=>Ke(()=>import("./BankTransactions-Cgn2ER_l.js"),__vite__mapDeps([16,15]))),mM=B.lazy(()=>Ke(()=>import("./ExpenseUpload-CsIfG3dl.js"),__vite__mapDeps([17,14]))),gM=B.lazy(()=>Ke(()=>import("./ImportExpensify-BI3RSX6X.js"),[])),_M=B.lazy(()=>Ke(()=>import("./ClaudeRemote-DoYohmyP.js"),__vite__mapDeps([18,5,7]))),yM=B.lazy(()=>Ke(()=>import("./StavriView-DxbCBTdU.js"),[])),vM=B.lazy(()=>Ke(()=>import("./ClaudePinGate-C42Ke7Bh.js"),[])),wM=B.lazy(()=>Ke(()=>import("./UnsubscribePage-Cg_H8hdU.js"),[])),EM=B.lazy(()=>Ke(()=>import("./Eshop-1JEEl9qN.js"),[]));function IM(){return V.jsx("div",{className:"flex items-center justify-center py-24",children:V.jsx("div",{className:"text-blue-600 text-sm font-medium animate-pulse",children:"Φόρτωση σελίδας…"})})}function ys({children:t}){const{currentUser:e,userProfile:n}=ci();return e?(n==null?void 0:n.role)==="ekloges"?V.jsx(jt,{to:"/ekloges",replace:!0}):(n==null?void 0:n.role)==="expenses"?V.jsx(jt,{to:"/upload",replace:!0}):(n==null?void 0:n.role)==="accountant"?V.jsx(jt,{to:"/bookkeeping",replace:!0}):t:V.jsx(jt,{to:"/login",replace:!0})}function _i({children:t}){const{currentUser:e,isAdmin:n}=ci();return e?n?t:V.jsx(jt,{to:"/",replace:!0}):V.jsx(jt,{to:"/login",replace:!0})}function rE({children:t}){const{currentUser:e,isAdmin:n,isAccountant:r}=ci();return e?!n&&!r?V.jsx(jt,{to:"/",replace:!0}):t:V.jsx(jt,{to:"/login",replace:!0})}function TM({children:t}){const{currentUser:e,isAdmin:n,isExpenses:r}=ci();return e?!n&&!r?V.jsx(jt,{to:"/",replace:!0}):t:V.jsx(jt,{to:"/login",replace:!0})}function SM({children:t}){const{currentUser:e,isAdmin:n,isEkloges:r}=ci();return e?!r&&!n?V.jsx(jt,{to:"/",replace:!0}):t:V.jsx(jt,{to:"/login",replace:!0})}function AM(){const{currentUser:t}=ci(),e=ns(),n=e.pathname==="/unsubscribe"||e.pathname==="/eshop";return V.jsxs("div",{className:"min-h-screen flex flex-col",children:[t&&!n&&V.jsx(eM,{}),V.jsx("main",{className:"flex-1",children:V.jsx(tM,{children:V.jsx(B.Suspense,{fallback:V.jsx(IM,{}),children:V.jsx("div",{className:"route-fade",children:V.jsxs(sx,{children:[V.jsx(Oe,{path:"/login",element:V.jsx(Z2,{})}),V.jsx(Oe,{path:"/",element:V.jsx(ys,{children:V.jsx(rM,{})})}),V.jsx(Oe,{path:"/home",element:V.jsx(ys,{children:V.jsx(nM,{})})}),V.jsx(Oe,{path:"/waitlist",element:V.jsx(ys,{children:V.jsx(iM,{})})}),V.jsx(Oe,{path:"/admin",element:V.jsx(_i,{children:V.jsx(sM,{})})}),V.jsx(Oe,{path:"/email",element:V.jsx(_i,{children:V.jsx(oM,{})})}),V.jsx(Oe,{path:"/votes",element:V.jsx(_i,{children:V.jsx(aM,{})})}),V.jsx(Oe,{path:"/ekloges",element:V.jsx(SM,{children:V.jsx(lM,{})})}),V.jsx(Oe,{path:"/ballot-results",element:V.jsx(_i,{children:V.jsx(uM,{})})}),V.jsx(Oe,{path:"/election-archive",element:V.jsx(ys,{children:V.jsx(cM,{})})}),V.jsx(Oe,{path:"/medical",element:V.jsx(ys,{children:V.jsx(hM,{})})}),V.jsx(Oe,{path:"/medical/:id",element:V.jsx(ys,{children:V.jsx(dM,{})})}),V.jsx(Oe,{path:"/bookkeeping",element:V.jsx(rE,{children:V.jsx(fM,{})})}),V.jsx(Oe,{path:"/banks",element:V.jsx(rE,{children:V.jsx(pM,{})})}),V.jsx(Oe,{path:"/upload",element:V.jsx(TM,{children:V.jsx(mM,{})})}),V.jsx(Oe,{path:"/import-expensify",element:V.jsx(_i,{children:V.jsx(gM,{})})}),V.jsx(Oe,{path:"/claude",element:V.jsx(_i,{children:V.jsx(vM,{children:V.jsx(_M,{})})})}),V.jsx(Oe,{path:"/stavri",element:V.jsx(_i,{children:V.jsx(yM,{})})}),V.jsx(Oe,{path:"/unsubscribe",element:V.jsx(wM,{})}),V.jsx(Oe,{path:"/eshop",element:V.jsx(EM,{})}),V.jsx(Oe,{path:"*",element:V.jsx(jt,{to:"/",replace:!0})})]})},e.pathname)})})})]})}Zd.createRoot(document.getElementById("root")).render(V.jsx(pE.StrictMode,{children:V.jsx(dx,{children:V.jsx(X2,{children:V.jsx(AM,{})})})}));export{ht as $,PM as A,GF as B,HF as C,QF as D,KF as E,pE as F,CM as G,WF as H,BA as I,ul as J,mL as K,Ve as L,Yi as M,Rn as N,Ge as O,mo as P,ss as Q,nP as R,UM as S,xe as T,os as U,ge as V,j as W,Sg as X,fL as Y,LL as Z,Ke as _,Sm as a,AF as a$,bo as a0,Vl as a1,Zu as a2,Mh as a3,Ol as a4,Oh as a5,Dg as a6,go as a7,Lh as a8,ki as a9,IL as aA,jF as aB,bF as aC,KM as aD,BF as aE,JM as aF,jM as aG,zM as aH,GM as aI,UF as aJ,aF as aK,oF as aL,Ne as aM,Ll as aN,AL as aO,TF as aP,fF as aQ,pF as aR,gF as aS,_F as aT,pL as aU,FF as aV,BM as aW,rF as aX,HM as aY,SF as aZ,RF as a_,OL as aa,xh as ab,VL as ac,x0 as ad,Me as ae,$i as af,G as ag,bM as ah,iD as ai,Ae as aj,qF as ak,ne as al,xM as am,$F as an,zF as ao,DM as ap,en as aq,hL as ar,cF as as,hF as at,eF as au,DF as av,uF as aw,$M as ax,MM as ay,dL as az,yF as b,QM as b0,IF as b1,ZM as b2,PF as b3,CF as b4,NL as b5,RA as b6,FM as b7,xF as b8,MF as b9,kM as ba,dF as bb,sF as bc,iF as bd,lF as be,WM as bf,OF as bg,qM as bh,LM as c,Xu as d,Yd as e,tF as f,vF as g,Qw as h,wF as i,V as j,mF as k,SL as l,nF as m,LF as n,EF as o,dr as p,YM as q,B as r,Hw as s,E0 as t,ci as u,fk as v,XM as w,NF as x,VF as y,BR as z};
