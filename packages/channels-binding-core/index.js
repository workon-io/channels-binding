module.exports=function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){e.exports=require("react")},function(e,t,n){"use strict";function r(e){this.settings=_.defaults(e,{debug:!0,protocols:[],args:{},automaticOpen:!0,reconnectInterval:1e3,maxReconnectInterval:3e4,reconnectDecay:1.5,timeoutInterval:2e3,maxReconnectAttempts:null,binaryType:"blob"}),this.reconnectAttempts=0,this.readyState=WebSocket.CONNECTING,this.protocol=null;var t,n=this,o=!1,i=!1,c=document.createElement("div");function s(e,t){var n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!1,!1,t),n}c.addEventListener("open",(function(e){n.onopen(e)})),c.addEventListener("close",(function(e){n.onclose(e)})),c.addEventListener("connecting",(function(e){n.onconnecting(e)})),c.addEventListener("message",(function(e){n.onmessage(e)})),c.addEventListener("error",(function(e){n.onerror(e)})),this.addEventListener=c.addEventListener.bind(c),this.removeEventListener=c.removeEventListener.bind(c),this.dispatchEvent=c.dispatchEvent.bind(c),this.open=function(e){if((t=new WebSocket("".concat(n.settings.url),n.settings.protocols,{})).rejectUnauthorized=!1,t.binaryType=this.settings.binaryType,e){if(this.settings.maxReconnectAttempts&&this.reconnectAttempts>this.settings.maxReconnectAttempts)return}else c.dispatchEvent(s("connecting")),this.reconnectAttempts=0;(n.settings.debug||r.debugAll)&&console.debug("ReconnectingWebSocket","attempt-connect",n.url);var u=t,a=setTimeout((function(){(n.settings.debug||r.debugAll)&&console.debug("ReconnectingWebSocket","connection-timeout",n.url),i=!0,u.close(),i=!1}),n.settings.timeoutInterval);t.onopen=function(o){clearTimeout(a),(n.settings.debug||r.debugAll)&&console.debug("ReconnectingWebSocket","onopen",n.url),n.protocol=t.protocol,n.readyState=WebSocket.OPEN,n.reconnectAttempts=0;var i=s("open");i.isReconnect=e,e=!1,c.dispatchEvent(i)},t.onclose=function(u){if(clearTimeout(l),t=null,o)n.readyState=WebSocket.CLOSED,c.dispatchEvent(s("close"));else{n.readyState=WebSocket.CONNECTING;var a=s("connecting");a.code=u.code,a.reason=u.reason,a.wasClean=u.wasClean,c.dispatchEvent(a),e||i||((n.settings.debug||r.debugAll)&&console.debug("ReconnectingWebSocket","onclose",n.url),c.dispatchEvent(s("close")));var l=n.settings.reconnectInterval*Math.pow(n.settings.reconnectDecay,n.reconnectAttempts);setTimeout((function(){n.reconnectAttempts++,n.open(!0)}),l>n.settings.maxReconnectInterval?n.settings.maxReconnectInterval:l)}},t.onmessage=function(e){(n.settings.debug||r.debugAll)&&console.debug("ReconnectingWebSocket","onmessage",n.url,e.data);var t=s("message");t.data=e.data,c.dispatchEvent(t)},t.onerror=function(e){(n.settings.debug||r.debugAll)&&console.debug("ReconnectingWebSocket","onerror",n.url,e),c.dispatchEvent(s("error"))}},1==this.settings.automaticOpen&&this.open(!1),this.send=function(e){if(t)return(n.settings.debug||r.debugAll)&&console.debug("ReconnectingWebSocket","send",n.url,e),t.send(e);throw"INVALID_STATE_ERR : Pausing to reconnect websocket"},this.close=function(e,n){void 0===e&&(e=1e3),o=!0,t&&t.close(e,n)},this.refresh=function(){t&&t.close()}}n.r(t),r.prototype.onopen=function(e){},r.prototype.onclose=function(e){},r.prototype.onconnecting=function(e){},r.prototype.onmessage=function(e){},r.prototype.onerror=function(e){},r.debugAll=!1,r.CONNECTING=WebSocket.CONNECTING,r.OPEN=WebSocket.OPEN,r.CLOSING=WebSocket.CLOSING,r.CLOSED=WebSocket.CLOSED;var o=r;function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var c=function(){function e(t,n){var r=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.options=_.defaults(n,{host:window.location.hostname,port:window.location.port,path:null,debug:0,params:{},safetyLimit:!0,protocol:"https:"===window.location.protocol?"wss:":"ws:"}),this.url=new URL("".concat(this.options.protocol,"//").concat(this.options.host,":").concat(this.options.port)),this.url.pathname=this.options.path||"",_.map(this.options.params,(function(e,t){return r.url.searchParams.set(t,e)})),this.name=t,this.active=!1,this.connected=!1,this.pending=!1,this.fetching=!1,this.pending_calls={},this.listeners={},this.unique_listeners={},this.socket=null,this.state_listeners={},this.event_limits={},this.event_limits_to=null}var t,n,r;return t=e,(n=[{key:"connect",value:function(){var e=this;this.connected||(this.active=!0,this.pending=!0,this.options.debug&&this.logSuccess("Connecting",this.url.href),this.socket=new o({url:this.url}),this.socket.addEventListener("open",(function(){return e.onOpen.apply(e,arguments)})),this.socket.addEventListener("close",(function(){return e.onClose.apply(e,arguments)})),this.socket.addEventListener("message",(function(){return e.receive.apply(e,arguments)})),this.updateState())}},{key:"onOpen",value:function(){var e=this;this.pending=!1,this.connected=!0,this.options.debug&&this.logSuccess("Connected"),_.map(this.pending_calls,(function(t,n){delete e.pending_calls[n],e.send(n,t)})),this.updateState()}},{key:"reconnect",value:function(){this.close(),this.connect()}},{key:"disconnect",value:function(){this.close()}},{key:"close",value:function(){this.socket&&this.socket.close(),this.pending=!1,this.connected=!1,this.updateState()}},{key:"onClose",value:function(e){this.pending=!1,this.connected=!1,this.options.debug&&this.logError("Closed"),this.updateState()}},{key:"send",value:function(e,t,n){var r=this;if(this.connect(),this.options.safetyLimit&&(this.event_limits[e]?this.event_limits[e]+=1:this.event_limits[e]=1,this.event_limits_to&&clearTimeout(this.event_limits_to),this.event_limits_to=setTimeout((function(){return delete r.event_limits[e]}),1e3),this.event_limits[e]>100))throw"Channels binding Consumer.safetyLimit => Too many event sending occured in too few ms ellasped.";try{this.connected?(this.options.debug&&this.logInfo("Sent",e,this.options.debug>1&&t),n?setTimeout((function(){return r.socket.send(JSON.stringify({event:e,data:t}))}),n):this.socket.send(JSON.stringify({event:e,data:t}))):(this.pending_calls[e]=t,this.options.debug>2&&this.logError("Not sent","Socket is not connected yet"))}catch(e){this.reconnect()}}},{key:"attachListener",value:function(e,t){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],r=arguments.length>3?arguments[3]:void 0,o=function(){t&&t.apply(void 0,arguments),r&&r(!1)},i=this.addListener(e,o);return n&&this.send(e,options)&&r&&r(!0),i}},{key:"disposeListener",value:function(e,t){var n=this,r=Math.random();return this.options.debug&&this.options.debug>2&&this.logInfo("addListener: ".concat(e,".").concat(t&&t.name)),this.connect(),!this.listeners[e]&&(this.listeners[e]={}),this.listeners[e][r]=t,function(){n.options.debug&&n.options.debug>2&&n.logInfo("removeListener: ".concat(e,".").concat(t&&t.name));try{delete n.listeners[e][r]}catch(r){n.options.debug&&n.options.debug>2&&n.logError("removeListener: ".concat(e,".").concat(t&&t.name," not found."))}}}},{key:"addListener",value:function(e,t){var n=this;return this.options.debug&&this.options.debug>2&&this.logInfo("addListener: ".concat(e,".").concat(t&&t.name)),this.connect(),!this.listeners[e]&&(this.listeners[e]={}),this.listeners[e][t]=t,function(){n.removeListener(e,t)}}},{key:"removeListener",value:function(e,t){this.options.debug&&this.options.debug>2&&this.logInfo("removeListener: ".concat(e,".").concat(t&&t.name));try{delete this.listeners[e][t]}catch(n){this.options.debug&&this.options.debug>2&&this.logError("removeListener: ".concat(e,".").concat(t&&t.name," not found."))}}},{key:"receive",value:function(e){var t=this,n=JSON.parse(e.data);"error"==n.event?this.options.debug&&this.logError("Error",this.options.debug>1&&n.data):n.event&&(this.options.debug&&this.logSuccess("Receive",n.event,this.options.debug>1&&n.data),_.has(this.listeners,n.event)&&_.map(this.listeners[n.event],(function(e){return e&&e(n.data,t)})),_.has(this.unique_listeners,n.event)&&(this.unique_listeners[n.event](n.data,this),delete this.unique_listeners[n.event]))}},{key:"addStateListener",value:function(e,t){this.state_listeners[e]=t}},{key:"removeStateListener",value:function(e){this.state_listeners[e]&&delete this.state_listeners[e]}},{key:"updateState",value:function(){var e=this;_.map(this.state_listeners,(function(t){return _.isFunction(t)&&t(e)}))}},{key:"setArg",value:function(e,t){this.url.searchParams.set(e,t),this.reconnect()}},{key:"unsetArg",value:function(e){this.delArg(e)}},{key:"delArg",value:function(e){this.url.searchParams.delete(e),this.reconnect()}},{key:"once",value:function(e,t){this.options.debug&&this.options.debug>2&&this.logInfo("once: Method ".concat(e,".").concat(t&&t.name)),this.connect(),this.unique_listeners[e]=t}},{key:"request",value:function(e,t,n){var r=this;n=_.defaults(n,{method:"GET"});var o=this.link(e);this.options.debug&&this.logInfo(n.method,o,n),n.data&&(n.body=JSON.stringify(n.data)),this.fetching=!0,this.updateState(),fetch(o,n).then((function(e){return e.json()})).then(t).catch((function(e){r.logError(n.method,e)})).finally((function(){r.fetching=!0,r.updateState()}))}},{key:"link",value:function(e){var t=new URL(this.url);return t.pathname=t.pathname+e,t.protocol=document.location.protocol,t.href}},{key:"log",value:function(e,t){for(var n,r=arguments.length,o=new Array(r>2?r-2:0),i=2;i<r;i++)o[i-2]=arguments[i];(n=console).log.apply(n,["%c [".concat(_.toUpper(this.name),"] %c ").concat(e),"font-weight:bolder; ".concat(t),"font-weight:bold"].concat(o))}},{key:"logSuccess",value:function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];this.log.apply(this,[e,"background: #bada55; color: #222"].concat(n))}},{key:"logInfo",value:function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];this.log.apply(this,[e,"background: #222; color: #bada55"].concat(n))}},{key:"logError",value:function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];this.log.apply(this,[e,"background: red; color: white"].concat(n))}}])&&i(t.prototype,n),r&&i(t,r),e}();function s(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}function u(e,t,n){return(u=s()?Reflect.construct:function(e,t,n){var r=[null];r.push.apply(r,t);var o=new(Function.bind.apply(e,r));return n&&a(o,n.prototype),o}).apply(null,arguments)}function a(e,t){return(a=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var l={},f=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];l[e]=u(c,[e].concat(n))};function p(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(!(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var c,s=e[Symbol.iterator]();!(r=(c=s.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var d=function(e){return{consumer:e,active:e.active,fetching:e.fetching,pending:e.pending,connected:e.connected}},b=function(e){var t=Math.random(),n=l[e],r=p(React.useState(d(n)),2),o=r[0],i=r[1];return React.useEffect((function(){return n&&n.addStateListener(t,(function(e){return i(d(e))})),n&&n.connect(),function(){return n&&n.removeStateListener(t)}}),[]),o},h=n(0),v=n.n(h);function y(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function g(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?y(Object(n),!0).forEach((function(t){O(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):y(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function O(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function m(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(!(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var c,s=e[Symbol.iterator]();!(r=(c=s.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var j=function(e){var t=e.action,n=e.data,r=e.params,o=void 0===r?{}:r,i=e.passive,c=void 0!==i&&i,s=e.intercept,u=void 0===s?null:s,a=e.observe,f=void 0===a?null:a,p=e.event,d=e.stream,b=e.hash,h=void 0===b?null:b,y=e.listen,O=m(v.a.useState({data:n||{},fetching:!c}),2),j=O[0],S=O[1],w=function(){console.error("%c [_________] %c Sending impossibe: Consumer not found","font - weight: bolder; 'background: #222; color: #bada55'","font-weight:bold",e)},P=function(){return function(){}},E=null,k=null;if(d){var A=_.split(d,"#");A.length>=2&&(d=_.trim(A[0]),h=_.trim(A[1]))}if(d&&t&&(p=_.trim("".concat(d,".").concat(t))),y=_.isArray(y)?y:y?[y]:[JSON.stringify(o)],p){h&&(p="".concat(p,"#").concat(h));var x=_.split(p,":");x.length>=2&&(E=l[x[0]],k=x[1],E&&(w=function(e){S(g(g({},j),{},{fetching:!0})),E.send(k,e||o)},P=function(){return E.disposeListener(k,(function(e){if(u){var t=u(e,j.data,I);!0===t?I(e):t&&I(t)}else I(e);f&&f(e,j.data,I)}))}))}var I=function(e){return S({data:e,fetching:!1})};return v.a.useEffect((function(){var e=P();return!c&&w(o),e}),y),g({stream:d,event:p,consumer:E,hash:h,send:w,refresh:function(){w(o)}},j)};function S(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var w=function(e){var t=e.children,n=S(e,["children"]);return t(j(n))};function P(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function E(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?P(Object(n),!0).forEach((function(t){k(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):P(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function k(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function A(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var x=function(e){var t=e.action,n=void 0===t?"search":t,r=e.filters,o=void 0===r?{}:r,i=e.page,c=void 0===i?1:i,s=e.limit,u=void 0===s?25:s,a=e.order,l=void 0===a?null:a,f=A(e,["action","filters","page","limit","order"]),p=j(E({action:n,params:_.merge({filters:o,page:c,limit:u,order:l},f.params)},f));return E(E({},p),{},{filters:o,search:p.send})};function I(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var L=function(e){var t=e.children,n=I(e,["children"]);return t(x(n))};function D(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function R(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?D(Object(n),!0).forEach((function(t){T(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):D(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function T(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function C(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(!(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var c,s=e[Symbol.iterator]();!(r=(c=s.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function N(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var W=function(e){var t=e.data,n=e.action,r=void 0===n?"delete":n,o=e.passive,i=void 0===o||o,c=e.params,s=void 0===c?{}:c,u=e.intercept,a=e.onSuccess,l=e.onErrors,f=e.pk,p=void 0===f?"id":f,d=N(e,["data","action","passive","params","intercept","onSuccess","onErrors","pk"]),b=C(v.a.useState(t),2),h=b[0],y=b[1],g=C(v.a.useState(!1),2),O=g[0],m=g[1],S=C(v.a.useState(null),2),w=S[0],P=S[1],E=u||function(e,n,r){e[p]!==t[p]&&e[p]!==s[p]||(e.errors?(m(!1),P(e.errors),console.error(e.errors),l&&l(e.errors)):(P(null),m(!0),a&&a(h)))},k=j(R({action:r,passive:i,params:h&&h[p]?R(R({},s),{},{id:h[p]}):s,intercept:E},d));return v.a.useEffect((function(){y(t)}),[t]),R(R({},k),{},{errors:w,success:O,deleted:O,submit:function(e){return k.send(R(R({},e||{}),{},{id:h[p]}))}})};function M(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function q(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function G(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var J=function(e){var t=e.action,n=void 0===t?"retrieve":t,r=e.params,o=void 0===r?{}:r,i=e.versatile,c=void 0!==i&&i,s=e.intercept,u=e.pk,a=void 0===u?"id":u,l=G(e,["action","params","versatile","intercept","pk"]);return j(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?M(Object(n),!0).forEach((function(t){q(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):M(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({action:n,intercept:s||(c?null:function(e){return _.toString(e[a])==_.toString(o[a])})},l))};function F(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var U=function(e){var t=e.deletable,n=F(e,["deletable"]),r=n.stream,o=n.data,i=n.pk;return t&&W({stream:r,data:o,pk:i}).deleted?null:children(J(n))};function V(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function B(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?V(Object(n),!0).forEach((function(t){z(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):V(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function z(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function H(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(!(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var c,s=e[Symbol.iterator]();!(r=(c=s.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function K(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var Q=function(e){var t=e.object,n=e.action,r=void 0===n?"form":n,o=e.passive,i=void 0!==o&&o,c=e.params,s=void 0===c?{}:c,u=e.intercept,a=e.onSuccess,l=e.onErrors,f=K(e,["object","action","passive","params","intercept","onSuccess","onErrors"]),p=H(v.a.useState(t),2),d=p[0],b=p[1],h=H(v.a.useState(!1),2),y=h[0],g=h[1],O=H(v.a.useState(null),2),m=O[0],S=O[1],w=u||function(e,t,n){e.errors?(S(e.errors),l&&l(e.errors)):!0===e.success?(b(e.object),g(!0),a&&a(e.object)):n(e)},P=j(B({data:E,action:r,passive:i,params:d&&d.id?B(B({},s),{},{id:d.id}):B(B({},s),d),intercept:w},f)),E=P.data,k=K(P,["data"]),A=E.fields||{};return _.map(A,(function(e){e.event&&k.api&&(e.stream="".concat(k.api.name,":").concat(e.event)),A[e.name]=e})),B(B({},k),{},{object:d,fields:A,errors:m,success:y,setValue:function(e,t){return setData(B(B({},E),{},z({},e,t)))},submit:function(e){return k.send(d&&d.id?B(B({},s),{},{submit:e,id:E.id}):B(B(B({},s),d),{},{submit:e,id:E.id}))}})};function X(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var Y=function(e){var t=e.children,n=X(e,["children"]);return t(Q(n))};function Z(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function $(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Z(Object(n),!0).forEach((function(t){ee(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Z(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function ee(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function te(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(!(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var c,s=e[Symbol.iterator]();!(r=(c=s.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function ne(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var re=function(e){var t=e.data,n=e.action,r=void 0===n?"save":n,o=e.passive,i=void 0===o||o,c=e.params,s=void 0===c?{}:c,u=e.intercept,a=e.onSuccess,l=e.onErrors,f=ne(e,["data","action","passive","params","intercept","onSuccess","onErrors"]),p=te(v.a.useState(t),2),d=p[0],b=p[1],h=te(v.a.useState(!1),2),y=h[0],g=h[1],O=te(v.a.useState(null),2),m=O[0],S=O[1],w=u||function(e,t,n){e.errors?(g(!1),S(e.errors),console.error(e.errors),l&&l(e.errors)):(n($($({},d),{},{id:e.id})),S(null),g(!0),a&&a(d))},P=j($({action:r,passive:i,params:d&&d.id?$($({},s),{},{id:d.id}):s,intercept:w},f));return v.a.useEffect((function(){b(t)}),[t]),$($({},P),{},{data:d,errors:m,success:y,setValue:function(e,t){return b($($({},d),{},ee({},e,t)))},submit:function(e){return P.send($($({},e||d),{},{id:d.id}))}})};function oe(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var ie=function(e){var t=e.children,n=oe(e,["children"]);return t(re(n))};function ce(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var se=function(e){var t=e.children,n=ce(e,["children"]),r=W(n);r.deleted;return t(ce(r,["deleted"]))};function ue(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(!(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var c,s=e[Symbol.iterator]();!(r=(c=s.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var ae=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:350,n=React.useState(e),r=ue(n,2),o=r[0],i=r[1];return React.useEffect((function(){var n=setTimeout((function(){i(e)}),t);return function(){clearTimeout(n)}}),[e]),o};function le(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(!(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var c,s=e[Symbol.iterator]();!(r=(c=s.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var fe=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:350,n=React.useState(e),r=le(n,2),o=r[0],i=r[1];return[o,ae(o,t),i]};n.d(t,"useConsumer",(function(){return b})),n.d(t,"registerConsumer",(function(){return f})),n.d(t,"Bind",(function(){return w})),n.d(t,"useBind",(function(){return j})),n.d(t,"Search",(function(){return L})),n.d(t,"useSearch",(function(){return x})),n.d(t,"Retrieve",(function(){return U})),n.d(t,"useRetrieve",(function(){return J})),n.d(t,"Form",(function(){return Y})),n.d(t,"useForm",(function(){return Q})),n.d(t,"Save",(function(){return ie})),n.d(t,"useSave",(function(){return re})),n.d(t,"Delete",(function(){return se})),n.d(t,"useDelete",(function(){return W})),n.d(t,"useDebouncedState",(function(){return fe})),n.d(t,"useDebounced",(function(){return ae}))}]);