/* GETAWAY — driver flow screens. */
import React from 'react';
import { Icon, Stars, Chips, CarPhoto, Badge, Heart, Header } from './ui.jsx';
import { DateLine, EntityRow, ProfileHeader, StatTiles, Toggle, SettingRow, NavCard, SectionCard } from './blocks.jsx';
import { DATA as D } from './data.js';

const h = React.createElement;

/* shared car list row */
function CarRow({car, onClick, liked, onLike, trailing, showPhoto=true, delay=0}){
  return h('div',{className:'car-row reveal',style:{animationDelay:delay+'ms'},onClick},
    showPhoto && h(CarPhoto,{src:car.img,alt:car.name,w:74,h:56}),
    h('div',{className:'meta'},
      h('div',{className:'car-name'},car.name),
      car.chips && h(Chips,{items:car.chips})),
    h('div',{className:'car-right'},
      trailing!==undefined ? trailing :
      h(React.Fragment,null,
        h('div',{className:'price'},'$'+car.price,h('small',null,'/hr')),
        h(Heart,{on:liked,onClick:onLike,size:24}))));
}

/* ---------------- HOME ---------------- */
function Home({go, state}){
  const up = D.upcoming, rate = D.rate;
  return h('div',{className:'screen-pad'},
    h('div',{style:{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,marginTop:4}},
      h('div',null,
        h('div',{className:'eyebrow'},'Your next adventure'),
        h('div',{className:'h-greet'},'Welcome back,',h('br'),h('b',null,D.driver.name))),
      h('img',{src:D.driver.avatar,alt:'avi',style:{width:62,height:62,borderRadius:18,objectFit:'cover',border:'2px solid hsl(var(--primary)/.3)'}})),

    h('div',{className:'searchbar block',onClick:()=>go('search-list')},
      h(Icon,{name:'search',size:24}),
      h('div',{className:'grow'},
        h('div',{style:{fontWeight:700,color:'var(--ink)'}},'Find a car'),
        h('div',{className:'search-sub'},'Search available cars near you'))),

    h(SectionCard,{title:'Upcoming Rentals',action:'See all',onAction:()=>go('history')},
      up.map((b,i)=>{const c=D.byId[b.car];const active=b.status==='confirmed';return h(EntityRow,{key:i,accent:true,delay:i*70,
        lead:{src:c.img,w:60,h:48,r:14},title:c.name,titleSize:18,
        onClick:active?()=>go('fuel-pickup',{id:c.id,phase:'pickup'}):undefined,
        sub:[h(DateLine,{key:'d',date:b.date,time:b.time})],
        trailing:[h('div',{key:'p',className:'price'},'$'+b.total),
          active?h('span',{key:'k',className:'badge ok',style:{display:'inline-flex',alignItems:'center',gap:4}},h(Icon,{name:'key',size:12}),'Key'):h(Badge,{status:b.status})]});})),

    h(SectionCard,{title:'Rate Your Rides'},
      rate.map((b,i)=>{const c=D.byId[b.car];const val=state.ratings[c.id]||b.stars;
        return h(EntityRow,{key:i,accent:true,delay:i*70,lead:{src:c.img,w:60,h:48,r:14},title:c.name,titleSize:18,
          sub:[h(DateLine,{key:'d',date:b.date})],
          trailing:[h('div',{key:'p',className:'price'},'$'+b.total),h(Stars,{key:'s',value:val,size:18,onRate:(n)=>state.rate(c.id,n)})]});}))
  );
}

/* ---------------- SEARCH LIST ---------------- */
function SearchList({go, state}){
  return h('div',{className:'screen-pad',style:{paddingTop:2}},
    h('div',{className:'row',style:{gap:10}},
      h('button',{className:'iconbtn glass',onClick:()=>go('map'),'aria-label':'map'},h(Icon,{name:'map',size:22})),
      h('button',{className:'iconbtn glass',onClick:()=>go('filter'),'aria-label':'filter'},h(Icon,{name:'filter',size:22})),
      h('div',{className:'searchbar'},h(Icon,{name:'search',size:22}),
        h('input',{placeholder:'Find a car…',defaultValue:state.query,onChange:e=>state.setQuery(e.target.value)}),
        h(Icon,{name:'mic',size:20}))),
    h('div',{style:{display:'flex',flexDirection:'column'}},
      D.cars.filter(c=>!state.ownedIds.has(c.id) && (!state.query||c.name.toLowerCase().includes(state.query.toLowerCase())))
        .map((c,i)=>h(CarRow,{key:c.id,car:c,delay:i*55,liked:state.likes.has(c.id),
          onLike:()=>state.toggleLike(c.id),onClick:()=>go('car-detail',{id:c.id})})))
  );
}

