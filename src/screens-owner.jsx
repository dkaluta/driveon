/* DriveOn — car-owner flow screens.
   Reuses the SAME generic Blocks (EntityRow, ProfileHeader, StatTiles, etc.) as the driver flow. */
import React from 'react';
import { Icon, Chips, CarPhoto, Badge, Header, messageOnWhatsApp } from './ui.jsx';
import { DateLine, EntityRow, ProfileHeader, StatTiles, NavCard, SectionCard } from './blocks.jsx';
import { FuelGauge } from './screens-driver.jsx';
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

    // car-returned notification — driver brought a car back (fuel verified)
    D.returns.length>0 && h('div',{className:'return-note reveal',onClick:()=>go('owner-return',{idx:0})},
      h('span',{className:'rn-ic'},h(Icon,{name:'check-circle',size:22})),
      h('div',{className:'grow'},
        h('div',{style:{fontWeight:800,fontSize:15}},D.byId[D.returns[0].car].name+' was returned'),
        h('div',{className:'t-muted',style:{fontSize:13,fontWeight:600,marginTop:1}},'Full tank verified · '+D.returns[0].loc)),
      h(Icon,{name:'chevron-right',size:20,color:'var(--c-accent)'})),

    h('div',{className:'card card-interactive',style:{background:'var(--grad-secondary)',color:'#fff',border:'none',boxShadow:'var(--teal-shadow)',cursor:'pointer'},onClick:()=>go('owner-earnings')},
      h('div',{className:'row between'},
        h('div',{className:'label',style:{opacity:.85,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',fontSize:12}},'Earnings this month'),
        h(Icon,{name:'chevron-right',size:20,color:'rgba(255,255,255,.85)'})),
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
const hrLabel = (n)=>String(n).padStart(2,'0')+':00';
/* compact hour stepper (− value +) used inside a per-day availability row */
function TimeStep({val,onChange}){
  return h('div',{className:'avstep'},
    h('button',{onClick:()=>onChange(val-1),'aria-label':'earlier'},h(Icon,{name:'arrow-left',size:13})),
    h('span',null,hrLabel(val)),
    h('button',{onClick:()=>onChange(val+1),'aria-label':'later'},h(Icon,{name:'arrow-right',size:13})));
}
/* one weekday's availability — open/closed toggle + its OWN from–to window */
function DayAvail({day,on,from,to,onToggle,onFrom,onTo}){
  return h('div',{className:'avrow'+(on?'':' is-off')},
    h('button',{className:'avtoggle'+(on?' on':''),onClick:onToggle,'aria-label':day+(on?' open':' closed')},
      h('span',{className:'avknob'})),
    h('span',{className:'avname'},day),
    on
      ? h('div',{className:'avtimes'},
          h(TimeStep,{val:from,onChange:onFrom}),
          h('span',{className:'avdash'},'–'),
          h(TimeStep,{val:to,onChange:onTo}))
      : h('span',{className:'avclosed'},'Closed'));
}
function OwnerCalendar({go, state, params}){
  const weeks = D.ownerWeeks;
  // params.week / params.sel seed fixed states for the static Figma export.
  const [offset,setOffset] = React.useState(params.week||0);
  const [sel,setSel] = React.useState(params.sel!=null?params.sel:0);
  const [avail,setAvail] = React.useState(D.ownerAvailability);
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
            onClick:()=>go('owner-renter',{who:b.who,avatar:b.avatar,car:b.car,time:b.time,amount:b.amount,day:WEEK_DAYS[sel],date:dates[sel],month:D.weekMonth})},
            h('img',{className:'cal-avi',src:b.avatar,alt:b.who}),
            h('div',{className:'grow'},
              h('div',{style:{fontWeight:800,fontSize:17}},b.who),
              h('div',{className:'cal-when'},h(Icon,{name:'clock',size:14}),WEEK_DAYS[sel]+' | '+b.time)),
            h(Icon,{name:'chevron-right',size:22,color:'var(--c-accent)'})))
    ),
    // availability — PER-DAY booking windows (each weekday its own hours)
    h('div',{className:'card',style:{display:'flex',flexDirection:'column',gap:4}},
      h('div',{className:'row between',style:{marginBottom:4}},
        h('span',{className:'eyebrow'},'Booking availability'),
        h('span',{className:'t-muted',style:{fontSize:12,fontWeight:700}},
          avail.days.filter(d=>d.on).length+' of 7 days open')),
      WEEK_DAYS.map((d,i)=>h(DayAvail,{key:i,day:d,
        on:avail.days[i].on, from:avail.days[i].from, to:avail.days[i].to,
        onToggle:()=>setAvail(a=>({...a,days:a.days.map((x,j)=>j===i?{...x,on:!x.on}:x)})),
        onFrom:v=>setAvail(a=>({...a,days:a.days.map((x,j)=>j===i?{...x,from:Math.max(0,Math.min(x.to-1,v))}:x)})),
        onTo:v=>setAvail(a=>({...a,days:a.days.map((x,j)=>j===i?{...x,to:Math.max(x.from+1,Math.min(24,v))}:x)}))})),
      h('p',{className:'t-muted',style:{margin:'6px 0 0',fontSize:13,fontWeight:600}},'Each day has its own hours — renters can only book during open windows.'))
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

/* ---------------- OWNER ADD / EDIT CAR ----------------
   Mirrors the owner sign-up "Your car" registration fields exactly. */
function CarTextField({label,defVal,ph}){
  return h('div',null,h('div',{className:'eyebrow',style:{marginBottom:6}},label),
    h('div',{className:'searchbar',style:{background:'var(--surface)',border:'2px solid var(--hair)'}},
      h('input',{defaultValue:defVal||'',placeholder:ph})));
}
function CarStep({label,value,onChange}){
  return h('div',{className:'card',style:{flex:1,padding:'10px 12px'}},
    h('div',{className:'label',style:{color:'var(--muted)',fontSize:11,textTransform:'uppercase',letterSpacing:'.05em'}},label),
    h('div',{className:'row between',style:{marginTop:6}},
      h('button',{className:'iconbtn',style:{width:30,height:30},onClick:()=>onChange(Math.max(0,(value||0)-1))},h(Icon,{name:'arrow-left',size:15})),
      h('div',{style:{fontWeight:800,fontSize:18}},value||0),
      h('button',{className:'iconbtn',style:{width:30,height:30},onClick:()=>onChange((value||0)+1)},h(Icon,{name:'arrow-right',size:15}))));
}
function OwnerAddCar({go, state, params}){
  const editId = params && params.edit;
  const car = editId ? D.byId[editId] : null;
  const oc = editId ? D.ownerCars.find(x=>x.car===editId) : null;
  const [sel,setSel] = React.useState(car ? car.chips.map(c=>c[0]) : ['auto']);
  const [steps,setSteps] = React.useState({doors:4, seats:car?car.seats:5, trunk:2});
  const allChips=[['auto','Auto'],['gear','Manual'],['bolt','EV'],['awd','AWD'],['leaf','ECO'],['glass','High-End']];
  const toggle=(k)=>setSel(s=>s.includes(k)?s.filter(x=>x!==k):[...s,k]);
  const setStep=(k,v)=>setSteps(o=>({...o,[k]:v}));
  const back=()=>go(editId?'car-detail':'owner-garage', editId?{id:editId}:null, !editId);
  return h('div',{className:'screen-pad',style:{gap:16}},
    h(Header,{title:editId?'Edit car':'List a car',onBack:back}),
    h('div',{style:{aspectRatio:'16/9',borderRadius:24,border:'2px dashed var(--mint-strong)',background:'var(--mint)',overflow:'hidden',position:'relative',
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,color:'var(--c-secondary)',cursor:'pointer'}},
      car && h('img',{src:car.img,alt:car.name,style:{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:.92}}),
      h(Icon,{name:'camera',size:34,stroke:2,style:{position:'relative'}}),
      h('div',{className:'label',style:{fontWeight:700,position:'relative'}},car?'Change photos':'Add photos')),
    h('div',{className:'row',style:{gap:12}},
      h('div',{className:'grow'},h(CarTextField,{label:'Make',defVal:car&&car.name.split(' ')[0],ph:'Toyota'})),
      h('div',{className:'grow'},h(CarTextField,{label:'Model',defVal:car&&car.name.split(' ').slice(1).join(' '),ph:'Corolla'}))),
    h('div',{className:'row',style:{gap:12}},
      h('div',{className:'grow'},h(CarTextField,{label:'Year',defVal:car&&String(car.year),ph:'2021'})),
      h('div',{className:'grow'},h(CarTextField,{label:'License plate',defVal:oc&&oc.plate,ph:'123-45-678'}))),
    h('div',{className:'row',style:{gap:10}},
      h(CarStep,{label:'Doors',value:steps.doors,onChange:v=>setStep('doors',v)}),
      h(CarStep,{label:'Seats',value:steps.seats,onChange:v=>setStep('seats',v)}),
      h(CarStep,{label:'Trunk',value:steps.trunk,onChange:v=>setStep('trunk',v)})),
    h('div',{className:'row',style:{gap:12}},
      h('div',{className:'grow'},h(CarTextField,{label:'Price / hour ($)',defVal:car&&String(car.price),ph:'12'})),
      h('div',{className:'grow'},h(CarTextField,{label:'Price / day ($)',defVal:car&&String(car.price*10),ph:'120'}))),
    h(CarTextField,{label:'Mileage (km)',defVal:car&&car.mileage,ph:'80,000'}),
    h('div',null,h('div',{className:'eyebrow',style:{marginBottom:8}},'Features'),
      h('div',{className:'chips'},allChips.map(([ic,label])=>h('button',{key:ic,onClick:()=>toggle(ic),
        className:'chip',style:{border:'none',cursor:'pointer',background:sel.includes(ic)?'var(--c-brand)':'var(--mint)',color:sel.includes(ic)?'#fff':'var(--c-accent)'}},
        h(Icon,{name:ic,size:15,stroke:2.2}),label)))),
    h('div',{className:'mt-auto'}),
    h('button',{className:'btn btn-primary btn-block',onClick:back},editId?'Save changes':'Publish listing')
  );
}

/* ---------------- OWNER EARNINGS ---------------- */
function OwnerEarnings({go, state}){
  const e = D.ownerEarnings;
  const max = Math.max(...e.months.map(m=>m[1]));
  return h('div',{className:'screen-pad',style:{gap:18}},
    h(Header,{title:'Earnings',onBack:()=>go(null,null,true)}),
    h('div',{className:'card',style:{background:'var(--grad-secondary)',color:'#fff',border:'none',boxShadow:'var(--teal-shadow)'}},
      h('div',{className:'label',style:{opacity:.85,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',fontSize:12}},'Total this month'),
      h('div',{className:'row',style:{alignItems:'flex-end',gap:12,marginTop:6}},
        h('div',{className:'counter',style:{fontSize:44,fontWeight:900,letterSpacing:'-.02em',lineHeight:1}},'$'+e.total.toLocaleString()),
        h('div',{className:'row',style:{gap:4,background:'rgba(255,255,255,.22)',padding:'5px 10px',borderRadius:999,fontWeight:800,fontSize:14}},
          h(Icon,{name:'trend-up',size:16,stroke:2.6}),e.change+'%'))),
    h('div',{className:'card'},
      h('div',{className:'eyebrow',style:{marginBottom:16}},'Last 5 months'),
      h('div',{className:'row',style:{alignItems:'flex-end',gap:10,height:140}},
        e.months.map(([m,v],i)=>h('div',{key:i,style:{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:8,justifyContent:'flex-end',height:'100%'}},
          h('div',{style:{fontWeight:800,fontSize:12,color:'var(--c-secondary)'}},'$'+(v/1000).toFixed(1)+'k'),
          h('div',{style:{width:'100%',maxWidth:32,height:Math.round(v/max*96)+'px',borderRadius:8,background:i===e.months.length-1?'var(--grad-primary)':'var(--mint-strong)'}}),
          h('div',{className:'label',style:{fontSize:11,color:'var(--muted)',fontWeight:700}},m))))),
    h(StatTiles,{tiles:[{value:e.trips,label:'Trips'},{value:'$'+e.avgTrip,label:'Avg / trip'},{value:e.bestMonth,label:'Best month'}]}),
    h(SectionCard,{title:'By car'},
      e.byCar.map((bc,i)=>{const c=D.byId[bc.car];return h(EntityRow,{key:i,accent:true,delay:i*70,lead:{src:c.img,w:60,h:48,r:14},title:c.name,titleSize:18,
        sub:[h('div',{key:'t',className:'t-muted',style:{fontWeight:700,fontSize:13}},bc.trips+' trips')],
        trailing:[h('div',{key:'p',className:'price'},'$'+bc.amount)]});}))
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

/* ---------------- OWNER · CAR RETURNED (return notification detail) ---------------- */
function OwnerReturn({go, state, params}){
  const r = (params && params.idx!=null && D.returns[params.idx]) || D.returns[0];
  const car = D.byId[r.car];
  const kv=(k,v,accent)=>h('div',{className:'kv'},h('span',{className:'k'},k),
    h('span',{className:'v',style:accent?{color:'var(--c-secondary)'}:undefined},v));
  return h('div',{className:'screen-pad',style:{gap:16}},
    h(Header,{title:'Car returned',onBack:()=>go(null,null,true)}),
    h('div',{className:'card',style:{display:'flex',gap:13,alignItems:'center'}},
      h(CarPhoto,{src:car.img,alt:car.name,w:64,h:50}),
      h('div',{className:'grow'},
        h('div',{className:'car-name',style:{fontSize:18}},car.name),
        h('div',{className:'t-muted',style:{fontWeight:700,marginTop:2}},'Returned by '+r.who)),
      h(Badge,{status:'available'})),
    // fuel verification — answers "did they bring it back with fuel?"
    h('div',{className:'card fuel-proof'},
      h(FuelGauge),
      h('div',{className:'fuel-status verified'},h(Icon,{name:'check-circle',size:20}),
        r.fuel==='full'?'Returned with a full tank — verified':'Fuel not verified')),
    // where + when + earnings
    h('div',{className:'card',style:{display:'flex',flexDirection:'column',gap:12}},
      kv('Returned to', r.loc + (r.sameSpot?' · same spot':'')),
      kv('When', r.when),
      kv('Distance driven', r.distance),
      kv('You earned','$'+r.amount,true)),
    // mini map of where it came back
    h('div',{style:{position:'relative',borderRadius:'var(--r-card)',overflow:'hidden',aspectRatio:'2 / 1',border:'1px solid var(--hair)'}},
      h('img',{src:D.A('map.jpg'),alt:'return location',style:{width:'100%',height:'100%',objectFit:'cover'}}),
      h('div',{className:'me-dot',style:{left:'46%',top:'52%'}})),
    h('div',{className:'mt-auto'}),
    h('button',{className:'btn btn-primary btn-block',onClick:()=>go('owner-garage')},
      h(Icon,{name:'car',size:20}),'View in garage')
  );
}

/* ---------------- OWNER · RENTER PROFILE (tap a booking in the calendar) ---------------- */
function OwnerRenter({go, state, params}){
  const r = params || {};
  const car = D.cars.find(c=>c.name===r.car);
  const kv=(k,v,accent)=>h('div',{className:'kv'},h('span',{className:'k'},k),
    h('span',{className:'v',style:accent?{color:'var(--c-secondary)'}:undefined},v));
  return h('div',{className:'screen-pad',style:{gap:16}},
    h(Header,{title:'Booking',onBack:()=>go(null,null,true)}),
    h(ProfileHeader,{avatar:r.avatar,name:r.who,verified:true,rating:4.8,reviews:24}),
    h('div',{className:'card',style:{display:'flex',flexDirection:'column',gap:12}},
      h('div',{className:'eyebrow',style:{marginBottom:2}},'Booking details'),
      car && h('div',{className:'row',style:{gap:12,alignItems:'center',marginBottom:4}},
        h(CarPhoto,{src:car.img,alt:car.name,w:60,h:46}),
        h('div',{className:'grow'},h('div',{className:'car-name',style:{fontSize:17}},car.name),
          h('div',{className:'t-muted',style:{fontWeight:700,fontSize:13,marginTop:2}},car.loc))),
      kv('When', ((r.day||'')+' '+(r.date||'')).trim()+(r.month?' · '+r.month:'')),
      kv('Time', r.time||'—'),
      kv('Earnings','$'+(r.amount||0),true)),
    h('div',{className:'mt-auto'}),
    h('button',{className:'btn btn-primary btn-block',onClick:()=>messageOnWhatsApp(r.who)},
      h(Icon,{name:'chat',size:20}),'Message '+(r.who?r.who.split(' ')[0]:'renter'))
  );
}

export const OwnerScreens = {OwnerHome,OwnerCalendar,OwnerHistory,OwnerGarage,OwnerAddCar,OwnerEarnings,OwnerProfile,OwnerReturn,OwnerRenter};
export default OwnerScreens;
