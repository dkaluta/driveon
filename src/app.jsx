/* DriveOn — app shell: router + state + splash + tweaks. */
import React from 'react';
import { Icon, StatusBar, BottomTab, Wordmark } from './ui.jsx';
import { DATA as D } from './data.js';
import { DriverScreens as Driver } from './screens-driver.jsx';
import { OwnerScreens as Owner } from './screens-owner.jsx';
import { OnboardingScreens as Onb } from './screens-onboarding.jsx';
import { useTweaks, TweaksPanel, TweakSection, TweakToggle, TweakRadio, TweakSlider } from './tweaks-panel.jsx';

const h = React.createElement;

const SCREENS = {
  splash:        {comp:Splash,             chrome:false, status:'dark', tr:'fade'},
  signup:        {comp:Onb.Onboarding,     chrome:false,                tr:'up'},
  login:         {comp:Onb.Login,          chrome:false,                tr:'up'},
  home:          {comp:Driver.Home,        mode:'driver', key:'home',   tr:'fade'},
  'search-list': {comp:Driver.SearchList,  mode:'driver', key:null,     tr:'fwd'},
  map:           {comp:Driver.MapView,     mode:'driver', key:null,     tr:'up',  bare:true},
  filter:        {comp:Driver.Filter,      mode:'driver', key:null,     tr:'up'},
  'car-detail':  {comp:Driver.CarDetail,   mode:'dynamic', key:null,     tr:'fwd'},
  'book-dates':  {comp:Driver.BookDates,   chrome:false,                tr:'up'},
  payment:       {comp:Driver.Payment,     chrome:false,                tr:'fwd'},
  confirmed:     {comp:Driver.Confirmed,   chrome:false,                tr:'fade'},
  'fuel-pickup': {comp:Driver.FuelVerify,   chrome:false,                tr:'up'},
  'fuel-return': {comp:Driver.FuelVerify,   chrome:false,                tr:'up'},
  'trip-done':   {comp:Driver.TripDone,     chrome:false,                tr:'fade'},
  navigate:      {comp:Driver.NavScreen,    chrome:false,                tr:'fwd'},
  'key-early':   {comp:Driver.KeyEarly,     chrome:false,                tr:'up'},
  'digital-key': {comp:Driver.DigitalKey,   chrome:false,                tr:'up'},
  'rate-ride':   {comp:Driver.RateRide,     chrome:false,                tr:'up'},
  history:       {comp:Driver.History,     mode:'driver', key:'history',tr:'fade'},
  likes:         {comp:Driver.Likes,       mode:'driver', key:'likes',  tr:'fade'},
  profile:       {comp:Driver.Profile,     mode:'driver', key:'profile',tr:'fade'},
  settings:      {comp:Driver.Settings,    chrome:false,                tr:'fwd'},
  'setting-detail':{comp:Driver.SettingDetail, chrome:false,            tr:'fwd'},
  'owner-home':    {comp:Owner.OwnerHome,    mode:'owner', key:'home',   tr:'fade'},
  'owner-calendar':{comp:Owner.OwnerCalendar,mode:'owner', key:null,     tr:'up'},
  'owner-earnings':{comp:Owner.OwnerEarnings, chrome:false,             tr:'fwd'},
  'owner-history': {comp:Owner.OwnerHistory, mode:'owner', key:'history',tr:'fade'},
  'owner-garage':  {comp:Owner.OwnerGarage,  mode:'owner', key:'garage', tr:'fade'},
  'owner-add-car': {comp:Owner.OwnerAddCar,  chrome:false,              tr:'up'},
  'owner-return':  {comp:Owner.OwnerReturn,  chrome:false,              tr:'fwd'},
  'owner-renter':  {comp:Owner.OwnerRenter,  chrome:false,              tr:'fwd'},
  'owner-profile': {comp:Owner.OwnerProfile, mode:'owner', key:'profile',tr:'fade'},
};
const RESET = new Set(['splash','home','owner-home','signup','login']);
const TAB_ROOT = {driver:{home:'home',history:'history',likes:'likes',profile:'profile'},
                  owner:{home:'owner-home',history:'owner-history',garage:'owner-garage',profile:'owner-profile'}};

/* ---------------- SPLASH ---------------- */
function Splash({go, state}){
  return h('div',{className:'splash'},
    h('div',{className:'bgimg'},h('img',{src:D.A('splash-bg.jpg'),alt:''})),
    h('div',{className:'inner'},
      h(Wordmark,{height:58,color:'#fff',className:'splash-wm'}),
      h('div',{className:'tag'},'Your next adventure is parked nearby'),
      h('div',{className:'choose'},
        h('button',{className:'btn btn-primary',style:{minWidth:260},onClick:()=>go('signup',{role:'driver'})},'I want to drive'),
        h('button',{className:'btn btn-deep',style:{minWidth:260,background:'rgba(255,255,255,.16)',backdropFilter:'blur(6px)'},onClick:()=>go('signup',{role:'owner'})},'I want to rent out my car'),
        h('div',{style:{marginTop:4}},
          h('span',{style:{color:'hsl(173 40% 88%)',fontSize:15}},'Already have an account? '),
          h('span',{style:{color:'#fff',fontWeight:800,fontSize:15,cursor:'pointer'},onClick:()=>go('login',{role:'driver'})},'Log in')))));
}