/* ---------------- MAP ---------------- */
function MapView({go, state}){
  const [sel,setSel] = React.useState('corolla');
  const car = D.byId[sel];
  return h('div',{style:{position:'absolute',inset:0}},
    h('div',{className:'mapwrap'}, h('img',{src:D.A('map.jpg'),alt:'map'})),
    h('div',{style:{position:'absolute',top:10,left:14,right:14,display:'flex',gap:10,alignItems:'center'}},
      h('button',{className:'iconbtn glass',onClick:()=>go('search-list')},h(Icon,{name:'list',size:22})),
      h('button',{className:'iconbtn glass',onClick:()=>go('filter')},h(Icon,{name:'filter',size:22})),
      h('div',{className:'searchbar'},
        h(Icon,{name:'search',size:22}),h('input',{placeholder:'Find a car…'}),h(Icon,{name:'mic',size:20}))),
    h('div',{className:'me-dot',style:{left:'42%',top:'46%'}}),
    D.cars.filter(c=>!state.ownedIds.has(c.id)).map(c=>h('div',{key:c.id,className:'pin'+(sel===c.id?' sel':''),
      style:{left:c.map.x+'%',top:c.map.y+'%'},onClick:()=>setSel(c.id)},
      h('div',{className:'bub'},'$'+c.map.price),h('div',{className:'stem'}))),
    h('div',{className:'sheet-card',key:sel,onClick:()=>go('car-detail',{id:sel})},
      h(CarPhoto,{src:car.img,alt:car.name,w:78,h:62}),
      h('div',{className:'grow'},
        h('div',{className:'car-name'},car.name),
        h('div',{style:{marginTop:8}},h(Chips,{items:car.chips,max:2}))),
      h('div',{className:'car-right'},
        h('div',{className:'price'},'$'+car.price,h('small',null,'/hr')),
        h(Icon,{name:'chevron-right',size:24,color:'var(--c-secondary)'})))
  );
}

/* ---------------- FILTER ---------------- */
function Filter({go, back, state}){
  const f = state.filters, set = state.setFilters;
  const opt=(group,val,label)=>h('div',{className:'optrow',key:val,onClick:()=>set(group,val)},
    h('span',{className:'cbox'+((f[group]||[]).includes(val)?' on':'')},h(Icon,{name:'check',size:18,stroke:3})),label);
  const sect=(t,kids)=>h('div',null,h('div',{className:'h-section',style:{marginBottom:4}},t),kids);
  return h('div',{className:'screen-pad'},
    h(Header,{title:'Filter',onBack:back}),
    sect('Gear system',[opt('gear','auto','Auto'),opt('gear','manual','Manual')]),
    h('hr',{className:'hr'}),
    sect('Mileage',[opt('mile','low','Up to 100,000 km'),opt('mile','mid','100,000 – 200,000 km'),opt('mile','high','Over 200,000 km')]),
    h('hr',{className:'hr'}),
    h('div',null,h('div',{className:'h-section',style:{marginBottom:14}},'Price per hour'),
      h(PriceRange,{value:f.price,onChange:v=>set('price',v)})),
    h('hr',{className:'hr'}),
    sect('Number of seats',[opt('seats','5','5'),opt('seats','58','5 – 8'),opt('seats','8','8 +')]),
    h('button',{className:'btn btn-primary btn-block',style:{marginTop:8},onClick:back},'Show results')
  );
}
function PriceRange({value=46,onChange}){
  const ref = React.useRef();
  const pct = value;
  const drag=(e)=>{const r=ref.current.getBoundingClientRect();
    const move=(ev)=>{const x=(ev.touches?ev.touches[0].clientX:ev.clientX)-r.left;
      onChange(Math.max(0,Math.min(100,Math.round(x/r.width*100))));};
    move(e); const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);};
    window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);};
  const dollar=(p)=>Math.round(7+p/100*93);
  return h('div',null,
    h('div',{className:'range',ref,onPointerDown:drag},
      h('div',{className:'track'}),h('div',{className:'fill',style:{width:pct+'%'}}),
      h('div',{className:'knob',style:{left:pct+'%'}})),
    h('div',{className:'row between',style:{fontWeight:800,fontSize:18,marginTop:2}},
      h('span',null,'$7'),h('span',{style:{color:'var(--c-secondary)'}},'$'+dollar(pct)),h('span',null,'$100')));
}

