/* DriveOn shared UI kit. */
import React from 'react';
import { Icon } from './icons.jsx';

const h = React.createElement;

// Re-export so screens can pull every shared primitive from a single module.
export { Icon };

/* ---- Logo: DriveOn G-scooter mark (matches Figma app icon) ----
   variant 'badge' = gradient rounded-square + white mark (app-icon style).  */
export function LogoG({size=112, variant='badge', tint}){
  const badge = variant==='badge';
  const ink = badge ? '#ffffff' : (tint || 'var(--c-brand)');
  return h('svg',{className:'logo-g',width:size,height:size,viewBox:'0 0 120 120',fill:'none'},
    badge && h('defs',null,
      h('linearGradient',{id:'lg',x1:0,y1:0,x2:1,y2:1},
        h('stop',{offset:0,stopColor:'hsl(174 72% 56%)'}),
        h('stop',{offset:1,stopColor:'hsl(171 38% 52%)'}))),
    badge && h('rect',{x:6,y:6,width:108,height:108,rx:30,fill:'url(#lg)'}),
    h('g',{stroke:ink,strokeWidth:6,strokeLinecap:'round',opacity:badge?.9:.85},
      h('line',{x1:14,y1:44,x2:34,y2:44}),
      h('line',{x1:9,y1:57,x2:30,y2:57}),
      h('line',{x1:15,y1:70,x2:33,y2:70})),
    h('path',{d:'M83 41 A27 27 0 1 0 83 61 L83 52 L65 52',
      stroke:ink,strokeWidth:12,strokeLinecap:'round',strokeLinejoin:'round',fill:'none'}),
    h('g',{stroke:ink,strokeWidth:6,fill:'none'},
      h('circle',{cx:48,cy:95,r:10}),
      h('circle',{cx:84,cy:95,r:10})),
    h('g',{fill:ink},
      h('circle',{cx:48,cy:95,r:3}),
      h('circle',{cx:84,cy:95,r:3}))
  );
}

/* ---- Wordmark: DriveOn horizontal logotype (exact Figma vector, power-button "O") ----
   Inlined so it survives bundling; fill = currentColor (set via `color`). ----- */
const WORDMARK_SVG =
  '<path d="M 40.608 16.432 L 32.544 54.256 L 40.608 54.256 C 53.856 54.256 63.072 48.304 65.856 35.344 C 68.544 22.384 61.92 16.432 48.672 16.432 L 40.608 16.432 Z M 0 70 L 14.688 0.688 L 51.84 0.688 C 72.288 0.688 85.152 2.512 92.64 12.112 C 96.576 17.2 98.208 25.552 96 35.92 C 93.888 46.096 88.416 55.984 81.312 60.784 C 71.808 67.312 63.552 70 42.144 70 L 0 70 Z M 101.906 70 L 116.594 0.688 L 165.938 0.688 C 184.85 0.688 195.794 4.432 192.53 19.792 C 190.61 28.912 183.026 34.672 174.098 36.208 L 173.906 37.168 C 180.53 37.36 185.618 39.76 185.234 46.768 L 184.082 70 L 154.898 70 L 155.762 54.544 C 156.242 46 155.282 44.848 145.298 44.848 L 136.466 44.848 L 131.09 70 L 101.906 70 Z M 142.802 14.704 L 139.25 31.408 L 150.386 31.408 C 156.626 31.408 161.906 29.488 163.25 22.96 C 164.594 16.816 160.562 14.704 153.458 14.704 L 142.802 14.704 Z M 196.205 70 L 210.893 0.688 L 240.077 0.688 L 225.389 70 L 196.205 70 Z M 264.051 70 L 248.115 0.688 L 280.275 0.688 L 288.339 44.464 L 315.315 0.688 L 345.075 0.688 L 299.763 70 L 264.051 70 Z M 339 70 L 353.688 0.688 L 420.12 0.688 L 417.048 15.28 L 378.84 15.28 L 376.152 28.048 L 411.96 28.048 L 408.888 42.64 L 373.08 42.64 L 370.296 55.408 L 408.888 55.408 L 405.816 70 L 339 70 Z M 535.456 70 L 535.456 0.688 L 557.344 0.688 L 596.608 53.872 L 596.8 53.872 L 596.8 0.688 L 610.816 0.688 L 610.816 70 L 589.888 70 L 549.664 15.856 L 549.472 15.856 L 549.472 70 L 535.456 70 Z M 492.313 15.022 C 492.313 12.503 494.621 10.602 497.033 11.332 C 512.075 15.888 522.729 27.222 522.729 40.482 C 522.729 57.764 504.634 71.774 482.313 71.774 C 459.992 71.774 441.897 57.764 441.897 40.482 C 441.897 27.222 452.551 15.888 467.593 11.332 C 470.005 10.602 472.313 12.503 472.313 15.022 L 472.313 18.004 C 472.313 19.761 471.155 21.287 469.533 21.959 C 460.999 25.496 455.194 32.464 455.194 40.482 C 455.194 52.078 467.336 61.479 482.313 61.479 C 497.291 61.479 509.432 52.078 509.432 40.482 C 509.432 32.464 503.627 25.496 495.093 21.959 C 493.471 21.287 492.313 19.761 492.313 18.004 L 492.313 15.022 Z M 477.456 4 L 477.456 38 C 477.456 40.209 479.247 42 481.456 42 L 483.456 42 C 485.665 42 487.456 40.209 487.456 38 L 487.456 4 C 487.456 1.791 485.665 0 483.456 0 L 481.456 0 C 479.247 0 477.456 1.791 477.456 4 Z"/>';