/* ---------------- TWEAKS ---------------- */
const TWEAK_DEFAULTS = { dark:false, theme:'Turquoise', radius:22, uppercase:true };
const THEMES = {
  Turquoise:{p:'174 72% 56%',s:'171 38% 52%',a:'173 22% 45%',b:'173 37% 23%'},
  Lagoon:   {p:'189 80% 52%',s:'196 55% 46%',a:'200 30% 42%',b:'200 45% 22%'},
  Sunset:   {p:'16 90% 60%', s:'32 85% 55%', a:'8 55% 48%',  b:'12 50% 26%'},
  Violet:   {p:'265 78% 64%',s:'255 55% 58%',a:'258 30% 48%',b:'262 45% 26%'},
};

/* ---------------- APP ---------------- */
export default function App(){
  const [t,setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [stack,setStack] = React.useState([{name:'splash',params:null}]);
  const [dir,setDir] = React.useState('fade');
  const [mode,setMode] = React.useState('driver');  // session role: driver | owner

  // shared cross-screen state
  const [likes,setLikes] = React.useState(new Set(D.likes));
  const [ratings,setRatings] = React.useState({});
  const [query,setQuery] = React.useState('');
  const [filters,setFiltersRaw] = React.useState({gear:[],mile:[],seats:[],price:46});
  const [booking,setBooking] = React.useState(null);
  const [notif,setNotif] = React.useState(true);
  const [reqStatus,setReqStatus] = React.useState({});

  const go = React.useCallback((name,params=null,asBack=false)=>{
    setStack(prev=>{
      if(asBack || name===null){ const ns=prev.slice(0,-1);
        if(name && (ns.length===0 || ns[ns.length-1].name!==name)) ns.push({name,params});
        return ns.length?ns:[{name:'splash'}]; }
      if(RESET.has(name)) return [{name,params}];
      return [...prev,{name,params}];
    });
    setDir(asBack||name===null ? 'back' : (SCREENS[name]?SCREENS[name].tr:'fwd'));
  },[]);
  const back = React.useCallback(()=>go(null,null,true),[go]);
  const navTab = (m)=>(key)=>{ const name=TAB_ROOT[m][key]; setStack([{name}]); setDir('fade'); };
  const onFab = (m)=> ()=> go(m==='owner'?'owner-calendar':'search-list');

  const toggleLike = (id)=>setLikes(s=>{const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n;});
  const rate = (id,n)=>setRatings(r=>({...r,[id]:n}));
  const setFilters = (g,v)=>setFiltersRaw(f=>{
    if(g==='price') return {...f,price:v};
    if(g==='gear') return {...f,gear: f.gear.includes(v)?[]:[v]};   // auto/manual mutually exclusive
    return {...f,[g]: (f[g].includes(v)? f[g].filter(x=>x!==v): [...f[g],v])};
  });
  const decide = (i,s)=>setReqStatus(r=>({...r,[i]:s}));
  const switchMode = (m,dest)=>{ setMode(m); go(dest); };

  const state = {likes,toggleLike,ratings,rate,query,setQuery,filters,setFilters,
    booking,setBooking,startBooking:()=>setBooking(null),notif,setNotif,
    requests:D.requests,reqStatus,decide,
    mode,switchMode,ownedIds:new Set(D.ownedIds)};

  const top = stack[stack.length-1];
  const meta = SCREENS[top.name] || SCREENS.splash;
  const Comp = meta.comp;
  const barMode = meta.mode==='dynamic' ? mode : meta.mode;

  // apply tweaks
  const th = THEMES[t.theme]||THEMES.Turquoise;
  const devStyle = {'--primary':th.p,'--secondary':th.s,'--accent':th.a,'--brand':th.b,
    '--r-card':t.radius+'px'};
  const devClass = 'device'+(t.dark?' dark':'')+(t.uppercase?'':' no-upper');
  const TR = {fwd:'enter',back:'enter-back',up:'enter-up',fade:'enter-fade'};

  return h('div',{className:'stage'},
    h('div',{className:devClass,style:devStyle},
      top.name!=='splash' && h(StatusBar,{dark:false}),
      h('div',{className:'viewport'},
        h('div',{className:'screen '+(TR[dir]||'enter-fade'),key:stack.length+'-'+top.name,
          'data-screen-label':top.name,
          style:meta.bare?{padding:0}:undefined},
          h(Comp,{go,back,params:top.params||{},state,t,setTweak}))),
      meta.mode && h(BottomTab,{mode:barMode,tab:meta.key,
        onNav:navTab(barMode),onFab:onFab(barMode)})
    ),
    h(TweaksUI,{t,setTweak})
  );
}

function TweaksUI({t,setTweak}){
  return h(TweaksPanel,null,
    h(TweakSection,{label:'Theme'}),
    h(TweakRadio,{label:'Accent',value:t.theme,options:['Turquoise','Lagoon','Sunset','Violet'],onChange:v=>setTweak('theme',v)}),
    h(TweakToggle,{label:'Dark mode',value:t.dark,onChange:v=>setTweak('dark',v)}),
    h(TweakSection,{label:'Shape & type'}),
    h(TweakSlider,{label:'Card radius',value:t.radius,min:8,max:30,unit:'px',onChange:v=>setTweak('radius',v)}),
    h(TweakToggle,{label:'Uppercase headings',value:t.uppercase,onChange:v=>setTweak('uppercase',v)}),
  );
}
