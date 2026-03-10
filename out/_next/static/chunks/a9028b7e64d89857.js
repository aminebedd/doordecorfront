(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,25913,e=>{"use strict";var t=e.i(7670);let r=e=>"boolean"==typeof e?`${e}`:0===e?"0":e,a=t.clsx;e.s(["cva",0,(e,t)=>s=>{var i;if((null==t?void 0:t.variants)==null)return a(e,null==s?void 0:s.class,null==s?void 0:s.className);let{variants:n,defaultVariants:l}=t,o=Object.keys(n).map(e=>{let t=null==s?void 0:s[e],a=null==l?void 0:l[e];if(null===t)return null;let i=r(t)||r(a);return n[e][i]}),d=s&&Object.entries(s).reduce((e,t)=>{let[r,a]=t;return void 0===a||(e[r]=a),e},{});return a(e,o,null==t||null==(i=t.compoundVariants)?void 0:i.reduce((e,t)=>{let{class:r,className:a,...s}=t;return Object.entries(s).every(e=>{let[t,r]=e;return Array.isArray(r)?r.includes({...l,...d}[t]):({...l,...d})[t]===r})?[...e,r,a]:e},[]),null==s?void 0:s.class,null==s?void 0:s.className)}])},67881,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(91918),s=e.i(25913),i=e.i(47163);let n=(0,s.cva)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),l=r.forwardRef(({className:e,variant:r,size:s,asChild:l=!1,...o},d)=>{let c=l?a.Slot:"button";return(0,t.jsx)(c,{className:(0,i.cn)(n({variant:r,size:s,className:e})),ref:d,...o})});l.displayName="Button",e.s(["Button",()=>l,"buttonVariants",()=>n])},70065,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(47163);let s=r.forwardRef(({className:e,...r},s)=>(0,t.jsx)("div",{ref:s,className:(0,a.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",e),...r}));s.displayName="Card";let i=r.forwardRef(({className:e,...r},s)=>(0,t.jsx)("div",{ref:s,className:(0,a.cn)("flex flex-col space-y-1.5 p-6",e),...r}));i.displayName="CardHeader";let n=r.forwardRef(({className:e,...r},s)=>(0,t.jsx)("div",{ref:s,className:(0,a.cn)("text-2xl font-semibold leading-none tracking-tight",e),...r}));n.displayName="CardTitle";let l=r.forwardRef(({className:e,...r},s)=>(0,t.jsx)("div",{ref:s,className:(0,a.cn)("text-sm text-muted-foreground",e),...r}));l.displayName="CardDescription";let o=r.forwardRef(({className:e,...r},s)=>(0,t.jsx)("div",{ref:s,className:(0,a.cn)("p-6 pt-0",e),...r}));o.displayName="CardContent",r.forwardRef(({className:e,...r},s)=>(0,t.jsx)("div",{ref:s,className:(0,a.cn)("flex items-center p-6 pt-0",e),...r})).displayName="CardFooter",e.s(["Card",()=>s,"CardContent",()=>o,"CardDescription",()=>l,"CardHeader",()=>i,"CardTitle",()=>n])},3085,e=>{"use strict";var t=e.i(68786);async function r(){return t.httpClient.get("/catalog/categories")}async function a(e){return t.httpClient.post("/catalog/categories",e)}async function s(e,r){return t.httpClient.patch(`/catalog/categories/${e}`,r)}async function i(e){return t.httpClient.delete(`/catalog/categories/${e}`)}async function n(e={}){return t.httpClient.get((0,t.withQuery)("/catalog/products",{category_id:e.categoryId,is_available:e.isAvailable,limit:e.limit,search:e.search}))}async function l(e){return t.httpClient.get(`/catalog/products/${e}`)}async function o(e){return t.httpClient.post("/catalog/products",e)}async function d(e,r){return t.httpClient.patch(`/catalog/products/${e}`,r)}async function c(e){return t.httpClient.delete(`/catalog/products/${e}`)}async function u(){return t.httpClient.get("/catalog/colors")}async function p(e){return t.httpClient.post("/catalog/colors",e)}async function m(e){return t.httpClient.delete(`/catalog/colors/${e}`)}async function f(){return t.httpClient.get("/catalog/handles")}async function h(e){return t.httpClient.post("/catalog/handles",e)}async function g(e){return t.httpClient.delete(`/catalog/handles/${e}`)}async function x(){return t.httpClient.get("/catalog/delivery-states")}async function b(e){return t.httpClient.post("/catalog/delivery-states",e)}async function v(e){return t.httpClient.delete(`/catalog/delivery-states/${e}`)}async function y(e){return t.httpClient.get((0,t.withQuery)("/catalog/product-images",{product_id:e}))}async function j(e){return t.httpClient.post("/catalog/product-images",e)}async function w(e){return t.httpClient.delete(`/catalog/product-images/${e}`)}async function _(e){return t.httpClient.get((0,t.withQuery)("/catalog/product-handles",{product_id:e}))}async function N(e,r){return t.httpClient.put(`/catalog/products/${e}/handles`,{handle_ids:r})}e.s(["createCategory",()=>a,"createColor",()=>p,"createDeliveryState",()=>b,"createHandle",()=>h,"createProduct",()=>o,"createProductImage",()=>j,"deleteCategory",()=>i,"deleteColor",()=>m,"deleteDeliveryState",()=>v,"deleteHandle",()=>g,"deleteProduct",()=>c,"deleteProductImage",()=>w,"getCategories",()=>r,"getColors",()=>u,"getDeliveryStates",()=>x,"getHandles",()=>f,"getProductById",()=>l,"getProductHandles",()=>_,"getProductImages",()=>y,"getProducts",()=>n,"setProductHandles",()=>N,"updateCategory",()=>s,"updateProduct",()=>d])},88143,(e,t,r)=>{"use strict";function a({widthInt:e,heightInt:t,blurWidth:r,blurHeight:a,blurDataURL:s,objectFit:i}){let n=r?40*r:e,l=a?40*a:t,o=n&&l?`viewBox='0 0 ${n} ${l}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${o}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${o?"none":"contain"===i?"xMidYMid":"cover"===i?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${s}'/%3E%3C/svg%3E`}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImageBlurSvg",{enumerable:!0,get:function(){return a}})},87690,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={VALID_LOADERS:function(){return i},imageConfigDefault:function(){return n}};for(var s in a)Object.defineProperty(r,s,{enumerable:!0,get:a[s]});let i=["default","imgix","cloudinary","akamai","custom"],n={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],maximumRedirects:3,maximumResponseBody:5e7,dangerouslyAllowLocalIP:!1,dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",localPatterns:void 0,remotePatterns:[],qualities:[75],unoptimized:!1}},8927,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImgProps",{enumerable:!0,get:function(){return d}}),e.r(33525);let a=e.r(43369),s=e.r(88143),i=e.r(87690),n=["-moz-initial","fill","none","scale-down",void 0];function l(e){return void 0!==e.default}function o(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function d({src:e,sizes:t,unoptimized:r=!1,priority:d=!1,preload:c=!1,loading:u,className:p,quality:m,width:f,height:h,fill:g=!1,style:x,overrideSrc:b,onLoad:v,onLoadingComplete:y,placeholder:j="empty",blurDataURL:w,fetchPriority:_,decoding:N="async",layout:C,objectFit:S,objectPosition:k,lazyBoundary:P,lazyRoot:$,...O},z){var M;let B,I,E,{imgConf:R,showAltText:D,blurComplete:L,defaultLoader:T}=z,A=R||i.imageConfigDefault;if("allSizes"in A)B=A;else{let e=[...A.deviceSizes,...A.imageSizes].sort((e,t)=>e-t),t=A.deviceSizes.sort((e,t)=>e-t),r=A.qualities?.sort((e,t)=>e-t);B={...A,allSizes:e,deviceSizes:t,qualities:r}}if(void 0===T)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let H=O.loader||T;delete O.loader,delete O.srcSet;let U="__next_img_default"in H;if(U){if("custom"===B.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=H;H=t=>{let{config:r,...a}=t;return e(a)}}if(C){"fill"===C&&(g=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[C];e&&(x={...x,...e});let r={responsive:"100vw",fill:"100vw"}[C];r&&!t&&(t=r)}let q="",F=o(f),X=o(h);if((M=e)&&"object"==typeof M&&(l(M)||void 0!==M.src)){let t=l(e)?e.default:e;if(!t.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!t.height||!t.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(I=t.blurWidth,E=t.blurHeight,w=w||t.blurDataURL,q=t.src,!g)if(F||X){if(F&&!X){let e=F/t.width;X=Math.round(t.height*e)}else if(!F&&X){let e=X/t.height;F=Math.round(t.width*e)}}else F=t.width,X=t.height}let V=!d&&!c&&("lazy"===u||void 0===u);(!(e="string"==typeof e?e:q)||e.startsWith("data:")||e.startsWith("blob:"))&&(r=!0,V=!1),B.unoptimized&&(r=!0),U&&!B.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(r=!0);let W=o(m),G=Object.assign(g?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:S,objectPosition:k}:{},D?{}:{color:"transparent"},x),Q=L||"empty"===j?null:"blur"===j?`url("data:image/svg+xml;charset=utf-8,${(0,s.getImageBlurSvg)({widthInt:F,heightInt:X,blurWidth:I,blurHeight:E,blurDataURL:w||"",objectFit:G.objectFit})}")`:`url("${j}")`,Y=n.includes(G.objectFit)?"fill"===G.objectFit?"100% 100%":"cover":G.objectFit,Z=Q?{backgroundSize:Y,backgroundPosition:G.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:Q}:{},J=function({config:e,src:t,unoptimized:r,width:s,quality:i,sizes:n,loader:l}){if(r){let e=(0,a.getDeploymentId)();if(t.startsWith("/")&&!t.startsWith("//")&&e){let r=t.includes("?")?"&":"?";t=`${t}${r}dpl=${e}`}return{src:t,srcSet:void 0,sizes:void 0}}let{widths:o,kind:d}=function({deviceSizes:e,allSizes:t},r,a){if(a){let r=/(^|\s)(1?\d?\d)vw/g,s=[];for(let e;e=r.exec(a);)s.push(parseInt(e[2]));if(s.length){let r=.01*Math.min(...s);return{widths:t.filter(t=>t>=e[0]*r),kind:"w"}}return{widths:t,kind:"w"}}return"number"!=typeof r?{widths:e,kind:"w"}:{widths:[...new Set([r,2*r].map(e=>t.find(t=>t>=e)||t[t.length-1]))],kind:"x"}}(e,s,n),c=o.length-1;return{sizes:n||"w"!==d?n:"100vw",srcSet:o.map((r,a)=>`${l({config:e,src:t,quality:i,width:r})} ${"w"===d?r:a+1}${d}`).join(", "),src:l({config:e,src:t,quality:i,width:o[c]})}}({config:B,src:e,unoptimized:r,width:F,quality:W,sizes:t,loader:H}),K=V?"lazy":u;return{props:{...O,loading:K,fetchPriority:_,width:F,height:X,decoding:N,className:p,style:{...G,...Z},sizes:J.sizes,srcSet:J.srcSet,src:b||J.src},meta:{unoptimized:r,preload:c||d,placeholder:j,fill:g}}}},98879,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return l}});let a=e.r(71645),s="u"<typeof window,i=s?()=>{}:a.useLayoutEffect,n=s?()=>{}:a.useEffect;function l(e){let{headManager:t,reduceComponentsToState:r}=e;function l(){if(t&&t.mountedInstances){let e=a.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(r(e))}}return s&&(t?.mountedInstances?.add(e.children),l()),i(()=>(t?.mountedInstances?.add(e.children),()=>{t?.mountedInstances?.delete(e.children)})),i(()=>(t&&(t._pendingUpdate=l),()=>{t&&(t._pendingUpdate=l)})),n(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}},25633,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={default:function(){return h},defaultHead:function(){return u}};for(var s in a)Object.defineProperty(r,s,{enumerable:!0,get:a[s]});let i=e.r(55682),n=e.r(90809),l=e.r(43476),o=n._(e.r(71645)),d=i._(e.r(98879)),c=e.r(42732);function u(){return[(0,l.jsx)("meta",{charSet:"utf-8"},"charset"),(0,l.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function p(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===o.default.Fragment?e.concat(o.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}e.r(33525);let m=["name","httpEquiv","charSet","itemProp"];function f(e){let t,r,a,s;return e.reduce(p,[]).reverse().concat(u().reverse()).filter((t=new Set,r=new Set,a=new Set,s={},e=>{let i=!0,n=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){n=!0;let r=e.key.slice(e.key.indexOf("$")+1);t.has(r)?i=!1:t.add(r)}switch(e.type){case"title":case"base":r.has(e.type)?i=!1:r.add(e.type);break;case"meta":for(let t=0,r=m.length;t<r;t++){let r=m[t];if(e.props.hasOwnProperty(r))if("charSet"===r)a.has(r)?i=!1:a.add(r);else{let t=e.props[r],a=s[r]||new Set;("name"!==r||!n)&&a.has(t)?i=!1:(a.add(t),s[r]=a)}}}return i})).reverse().map((e,t)=>{let r=e.key||t;return o.default.cloneElement(e,{key:r})})}let h=function({children:e}){let t=(0,o.useContext)(c.HeadManagerContext);return(0,l.jsx)(d.default,{reduceComponentsToState:f,headManager:t,children:e})};("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},18556,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"ImageConfigContext",{enumerable:!0,get:function(){return i}});let a=e.r(55682)._(e.r(71645)),s=e.r(87690),i=a.default.createContext(s.imageConfigDefault)},65856,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"RouterContext",{enumerable:!0,get:function(){return a}});let a=e.r(55682)._(e.r(71645)).default.createContext(null)},70965,(e,t,r)=>{"use strict";function a(e,t){let r=e||75;return t?.qualities?.length?t.qualities.reduce((e,t)=>Math.abs(t-r)<Math.abs(e-r)?t:e,0):r}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"findClosestQuality",{enumerable:!0,get:function(){return a}})},1948,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return n}});let a=e.r(70965),s=e.r(43369);function i({config:e,src:t,width:r,quality:i}){if(t.startsWith("/")&&t.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let n=(0,a.findClosestQuality)(i,e),l=(0,s.getDeploymentId)();return`${e.path}?url=${encodeURIComponent(t)}&w=${r}&q=${n}${t.startsWith("/")&&l?`&dpl=${l}`:""}`}i.__next_img_default=!0;let n=i},5500,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"Image",{enumerable:!0,get:function(){return y}});let a=e.r(55682),s=e.r(90809),i=e.r(43476),n=s._(e.r(71645)),l=a._(e.r(74080)),o=a._(e.r(25633)),d=e.r(8927),c=e.r(87690),u=e.r(18556);e.r(33525);let p=e.r(65856),m=a._(e.r(1948)),f=e.r(18581),h={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!0};function g(e,t,r,a,s,i,n){let l=e?.src;e&&e["data-loaded-src"]!==l&&(e["data-loaded-src"]=l,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&s(!0),r?.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let a=!1,s=!1;r.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>a,isPropagationStopped:()=>s,persist:()=>{},preventDefault:()=>{a=!0,t.preventDefault()},stopPropagation:()=>{s=!0,t.stopPropagation()}})}a?.current&&a.current(e)}}))}function x(e){return n.use?{fetchPriority:e}:{fetchpriority:e}}"u"<typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let b=(0,n.forwardRef)(({src:e,srcSet:t,sizes:r,height:a,width:s,decoding:l,className:o,style:d,fetchPriority:c,placeholder:u,loading:p,unoptimized:m,fill:h,onLoadRef:b,onLoadingCompleteRef:v,setBlurComplete:y,setShowAltText:j,sizesInput:w,onLoad:_,onError:N,...C},S)=>{let k=(0,n.useCallback)(e=>{e&&(N&&(e.src=e.src),e.complete&&g(e,u,b,v,y,m,w))},[e,u,b,v,y,N,m,w]),P=(0,f.useMergedRef)(S,k);return(0,i.jsx)("img",{...C,...x(c),loading:p,width:s,height:a,decoding:l,"data-nimg":h?"fill":"1",className:o,style:d,sizes:r,srcSet:t,src:e,ref:P,onLoad:e=>{g(e.currentTarget,u,b,v,y,m,w)},onError:e=>{j(!0),"empty"!==u&&y(!0),N&&N(e)}})});function v({isAppRouter:e,imgAttributes:t}){let r={as:"image",imageSrcSet:t.srcSet,imageSizes:t.sizes,crossOrigin:t.crossOrigin,referrerPolicy:t.referrerPolicy,...x(t.fetchPriority)};return e&&l.default.preload?(l.default.preload(t.src,r),null):(0,i.jsx)(o.default,{children:(0,i.jsx)("link",{rel:"preload",href:t.srcSet?void 0:t.src,...r},"__nimg-"+t.src+t.srcSet+t.sizes)})}let y=(0,n.forwardRef)((e,t)=>{let r=(0,n.useContext)(p.RouterContext),a=(0,n.useContext)(u.ImageConfigContext),s=(0,n.useMemo)(()=>{let e=h||a||c.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),r=e.deviceSizes.sort((e,t)=>e-t),s=e.qualities?.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:r,qualities:s,localPatterns:"u"<typeof window?a?.localPatterns:e.localPatterns}},[a]),{onLoad:l,onLoadingComplete:o}=e,f=(0,n.useRef)(l);(0,n.useEffect)(()=>{f.current=l},[l]);let g=(0,n.useRef)(o);(0,n.useEffect)(()=>{g.current=o},[o]);let[x,y]=(0,n.useState)(!1),[j,w]=(0,n.useState)(!1),{props:_,meta:N}=(0,d.getImgProps)(e,{defaultLoader:m.default,imgConf:s,blurComplete:x,showAltText:j});return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(b,{..._,unoptimized:N.unoptimized,placeholder:N.placeholder,fill:N.fill,onLoadRef:f,onLoadingCompleteRef:g,setBlurComplete:y,setShowAltText:w,sizesInput:e.sizes,ref:t}),N.preload?(0,i.jsx)(v,{isAppRouter:!r,imgAttributes:_}):null]})});("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},94909,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={default:function(){return c},getImageProps:function(){return d}};for(var s in a)Object.defineProperty(r,s,{enumerable:!0,get:a[s]});let i=e.r(55682),n=e.r(8927),l=e.r(5500),o=i._(e.r(1948));function d(e){let{props:t}=(0,n.getImgProps)(e,{defaultLoader:o.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!0}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}}let c=l.Image},57688,(e,t,r)=>{t.exports=e.r(94909)},1928,e=>{"use strict";let t=(0,e.i(75254).default)("shopping-cart",[["circle",{cx:"8",cy:"21",r:"1",key:"jimo8o"}],["circle",{cx:"19",cy:"21",r:"1",key:"13723u"}],["path",{d:"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",key:"9zh506"}]]);e.s(["ShoppingCart",()=>t],1928)},99023,e=>{"use strict";let t=(0,e.i(75254).default)("minus",[["path",{d:"M5 12h14",key:"1ays0h"}]]);e.s(["Minus",()=>t],99023)},37727,e=>{"use strict";let t=(0,e.i(75254).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",()=>t],37727)},23750,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(47163);let s=r.forwardRef(({className:e,type:r,...s},i)=>(0,t.jsx)("input",{type:r,className:(0,a.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",e),ref:i,...s}));s.displayName="Input",e.s(["Input",()=>s])},10708,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(48425),s=r.forwardRef((e,r)=>(0,t.jsx)(a.Primitive.label,{...e,ref:r,onMouseDown:t=>{t.target.closest("button, input, select, textarea")||(e.onMouseDown?.(t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}}));s.displayName="Label";var i=e.i(25913),n=e.i(47163);let l=(0,i.cva)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),o=r.forwardRef(({className:e,...r},a)=>(0,t.jsx)(s,{ref:a,className:(0,n.cn)(l(),e),...r}));o.displayName=s.displayName,e.s(["Label",()=>o],10708)},7233,e=>{"use strict";let t=(0,e.i(75254).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["Plus",()=>t],7233)},27612,e=>{"use strict";let t=(0,e.i(75254).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["Trash2",()=>t],27612)},88699,e=>{"use strict";let t=(0,e.i(75254).default)("pencil",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]);e.s(["Pencil",()=>t],88699)},89166,e=>{"use strict";var t=e.i(68786);async function r(e={}){return t.httpClient.get((0,t.withQuery)("/orders",{status:e.status,order_code:e.orderCode,include_items:e.includeItems}))}async function a(e){return t.httpClient.get(`/orders/${e}`)}async function s(e){return t.httpClient.get((0,t.withQuery)("/orders/by-code",{order_code:e}))}async function i(e){return t.httpClient.post("/orders",e)}async function n(e,r){return t.httpClient.post(`/orders/${e}/items`,{items:r})}async function l(e,r,a={}){return t.httpClient.patch(`/orders/${e}/status`,{order_status:r,...a})}async function o(e){return t.httpClient.delete(`/orders/${e}`)}async function d(e){return t.httpClient.delete(`/orders/${e}/items`)}e.s(["createOrder",()=>i,"createOrderItems",()=>n,"deleteOrder",()=>o,"deleteOrderItems",()=>d,"getOrderByCode",()=>s,"getOrderById",()=>a,"getOrders",()=>r,"updateOrderStatus",()=>l])},31278,e=>{"use strict";let t=(0,e.i(75254).default)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);e.s(["Loader2",()=>t],31278)},72930,e=>{"use strict";var t=e.i(46696),r=e.i(68786);async function a(e){return r.httpClient.post("/notifications/whatsapp/ticket",e)}async function s(e){try{let r=await a(e);if(!r?.waLink)return t.toast.error("لم يتم إنشاء رابط واتساب"),!1;return window.open(r.waLink,"_self"),!0}catch{return t.toast.error("حدث خطأ"),!1}}e.s(["sendTicketToWhatsApp",()=>s],72930)},16138,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(57688),s=e.i(23945),i=e.i(31278),n=e.i(7233),l=e.i(99023),o=e.i(43531),d=e.i(75254);let c=(0,d.default)("printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]);var u=e.i(78583),p=e.i(27612),m=e.i(88699),f=e.i(1928),h=e.i(37727);let g=(0,d.default)("message-circle",[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]]);var x=e.i(67881),b=e.i(23750),v=e.i(10708),y=e.i(70065),j=e.i(69035),w=e.i(62870),_=e.i(46696),N=e.i(72930),C=e.i(3085),S=e.i(89166);function k(){let[e,d]=(0,r.useState)([]),[k,P]=(0,r.useState)([]),[$,O]=(0,r.useState)([]),[z,M]=(0,r.useState)([]),[B,I]=(0,r.useState)({}),[E,R]=(0,r.useState)([]),[D,L]=(0,r.useState)(!0),[T,A]=(0,r.useState)(""),[H,U]=(0,r.useState)(""),[q,F]=(0,r.useState)(null),[X,V]=(0,r.useState)(null),[W,G]=(0,r.useState)(90),[Q,Y]=(0,r.useState)(210),[Z,J]=(0,r.useState)(1),[K,ee]=(0,r.useState)([]),[et,er]=(0,r.useState)(null),[ea,es]=(0,r.useState)(!0),[ei,en]=(0,r.useState)(""),[el,eo]=(0,r.useState)(""),[ed,ec]=(0,r.useState)(!1),[eu,ep]=(0,r.useState)(null);(0,r.useEffect)(()=>{(async function(){try{let[e,t,r,a,s,i]=await Promise.all([(0,C.getCategories)(),(0,C.getProducts)({isAvailable:!0}),(0,C.getColors)(),(0,C.getHandles)(),(0,C.getProductImages)(),(0,C.getProductHandles)()]);d(e??[]),P(t??[]),O(r??[]),M(a??[]),R(s??[]);let n={};for(let e of i??[])n[e.product_id]||(n[e.product_id]=[]),n[e.product_id].push(e.handle_id);I(n)}catch{d([]),P([]),O([]),M([]),R([]),I({}),_.toast.error("خطا في تحميل البيانات")}finally{L(!1)}})().catch(()=>L(!1))},[]);let em=(0,r.useMemo)(()=>T?k.filter(e=>e.category_id===T):k,[T,k]),ef=(0,r.useMemo)(()=>k.find(e=>e.id===H)??null,[H,k]),eh=(0,r.useMemo)(()=>{if(!H)return z;let e=B[H];return e&&0!==e.length?z.filter(t=>e.includes(t.id)):z},[H,z,B]),eg=ef&&Number(ef.min_width)||60,ex=ef&&Number(ef.max_width)||200,eb=ef&&Number(ef.min_height)||180,ev=ef&&Number(ef.max_height)||280,ey=(0,r.useMemo)(()=>E.filter(e=>e.product_id===H),[H,E]),ej=(0,r.useMemo)(()=>{if(0===ey.length)return $;let e=new Set(ey.map(e=>e.color_id));return $.filter(t=>e.has(t.id))},[ey,$]),ew=(0,r.useMemo)(()=>{if(!q)return ey[0]?.image_url??null;if(X){let e=ey.find(e=>e.color_id===q.id&&e.handle_id===X.id);if(e)return e.image_url}let e=ey.find(e=>e.color_id===q.id&&!e.handle_id);if(e)return e.image_url;let t=ey.find(e=>e.color_id===q.id);return t?t.image_url:ey[0]?.image_url??null},[q,X,ey]);(0,r.useEffect)(()=>{ef&&(G(ef.width||90),Y(ef.height||210),F(null),V(eh[0]??null),J(1))},[H,ef,eh]),(0,r.useEffect)(()=>{ej.length>0&&!q&&F(ej[0])},[ej,q]);let e_=ef&&Number(ef.width_threshold)||85,eN=ef?W<=e_?Math.round(Number(ef.price_below)):Math.round(Number(ef.price_above)):0,eC=eN*Z,eS=(0,r.useMemo)(()=>K.reduce((e,t)=>e+t.lineTotal,0),[K]),ek=(0,r.useCallback)(()=>{A(""),U(""),F(null),V(null),G(90),Y(210),J(1),er(null)},[]),eP=(0,r.useCallback)(()=>{if(!ef)return _.toast.error("يرجى اختيار المنتج");if(!q)return _.toast.error("يرجى اختيار اللون");if(!X)return _.toast.error("يرجى اختيار المقبض");let e={id:et??crypto.randomUUID(),product:ef,color:q,handle:X,width:W,height:Q,quantity:Z,unitPrice:eN,lineTotal:eC,imageUrl:ew};et?(ee(t=>t.map(t=>t.id===et?e:t)),_.toast.success("تم تعديل المنتج")):(ee(t=>[...t,e]),_.toast.success("تم اضافة المنتج الى الطلب")),ek(),es(!1)},[ef,q,X,W,Q,Z,eN,eC,ew,et,ek]),e$=(0,r.useCallback)(e=>{A(e.product.category_id||""),U(e.product.id),setTimeout(()=>{F(e.color),V(e.handle),G(e.width),Y(e.height),J(e.quantity)},50),er(e.id),es(!0)},[]),eO=(0,r.useCallback)(e=>{ee(t=>t.filter(t=>t.id!==e)),et===e&&(ek(),es(!1)),_.toast.success("تم ازالة المنتج")},[et,ek]),ez=(0,r.useCallback)(async()=>{if(!ei.trim())return _.toast.error("يرجى ادخال اسم العميل");if(!el.trim())return _.toast.error("يرجى ادخال رقم الهاتف");if(0===K.length)return _.toast.error("يرجى اضافة منتج واحد على الاقل");ec(!0);try{let e=`DD-S-${Date.now().toString(36).toUpperCase()}`,t=await (0,S.createOrder)({order_code:e,customer_name:ei.trim(),phone:el.trim(),total_price:eS,delivery_price:0,order_status:"IN_PRODUCTION",is_online:!1,user_id:null,email:null,address:null,state:null}),r=K.map(e=>({order_id:t.id,product_id:e.product.id,product_name:e.product.name_ar||e.product.name,quantity:e.quantity,unit_price:e.unitPrice,width:e.width,height:e.height,selected_color:e.color.name_ar||e.color.name,selected_handle:e.handle.name_ar||e.handle.name}));await (0,S.createOrderItems)(t.id,r);let a=await (0,S.getOrderById)(t.id).catch(()=>null);ep(a??t),_.toast.success("تم انشاء الطلب بنجاح")}catch{_.toast.error("خطا في انشاء الطلب")}finally{ec(!1)}},[ei,el,K,eS]);return eu?(0,t.jsx)("div",{className:"mx-auto max-w-2xl",children:(0,t.jsx)(y.Card,{children:(0,t.jsxs)(y.CardContent,{className:"flex flex-col items-center gap-6 py-12",children:[(0,t.jsx)("div",{className:"rounded-full bg-emerald-100 p-4",children:(0,t.jsx)(o.Check,{className:"h-10 w-10 text-emerald-600"})}),(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsx)("h1",{className:"text-2xl font-bold text-foreground",children:"تم انشاء الطلب بنجاح"}),(0,t.jsx)("p",{className:"mt-2 text-lg font-semibold text-primary",children:eu.order_code}),(0,t.jsxs)("p",{className:"mt-1 text-sm text-muted-foreground",children:["الطلب الان في مرحلة الانتاج"," - ",eu.order_items?.length||0," ","منتج"]})]}),(0,t.jsx)(j.Separator,{}),(0,t.jsxs)("div",{className:"flex flex-wrap justify-center gap-3",children:[(0,t.jsxs)(x.Button,{variant:"outline",className:"gap-2 bg-transparent",onClick:()=>{var e,t;let r,a,s,i,n,l,o,d,c;return s=(e=eu).order_items??[],i=(r=new Date(e.created_at)).toLocaleDateString("ar-DZ",{year:"numeric",month:"short",day:"numeric"})+" "+r.toLocaleTimeString("ar-DZ",{hour:"2-digit",minute:"2-digit"}),n=s.reduce((e,t)=>e+t.unit_price*t.quantity,0),l=e.delivery_price||0,o=e.total_price,d="INV-"+e.order_code.replace("DD-",""),c=s.map((e,t)=>{let r=e.product_name||e.products?.name_ar||e.products?.name||"منتج",a=e.width&&e.height?`${e.width} \xd7 ${e.height} سم`:"-",s=e.unit_price*e.quantity;return`
      <tr>
        <td class="center">${t+1}</td>
        <td>
          <div class="product-name">${r}</div>
          <div class="product-specs">
            ${e.selected_color?`<span>اللون: ${e.selected_color}</span>`:""}
            ${e.selected_handle?`<span>المقبض: ${e.selected_handle}</span>`:""}
          </div>
        </td>
        <td class="center">${a}</td>
        <td class="center">${e.quantity}</td>
        <td class="number">${e.unit_price.toLocaleString()}</td>
        <td class="number highlight">${s.toLocaleString()}</td>
      </tr>
    `}).join(""),void(t=`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>فاتورة ${e.order_code}</title>
  <style>
    @page {
      size: A4;
      margin: 12mm;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1a1a1a;
      background: #fff;
      direction: rtl;
      padding: 15px;
    }
    
    .invoice {
      max-width: 210mm;
      margin: 0 auto;
      border: 2px solid #8B5A2B;
      border-radius: 8px;
      overflow: hidden;
    }
    
    /* Header */
    .header {
      background: linear-gradient(135deg, #8B5A2B 0%, #6d4722 100%);
      color: #fff;
      padding: 20px 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .brand {
      text-align: right;
    }
    
    .brand h1 {
      font-size: 26pt;
      font-weight: bold;
      margin-bottom: 3px;
    }
    
    .brand p {
      font-size: 10pt;
      opacity: 0.9;
    }
    
    .invoice-info {
      text-align: left;
      background: rgba(255,255,255,0.15);
      padding: 12px 18px;
      border-radius: 8px;
    }
    
    .invoice-title {
      font-size: 18pt;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .invoice-number {
      font-size: 12pt;
      font-family: 'Courier New', monospace;
    }
    
    /* Body */
    .body {
      padding: 20px 25px;
    }
    
    /* Customer and Order Info Grid */
    .info-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .info-box {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .info-box-header {
      background: #f5f0eb;
      padding: 8px 12px;
      font-weight: bold;
      color: #8B5A2B;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .info-box-content {
      padding: 12px;
    }
    
    .info-row {
      display: flex;
      margin-bottom: 6px;
    }
    
    .info-row:last-child {
      margin-bottom: 0;
    }
    
    .info-label {
      min-width: 80px;
      color: #666;
    }
    
    .info-value {
      font-weight: 500;
    }
    
    .info-value.highlight {
      color: #8B5A2B;
      font-weight: bold;
    }
    
    /* Products Table */
    .products-section {
      margin-bottom: 20px;
    }
    
    .section-title {
      font-size: 13pt;
      font-weight: bold;
      color: #8B5A2B;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 2px solid #8B5A2B;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10pt;
    }
    
    th {
      background: #f5f0eb;
      color: #8B5A2B;
      padding: 10px 8px;
      text-align: right;
      font-weight: bold;
      border-bottom: 2px solid #8B5A2B;
    }
    
    th.center, td.center {
      text-align: center;
    }
    
    th.number, td.number {
      text-align: left;
      font-family: 'Courier New', monospace;
    }
    
    td {
      padding: 10px 8px;
      border-bottom: 1px solid #e0e0e0;
      vertical-align: top;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    tr:nth-child(even) {
      background: #fafafa;
    }
    
    .product-name {
      font-weight: bold;
      color: #333;
      margin-bottom: 3px;
    }
    
    .product-specs {
      font-size: 9pt;
      color: #666;
      display: flex;
      gap: 12px;
    }
    
    td.highlight {
      font-weight: bold;
      color: #8B5A2B;
    }
    
    /* Summary */
    .summary-section {
      display: flex;
      justify-content: flex-end;
    }
    
    .summary-box {
      width: 280px;
      border: 2px solid #8B5A2B;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 15px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .summary-row:last-child {
      border-bottom: none;
    }
    
    .summary-row .label {
      color: #666;
    }
    
    .summary-row .value {
      font-family: 'Courier New', monospace;
      font-weight: 500;
    }
    
    .summary-row.grand-total {
      background: #8B5A2B;
      color: #fff;
    }
    
    .summary-row.grand-total .label,
    .summary-row.grand-total .value {
      color: #fff;
      font-weight: bold;
      font-size: 13pt;
    }
    
    /* Footer */
    .footer {
      background: #f5f0eb;
      padding: 15px 25px;
      text-align: center;
      border-top: 2px solid #8B5A2B;
    }
    
    .footer-brand {
      font-size: 14pt;
      font-weight: bold;
      color: #8B5A2B;
      margin-bottom: 5px;
    }
    
    .footer-thanks {
      font-size: 11pt;
      color: #666;
      margin-bottom: 8px;
    }
    
    .footer-contact {
      font-size: 9pt;
      color: #888;
    }
    
    .footer-date {
      margin-top: 10px;
      font-size: 8pt;
      color: #aaa;
    }
    
    /* Notes Section */
    .notes-section {
      margin-top: 20px;
      padding: 12px;
      background: #fffbf5;
      border: 1px dashed #8B5A2B;
      border-radius: 8px;
    }
    
    .notes-title {
      font-weight: bold;
      color: #8B5A2B;
      margin-bottom: 5px;
    }
    
    .notes-text {
      font-size: 10pt;
      color: #666;
    }
    
    /* Print button */
    .print-btn {
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: #8B5A2B;
      color: #fff;
      border: none;
      padding: 12px 24px;
      font-size: 13pt;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 1000;
    }
    
    .print-btn:hover {
      background: #6d4722;
    }
    
    @media print {
      body {
        padding: 0;
      }
      .print-btn {
        display: none !important;
      }
      .invoice {
        border: none;
      }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <!-- Header -->
    <div class="header">
      <div class="brand">
        <h1>Door & Decor</h1>
        <p>أبواب عصرية بتصميم فريد</p>
      </div>
      <div class="invoice-info">
        <div class="invoice-title">فاتورة</div>
        <div class="invoice-number">${d}</div>
      </div>
    </div>
    
    <!-- Body -->
    <div class="body">
      <!-- Customer and Order Info -->
      <div class="info-section">
        <div class="info-box">
          <div class="info-box-header">معلومات العميل</div>
          <div class="info-box-content">
            <div class="info-row">
              <span class="info-label">الاسم:</span>
              <span class="info-value highlight">${e.customer_name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">الهاتف:</span>
              <span class="info-value">${e.phone||"-"}</span>
            </div>
            ${e.email?`
            <div class="info-row">
              <span class="info-label">البريد:</span>
              <span class="info-value">${e.email}</span>
            </div>
            `:""}
            ${e.state?`
            <div class="info-row">
              <span class="info-label">الولاية:</span>
              <span class="info-value">${e.state}</span>
            </div>
            `:""}
            ${e.address?`
            <div class="info-row">
              <span class="info-label">العنوان:</span>
              <span class="info-value">${e.address}</span>
            </div>
            `:""}
          </div>
        </div>
        
        <div class="info-box">
          <div class="info-box-header">معلومات الطلب</div>
          <div class="info-box-content">
            <div class="info-row">
              <span class="info-label">رمز الطلب:</span>
              <span class="info-value highlight">${e.order_code}</span>
            </div>
            <div class="info-row">
              <span class="info-label">التاريخ:</span>
              <span class="info-value">${i}</span>
            </div>
            <div class="info-row">
              <span class="info-label">النوع:</span>
              <span class="info-value">${e.is_online?"طلب اونلاين":"طلب من المحل"}</span>
            </div>
            <div class="info-row">
              <span class="info-label">عدد المنتجات:</span>
              <span class="info-value">${s.length}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Products Table -->
      <div class="products-section">
        <div class="section-title">تفاصيل المنتجات</div>
        <table>
          <thead>
            <tr>
              <th class="center" style="width: 40px;">#</th>
              <th>المنتج</th>
              <th class="center" style="width: 100px;">الأبعاد</th>
              <th class="center" style="width: 60px;">الكمية</th>
              <th class="number" style="width: 90px;">سعر الوحدة</th>
              <th class="number" style="width: 100px;">المجموع</th>
            </tr>
          </thead>
          <tbody>
            ${c}
          </tbody>
        </table>
      </div>
      
      <!-- Summary -->
      <div class="summary-section">
        <div class="summary-box">
          <div class="summary-row">
            <span class="label">المجموع الفرعي:</span>
            <span class="value">${n.toLocaleString()} د.ج</span>
          </div>
          <div class="summary-row">
            <span class="label">التوصيل:</span>
            <span class="value">${l.toLocaleString()} د.ج</span>
          </div>
          <div class="summary-row grand-total">
            <span class="label">المجموع الكلي:</span>
            <span class="value">${o.toLocaleString()} د.ج</span>
          </div>
        </div>
      </div>
      
      <!-- Notes -->
      <div class="notes-section">
        <div class="notes-title">ملاحظات:</div>
        <div class="notes-text">
          يرجى الاحتفاظ بهذه الفاتورة كإثبات للشراء. للاستفسارات يرجى التواصل معنا.
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-brand">Door & Decor</div>
      <div class="footer-thanks">شكراً لثقتكم بنا - نتطلع لخدمتكم مجدداً</div>
      <div class="footer-date">تاريخ الطباعة: ${new Date().toLocaleString("ar-DZ")}</div>
    </div>
  </div>
  
  <button class="print-btn" onclick="window.print()">طباعة / حفظ PDF</button>
</body>
</html>
`,(a=window.open("","_blank"))&&(a.document.write(t),a.document.close()))},children:[(0,t.jsx)(u.FileText,{className:"h-4 w-4"}),"طباعة فاتورة العميل"]}),(0,t.jsxs)(x.Button,{variant:"outline",className:"gap-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800",onClick:()=>(0,N.sendTicketToWhatsApp)(eu),children:[(0,t.jsx)(g,{className:"h-4 w-4"}),"إرسال للواتساب"]})]}),(0,t.jsxs)(x.Button,{className:"mt-4 gap-2",onClick:()=>{ep(null),en(""),eo(""),ee([]),ek(),es(!0)},children:[(0,t.jsx)(n.Plus,{className:"h-4 w-4"}),"انشاء طلب جديد"]})]})})}):D?(0,t.jsx)("div",{className:"flex items-center justify-center py-20",children:(0,t.jsx)(i.Loader2,{className:"h-8 w-8 animate-spin text-muted-foreground"})}):(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"mb-6",children:[(0,t.jsxs)("h1",{className:"flex items-center gap-2 text-2xl font-bold text-foreground",children:[(0,t.jsx)(s.Store,{className:"h-6 w-6"}),"طلب جديد من المحل"]}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"انشاء طلب لعميل حضر مباشرة الى المحل - يمكنك اضافة عدة منتجات في طلب واحد"})]}),(0,t.jsxs)("div",{className:"grid gap-6 lg:grid-cols-3",children:[(0,t.jsxs)("div",{className:"flex flex-col gap-6 lg:col-span-2",children:[(0,t.jsxs)(y.Card,{children:[(0,t.jsx)(y.CardHeader,{className:"pb-3",children:(0,t.jsx)(y.CardTitle,{className:"text-base",children:"معلومات العميل"})}),(0,t.jsxs)(y.CardContent,{className:"grid gap-4 sm:grid-cols-2",children:[(0,t.jsxs)("div",{className:"flex flex-col gap-1.5",children:[(0,t.jsx)(v.Label,{children:"الاسم الكامل"}),(0,t.jsx)(b.Input,{value:ei,onChange:e=>en(e.target.value),placeholder:"اسم العميل"})]}),(0,t.jsxs)("div",{className:"flex flex-col gap-1.5",children:[(0,t.jsx)(v.Label,{children:"رقم الهاتف"}),(0,t.jsx)(b.Input,{value:el,onChange:e=>eo(e.target.value),placeholder:"0XX XXX XXXX",dir:"ltr"})]})]})]}),K.length>0&&(0,t.jsxs)(y.Card,{children:[(0,t.jsx)(y.CardHeader,{className:"pb-3",children:(0,t.jsxs)(y.CardTitle,{className:"flex items-center gap-2 text-base",children:[(0,t.jsx)(f.ShoppingCart,{className:"h-4 w-4"}),"المنتجات في الطلب"," (",K.length,")"]})}),(0,t.jsx)(y.CardContent,{className:"flex flex-col gap-3",children:K.map((e,r)=>(0,t.jsxs)("div",{className:"flex items-start gap-3 rounded-lg border border-border bg-card p-3",children:[(0,t.jsx)("div",{className:"relative h-20 w-[44px] shrink-0 overflow-hidden rounded-md bg-muted",children:e.imageUrl?(0,t.jsx)(a.default,{src:e.imageUrl||"/placeholder.svg",alt:"",fill:!0,className:"object-cover",sizes:"48px"}):(0,t.jsx)("div",{className:"flex h-full items-center justify-center",children:(0,t.jsx)(s.Store,{className:"h-5 w-5 text-muted-foreground/30"})})}),(0,t.jsxs)("div",{className:"min-w-0 flex-1",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("span",{className:"flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary",children:r+1}),(0,t.jsx)("p",{className:"truncate text-sm font-semibold text-foreground",children:e.product.name_ar||e.product.name})]}),(0,t.jsxs)("div",{className:"mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground",children:[(0,t.jsxs)("span",{className:"flex items-center gap-1",children:[(0,t.jsx)("span",{className:"inline-block h-3 w-3 rounded-full border",style:e.color.secondary_code?{background:`linear-gradient(135deg, ${e.color.code} 50%, ${e.color.secondary_code} 50%)`}:{backgroundColor:e.color.code}}),e.color.name_ar||e.color.name]}),(0,t.jsx)("span",{children:e.handle.name_ar||e.handle.name}),(0,t.jsxs)("span",{dir:"ltr",children:[e.width,"x",e.height," ","سم"]}),(0,t.jsxs)("span",{children:["x",e.quantity]})]})]}),(0,t.jsxs)("div",{className:"flex shrink-0 flex-col items-end gap-1",children:[(0,t.jsxs)("span",{className:"text-sm font-bold text-primary",children:[e.lineTotal.toLocaleString()," ","د.ج"]}),(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsx)(x.Button,{variant:"ghost",size:"icon",className:"h-7 w-7 text-muted-foreground hover:text-foreground",onClick:()=>e$(e),children:(0,t.jsx)(m.Pencil,{className:"h-3.5 w-3.5"})}),(0,t.jsx)(x.Button,{variant:"ghost",size:"icon",className:"h-7 w-7 text-muted-foreground hover:text-destructive",onClick:()=>eO(e.id),children:(0,t.jsx)(p.Trash2,{className:"h-3.5 w-3.5"})})]})]})]},e.id))})]}),ea?(0,t.jsxs)(y.Card,{children:[(0,t.jsx)(y.CardHeader,{className:"pb-3",children:(0,t.jsxs)(y.CardTitle,{className:"flex items-center justify-between text-base",children:[(0,t.jsx)("span",{children:et?"تعديل المنتج":"اضافة منتج"}),K.length>0&&!et&&(0,t.jsx)(x.Button,{variant:"ghost",size:"icon",className:"h-7 w-7 text-muted-foreground",onClick:()=>{es(!1),ek()},children:(0,t.jsx)(h.X,{className:"h-4 w-4"})})]})}),(0,t.jsxs)(y.CardContent,{className:"flex flex-col gap-4",children:[(0,t.jsxs)("div",{className:"grid gap-4 sm:grid-cols-2",children:[(0,t.jsxs)("div",{className:"flex flex-col gap-1.5",children:[(0,t.jsx)(v.Label,{children:"القسم"}),(0,t.jsxs)(w.Select,{value:T||"all",onValueChange:e=>{A("all"===e?"":e),U("")},children:[(0,t.jsx)(w.SelectTrigger,{children:(0,t.jsx)(w.SelectValue,{placeholder:"كل الاقسام"})}),(0,t.jsxs)(w.SelectContent,{children:[(0,t.jsx)(w.SelectItem,{value:"all",children:"كل الاقسام"}),e.map(e=>(0,t.jsx)(w.SelectItem,{value:e.id,children:e.name_ar||e.name},e.id))]})]})]}),(0,t.jsxs)("div",{className:"flex flex-col gap-1.5",children:[(0,t.jsx)(v.Label,{children:"المنتج"}),(0,t.jsxs)(w.Select,{value:H,onValueChange:U,children:[(0,t.jsx)(w.SelectTrigger,{children:(0,t.jsx)(w.SelectValue,{placeholder:"اختر المنتج"})}),(0,t.jsx)(w.SelectContent,{children:em.map(e=>(0,t.jsxs)(w.SelectItem,{value:e.id,children:[e.name_ar||e.name," - ",Number(e.price_below).toLocaleString(),"/",Number(e.price_above).toLocaleString()," ","د.ج"]},e.id))})]})]})]}),ef&&(0,t.jsxs)(t.Fragment,{children:[ew&&(0,t.jsx)("div",{className:"relative mx-auto aspect-[5/9] w-full max-w-[200px] overflow-hidden rounded-lg bg-muted",children:(0,t.jsx)(a.default,{src:ew||"/placeholder.svg",alt:"",fill:!0,className:"object-contain",sizes:"200px"})}),(0,t.jsxs)("div",{children:[(0,t.jsxs)(v.Label,{className:"mb-2 block text-sm font-semibold",children:["اللون: ",(0,t.jsx)("span",{className:"font-normal text-muted-foreground",children:q?.name_ar||q?.name||"لم يتم الاختيار"})]}),(0,t.jsx)("div",{className:"flex flex-wrap gap-2",children:ej.map(e=>{let r,a,s=q?.id===e.id;return(0,t.jsx)("button",{type:"button",onClick:()=>F(e),className:`group relative h-10 w-10 overflow-hidden rounded-full border-2 transition-all ${s?"border-primary ring-2 ring-primary/30":"border-border hover:border-primary/50"}`,style:e.secondary_code?{background:`linear-gradient(135deg, ${e.code} 50%, ${e.secondary_code} 50%)`}:{backgroundColor:e.code},title:e.name_ar||e.name,children:s&&(0,t.jsx)(o.Check,{className:`absolute inset-0 m-auto h-4 w-4 ${(a=Number.parseInt((r=e.code.replace("#","")).slice(0,2),16),(299*a+587*Number.parseInt(r.slice(2,4),16)+114*Number.parseInt(r.slice(4,6),16))/1e3>186)?"text-foreground":"text-primary-foreground"}`})},e.id)})})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(v.Label,{className:"mb-2 block text-sm font-semibold",children:"المقبض"}),(0,t.jsx)("div",{className:"flex flex-col gap-2",children:eh.map(e=>{let r=X?.id===e.id;return(0,t.jsxs)("button",{type:"button",onClick:()=>V(e),className:`flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-sm transition-all ${r?"border-primary bg-primary/5 text-foreground":"border-border bg-card text-foreground hover:border-primary/50"}`,children:[e.image_url&&(0,t.jsx)("div",{className:"relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted",children:(0,t.jsx)(a.default,{src:e.image_url||"/placeholder.svg",alt:"",fill:!0,className:"object-cover",sizes:"40px"})}),(0,t.jsx)("span",{className:"flex-1 text-right font-medium",children:e.name_ar||e.name}),r&&(0,t.jsx)(o.Check,{className:"h-4 w-4 shrink-0 text-primary"})]},e.id)})})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(v.Label,{className:"mb-2 block text-sm font-semibold",children:"الابعاد (سم)"}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"flex flex-col gap-1.5",children:[(0,t.jsx)(v.Label,{className:"text-xs text-muted-foreground",children:`العرض (${eg}-${ex})`}),(0,t.jsx)(b.Input,{type:"number",value:W,onChange:e=>G(Math.max(eg,Math.min(ex,Number(e.target.value)))),min:eg,max:ex,dir:"ltr"})]}),(0,t.jsxs)("div",{className:"flex flex-col gap-1.5",children:[(0,t.jsx)(v.Label,{className:"text-xs text-muted-foreground",children:`الارتفاع (${eb}-${ev})`}),(0,t.jsx)(b.Input,{type:"number",value:Q,onChange:e=>Y(Math.max(eb,Math.min(ev,Number(e.target.value)))),min:eb,max:ev,dir:"ltr"})]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(v.Label,{className:"mb-2 block text-sm font-semibold",children:"الكمية"}),(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)(x.Button,{variant:"outline",size:"icon",className:"bg-transparent",onClick:()=>J(Math.max(1,Z-1)),disabled:Z<=1,children:(0,t.jsx)(l.Minus,{className:"h-4 w-4"})}),(0,t.jsx)("span",{className:"w-12 text-center text-lg font-semibold",children:Z}),(0,t.jsx)(x.Button,{variant:"outline",size:"icon",className:"bg-transparent",onClick:()=>J(Z+1),children:(0,t.jsx)(n.Plus,{className:"h-4 w-4"})})]})]}),(0,t.jsxs)("div",{className:"rounded-lg bg-muted/50 p-3",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between text-sm",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"سعر الوحدة"}),(0,t.jsxs)("span",{className:"font-medium",children:[eN.toLocaleString()," ","د.ج"]})]}),Z>1&&(0,t.jsxs)("div",{className:"mt-1 flex items-center justify-between text-sm",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"الكمية"}),(0,t.jsxs)("span",{className:"font-medium",children:["x",Z]})]}),(0,t.jsxs)("div",{className:"mt-2 flex items-center justify-between border-t border-border pt-2 text-base font-bold",children:[(0,t.jsx)("span",{children:"اجمالي هذا المنتج"}),(0,t.jsxs)("span",{className:"text-primary",children:[eC.toLocaleString()," ","د.ج"]})]})]}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsxs)(x.Button,{className:"flex-1 gap-2",onClick:eP,children:[et?(0,t.jsx)(o.Check,{className:"h-4 w-4"}):(0,t.jsx)(n.Plus,{className:"h-4 w-4"}),et?"حفظ التعديل":"اضافة الى الطلب"]}),et&&(0,t.jsx)(x.Button,{variant:"outline",className:"bg-transparent",onClick:()=>{ek(),es(0===K.length)},children:"الغاء"})]})]})]})]}):(0,t.jsxs)(x.Button,{variant:"outline",className:"gap-2 border-2 border-dashed bg-transparent py-8 text-muted-foreground hover:text-foreground",onClick:()=>{ek(),es(!0)},children:[(0,t.jsx)(n.Plus,{className:"h-5 w-5"}),"اضافة منتج اخر"]})]}),(0,t.jsx)("div",{className:"flex flex-col gap-6",children:(0,t.jsxs)(y.Card,{className:"sticky top-4",children:[(0,t.jsx)(y.CardHeader,{className:"pb-3",children:(0,t.jsx)(y.CardTitle,{className:"text-base",children:"ملخص الطلب"})}),(0,t.jsxs)(y.CardContent,{className:"flex flex-col gap-3",children:[0===K.length?(0,t.jsxs)("div",{className:"flex flex-col items-center gap-2 py-6 text-center text-muted-foreground",children:[(0,t.jsx)(f.ShoppingCart,{className:"h-10 w-10 opacity-20"}),(0,t.jsx)("p",{className:"text-sm",children:"لم يتم اضافة منتجات بعد"})]}):(0,t.jsxs)(t.Fragment,{children:[K.map((e,r)=>(0,t.jsxs)("div",{className:"flex items-center justify-between text-sm",children:[(0,t.jsxs)("span",{className:"truncate text-muted-foreground",children:[r+1,". ",e.product.name_ar||e.product.name," (x",e.quantity,")"]}),(0,t.jsxs)("span",{className:"shrink-0 font-medium",children:[e.lineTotal.toLocaleString()," ","د.ج"]})]},e.id)),(0,t.jsx)(j.Separator,{}),(0,t.jsxs)("div",{className:"flex items-center justify-between text-lg font-bold",children:[(0,t.jsx)("span",{children:"الاجمالي"}),(0,t.jsxs)("span",{className:"text-primary",children:[eS.toLocaleString()," ","د.ج"]})]})]}),(0,t.jsxs)(x.Button,{size:"lg",className:"mt-2 w-full gap-2",onClick:ez,disabled:ed||!ei||!el||0===K.length,children:[ed?(0,t.jsx)(i.Loader2,{className:"h-5 w-5 animate-spin"}):(0,t.jsx)(c,{className:"h-5 w-5"}),ed?"جاري الانشاء...":`انشاء الطلب (${K.length} منتج)`]})]})]})})]})]})}e.s(["default",()=>k],16138)}]);