/* ---------------- CAR DETAIL ---------------- */
function PolicyCard({p}){
  const Row=(icon,label,value,sub,key)=>h('div',{className:'pol-row'+(key?' key':'')},
    h('span',{className:'pol-ic'},h(Icon,{name:icon,size:20})),
    h('div',{className:'grow'},
      h('div',{className:'pol-lab'},label),
      h('div',{className:'pol-val'},value),
      sub&&h('div',{className:'pol-sub'},sub)));
  const ev = /Electric/i.test(p.fuelType);
  return h('div',{className:'card',style:{display:'flex',flexDirection:'column'}},
    h('div',{className:'eyebrow',style:{marginBottom:6}},'Pickup & return'),
    Row(ev?'bolt':'fuel','Fuel type',p.fuelType),
    h('hr',{className:'hr'}),
    Row(ev?'bolt':'fuel','Return policy',p.return,null,true),
    h('hr',{className:'hr'}),
    Row('gauge','Mileage allowance',p.mileage,p.extra),
    p.rules && h('div',{className:'pol-rules'},
      p.rules.map(([ic,label],i)=>h('span',{className:'pol-rule',key:i},h(Icon,{name:ic,size:14}),label))));
}

/* Open Google Maps with public-transit directions to the car (falls back to the
   next-best route automatically). Origin omitted → uses the driver's location. */
function navigateToVehicle(car){
  const url='https://www.google.com/maps/dir/?api=1&destination='+
    encodeURIComponent(car.loc)+'&travelmode=transit';
  if(typeof window!=='undefined') window.open(url,'_blank','noopener');
}

function CarDetail({go, state, params}){
  const car = D.byId[params.id] || D.cars[0];
  const owned = state.ownedIds.has(car.id);
  const oc = owned ? D.ownerCars.find(x=>x.car===car.id) : null;
  const liked = state.likes.has(car.id);
  // a car is "reserved" once the driver has an active booking for it.
  const reserved = !!(state.booking && state.booking.carId===car.id);
  return h('div',{className:'screen-pad',style:{paddingTop:2,gap:16}},
    h('div',{style:{position:'relative'}},
      h('div',{className:'hero-img',style:{aspectRatio:'16/11'}},
        h('img',{src:car.img,alt:car.name}),h('div',{className:'scrim'}),
        owned && h('div',{style:{position:'absolute',bottom:12,left:12}},h('span',{className:'badge ok',style:{display:'inline-flex',alignItems:'center',gap:5}},h(Icon,{name:'key',size:14}),'Your car'))),
      h('button',{className:'iconbtn',style:{position:'absolute',top:12,left:12,background:'rgba(255,255,255,.9)',backdropFilter:'blur(6px)'},onClick:()=>go(null,null,true)},h(Icon,{name:'back',size:24})),
      !owned && h('div',{style:{position:'absolute',top:12,right:12}},h('button',{className:'iconbtn',style:{background:'rgba(255,255,255,.9)',backdropFilter:'blur(6px)'},onClick:()=>state.toggleLike(car.id)},h(Icon,{name:'heart',size:22,fill:liked,color:liked?'var(--c-primary)':'var(--c-brand)'})))),

    h('div',{className:'row between',style:{alignItems:'flex-start'}},
      h('div',null,
        h('div',{className:'car-name',style:{fontSize:28}},car.name),
        h('div',{className:'label',style:{color:'var(--muted)',marginTop:2,fontWeight:700}},car.year+' · '+car.seats+' seats')),
      h('div',{className:'car-right'},
        h('div',{className:'price',style:{fontSize:28}},'$'+car.price,h('small',null,'/hr')),
        h('div',{className:'row',style:{gap:6}},h(Icon,{name:'star',size:18,fill:true,color:'var(--star)'}),
          h('b',null,car.rating),h('span',{className:'t-muted',style:{fontSize:13}},'('+car.reviews+')')))),

    h(Chips,{items:car.chips}),
    h('div',{className:'row between'},
      h('div',{className:'loc'},h(Icon,{name:'location',size:24}),car.loc),
      h('div',{className:'label',style:{fontWeight:700,fontSize:13}},car.dist+' away')),
    h('hr',{className:'hr'}),

    car.policy && h(PolicyCard,{p:car.policy}),

    owned
      // ---- OWNER VIEW: manage your own listing, no booking ----
      ? h(React.Fragment,null,
          h('div',{className:'card',style:{display:'flex',flexDirection:'column',gap:12}},
            h('div',{className:'row between'},h('span',{className:'eyebrow'},'Your listing'),h(Badge,{status:oc.status})),
            h('div',{className:'kv'},h('span',{className:'k'},'Licence plate'),h('span',{className:'v'},oc.plate)),
            h('div',{className:'kv'},h('span',{className:'k'},'Total earned'),h('span',{className:'v',style:{color:'var(--c-secondary)'}},'$'+oc.earned))),
          h('div',{className:'row',style:{gap:10}},
            h('button',{className:'btn btn-ghost grow',onClick:()=>go('owner-add-car')},h(Icon,{name:'pencil',size:19}),'Edit'),
            h('button',{className:'btn btn-primary grow',onClick:()=>go('owner-calendar')},h(Icon,{name:'calendar',size:19}),'Bookings')))
      // ---- DRIVER VIEW: owner contact + book ----
      : h(React.Fragment,null,
          h('div',{className:'row',style:{gap:14}},
            h('img',{src:car.owner.avatar,alt:car.owner.name,style:{width:54,height:54,borderRadius:16,objectFit:'cover'}}),
            h('div',{className:'grow'},
              h('div',{style:{fontWeight:800,fontSize:18}},car.owner.name),
              h('div',{className:'t-muted',style:{fontWeight:600,fontSize:14}},car.owner.resp+'% response rate')),
            car.owner.verified && h('span',{className:'badge ok',style:{display:'inline-flex',alignItems:'center',gap:5}},
              h(Icon,{name:'shield',size:15}),'Verified')),
          reserved
            // ---- RESERVED: navigate (Google Maps transit) + open key ----
            ? h(React.Fragment,null,
                h('button',{className:'btn btn-primary btn-block',onClick:()=>navigateToVehicle(car)},
                  h(Icon,{name:'navigation',size:20}),'Navigate to Vehicle'),
                h('div',{className:'row',style:{gap:10}},
                  h('button',{className:'btn btn-ghost',style:{flex:'0 0 auto',padding:'15px 18px'}},h(Icon,{name:'phone',size:20})),
                  h('button',{className:'btn btn-ghost grow',onClick:()=>go('fuel-pickup',{id:car.id,phase:'pickup'})},
                    h(Icon,{name:'key',size:19}),'Open digital key')))
            // ---- NOT RESERVED: book ----
            : h('div',{className:'row',style:{gap:10}},
                h('button',{className:'btn btn-ghost',style:{flex:'0 0 auto',padding:'15px 18px'}},h(Icon,{name:'phone',size:20})),
                h('button',{className:'btn btn-primary grow',onClick:()=>{state.startBooking(car.id);go('book-dates',{id:car.id});}},'Book this car')))
  );
}

