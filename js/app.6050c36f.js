(function(){"use strict";var t={4271:function(t,e,i){var n=i(144),s=i(998),r=i(2436),a=i(266),o=i(4324),l=i(1713),u=i(8718),c=i(5443),f=function(){var t=this,e=t._self._c;return e(s.Z,{attrs:{id:"app"}},[e(l.Z,{attrs:{"no-gutters":""}},[e(a.Z,{attrs:{cols:8}},[e("div",{ref:"surface",staticClass:"main-container"})]),e(a.Z,{attrs:{cols:4}},[e(c.Z,{staticClass:"mt-10 px-10",attrs:{filled:"",rows:15,label:"粘贴运行结果"},model:{value:t.inputStr,callback:function(e){t.inputStr=e},expression:"inputStr"}}),e(l.Z,{staticClass:"mt-1",attrs:{"no-gutters":""}},[e(u.Z),e(u.Z),e(r.Z,{attrs:{color:"warning",outlined:""},on:{click:t.submit}},[e(o.Z,{staticClass:"mr-2"},[t._v("mdi-check")]),t._v(" 确认 ")],1),e(u.Z),e(r.Z,{attrs:{color:"success",outlined:""},on:{click:t.reset}},[e(o.Z,{staticClass:"mr-2"},[t._v("mdi-close-circle-outline")]),t._v(" 清空 ")],1),e(u.Z),e(u.Z)],1),e(l.Z,{staticClass:"mt-7",attrs:{"no-gutters":""}},[t.failed.length?e("div",{staticClass:"red--text text-body-2 ml-10"},[t._v(t._s(t.failed))]):t._e()])],1)],1)],1)},h=[];function m(t){let e=[],i=[],n=[];return t.trim().split("\n").map((t=>t.trim().split(/\s+/))).forEach((t=>{15===t.length?e=t:16===t.length&&(i.push(t[0]),n.push(Array(t.length-1).fill(1).map(((e,i)=>parseInt(t[i+1])))))})),{xAxis:e,yAxis:i,map:n}}var p={data:function(){return{echarts:null,inputStr:"",xAxis:[],yAxis:[],mountain:[],failed:"",colors:["#313695","#4575b4","#74add1","#abd9e9","#e0f3f8","#ffffbf","#fee090","#fdae61","#f46d43","#d73027","#a50026"],lights:{main:{intensity:.3,alpha:135,beta:45},ambient:{intensity:.8}},viewControl:{projection:"perspective",alpha:15,beta:-150,distance:270},textStyle:{fontSize:15,fontFamily:"Serif"},nameStyle:{fontSize:17,fontFamily:"Serif"}}},mounted(){this.echarts=this.$echarts.init(this.$refs.surface),this.colors.reverse();const t=this.$route.query["map"];if(t){this.inputStr=t;const e=m(t);e["xAxis"].length>0&&e["yAxis"].length>0&&(this.mountain=e["map"],this.xAxis=e["xAxis"],this.yAxis=e["yAxis"])}this.refresh()},methods:{refresh(){let t=[];this.mountain.forEach(((e,i)=>e.forEach(((e,n)=>t.push([i,n,e]))))),this.echarts.setOption({visualMap:{show:!1,min:Math.min(...t.map((t=>t[2]))),max:Math.max(...t.map((t=>t[2]))),color:this.colors},grid3D:{light:this.lights,viewControl:this.viewControl},xAxis3D:{type:"category",data:this.xAxis,name:"工作集大小（字节）",nameTextStyle:this.nameStyle,axisLabel:{textStyle:this.textStyle}},yAxis3D:{type:"category",data:this.yAxis,name:"步长（字）",nameTextStyle:this.nameStyle,axisLabel:{textStyle:this.textStyle}},zAxis3D:{name:"读吞吐率（MB/s）",nameTextStyle:this.nameStyle,axisLabel:{show:t.length>0,textStyle:this.textStyle}},series:[{type:"surface",data:t}]})},submit(){if(0===this.inputStr.length)this.failed="* 你没有输入任何内容。";else{const t=m(this.inputStr);0===t["xAxis"].length&&0===t["yAxis"].length?this.failed="* 解析失败，请检查您的输入。":(this.failed="",this.mountain=t["map"],this.xAxis=t["xAxis"],this.yAxis=t["yAxis"],this.refresh())}},reset(){this.failed="",this.inputStr="",this.mountain=[],this.xAxis=this.yAxis=[],this.refresh()}}},x=p,d=i(1001),y=(0,d.Z)(x,f,h,!1,null,"d6524ef0",null),v=y.exports,b=i(8345),g=i(8864);i(8556);n.ZP.use(g.Z);var S=new g.Z({breakpoint:{mobileBreakpoint:"sm"},icons:{iconfont:"mdiSvg"}}),Z=i(150);i(1747);n.ZP.use(b.Z),n.ZP.prototype.$echarts=Z,n.ZP.config.productionTip=!1;const A=new b.Z({mode:"history",base:""});new n.ZP({router:A,vuetify:S,render:t=>t(v)}).$mount("#app")}},e={};function i(n){var s=e[n];if(void 0!==s)return s.exports;var r=e[n]={exports:{}};return t[n](r,r.exports,i),r.exports}i.m=t,function(){var t=[];i.O=function(e,n,s,r){if(!n){var a=1/0;for(c=0;c<t.length;c++){n=t[c][0],s=t[c][1],r=t[c][2];for(var o=!0,l=0;l<n.length;l++)(!1&r||a>=r)&&Object.keys(i.O).every((function(t){return i.O[t](n[l])}))?n.splice(l--,1):(o=!1,r<a&&(a=r));if(o){t.splice(c--,1);var u=s();void 0!==u&&(e=u)}}return e}r=r||0;for(var c=t.length;c>0&&t[c-1][2]>r;c--)t[c]=t[c-1];t[c]=[n,s,r]}}(),function(){i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,{a:e}),e}}(),function(){i.d=function(t,e){for(var n in e)i.o(e,n)&&!i.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})}}(),function(){i.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}}(),function(){var t={143:0};i.O.j=function(e){return 0===t[e]};var e=function(e,n){var s,r,a=n[0],o=n[1],l=n[2],u=0;if(a.some((function(e){return 0!==t[e]}))){for(s in o)i.o(o,s)&&(i.m[s]=o[s]);if(l)var c=l(i)}for(e&&e(n);u<a.length;u++)r=a[u],i.o(t,r)&&t[r]&&t[r][0](),t[r]=0;return i.O(c)},n=self["webpackChunkmemory_mountain"]=self["webpackChunkmemory_mountain"]||[];n.forEach(e.bind(null,0)),n.push=e.bind(null,n.push.bind(n))}();var n=i.O(void 0,[998],(function(){return i(4271)}));n=i.O(n)})();