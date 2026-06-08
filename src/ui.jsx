/* GETAWAY shared UI kit. */
import React from 'react';
import { Icon } from './icons.jsx';

const h = React.createElement;

// Re-export so screens can pull every shared primitive from a single module.
export { Icon };

/* ---- Logo: GETAWAY G-scooter mark (matches Figma app icon) ----
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

/* ---- Wordmark: EXACT Figma "GETAWAY" horizontal lockup (getaway-light.svg) ----
   Inlined so it survives bundling; fill = currentColor (set via `color`). ----- */
const WORDMARK_SVG =
  '<path d="M205.601 81.136L220.289 11.824H286.721L283.649 26.416H245.441L242.753 39.184H278.561L275.489 53.776H239.681L236.897 66.544H275.489L272.417 81.136H205.601Z"/>'+
  '<path d="M302.258 81.136L313.394 28.72H290.642L294.194 11.824H368.882L365.33 28.72H342.578L331.442 81.136H302.258Z"/>'+
  '<path d="M394.244 54.448H416.228L410.66 30.256L394.244 54.448ZM347.588 81.136L397.604 11.824H433.988L454.628 81.136H422.468L419.876 69.616H384.068L376.196 81.136H347.588Z"/>'+
  '<path d="M466.074 81.136L464.538 11.824H492.762L492.858 55.12H493.146L515.226 11.824H547.77L551.418 55.12H551.706L569.946 11.824H596.154L565.05 81.136H528.282L524.826 38.992H524.538L503.13 81.136H466.074Z"/>'+
  '<path d="M625.057 54.448H647.041L641.473 30.256L625.057 54.448ZM578.401 81.136L628.417 11.824H664.801L685.441 81.136H653.281L650.689 69.616H614.881L607.009 81.136H578.401Z"/>'+
  '<path d="M707.479 81.136L711.895 60.4L688.183 11.824H724.567L732.919 40.432L754.231 11.824H785.335L741.079 60.4L736.663 81.136H707.479Z"/>'+
  '<path d="M117.714 77.1357C121.58 77.1359 124.714 80.2699 124.714 84.1357C124.714 88.0017 121.58 91.1356 117.714 91.1357C113.848 91.1357 110.714 88.0017 110.714 84.1357C110.714 80.2699 113.848 77.1357 117.714 77.1357Z"/>'+
  '<path fill-rule="evenodd" clip-rule="evenodd" d="M117.714 72.1357C124.341 72.1359 129.714 77.5085 129.714 84.1357C129.714 90.7631 124.341 96.1356 117.714 96.1357C111.086 96.1357 105.714 90.7632 105.714 84.1357C105.714 77.5084 111.087 72.1357 117.714 72.1357ZM117.714 75.1357C112.743 75.1357 108.714 79.1653 108.714 84.1357C108.714 89.1063 112.743 93.1357 117.714 93.1357C122.684 93.1356 126.714 89.1062 126.714 84.1357C126.714 79.1654 122.684 75.1359 117.714 75.1357Z"/>'+
  '<path d="M169.714 77.1357C173.58 77.1359 176.714 80.2699 176.714 84.1357C176.714 88.0017 173.58 91.1356 169.714 91.1357C165.848 91.1357 162.714 88.0017 162.714 84.1357C162.714 80.2699 165.848 77.1357 169.714 77.1357Z"/>'+
  '<path fill-rule="evenodd" clip-rule="evenodd" d="M169.714 72.1357C176.341 72.1359 181.714 77.5085 181.714 84.1357C181.714 90.7631 176.341 96.1356 169.714 96.1357C163.086 96.1357 157.714 90.7632 157.714 84.1357C157.714 77.5084 163.087 72.1357 169.714 72.1357ZM169.714 75.1357C164.743 75.1357 160.714 79.1653 160.714 84.1357C160.714 89.1063 164.743 93.1357 169.714 93.1357C174.684 93.1356 178.714 89.1062 178.714 84.1357C178.714 79.1654 174.684 75.1359 169.714 75.1357Z"/>'+
  '<path fill-rule="evenodd" clip-rule="evenodd" d="M161.354 10C186.505 10 203.306 15.4724 200.138 32.9443H169.706C169.706 31.1204 168.938 29.008 167.21 27.376C165.482 25.744 162.505 24.5918 157.897 24.5918C145.418 24.5919 136.778 32.944 134.09 45.4238C131.306 58.7678 135.338 68.3682 149.834 68.3682C156.17 68.3681 160.969 67.4077 163.945 65.9678L166.153 55.4082H149.258L152.33 40.8164H198.41L190.634 77.3916C188.118 77.9489 185.47 78.4806 182.733 78.9814C180.681 73.8005 175.625 70.1358 169.714 70.1357C162.556 70.1357 156.652 75.5081 155.815 82.4404C151.245 82.7741 146.766 82.9599 142.538 82.96C138.541 82.96 134.904 82.7572 131.604 82.373C130.737 75.4734 124.849 70.1359 117.714 70.1357C114.465 70.1357 111.473 71.2423 109.098 73.0996C103.178 66.7347 102.33 57.7189 104.521 47.3438C109.994 21.328 130.826 10.0001 161.354 10ZM154.714 49.1357H165.846L166.714 45.1357H155.582L154.714 49.1357ZM146.124 15.1436C135.078 17.152 126.983 20.4268 121.078 25.4424C115.166 30.4645 111.497 37.1916 109.229 46.0107L110.198 46.2607C112.43 37.5805 116.012 31.0568 121.725 26.2041C127.445 21.3451 135.351 18.1194 146.304 16.1279L146.124 15.1436Z"/>'+
  '<path d="M96.418 68C97.2461 68.0002 97.9178 68.6718 97.918 69.5C97.918 70.3283 97.2462 70.9998 96.418 71H11.5C10.6716 71 10 70.3284 10 69.5C10.0001 68.6717 10.6717 68 11.5 68H96.418Z"/>'+
  '<path d="M89 47.5C89.8283 47.5 90.4999 48.1717 90.5 49C90.5 49.8284 89.8284 50.5 89 50.5H26.5C25.6716 50.5 25 49.8284 25 49C25.0001 48.1717 25.6717 47.5 26.5 47.5H89Z"/>'+
  '<path d="M96.418 28C97.2461 28.0002 97.9178 28.6718 97.918 29.5C97.918 30.3283 97.2462 30.9998 96.418 31H41C40.1716 31 39.5 30.3284 39.5 29.5C39.5001 28.6717 40.1717 28 41 28H96.418Z"/>';
export function Wordmark({height=46, color='#fff', style, className}){
  return h('svg',{className,viewBox:'0 0 796 107',height,width:height*(796/107),
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
