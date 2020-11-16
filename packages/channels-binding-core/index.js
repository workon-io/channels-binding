module.exports=function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=1)}([function(t,e){t.exports=require("react")},function(t,e,n){"use strict";function r(t){this.settings=_.defaults(t,{debug:!0,protocols:[],args:{},automaticOpen:!0,reconnectInterval:1e3,maxReconnectInterval:3e4,reconnectDecay:1.5,timeoutInterval:2e3,maxReconnectAttempts:null,binaryType:"blob"}),this.reconnectAttempts=0,this.readyState=WebSocket.CONNECTING,this.protocol=null;var e,n=this,o=!1,i=!1,c=document.createElement("div");function s(t,e){var n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}c.addEventListener("open",(function(t){n.onopen(t)})),c.addEventListener("close",(function(t){n.onclose(t)})),c.addEventListener("connecting",(function(t){n.onconnecting(t)})),c.addEventListener("message",(function(t){n.onmessage(t)})),c.addEventListener("error",(function(t){n.onerror(t)})),this.addEventListener=c.addEventListener.bind(c),this.removeEventListener=c.removeEventListener.bind(c),this.dispatchEvent=c.dispatchEvent.bind(c),this.open=function(t){if((e=new WebSocket("".concat(n.settings.url),n.settings.protocols,{})).rejectUnauthorized=!1,e.binaryType=this.settings.binaryType,t){if(this.settings.maxReconnectAttempts&&this.reconnectAttempts>this.settings.maxReconnectAttempts)return}else c.dispatchEvent(s("connecting")),this.reconnectAttempts=0;(n.settings.debug||r.debugAll)&&console.debug("ReconnectingWebSocket","attempt-connect",n.url);var u=e,a=setTimeout((function(){(n.settings.debug||r.debugAll)&&console.debug("ReconnectingWebSocket","connection-timeout",n.url),i=!0,u.close(),i=!1}),n.settings.timeoutInterval);e.onopen=function(o){clearTimeout(a),(n.settings.debug||r.debugAll)&&console.debug("ReconnectingWebSocket","onopen",n.url),n.protocol=e.protocol,n.readyState=WebSocket.OPEN,n.reconnectAttempts=0;var i=s("open");i.isReconnect=t,t=!1,c.dispatchEvent(i)},e.onclose=function(u){if(clearTimeout(l),e=null,o)n.readyState=WebSocket.CLOSED,c.dispatchEvent(s("close"));else{n.readyState=WebSocket.CONNECTING;var a=s("connecting");a.code=u.code,a.reason=u.reason,a.wasClean=u.wasClean,c.dispatchEvent(a),t||i||((n.settings.debug||r.debugAll)&&console.debug("ReconnectingWebSocket","onclose",n.url),c.dispatchEvent(s("close")));var l=n.settings.reconnectInterval*Math.pow(n.settings.reconnectDecay,n.reconnectAttempts);setTimeout((function(){n.reconnectAttempts++,n.open(!0)}),l>n.settings.maxReconnectInterval?n.settings.maxReconnectInterval:l)}},e.onmessage=function(t){(n.settings.debug||r.debugAll)&&console.debug("ReconnectingWebSocket","onmessage",n.url,t.data);var e=s("message");e.data=t.data,c.dispatchEvent(e)},e.onerror=function(t){(n.settings.debug||r.debugAll)&&console.debug("ReconnectingWebSocket","onerror",n.url,t),c.dispatchEvent(s("error"))}},1==this.settings.automaticOpen&&this.open(!1),this.send=function(t){if(e)return(n.settings.debug||r.debugAll)&&console.debug("ReconnectingWebSocket","send",n.url,t),e.send(t);throw"INVALID_STATE_ERR : Pausing to reconnect websocket"},this.close=function(t,n){void 0===t&&(t=1e3),o=!0,e&&e.close(t,n)},this.refresh=function(){e&&e.close()}}n.r(e),r.prototype.onopen=function(t){},r.prototype.onclose=function(t){},r.prototype.onconnecting=function(t){},r.prototype.onmessage=function(t){},r.prototype.onerror=function(t){},r.debugAll=!1,r.CONNECTING=WebSocket.CONNECTING,r.OPEN=WebSocket.OPEN,r.CLOSING=WebSocket.CLOSING,r.CLOSED=WebSocket.CLOSED;var o=r;function i(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var c=function(){function t(e,n){var r=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.options=_.defaults(n,{host:window.location.hostname,port:window.location.port,path:null,debug:0,params:{},safetyLimit:!0,protocol:"https:"===window.location.protocol?"wss:":"ws:"});try{var o=new URL(this.options.path);this.options.host=o.hostname,this.options.port=o.port,this.options.protocol="https:"===o.protocol?"wss:":"ws:",this.options.path=o.pathname}catch(t){}this.url=new URL("".concat(this.options.protocol,"//").concat(this.options.host,":").concat(this.options.port)),this.url.pathname=this.options.path||"",_.map(this.options.params,(function(t,e){return r.url.searchParams.set(e,t)})),this.name=e,this.active=!1,this.connected=!1,this.pending=!1,this.fetching=!1,this.pending_calls={},this.listeners={},this.unique_listeners={},this.socket=null,this.state_listeners={},this.event_limits={},this.event_limits_to=null}var e,n,r;return e=t,(n=[{key:"connect",value:function(){var t=this;this.connected||(this.active=!0,this.pending=!0,this.options.debug&&this.logWarning("?>",this.url.href),this.socket=new o({url:this.url}),this.socket.addEventListener("open",(function(){return t.onOpen.apply(t,arguments)})),this.socket.addEventListener("close",(function(){return t.onClose.apply(t,arguments)})),this.socket.addEventListener("message",(function(){return t.receive.apply(t,arguments)})),this.updateState())}},{key:"onOpen",value:function(){var t=this;this.pending=!1,this.connected=!0,this.options.debug&&this.logSuccess("<>","!Connected"),_.map(this.pending_calls,(function(e,n){delete t.pending_calls[n],t.send(n,e)})),this.updateState()}},{key:"reconnect",value:function(){this.close(),this.connect()}},{key:"disconnect",value:function(){this.close()}},{key:"close",value:function(){this.socket&&this.socket.close(),this.pending=!1,this.connected=!1,this.updateState()}},{key:"onClose",value:function(t){this.pending=!1,this.connected=!1,this.options.debug&&this.logError("<x"),this.updateState()}},{key:"send",value:function(t,e,n){var r=this;this.connect();try{this.connected?(this.options.debug&&this.logInfo(">>",t,this.options.debug>1?e:""),n?setTimeout((function(){return r.socket.send(JSON.stringify({event:t,data:e}))}),n):this.socket.send(JSON.stringify({event:t,data:e}))):(this.pending_calls[t]=e,this.options.debug>2&&this.logError("Not sent","Socket is not connected yet"))}catch(n){this.pending_calls[t]=e,this.reconnect()}}},{key:"attachListener",value:function(t,e){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],r=arguments.length>3?arguments[3]:void 0,o=function(){e&&e.apply(void 0,arguments),r&&r(!1)},i=this.addListener(t,o);return n&&this.send(t,options)&&r&&r(!0),i}},{key:"disposeListener",value:function(t,e){var n=this,r=Math.random();return this.options.debug&&this.options.debug>2&&this.logInfo("+: ".concat(t,".").concat(e&&e.name)),this.connect(),!this.listeners[t]&&(this.listeners[t]={}),this.listeners[t][r]=e,function(){n.options.debug&&n.options.debug>2&&n.logInfo("-: ".concat(t,".").concat(e&&e.name));try{delete n.listeners[t][r]}catch(r){n.options.debug&&n.options.debug>2&&n.logError("-: ".concat(t,".").concat(e&&e.name," not found."))}}}},{key:"addListener",value:function(t,e){var n=this;return this.options.debug&&this.options.debug>2&&this.logInfo("-: ".concat(t,".").concat(e&&e.name)),this.connect(),!this.listeners[t]&&(this.listeners[t]={}),this.listeners[t][e]=e,function(){n.removeListener(t,e)}}},{key:"removeListener",value:function(t,e){this.options.debug&&this.options.debug>2&&this.logInfo("+: ".concat(t,".").concat(e&&e.name));try{delete this.listeners[t][e]}catch(n){this.options.debug&&this.options.debug>2&&this.logError("+: ".concat(t,".").concat(e&&e.name," not found."))}}},{key:"receive",value:function(t){var e=this,n=JSON.parse(t.data);n.error?this.options.debug&&this.logError("<!",n.event,this.options.debug>0?n.error:""):n.event&&(this.options.debug&&this.logSuccess("<<",n.event,this.options.debug>1?n.data:""),_.has(this.listeners,n.event)&&_.map(this.listeners[n.event],(function(t){return t&&t(n.data,e)})),_.has(this.unique_listeners,n.event)&&(this.unique_listeners[n.event](n.data,this),delete this.unique_listeners[n.event]))}},{key:"addStateListener",value:function(t,e){this.state_listeners[t]=e}},{key:"removeStateListener",value:function(t){this.state_listeners[t]&&delete this.state_listeners[t]}},{key:"updateState",value:function(){var t=this;_.map(this.state_listeners,(function(e){return _.isFunction(e)&&e(t)}))}},{key:"setArg",value:function(t,e){this.url.searchParams.set(t,e),this.reconnect()}},{key:"unsetArg",value:function(t){this.delArg(t)}},{key:"delArg",value:function(t){this.url.searchParams.delete(t),this.reconnect()}},{key:"once",value:function(t,e){this.options.debug&&this.options.debug>2&&this.logInfo("once: Method ".concat(t,".").concat(e&&e.name)),this.connect(),this.unique_listeners[t]=e}},{key:"request",value:function(t,e,n){var r=this;n=_.defaults(n,{method:"GET"});var o=this.link(t);this.options.debug&&this.logInfo(n.method,o,n),n.data&&(n.body=JSON.stringify(n.data)),this.fetching=!0,this.updateState(),fetch(o,n).then((function(t){return t.json()})).then(e).catch((function(t){r.logError(n.method,t)})).finally((function(){r.fetching=!0,r.updateState()}))}},{key:"link",value:function(t){var e=new URL(this.url);return e.pathname=e.pathname+t,e.protocol=document.location.protocol,e.href}},{key:"log",value:function(t,e,n){for(var r,o=arguments.length,i=new Array(o>3?o-3:0),c=3;c<o;c++)i[c-3]=arguments[c];(r=console).log.apply(r,["%c".concat(t," %c").concat(this.name,"%c:"),"font-weight:bold; color: ".concat(n),"margin-right: -5px; font-weight:bolder; color: white; background: ".concat(e),"color: ".concat(e)].concat(i))}},{key:"logSuccess",value:function(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),r=1;r<e;r++)n[r-1]=arguments[r];this.log.apply(this,[t,"#6eca1b","#6eca1b"].concat(n))}},{key:"logWarning",value:function(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),r=1;r<e;r++)n[r-1]=arguments[r];this.log.apply(this,[t,"orange","orange"].concat(n))}},{key:"logInfo",value:function(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),r=1;r<e;r++)n[r-1]=arguments[r];this.log.apply(this,[t,"#2196f3","#2196f3"].concat(n))}},{key:"logError",value:function(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),r=1;r<e;r++)n[r-1]=arguments[r];this.log.apply(this,[t,"red","red"].concat(n))}}])&&i(e.prototype,n),r&&i(e,r),t}();function s(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}function u(t,e,n){return(u=s()?Reflect.construct:function(t,e,n){var r=[null];r.push.apply(r,e);var o=new(Function.bind.apply(t,r));return n&&a(o,n.prototype),o}).apply(null,arguments)}function a(t,e){return(a=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var l={},f=function(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),r=1;r<e;r++)n[r-1]=arguments[r];l[t]=u(c,[t].concat(n))};function p(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var c,s=t[Symbol.iterator]();!(r=(c=s.next()).done)&&(n.push(c.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var d=function(t){return{consumer:t,active:t.active,fetching:t.fetching,pending:t.pending,connected:t.connected}},b=function(t){var e=Math.random(),n=l[t],r=p(React.useState(d(n)),2),o=r[0],i=r[1];return React.useEffect((function(){return n&&n.addStateListener(e,(function(t){return i(d(t))})),n&&n.connect(),function(){return n&&n.removeStateListener(e)}}),[]),o},h=n(0),y=n.n(h);function v(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function g(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?v(Object(n),!0).forEach((function(e){O(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):v(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function O(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function m(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var c,s=t[Symbol.iterator]();!(r=(c=s.next()).done)&&(n.push(c.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var j=function(t){_.isString(t)&&(t={event:t});var e=t,n=e.action,r=e.data,o=e.params,i=void 0===o?{}:o,c=e.passive,s=void 0!==c&&c,u=e.intercept,a=void 0===u?null:u,f=e.observe,p=void 0===f?null:f,d=t,b=d.event,h=d.stream,v=d.hash,O=void 0===v?null:v,j=d.listen,S=m(y.a.useState({data:r||{},fetching:!s}),2),w=S[0],P=S[1],E=function(){console.error("%c [_________] %c Sending impossibe: Consumer not found","font - weight: bolder; 'background: #222; color: #bada55'","font-weight:bold",t)},k=function(){return function(){}},A=null,x=null;if(h){var D=_.split(h,"#");D.length>=2&&(h=_.trim(D[0]),O=_.trim(D[1]))}if(h&&n&&(b=_.trim("".concat(h,".").concat(n))),b&&O&&(b="".concat(b,"#").concat(O)),j=_.isArray(j)?j:j?[j]:[b,JSON.stringify(i)],b){var I=_.split(b,":");I.length>=2&&(A=l[I[0]],x=I[1],A&&(E=function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];!e&&P(g(g({},w),{},{fetching:!0})),A.send(x,t||i)},k=function(){return A.disposeListener(x,(function(t){if(a){var e=a(t,w.data,L);!0===e?L(t):e&&L(e)}else L(t);p&&p(t,w.data,L)}))}))}var L=function(t){return P({data:t,fetching:!1})};return y.a.useEffect((function(){var t=k();return!s&&E(i),t}),j),g({stream:h,params:i,event:b,consumer:A,hash:O,send:E,refresh:function(){E(i)},dispatch:function(){E(i,!0)}},w)};function S(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}var w=function(t){var e=t.children,n=S(t,["children"]);return e(j(n))};function P(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function E(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var k=function(t){return _.isString(t)&&(t={event:t,passive:!0}),j(function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?P(Object(n),!0).forEach((function(e){E(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):P(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}({passive:!0},t))};function A(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function x(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?A(Object(n),!0).forEach((function(e){D(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):A(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function D(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function I(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}var L=function(t){var e=t.action,n=void 0===e?"search":e,r=t.filters,o=void 0===r?{}:r,i=t.page,c=void 0===i?1:i,s=t.limit,u=void 0===s?25:s,a=t.order,l=void 0===a?null:a,f=I(t,["action","filters","page","limit","order"]),p=j(x({action:n,params:_.merge({filters:o,page:c,limit:u,order:l},f.params)},f));return x(x({},p),{},{filters:o,search:p.send})};function R(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}var T=function(t){var e=t.children,n=R(t,["children"]);return e(L(n))};function C(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function N(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?C(Object(n),!0).forEach((function(e){W(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):C(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function W(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function M(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var c,s=t[Symbol.iterator]();!(r=(c=s.next()).done)&&(n.push(c.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function q(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}var G=function(t){var e=t.data,n=t.action,r=void 0===n?"delete":n,o=t.passive,i=void 0===o||o,c=t.params,s=void 0===c?{}:c,u=t.intercept,a=t.onSuccess,l=t.onErrors,f=t.pk,p=void 0===f?"id":f,d=q(t,["data","action","passive","params","intercept","onSuccess","onErrors","pk"]),b=M(y.a.useState(e),2),h=b[0],v=b[1],g=M(y.a.useState(!1),2),O=g[0],m=g[1],S=M(y.a.useState(null),2),w=S[0],P=S[1],E=u||function(t,n,r){t[p]!==e[p]&&t[p]!==s[p]||(t.errors?(m(!1),P(t.errors),console.error(t.errors),l&&l(t.errors)):(P(null),m(!0),a&&a(h)))},k=j(N({action:r,passive:i,params:h&&h[p]?N(N({},s),{},{id:h[p]}):s,intercept:E},d));return y.a.useEffect((function(){v(e)}),[e]),N(N({},k),{},{errors:w,success:O,deleted:O,submit:function(t){return k.send(N(N({},t||{}),{},{id:h[p]}))}})};function J(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function F(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function U(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}var B=function(t){var e=t.action,n=void 0===e?"retrieve":e,r=t.params,o=void 0===r?{}:r,i=t.versatile,c=void 0!==i&&i,s=t.intercept,u=t.pk,a=void 0===u?"id":u,l=U(t,["action","params","versatile","intercept","pk"]);return j(function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?J(Object(n),!0).forEach((function(e){F(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):J(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}({action:n,intercept:s||(c?null:function(t){return _.toString(t[a])==_.toString(o[a])})},l))};function V(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}var z=function(t){var e=t.deletable,n=V(t,["deletable"]),r=n.stream,o=n.data,i=n.pk;return e&&G({stream:r,data:o,pk:i}).deleted?null:children(B(n))};function H(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function K(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?H(Object(n),!0).forEach((function(e){Q(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):H(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function Q(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function X(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var c,s=t[Symbol.iterator]();!(r=(c=s.next()).done)&&(n.push(c.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function Y(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}var Z=function(t){var e=t.object,n=t.action,r=void 0===n?"form":n,o=t.passive,i=void 0!==o&&o,c=t.params,s=void 0===c?{}:c,u=t.intercept,a=t.onSuccess,l=t.onErrors,f=Y(t,["object","action","passive","params","intercept","onSuccess","onErrors"]),p=X(y.a.useState(e),2),d=p[0],b=p[1],h=X(y.a.useState(!1),2),v=h[0],g=h[1],O=X(y.a.useState(null),2),m=O[0],S=O[1],w=u||function(t,e,n){t.errors?(S(t.errors),l&&l(t.errors)):!0===t.success?(b(t.object),g(!0),a&&a(t.object)):n(t)},P=j(K({data:E,action:r,passive:i,params:d&&d.id?K(K({},s),{},{id:d.id}):K(K({},s),d),intercept:w},f)),E=P.data,k=Y(P,["data"]),A=E.fields||{};return _.map(A,(function(t){t.event&&k.api&&(t.stream="".concat(k.api.name,":").concat(t.event)),A[t.name]=t})),K(K({},k),{},{object:d,fields:A,errors:m,success:v,setValue:function(t,e){return setData(K(K({},E),{},Q({},t,e)))},submit:function(t){return k.send(d&&d.id?K(K({},s),{},{submit:t,id:E.id}):K(K(K({},s),d),{},{submit:t,id:E.id}))}})};function $(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}var tt=function(t){var e=t.children,n=$(t,["children"]);return e(Z(n))};function et(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function nt(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?et(Object(n),!0).forEach((function(e){rt(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):et(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function rt(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function ot(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var c,s=t[Symbol.iterator]();!(r=(c=s.next()).done)&&(n.push(c.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function it(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}var ct=function(t){var e=t.data,n=t.action,r=void 0===n?"save":n,o=t.passive,i=void 0===o||o,c=t.params,s=void 0===c?{}:c,u=t.intercept,a=t.onSuccess,l=t.onErrors,f=it(t,["data","action","passive","params","intercept","onSuccess","onErrors"]),p=ot(y.a.useState(e),2),d=p[0],b=p[1],h=ot(y.a.useState(!1),2),v=h[0],g=h[1],O=ot(y.a.useState(null),2),m=O[0],S=O[1],w=u||function(t,e,n){t.errors?(g(!1),S(t.errors),console.error(t.errors),l&&l(t.errors)):(n(nt(nt({},d),{},{id:t.id})),S(null),g(!0),a&&a(d))},P=j(nt({action:r,passive:i,params:d&&d.id?nt(nt({},s),{},{id:d.id}):s,intercept:w},f));return y.a.useEffect((function(){b(e)}),[e]),nt(nt({},P),{},{data:d,errors:m,success:v,setValue:function(t,e){return b(nt(nt({},d),{},rt({},t,e)))},submit:function(t){return P.send(nt(nt({},t||d),{},{id:d.id}))}})};function st(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}var ut=function(t){var e=t.children,n=st(t,["children"]);return e(ct(n))};function at(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}var lt=function(t){var e=t.children,n=at(t,["children"]),r=G(n);r.deleted;return e(at(r,["deleted"]))};function ft(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var c,s=t[Symbol.iterator]();!(r=(c=s.next()).done)&&(n.push(c.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var pt=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:350,n=React.useState(t),r=ft(n,2),o=r[0],i=r[1];return React.useEffect((function(){var n=setTimeout((function(){i(t)}),e);return function(){clearTimeout(n)}}),[t]),o};function dt(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var c,s=t[Symbol.iterator]();!(r=(c=s.next()).done)&&(n.push(c.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var bt=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:350,n=React.useState(t),r=dt(n,2),o=r[0],i=r[1];return[o,pt(o,e),i]};n.d(e,"useConsumer",(function(){return b})),n.d(e,"registerConsumer",(function(){return f})),n.d(e,"Bind",(function(){return w})),n.d(e,"useBind",(function(){return j})),n.d(e,"usePassiveBind",(function(){return k})),n.d(e,"Search",(function(){return T})),n.d(e,"useSearch",(function(){return L})),n.d(e,"Retrieve",(function(){return z})),n.d(e,"useRetrieve",(function(){return B})),n.d(e,"Form",(function(){return tt})),n.d(e,"useForm",(function(){return Z})),n.d(e,"Save",(function(){return ut})),n.d(e,"useSave",(function(){return ct})),n.d(e,"Delete",(function(){return lt})),n.d(e,"useDelete",(function(){return G})),n.d(e,"useDebouncedState",(function(){return bt})),n.d(e,"useDebounced",(function(){return pt}))}]);