/* ---------------- BOOK DATES ---------------- */
function BookDates({go, state, params}){
  const car = D.byId[params.id];
  const days = ['MON 14','TUE 15','WED 16','THU 17','FRI 18'];
  const [day,setDay] = React.useState(2);
  const [start,setStart] = React.useState(7), [end,setEnd] = React.useState(14);
  const hrs = Math.max(1,end-start), total = hrs*car.price;
  const step=(set,v,min,max)=>()=>set(p=>Math.max(min,Math.min(max,p+v)));
  const Stepper=({label,val,onMinus,onPlus})=>h('div',{className:'card',style:{flex:1,padding:'12px 14px'}},
    h('div',{className:'label',style:{color:'var(--muted)',fontSize:12,textTransform:'uppercase',letterSpacing:'.06em'}},label),
    h('div',{className:'row between',style:{marginTop:6}},
      h('button',{className:'iconbtn',style:{width:34,height:34},onClick:onMinus},h(Icon,{name:'arrow-left',size:18})),
      h('div',{style:{fontWeight:800,fontSize:22}},String(val).padStart(2,'0')+':00'),
      h('button',{className:'iconbtn',style:{width:34,height:34},onClick:onPlus},h(Icon,{name:'arrow-right',size:18}))));
  return h('div',{className:'screen-pad',style:{gap:18}},
    h(Header,{title:'When?',onBack:()=>go(null,null,true)}),
    h('div',{className:'card',style:{display:'flex',gap:14,alignItems:'center'}},
      h(CarPhoto,{src:car.img,alt:car.name,w:64,h:50}),
      h('div',{className:'grow'},h('div',{className:'car-name',style:{fontSize:18}},car.name),
        h('div',{className:'t-muted',style:{fontWeight:700,marginTop:4}},'$'+car.price+'/hr'))),
    h('div',null,h('div',{className:'h-section',style:{marginBottom:10}},'Pick a day'),
      h('div',{style:{display:'flex',gap:8,overflowX:'auto',paddingBottom:4}},
        days.map((d,i)=>{const [w,n]=d.split(' ');return h('button',{key:i,onClick:()=>setDay(i),
          style:{flex:'0 0 auto',border:'none',cursor:'pointer',borderRadius:16,padding:'12px 16px',
            background:day===i?'var(--grad-primary)':'var(--mint)',color:day===i?'#06302b':'var(--c-brand)',
            fontWeight:800,textAlign:'center',boxShadow:day===i?'var(--glow)':'none'}},
          h('div',{style:{fontSize:11,opacity:.8}},w),h('div',{style:{fontSize:18}},n));}))),
    h('div',null,h('div',{className:'h-section',style:{marginBottom:10}},'Time'),
      h('div',{className:'row',style:{gap:12}},
        h(Stepper,{label:'Pick-up',val:start,onMinus:step(setStart,-1,0,end-1),onPlus:step(setStart,1,0,end-1)}),
        h(Stepper,{label:'Drop-off',val:end,onMinus:step(setEnd,-1,start+1,24),onPlus:step(setEnd,1,start+1,24)}))),
    h('div',{className:'mt-auto'}),
    h('div',{className:'card',style:{display:'flex',flexDirection:'column',gap:10}},
      h('div',{className:'kv'},h('span',{className:'k'},'Duration'),h('span',{className:'v'},hrs+' hours')),
      h('div',{className:'kv'},h('span',{className:'k'},'Total'),h('span',{className:'v',style:{fontSize:24,color:'var(--c-secondary)'}},'$'+total))),
    h('button',{className:'btn btn-primary btn-block',onClick:()=>{state.setBooking({carId:car.id,day:days[day],start,end,hrs,total});go('payment',{id:car.id});}},'Continue to payment')
  );
}

