/* DriveOn — genericised building blocks shared by BOTH driver & owner flows.
   One row, one header, one tile grid, one settings row — reused everywhere. */
import React from 'react';
import { Icon } from './icons.jsx';

const h = React.createElement;

/* DateLine — calendar + "date · time" (used in every booking-ish row) */
export function DateLine({date,time,size=16}){
  return h('div',{className:'daterow'},h(Icon,{name:'calendar',size}),
    [date,time].filter(Boolean).join(' · '));
}

/* Lead media — rounded-rect photo OR circular-ish avatar, one place */
export function Lead({src,w=66,h:ht=52,r,avatar}){
  return h('img',{src,alt:'',className:'carphoto',
    style:{width:w,height:ht,borderRadius:r!=null?r:(avatar?16:'var(--r-photo)'),objectFit:'cover',flex:'0 0 auto'}});
}

/* EntityRow — the universal list row. */
export function EntityRow({lead, title, titleSize=19, sub=[], trailing, onClick, delay=0, accent}){
  return h('div',{className:'car-row reveal'+(accent?' card-row':''),onClick,
      style:{animationDelay:delay+'ms'}},
    lead && h(Lead,lead),
    h('div',{className:'meta'},
      h('div',{className:'car-name',style:{fontSize:titleSize}},title),
      ...sub),
    trailing!==undefined && h('div',{className:'car-right'},trailing));
}

/* ProfileHeader — avatar + name + verified + rating. Driver & owner share it. */
export function ProfileHeader({avatar,name,verified,rating,reviews,extra}){
  return h('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:10,marginTop:14}},
    h('img',{src:avatar,alt:name,style:{width:96,height:96,borderRadius:30,objectFit:'cover',boxShadow:'var(--glow)'}}),
    h('div',{className:'h-page',style:{marginTop:4}},name),
    extra,
    h('div',{className:'row',style:{gap:16}},
      verified && h('span',{className:'badge ok',style:{display:'inline-flex',alignItems:'center',gap:5}},h(Icon,{name:'shield',size:15}),'Verified'),
      rating!=null && h('div',{className:'row',style:{gap:6}},h(Icon,{name:'star',size:18,fill:true,color:'var(--star)'}),
        h('b',null,rating),reviews!=null&&h('span',{className:'t-muted',style:{fontSize:13}},'('+reviews+' reviews)'))));
}

/* StatTiles — 3-up metric tiles. */
export function StatTiles({tiles}){
  return h('div',{style:{display:'grid',gridTemplateColumns:'repeat('+tiles.length+',1fr)',gap:12}},
    tiles.map((t,i)=>h('div',{className:'tile',key:i},
      h('div',{className:'big counter'},t.value),h('div',{className:'cap'},t.label))));
}

/* SettingRow + Toggle — shared by driver & owner settings. */
export function Toggle({on,onClick}){
  return h('button',{onClick,style:{width:52,height:30,borderRadius:999,border:'none',cursor:'pointer',flex:'0 0 auto',
    background:on?'var(--c-secondary)':'var(--hair)',position:'relative',transition:'background .2s'}},
    h('span',{style:{position:'absolute',top:3,left:on?25:3,width:24,height:24,borderRadius:999,background:'#fff',transition:'left .2s',boxShadow:'0 1px 3px rgba(0,0,0,.3)'}}));
}
export function SettingRow({icon,label,right,onClick}){
  return h('div',{className:'card row between',style:{padding:'15px 16px',cursor:onClick?'pointer':'default'},onClick},
    h('span',{className:'row',style:{gap:12,fontWeight:700,fontSize:16}},h(Icon,{name:icon,size:21,color:'var(--c-secondary)'}),label),right);
}

/* NavCard — big tappable card row (settings / switch mode). */
export function NavCard({icon,label,onClick}){
  return h('button',{className:'card card-interactive row between',style:{width:'100%',border:'1px solid var(--hair)',cursor:'pointer',font:'inherit'},onClick},
    h('span',{className:'row',style:{gap:12,fontWeight:800,fontSize:17}},h(Icon,{name:icon,size:22,color:'var(--c-secondary)'}),label),
    h(Icon,{name:'chevron-right',size:22,color:'var(--c-accent)'}));
}

/* SectionCard — titled "see all" header + white card wrapper. */
export function SectionCard({title,action,onAction,children}){
  return h('div',null,
    h('div',{className:'row between',style:{marginBottom:6}},
      h('div',{className:'h-section'},title),
      action && h('span',{className:'tlink',onClick:onAction},action)),
    h('div',{className:'card',style:{padding:'4px 16px'}},children));
}

/* Review — one car review: avatar + name + star rating + date + a few words. */
export function Review({avatar,who,stars=5,date,text,delay=0}){
  return h('div',{className:'review reveal',style:{animationDelay:delay+'ms'}},
    h('div',{className:'row',style:{gap:10,alignItems:'center'}},
      h('img',{src:avatar,alt:who,style:{width:38,height:38,borderRadius:12,objectFit:'cover',flex:'0 0 auto'}}),
      h('div',{className:'grow'},
        h('div',{style:{fontWeight:800,fontSize:15}},who),
        h('div',{className:'t-muted',style:{fontSize:12,fontWeight:600}},date)),
      h('div',{className:'row',style:{gap:2}},
        [1,2,3,4,5].map(n=>h(Icon,{key:n,name:'star',size:14,fill:n<=stars,
          color:n<=stars?'var(--star)':'var(--hair)'})))),
    h('p',{className:'review-text'},text));
}

export const Blocks = {DateLine,Lead,EntityRow,ProfileHeader,StatTiles,Toggle,SettingRow,NavCard,SectionCard,Review};
export default Blocks;
