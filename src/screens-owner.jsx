/* GETAWAY — car-owner flow screens.
   Reuses the SAME generic Blocks (EntityRow, ProfileHeader, StatTiles, etc.) as the driver flow. */
import React from 'react';
import { Icon, Chips, CarPhoto, Badge, Header } from './ui.jsx';
import { DateLine, EntityRow, ProfileHeader, StatTiles, NavCard, SectionCard } from './blocks.jsx';
import { DATA as D } from './data.js';

const h = React.createElement;

/* count-up number. On the server (Figma export) there's no rAF, so seed with the
   target value; in the browser it starts at 0 and animates up. */
function useCountUp(target,ms=900){
  const [v,setV]=React.useState(typeof window==='undefined'?target:0);
  React.useEffect(()=>{let raf,t0;const tick=(t)=>{t0=t0||t;const p=Math.min(1,(t-t0)/ms);
    setV(Math.round(target*(1-Math.pow(1-p,3))));if(p<1)raf=requestAnimationFrame(tick);};
    raf=requestAnimationFrame(tick);return ()=>cancelAnimationFrame(raf);},[target]);
  return v;
}

/* approve / deny control — owner-specific trailing, but row itself is the generic EntityRow */
function Decide({status,onYes,onNo}){
  if(status==='approved') return h(Badge,{status:'confirmed'});
  if(status==='denied') return h(Badge,{status:'rejected'});
  return h('div',{className:'row',style:{gap:10}},
    h('button',{className:'iconbtn',style:{background:'var(--ok-bg)',color:'var(--ok-ink)'},onClick:e=>{e.stopPropagation();onNo();},'aria-label':'deny'},h(Icon,{name:'x',size:20,stroke:2.6})),
    h('button',{className:'iconbtn',style:{background:'var(--grad-primary)',color:'#06302b'},onClick:e=>{e.stopPropagation();onYes();},'aria-label':'approve'},h(Icon,{name:'check',size:20,stroke:2.8})));
}