/* ---------------- PAYMENT (ticket stub) ---------------- */
function Payment({go, state, params}){
  const car = D.byId[params.id]; const b = state.booking||{hrs:7,total:91,day:'WED 16',start:7,end:14};
  return h('div',{className:'screen-pad',style:{gap:18}},
    h(Header,{title:'Checkout',onBack:()=>go(null,null,true)}),
    h('div',{className:'ticket'},
      h('div',{className:'top'},
        h('div',{className:'row',style:{gap:14}},
          h(CarPhoto,{src:car.img,alt:car.name,w:64,h:50}),
          h('div',{className:'grow'},h('div',{className:'car-name',style:{fontSize:18}},car.name),
            h('div',{className:'t-muted',style:{fontWeight:700,marginTop:4}},car.loc))),
        h('div',{className:'kv'},h('span',{className:'k'},'Day'),h('span',{className:'v'},b.day)),
        h('div',{className:'kv'},h('span',{className:'k'},'Time'),h('span',{className:'v'},String(b.start).padStart(2,'0')+':00 – '+String(b.end).padStart(2,'0')+':00')),
        h('div',{className:'kv'},h('span',{className:'k'},'Duration'),h('span',{className:'v'},b.hrs+' hours'))),
      h('div',{className:'perf'}),
      h('div',{className:'bottom'},h('span',{className:'h-section'},'Total'),
        h('span',{className:'price',style:{fontSize:28,color:'var(--c-secondary)'}},'$'+b.total))),
    h('div',{className:'card row between'},
      h('div',{className:'row',style:{gap:12}},h(Icon,{name:'card',size:26,color:'var(--c-secondary)'}),
        h('div',null,h('div',{style:{fontWeight:800}},'Visa •••• 4242'),h('div',{className:'t-muted',style:{fontSize:13,fontWeight:600}},'Expires 08/27'))),
      h('span',{className:'tlink'},'Change')),
    car.policy && h('div',{className:'pol-row key',style:{margin:0}},
      h('span',{className:'pol-ic'},h(Icon,{name:/Electric/i.test(car.policy.fuelType)?'bolt':'fuel',size:20})),
      h('div',{className:'grow'},
        h('div',{className:'pol-lab'},'Before you return'),
        h('div',{className:'pol-val'},car.policy.return))),
    h('div',{className:'mt-auto'}),
    h('button',{className:'btn btn-primary btn-block',onClick:()=>go('confirmed',{id:car.id})},
      h(Icon,{name:'key',size:20}),'Pay $'+b.total)
  );
}