export function Wordmark({height=46, color='#fff', style, className}){
  return h('svg',{className,viewBox:'0 0 611 72',height,width:height*(611/72),
    fill:'currentColor',style:Object.assign({color,display:'block'},style||{}),
    dangerouslySetInnerHTML:{__html:WORDMARK_SVG}});
}

/* ---- Status bar ---- */
export function StatusBar({dark}){
  return h('div',{className:'statusbar'+(dark?' on-dark':'')},
    h('span',{className:'time'},'9:41'),
    h('span',{className:'sigs'},
      h('svg',{width:19,height:13,viewBox:'0 0 19 13',fill:'currentColor'},
        [3,7,11,15].map((x,i)=>h('rect',{key:i,x,y:9-i*2.6,width:2.6,height:4+i*2.6,rx:.8}))),
      h('svg',{width:18,height:13,viewBox:'0 0 18 13',fill:'none',stroke:'currentColor',strokeWidth:1.6,strokeLinecap:'round'},
        h('path',{d:'M1 4.2A11 11 0 0 1 17 4.2'}),h('path',{d:'M3.6 7A7 7 0 0 1 14.4 7'}),
        h('path',{d:'M6.2 9.7A3 3 0 0 1 11.8 9.7'}),h('circle',{cx:9,cy:11.6,r:.9,fill:'currentColor'})),
      h('svg',{width:26,height:13,viewBox:'0 0 26 13',fill:'none'},
        h('rect',{x:.7,y:.7,width:22,height:11.6,rx:3,stroke:'currentColor',strokeOpacity:.4,strokeWidth:1.2}),
        h('rect',{x:2.3,y:2.3,width:18,height:8.4,rx:1.6,fill:'currentColor'}),
        h('rect',{x:24,y:4,width:1.6,height:5,rx:.8,fill:'currentColor',fillOpacity:.4})))
  );
}

/* ---- Stars ---- */
export function Stars({value=0,size=19,onRate}){
  return h('span',{className:'stars'},
    [1,2,3,4,5].map(n=>h('span',{key:n,
      style:{color:n<=value?'var(--star)':'var(--muted)',opacity:n<=value?1:.4,cursor:onRate?'pointer':'default',lineHeight:0},
      onClick:onRate?(e)=>{e.stopPropagation();onRate(n);}:undefined},
      h(Icon,{name:'star',size,fill:n<=value}))));
}

/* ---- Chips ---- */
export const CHIP_ICON={Manual:'gear',Auto:'auto',EV:'bolt',AWD:'awd','High-End':'glass',ECO:'leaf'};
export function Chips({items,max}){
  const list = max? items.slice(0,max): items;
  return h('div',{className:'chips'}, list.map(([ic,label],i)=>
    h('span',{className:'chip',key:i}, h(Icon,{name:ic,size:15,stroke:2.2}), label)));
}

/* ---- Car photo (rounded rect) ---- */
export function CarPhoto({src,alt,w=78,h:ht=58,r,style}){
  return h('img',{className:'carphoto',src,alt,
    style:Object.assign({width:w,height:ht,borderRadius:r||'var(--r-photo)'},style||{})});
}

export function Badge({status}){
  const map={confirmed:['ok','Confirmed'],rejected:['no','Rejected'],pending:['warn','Pending'],
    active:['ok','Active'],completed:['warn','Completed'],available:['ok','Available'],rented:['warn','Rented']};
  const [cls,txt]=map[status]||['ok',status];
  return h('span',{className:'badge '+cls},txt);
}

export function Heart({on,onClick,size=24}){
  return h('span',{className:'heart',onClick:(e)=>{e&&e.stopPropagation();onClick&&onClick();},
    style:{opacity:on?1:.55}}, h(Icon,{name:'heart',size,fill:on,stroke:2.2}));
}

/* ---- App header ---- */
export function Header({title,onBack,right,icon}){
  return h('div',{className:'appbar'},
    onBack && h('button',{className:'iconbtn ghost',onClick:onBack,'aria-label':'Back'},h(Icon,{name:'back',size:26})),
    icon && h('button',{className:'iconbtn',onClick:icon.onClick},h(Icon,{name:icon.name,size:22})),
    h('h1',{className:'h-page',style:{margin:0,flex:1}},title),
    right);
}

/* ---- Bottom navigation ---- */
export function BottomTab({mode,tab,onNav,onFab}){
  const driver=[['home','home'],['history','history'],['__fab','search'],['likes','heart'],['profile','user']];
  const owner =[['home','home'],['history','history'],['__fab','calendar'],['garage','car'],['profile','user']];
  const items = mode==='owner'?owner:driver;
  return h('div',{className:'tabbar'}, items.map(([key,ic],i)=>{
    if(key==='__fab') return h('button',{className:'tab-fab',key:'fab',onClick:onFab,'aria-label':'action'},h(Icon,{name:ic,size:32,stroke:2.1}));
    return h('button',{key,className:'tab'+(tab===key?' active':''),onClick:()=>onNav(key)},
      h(Icon,{name:ic,size:26,fill:(key==='likes'&&tab==='likes')}));
  }));
}