/* ---------------- OWNER HOME ---------------- */
function OwnerHome({go, state}){
  const o = D.owner; const earn = useCountUp(o.earnings);
  return h('div',{className:'screen-pad'},
    h('div',{style:{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,marginTop:4}},
      h('div',null,h('div',{className:'eyebrow'},'Owner dashboard'),
        h('div',{className:'h-greet'},'Welcome back,',h('br'),h('b',null,o.name))),
      h('img',{src:o.avatar,alt:o.name,style:{width:62,height:62,borderRadius:18,objectFit:'cover',border:'2px solid hsl(var(--primary)/.3)'}})),

    h('div',{className:'card',style:{background:'var(--grad-secondary)',color:'#fff',border:'none',boxShadow:'var(--teal-shadow)'}},
      h('div',{className:'label',style:{opacity:.85,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',fontSize:12}},'Earnings this month'),
      h('div',{className:'row',style:{alignItems:'flex-end',gap:12,marginTop:6}},
        h('div',{className:'counter',style:{fontSize:46,fontWeight:900,letterSpacing:'-.02em',lineHeight:1}},'$'+earn.toLocaleString()),
        h('div',{className:'row',style:{gap:4,background:'rgba(255,255,255,.22)',padding:'5px 10px',borderRadius:999,fontWeight:800,fontSize:14}},
          h(Icon,{name:'trend-up',size:16,stroke:2.6}),o.change+'%'))),

    h(SectionCard,{title:'Waiting for approval'},
      state.requests.map((r,i)=>h(EntityRow,{key:i,accent:true,delay:i*70,
        lead:{src:r.avatar,w:54,h:54,r:16},title:r.who,titleSize:18,
        sub:[h('div',{key:'c',className:'t-muted',style:{fontWeight:700,fontSize:13,margin:'2px 0 6px'}},r.car+' · $'+r.amount),
             h(DateLine,{key:'d',date:r.date,time:r.time})],
        trailing:h(Decide,{status:state.reqStatus[i],onYes:()=>state.decide(i,'approved'),onNo:()=>state.decide(i,'denied')})}))),

    h(SectionCard,{title:'Upcoming rents',action:'Calendar',onAction:()=>go('owner-calendar')},
      D.ownerUpcoming.map((r,i)=>h(EntityRow,{key:i,accent:true,delay:i*70,
        lead:{src:r.avatar,w:54,h:54,r:16},title:r.who,titleSize:18,
        sub:[h('div',{key:'c',className:'t-muted',style:{fontWeight:700,fontSize:13,margin:'2px 0 6px'}},r.car),
             h(DateLine,{key:'d',date:r.date,time:r.time})],
        trailing:h('div',{className:'price'},'$'+r.amount)})))
  );
}

/* ---------------- OWNER CALENDAR (week view) ---------------- */
const WEEK_DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
function OwnerCalendar({go, state, params}){
  const weeks = D.ownerWeeks;
  // params.week / params.sel seed fixed states for the static Figma export.
  const [offset,setOffset] = React.useState(params.week||0);
  const [sel,setSel] = React.useState(params.sel!=null?params.sel:0);
  const week = weeks[String(offset)] || weeks['0'];
  const startNum = D.weekStart + offset*7;
  const dates = WEEK_DAYS.map((_,i)=>startNum+i);
  const heading = offset===0?'This week' : offset===1?'Next week' : offset===-1?'Last week' : 'Week of '+dates[0];
  const dayBookings = week[sel] || [];
  return h('div',{className:'screen-pad',style:{gap:16}},
    h('div',{className:'row between',style:{marginTop:4}},
      h('div',null,
        h('div',{className:'h-page'},heading),
        h('div',{className:'eyebrow',style:{marginTop:2}},D.weekMonth)),
      h('div',{className:'row',style:{gap:8}},
        h('button',{className:'iconbtn glass',onClick:()=>{setOffset(o=>o-1);setSel(0);},'aria-label':'previous week'},h(Icon,{name:'chevron-left',size:22})),
        h('button',{className:'iconbtn glass',onClick:()=>{setOffset(o=>o+1);setSel(0);},'aria-label':'next week'},h(Icon,{name:'chevron-right',size:22})))),

    h('div',{className:'weekstrip'},
      WEEK_DAYS.map((d,i)=>{const list=week[i]||[]; const booked=list.length>0; const active=i===sel;
        return h('button',{key:i,className:'wk-day'+(active?' active':'')+(booked?' booked':''),onClick:()=>setSel(i)},
          h('span',{className:'wk-name'},d),
          h('span',{className:'wk-num'},dates[i]),
          h('span',{className:'wk-dots'}, list.slice(0,3).map((b,j)=>h('img',{key:j,src:b.avatar,alt:''}))));
      })),

    h('div',{style:{display:'flex',flexDirection:'column',gap:12}},
      dayBookings.length===0
        ? h('div',{className:'cal-empty'}, h(Icon,{name:'calendar',size:40}),
            h('p',null,'No bookings on '+WEEK_DAYS[sel]+' '+dates[sel]))
        : dayBookings.map((b,i)=>h('div',{key:i,className:'cal-book reveal',style:{animationDelay:(i*70)+'ms'},
            onClick:()=>go('owner-history')},
            h('img',{className:'cal-avi',src:b.avatar,alt:b.who}),
            h('div',{className:'grow'},
              h('div',{style:{fontWeight:800,fontSize:17}},b.who),
              h('div',{className:'cal-when'},h(Icon,{name:'clock',size:14}),WEEK_DAYS[sel]+' | '+b.time)),
            h(Icon,{name:'chevron-right',size:22,color:'var(--c-accent)'})))
    )
  );
}

/* ---------------- OWNER HISTORY ---------------- */
function OwnerHistory({go, state}){
  const rows = D.history.map((b,idx)=>{const c=D.byId[b.car];const r=[...D.requests,...D.ownerUpcoming][idx%4];
    return {c,b,who:r?r.who:'Renter',avatar:r?r.avatar:c.img};});
  return h('div',{className:'screen-pad'},
    h('div',{className:'h-page',style:{marginTop:4}},'Rental History'),
    h('div',{style:{display:'flex',flexDirection:'column'}},
      rows.map(({c,b,who,avatar},i)=>h(EntityRow,{key:i,delay:i*50,lead:{src:c.img,w:70,h:54},title:c.name,
        sub:[h('div',{key:'w',className:'t-muted',style:{fontWeight:700,fontSize:13}},'Rented by '+who),
             h(DateLine,{key:'d',date:b.date,time:b.time})],
        trailing:[h('div',{key:'p',className:'price'},'$'+b.total),h(Badge,{key:'b',status:b.status})]})))
  );
}

/* ---------------- OWNER GARAGE (my cars) ---------------- */
function OwnerGarage({go, state}){
  return h('div',{className:'screen-pad'},
    h('div',{className:'row between',style:{marginTop:4}},
      h('div',{className:'h-page'},'My Garage'),
      h('button',{className:'iconbtn',style:{background:'var(--grad-primary)',color:'#06302b'},onClick:()=>go('owner-add-car')},h(Icon,{name:'plus',size:24,stroke:2.6}))),
    D.ownerCars.map((oc,i)=>{const c=D.byId[oc.car];
      return h('div',{key:i,className:'card card-interactive reveal',style:{padding:0,overflow:'hidden',animationDelay:(i*80)+'ms'},onClick:()=>go('car-detail',{id:c.id})},
        h('div',{className:'hero-img',style:{aspectRatio:'16/8'}},h('img',{src:c.img,alt:c.name}),h('div',{className:'scrim'}),
          h('div',{style:{position:'absolute',top:12,right:12}},h(Badge,{status:oc.status}))),
        h('div',{style:{padding:'14px 16px'}},
          h('div',{className:'row between'},
            h('div',{className:'car-name',style:{fontSize:20}},c.name),
            h('div',{className:'price'},'$'+c.price,h('small',null,'/hr'))),
          h('div',{className:'row between',style:{marginTop:10}},
            h(Chips,{items:c.chips,max:3}),
            h('div',{className:'label',style:{fontWeight:800,color:'var(--c-secondary)'}},'$'+oc.earned+' earned'))));
    }),
    h('button',{className:'btn btn-ghost btn-block',onClick:()=>go('owner-add-car')},h(Icon,{name:'plus',size:20,stroke:2.4}),'List another car')
  );
}

/* ---------------- OWNER ADD CAR ---------------- */
function OwnerAddCar({go, state}){
  const [sel,setSel] = React.useState(['auto']);
  const allChips=[['auto','Auto'],['gear','Manual'],['bolt','EV'],['awd','AWD'],['leaf','ECO'],['glass','High-End']];
  const toggle=(k)=>setSel(s=>s.includes(k)?s.filter(x=>x!==k):[...s,k]);
  const Field=({label,ph})=>h('div',null,h('div',{className:'eyebrow',style:{marginBottom:6}},label),
    h('div',{className:'searchbar',style:{background:'var(--surface)',border:'2px solid var(--hair)'}},h('input',{placeholder:ph})));
  return h('div',{className:'screen-pad',style:{gap:16}},
    h(Header,{title:'List a car',onBack:()=>go('owner-garage',null,true)}),
    h('div',{style:{aspectRatio:'16/9',borderRadius:24,border:'2px dashed var(--mint-strong)',background:'var(--mint)',
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,color:'var(--c-secondary)',cursor:'pointer'}},
      h(Icon,{name:'plus',size:36,stroke:2}),h('div',{className:'label',style:{fontWeight:700}},'Add photos')),
    h(Field,{label:'Make & model',ph:'e.g. Toyota Corolla'}),
    h('div',{className:'row',style:{gap:12}},
      h('div',{className:'grow'},h(Field,{label:'Year',ph:'2021'})),
      h('div',{className:'grow'},h(Field,{label:'Price / hr',ph:'$12'}))),
    h('div',null,h('div',{className:'eyebrow',style:{marginBottom:8}},'Features'),
      h('div',{className:'chips'},allChips.map(([ic,label])=>h('button',{key:ic,onClick:()=>toggle(ic),
        className:'chip',style:{border:'none',cursor:'pointer',background:sel.includes(ic)?'var(--c-brand)':'var(--mint)',color:sel.includes(ic)?'#fff':'var(--c-accent)'}},
        h(Icon,{name:ic,size:15,stroke:2.2}),label)))),
    h('div',{className:'mt-auto'}),
    h('button',{className:'btn btn-primary btn-block',onClick:()=>go('owner-garage',null,true)},'Publish listing')
  );
}

/* ---------------- OWNER PROFILE ---------------- */
function OwnerProfile({go, state}){
  const o = D.owner;
  return h('div',{className:'screen-pad',style:{gap:18}},
    h(ProfileHeader,{avatar:o.avatar,name:o.name,verified:o.verified,rating:o.rating,reviews:o.reviews}),
    h(StatTiles,{tiles:[{value:'$'+(o.earnings).toLocaleString(),label:'Earned'},{value:o.listed,label:'Cars'},{value:o.since,label:'Member'}]}),
    h(NavCard,{icon:'gear',label:'Settings',onClick:()=>go('settings')}),
    h(NavCard,{icon:'user',label:'Switch to driver mode',onClick:()=>state.switchMode('driver','home')}),
    h('div',{className:'mt-auto'}),
    h('button',{className:'btn btn-ghost btn-block',style:{color:'var(--no-ink)'},onClick:()=>go('splash')},h(Icon,{name:'logout',size:20}),'Log out')
  );
}

export const OwnerScreens = {OwnerHome,OwnerCalendar,OwnerHistory,OwnerGarage,OwnerAddCar,OwnerProfile};
export default OwnerScreens;