/* ---------------- CONFIRMED ---------------- */
function Confirmed({go, params}){
  return h('div',{className:'confirm'},
    h('div',{className:'ring'},h(Icon,{name:'check',size:56,stroke:2.6})),
    h('h2',null,'Booking Confirmed!'),
    h('p',null,'Your digital key is ready — unlock the car when you arrive'),
    h('div',{style:{display:'flex',flexDirection:'column',gap:12,marginTop:26,width:'100%',maxWidth:300}},
      h('button',{className:'btn btn-primary btn-block',onClick:()=>go('fuel-pickup',Object.assign({phase:'pickup'},params))},
        h(Icon,{name:'key',size:20}),'Open digital key'),
      h('button',{className:'btn btn-ghost btn-block',onClick:()=>go('home')},'Back to home')));
}

/* ---------------- FUEL VERIFICATION (pickup + return) ---------------- */
/* Dashboard-style fuel gauge, needle at Full. */
function FuelGauge(){
  return h('svg',{viewBox:'0 0 200 124',width:'100%',style:{maxWidth:230,display:'block',margin:'0 auto'}},
    h('path',{d:'M22 104 A82 82 0 0 1 178 104',fill:'none',stroke:'var(--hair)',strokeWidth:14,strokeLinecap:'round'}),
    h('path',{d:'M120 31 A82 82 0 0 1 178 104',fill:'none',stroke:'var(--c-secondary)',strokeWidth:14,strokeLinecap:'round'}),
    h('line',{x1:100,y1:104,x2:166,y2:55,stroke:'var(--ink)',strokeWidth:5,strokeLinecap:'round'}),
    h('circle',{cx:100,cy:104,r:8,fill:'var(--ink)'}),
    h('text',{x:20,y:120,fontSize:15,fontWeight:'800',fill:'var(--muted)'},'E'),
    h('text',{x:168,y:120,fontSize:15,fontWeight:'800',fill:'var(--c-secondary)'},'F'));
}

function FuelVerify({go, state, params}){
  const phase = params.phase==='return' ? 'return' : 'pickup';
  const car = params.id ? D.byId[params.id] : null;
  // params.fstate seeds a fixed state for the static Figma export.
  const [st,setSt] = React.useState(params.fstate || 'empty');
  React.useEffect(()=>{ if(st!=='verifying') return;
    const id=setTimeout(()=>setSt('verified'),1500); return ()=>clearTimeout(id); },[st]);
  const copy = phase==='return'
    ? {bar:'End Trip',   eyebrow:'Before you finish', title:'Confirm Refuel',
       desc:'Upload a photo showing the fuel tank is full again. Your trip is completed only after it’s verified.'}
    : {bar:'Fuel Check', eyebrow:'Before you unlock', title:'Confirm Full Tank',
       desc:'Upload a photo showing the vehicle’s fuel tank is full. The car unlocks only once the photo is verified.'};
  const cta = {
    empty:    ['Upload a photo', true,  null],
    uploaded: ['Verify photo',   false, ()=>setSt('verifying')],
    verifying:['Verifying…',     true,  null],
    verified: [phase==='return'?'Complete trip':'Continue to unlock', false,
               ()=> phase==='return' ? go('trip-done',{id:params.id}) : go('digital-key',{id:params.id})],
  }[st];
  return h('div',{className:'screen-pad',style:{gap:18}},
    h(Header,{title:copy.bar,onBack:()=>go(null,null,true)}),
    car && h('div',{className:'row',style:{gap:13,alignItems:'center'}},
      h(CarPhoto,{src:car.img,alt:car.name,w:54,h:42,r:12}),
      h('div',{className:'grow'},h('div',{style:{fontWeight:800,fontSize:17}},car.name),
        h('div',{className:'t-muted',style:{fontWeight:600,fontSize:13}},car.policy?car.policy.fuelType:'Full tank required'))),
    h('div',null,
      h('div',{className:'eyebrow'},copy.eyebrow),
      h('h2',{className:'h-page',style:{margin:'4px 0 6px'}},copy.title),
      h('p',{className:'t-muted',style:{fontWeight:600,lineHeight:1.5,margin:0}},copy.desc)),
    st==='empty'
      ? h('button',{className:'upload-zone',onClick:()=>setSt('uploaded')},
          h('span',{className:'upload-ic'},h(Icon,{name:'camera',size:34})),
          h('div',{style:{fontWeight:800}},'Upload fuel gauge photo'),
          h('div',{className:'t-muted',style:{fontWeight:600,fontSize:13}},'Take a clear photo of the dashboard gauge'))
      : h('div',{className:'card fuel-proof'},
          h(FuelGauge),
          h('div',{className:'fuel-status '+st},
            st==='verifying' ? h(React.Fragment,null,h('span',{className:'spin'}),'Verifying photo…')
            : st==='verified' ? h(React.Fragment,null,h(Icon,{name:'check-circle',size:20}),'Tank is full — verified')
            : h(React.Fragment,null,h(Icon,{name:'fuel',size:18}),'Photo ready to verify')),
          st!=='verifying' && h('button',{className:'tlink',style:{alignSelf:'center'},onClick:()=>setSt('empty')},'Retake photo')),
    h('div',{className:'mt-auto'}),
    h('button',{className:'btn btn-primary btn-block'+(cta[1]?' is-disabled':''),disabled:cta[1],onClick:cta[2]||undefined},
      st==='verified' && h(Icon,{name:phase==='return'?'check':'key',size:20}), cta[0])
  );
}

