!function(e){var t={};function r(n){if(t[n])return t[n].exports;var u=t[n]={i:n,l:!1,exports:{}};return e[n].call(u.exports,u,u.exports,r),u.l=!0,u.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var u in e)r.d(n,u,function(t){return e[t]}.bind(null,u));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,n){"use strict";n.r(t);var u={ROW:0,COL:1,UP:0,RIGHT:1,DOWN:2,LEFT:3,WEIGHT:.5,HEIGHT:3,WIDTH:3};const o=1,l=0,f=1,i=2,p=3,h=.5,a=3,s=3;var z=[],d=[];t.default=function(e){let t=function(e){let t=e.match(new RegExp("[0-9]","g"));if(null==t||9!=t.length)throw new Error("Given string must includes exact 9 numbers covering between 0 and 9.");let r=[],n=0,u=[];for(ex of t)n%s==0&&(u=[]),u.push(Number(ex)),n%s==s-1&&r.push(u),n++;return r}(e);for(z.push({puzzle:t,path:[],hash:""});;){if(0==z.lengh)throw new Error("There is no more nodes to be checked.");let e=b(z[0]),t=z[0];for(let r=0;r<z.length;r++){let n=b(z[r]);n<e&&(e=n,t=z[r])}let r=O(t,b(t));if(r)return r.path.join(",")}};function O(e,t,r=""){if(function(e){let t=0;for(let r=0;r<e.length;r++)for(let n=0;n<e[r].length;n++)if(t++!=e[r][n])return!1;return!0}(e.puzzle))return e;if(b(e)>t)return!1;let n=function(e){let t=y(e.puzzle),r=[];if(t[o]<s-1){let t=x(e.path);t.push(f),r.push({puzzle:m(j(e.puzzle)),path:t})}if(t[u.ROW]>0){let t=x(e.path);t.push(l),r.push({puzzle:R(j(e.puzzle)),path:t})}if(t[o]>0){let t=x(e.path);t.push(p),r.push({puzzle:v(j(e.puzzle)),path:t})}if(t[u.ROW]<a-1){let t=x(e.path);t.push(i),r.push({puzzle:g(j(e.puzzle)),path:t})}return r.map(e=>(e.hash=function(e){return e.path.reduce((e,t)=>e+(""===e?"":"-")+t,"")}(e),e))}(e);n=n.filter(e=>!d.includes(W(e.puzzle))),z.push(...n),d.push(W(e.puzzle)),z=(z=z.filter(t=>t.hash!==e.hash)).filter(e=>!d.includes(W(e.puzzle)));for(let e of n){let n=O(e,t,r+"    ");if(n)return n}return!1}function W(e){let t="";for(let r of e){for(let e of r)t+=e;t+="-"}return t}function b(e){return e.path.length*h+function(e){let t=0;for(let r of e)for(let e of r)t+=Math.floor(e/3)+e%3;return t}(e.puzzle)*(1-h)}function R(e){let t=y(e),r=x(e);return r[t[u.ROW]][t[o]]=r[t[u.ROW]-1][t[o]],r[t[u.ROW]-1][t[o]]=0,r}function g(e){let t=y(e),r=x(e);return r[t[u.ROW]][t[o]]=r[t[u.ROW]+1][t[o]],r[t[u.ROW]+1][t[o]]=0,r}function m(e){let t=y(e),r=x(e);return r[t[u.ROW]][t[o]]=r[t[u.ROW]][t[o]+1],r[t[u.ROW]][t[o]+1]=0,r}function v(e){let t=y(e),r=x(e);return r[t[u.ROW]][t[o]]=r[t[u.ROW]][t[o]-1],r[t[u.ROW]][t[o]-1]=0,r}function y(e){r=0;for(let t of e){c=0;for(let e of t){if(0==e)return[r,c];c++}r++}return[]}function x(e){return e?e.slice(0):[]}function j(e){let t=[];for(let r of e){let e=[];for(let t of r)e.push(t);t.push(e)}return t}}]);