/* ---------------- TRIP COMPLETE ---------------- */
function TripDone({go}){
  return h('div',{className:'confirm'},
    h('div',{className:'ring'},h(Icon,{name:'check',size:56,stroke:2.6})),
    h('h2',null,'Trip Completed!'),
    h('p',null,'Thanks for refueling — your rental is complete and the car is locked.'),
    h('div',{style:{display:'flex',flexDirection:'column',gap:12,marginTop:26,width:'100%',maxWidth:300}},
      h('button',{className:'btn btn-primary btn-block',onClick:()=>go('home')},'Back to home'),
      h('button',{className:'btn btn-ghost btn-block',onClick:()=>go('history')},'View trip history')));
}

/* ---------------- DIGITAL KEY (NFC unlock) ---------------- */
function DigitalKey({go, state, params}){
  const car = params && params.id ? D.byId[params.id] : null;
  // params.unlocked lets the Figma export render both lock states; live app starts locked.
  const [unlocked,setUnlocked] = React.useState(!!(params && params.unlocked));
  const waves = h('svg',{width:46,height:26,viewBox:'0 0 46 26',fill:'none',
    stroke:'#fff',strokeWidth:3,strokeLinecap:'round',style:{marginTop:8,opacity:.95}},
    h('path',{d:'M9 18a9 9 0 0 1 0-10'}),
    h('path',{d:'M18 22a16 16 0 0 1 0-18'}),
    h('path',{d:'M27 22a16 16 0 0 0 0-18'}),
    h('path',{d:'M36 18a9 9 0 0 0 0-10'}));
  return h('div',{className:'screen-pad keyscreen',style:{paddingTop:2}},
    h(Header,{title:'Digital Key',onBack:()=>go(null,null,true)}),
    car && h('div',{className:'row',style:{gap:13,justifyContent:'center',marginTop:-2}},
      h(CarPhoto,{src:car.img,alt:car.name,w:46,h:36,r:11}),
      h('div',{style:{fontWeight:800,fontSize:17}},car.name),
      h('span',{className:'badge ok'},'Active')),
    h('div',{className:'keypad'},
      h('div',{className:'nfc-wrap'},
        h('span',{className:'ring r1'}), h('span',{className:'ring r2'}), h('span',{className:'ring r3'}),
        h('button',{className:'nfc-orb'+(unlocked?' open':''),onClick:()=>setUnlocked(u=>!u),'aria-label':'toggle lock'},
          h('div',{style:{display:'flex',flexDirection:'column',alignItems:'center'}},
            h(Icon,{name:unlocked?'unlock':'lock',size:72,stroke:2}),
            waves))),
      h('div',{className:'key-title'}, unlocked?'Car Unlocked':'Tap to Unlock'),
      h('div',{className:'key-sub'}, unlocked?'You’re all set — enjoy the ride':'Hold phone near the door handle')),
    unlocked && h('button',{className:'btn btn-primary btn-block',style:{marginTop:'auto'},
      onClick:()=>go('fuel-return',{id:params&&params.id,phase:'return'})},
      h(Icon,{name:'check',size:20}),'End trip')
  );
}

/* ---------------- HISTORY ---------------- */
function History({go, state}){
  return h('div',{className:'screen-pad'},
    h('div',{className:'h-page',style:{marginTop:4}},'History'),
    h('div',{style:{display:'flex',flexDirection:'column'}},
      D.history.filter(b=>!state.ownedIds.has(b.car)).map((b,i)=>{const c=D.byId[b.car];const liked=state.likes.has(c.id);
        return h('div',{key:i,className:'car-row reveal',style:{animationDelay:(i*50)+'ms'},onClick:()=>go('car-detail',{id:c.id})},
          h(CarPhoto,{src:c.img,alt:c.name,w:70,h:54}),
          h('div',{className:'meta'},
            h('div',{className:'car-name'},c.name),
            h('div',{className:'daterow'},h(Icon,{name:'calendar',size:16}),b.date+' · '+b.time),
            b.status==='confirmed' && h('div',{className:'row',style:{gap:8}},
              h('span',{className:'label',style:{fontSize:13,fontWeight:700}},'Rate'),
              h(Stars,{value:state.ratings[c.id]||b.stars||0,size:17,onRate:n=>state.rate(c.id,n)}))),
          h('div',{className:'car-right'},
            h('div',{className:'row',style:{gap:8}},h(Heart,{on:liked,onClick:()=>state.toggleLike(c.id),size:22}),h('div',{className:'price'},'$'+b.total)),
            h(Badge,{status:b.status})));
      }))
  );
}

/* ---------------- LIKES ---------------- */
function Likes({go, state}){
  const ids = [...state.likes];
  return h('div',{className:'screen-pad'},
    h('div',{className:'h-page',style:{marginTop:4}},'Liked Cars'),
    ids.length===0 ? h('div',{className:'center-screen',style:{alignItems:'center',gap:12,color:'var(--muted)'}},
        h(Icon,{name:'heart',size:54}),h('p',null,'No liked cars yet')) :
    h('div',{style:{display:'flex',flexDirection:'column'}},
      ids.map((id,i)=>{const c=D.byId[id];return h(CarRow,{key:id,car:c,delay:i*55,liked:true,
        onLike:()=>state.toggleLike(id),onClick:()=>go('car-detail',{id})});}))
  );
}

/* ---------------- PROFILE ---------------- */
function Profile({go, state}){
  const u = D.driver;
  return h('div',{className:'screen-pad',style:{gap:18}},
    h(ProfileHeader,{avatar:u.avatar,name:u.name,verified:u.verified,rating:u.rating,reviews:u.reviews}),
    h(StatTiles,{tiles:[{value:u.rentals,label:'Rentals'},{value:u.listed,label:'Cars Listed'},{value:u.since,label:'Member'}]}),
    h(NavCard,{icon:'gear',label:'Settings',onClick:()=>go('settings')}),
    h(NavCard,{icon:'car',label:'Switch to owner mode',onClick:()=>state.switchMode('owner','owner-home')}),
    h('div',{className:'mt-auto'}),
    h('button',{className:'btn btn-ghost btn-block',style:{color:'var(--no-ink)'},onClick:()=>go('splash')},h(Icon,{name:'logout',size:20}),'Log out')
  );
}

/* ---------------- SETTINGS ---------------- */
function Settings({go, state, t, setTweak}){
  return h('div',{className:'screen-pad',style:{gap:14}},
    h(Header,{title:'Settings',onBack:()=>go(null,null,true)}),
    h('div',{className:'eyebrow'},'Account'),
    h(SettingRow,{icon:'user',label:'Edit profile',right:h(Icon,{name:'chevron-right',size:20,color:'var(--c-accent)'})}),
    h(SettingRow,{icon:'card',label:'Payment methods',right:h(Icon,{name:'chevron-right',size:20,color:'var(--c-accent)'})}),
    h(SettingRow,{icon:'shield',label:'Verification',right:h('span',{className:'badge ok'},'Verified')}),
    h('div',{className:'eyebrow',style:{marginTop:8}},'Preferences'),
    h(SettingRow,{icon:'moon',label:'Dark mode',right:h(Toggle,{on:t.dark,onClick:()=>setTweak('dark',!t.dark)})}),
    h(SettingRow,{icon:'bolt',label:'Notifications',right:h(Toggle,{on:state.notif,onClick:()=>state.setNotif(!state.notif)})}),
    h('div',{className:'mt-auto'}),
    h('button',{className:'btn btn-ghost btn-block',style:{color:'var(--no-ink)'},onClick:()=>go('splash')},h(Icon,{name:'logout',size:20}),'Log out')
  );
}

export const DriverScreens = {Home,SearchList,MapView,Filter,CarDetail,BookDates,Payment,Confirmed,FuelVerify,TripDone,DigitalKey,History,Likes,Profile,Settings};
export default DriverScreens;
