/* GETAWAY — sign-up / onboarding flows (driver + owner).
   Built from the Figma onboarding frames. Multi-step wizard, data-driven. */
import React from 'react';
import { Icon, Header, Wordmark } from './ui.jsx';
import { Toggle } from './blocks.jsx';

const h = React.createElement;

/* ---- step configs ---- */
const DRIVER = {
  role:'driver', enter:['driver','home'],
  init:{first:'Justine',last:'Taylor',email:'justine@example.com',phone:'+1 (234) 567-8910',
    card:'4580 1234 5678 9012',exp:'08/27',cvc:'123',hasins:true},
  steps:[
    {head:'Your details',sub:'Tell us a little about yourself',blocks:[
      {f:[{k:'first',label:'First name'},{k:'last',label:'Last name'}]},
      {f:[{k:'email',label:'Email',icon:'mail'}]},
      {f:[{k:'phone',label:'Phone number',icon:'phone'}]}]},
    {head:'Driver’s license',sub:'Upload a clear photo of your license',blocks:[
      {upload:'Upload your license',icon:'card'}]},
    {head:'Insurance',sub:'Add it now, or verify on a quick call',blocks:[
      {toggle:'I have insurance to add now',key:'hasins'},
      {upload:'Upload insurance document',icon:'shield',dep:'hasins'},
      {note:'If you don’t include insurance now, an agent will verify your insurance history during the phone call.'}]},
    {head:'Payment method',sub:'You won’t be charged until you book',blocks:[
      {f:[{k:'card',label:'Card number',icon:'card'}]},
      {f:[{k:'exp',label:'Expiry'},{k:'cvc',label:'CVC'}]}]},
  ],
  processing:'Your registration is being processed. An insurance agent will call you within 24–48 hours to complete your verification.',
  success:{title:'You’re verified!',sub:'Your account is ready — time to hit the road',cta:'Start driving'},
};

const OWNER = {
  role:'owner', enter:['owner','owner-home'],
  init:{first:'Justine',last:'Taylor',email:'justine@example.com',phone:'+1 (234) 567-8910',
    address:'City · Street · 123',make:'BMW',model:'330e',year:'2025',plate:'NONE0FYB',
    doors:4,seats:5,trunk:2,phr:'10',pday:'120',mileage:'100,000',
    provider:'Harel',policy:'POL-19873530',bank:'',iban:''},
  steps:[
    {head:'Your details',sub:'Tell us a little about yourself',blocks:[
      {f:[{k:'first',label:'First name'},{k:'last',label:'Last name'}]},
      {f:[{k:'email',label:'Email',icon:'mail'}]},
      {f:[{k:'phone',label:'Phone number',icon:'phone'}]},
      {f:[{k:'address',label:'Address',icon:'location'}]}]},
    {head:'Your car',sub:'List your vehicle’s details',blocks:[
      {f:[{k:'make',label:'Make'},{k:'model',label:'Model'}]},
      {f:[{k:'year',label:'Year'},{k:'plate',label:'License plate'}]},
      {step:[{k:'doors',label:'Doors'},{k:'seats',label:'Seats'},{k:'trunk',label:'Trunk'}]},
      {f:[{k:'phr',label:'Price / hour ($)'},{k:'pday',label:'Price / day ($)'}]},
      {f:[{k:'mileage',label:'Mileage (km)'}]}]},
    {head:'Insurance',sub:'Your coverage details',blocks:[
      {f:[{k:'provider',label:'Insurance provider'}]},
      {f:[{k:'policy',label:'Policy number'}]},
      {upload:'Upload insurance document',icon:'shield'}]},
    {head:'Payout details',sub:'All sensitive information is encrypted',blocks:[
      {f:[{k:'bank',label:'Bank',icon:'bank'}]},
      {f:[{k:'iban',label:'Account / IBAN'}]}]},
  ],
  success:{title:'Your car is listed!',sub:'Renters nearby can now book your car',cta:'Open dashboard'},
};

/* ---- field bits ---- */
function Field({label,icon,value,onChange}){
  return h('label',{className:'ob-field'},
    h('span',{className:'lab'},label),
    h('span',{className:'ob-input'},
      icon && h(Icon,{name:icon,size:19,color:'var(--c-secondary)'}),
      h('input',{value:value||'',onChange:e=>onChange(e.target.value),placeholder:label})));
}
function Stepper({label,value,onChange}){
  return h('div',{className:'ob-field'},
    h('span',{className:'lab'},label),
    h('div',{className:'ob-step'},
      h('button',{type:'button',onClick:()=>onChange(Math.max(0,(value||0)-1))},h(Icon,{name:'arrow-left',size:16})),
      h('span',{className:'v'},value||0),
      h('button',{type:'button',onClick:()=>onChange((value||0)+1)},h(Icon,{name:'arrow-right',size:16}))));
}
function Dropzone({label,icon,filled,onClick}){
  return h('button',{type:'button',className:'ob-dropzone'+(filled?' filled':''),onClick},
    h('div',{className:'dz-ic'},h(Icon,{name:filled?'check-circle':(icon||'upload'),size:30,stroke:2})),
    h('div',{style:{fontWeight:700,fontSize:15}},filled?'Document added':label),
    !filled && h('div',{style:{fontSize:13,opacity:.8}},'Tap to upload · JPG or PDF'));
}

/* ---- processing + success ---- */
function Processing({text}){
  return h('div',{className:'confirm'},
    h('div',{className:'ob-spin'}),
    h('h2',{style:{marginTop:26}},'Almost there!'),
    h('p',null,text));
}
function Success({cfg,onEnter}){
  return h('div',{className:'confirm'},
    h('div',{className:'ring'},h(Icon,{name:'check-circle',size:58,stroke:2.4})),
    h('h2',null,cfg.success.title),
    h('p',null,cfg.success.sub),
    h('button',{className:'btn btn-primary',style:{marginTop:28,minWidth:240},onClick:onEnter},cfg.success.cta));
}

/* ---- wizard ---- */
function Onboarding({go, state, params}){
  const cfg = (params && params.role==='owner') ? OWNER : DRIVER;
  // params.step / params.phase let the Figma export render each step as its own
  // frame; the live app omits them, so it still starts at step 0 / 'form'.
  const [step,setStep] = React.useState((params && params.step) || 0);
  const [vals,setVals] = React.useState(cfg.init);
  const [files,setFiles] = React.useState({});
  const [phase,setPhase] = React.useState((params && params.phase) || 'form');
  const total = cfg.steps.length;
  const set = (k,v)=>setVals(o=>({...o,[k]:v}));

  if(phase==='processing') return h(Processing,{text:cfg.processing});
  if(phase==='success') return h(Success,{cfg,onEnter:()=>state.switchMode(cfg.enter[0],cfg.enter[1])});

  const s = cfg.steps[step];
  const last = step===total-1;
  const goNext = ()=>{ if(!last){setStep(step+1);return;}
    if(cfg.processing){setPhase('processing');setTimeout(()=>setPhase('success'),2400);}
    else setPhase('success'); };
  const goBack = ()=>{ if(step===0) go(null,null,true); else setStep(step-1); };

  const renderBlock = (b,i)=>{
    if(b.f) return h('div',{key:i,className:b.f.length>1?'ob-row':''},
      b.f.map(fl=>h(Field,{key:fl.k,label:fl.label,icon:fl.icon,value:vals[fl.k],onChange:v=>set(fl.k,v)})));
    if(b.step) return h('div',{key:i,className:'ob-row'},
      b.step.map(st=>h(Stepper,{key:st.k,label:st.label,value:vals[st.k],onChange:v=>set(st.k,v)})));
    if(b.upload){ if(b.dep && !vals[b.dep]) return null;
      return h(Dropzone,{key:i,label:b.upload,icon:b.icon,filled:!!files[b.upload],onClick:()=>setFiles(f=>({...f,[b.upload]:!f[b.upload]}))}); }
    if(b.toggle) return h('div',{key:i,className:'card row between',style:{padding:'14px 16px'}},
      h('span',{style:{fontWeight:700,fontSize:16}},b.toggle),
      h(Toggle,{on:!!vals[b.key],onClick:()=>set(b.key,!vals[b.key])}));
    if(b.note) return h('p',{key:i,className:'ob-note'},b.note);
    return null;
  };

  return h('div',{className:'screen-pad ob-wrap'},
    h('div',{className:'appbar',style:{padding:'6px 0 0'}},
      h('button',{className:'iconbtn ghost',onClick:goBack,'aria-label':'Back'},h(Icon,{name:'back',size:26})),
      h('div',{className:'grow',style:{display:'flex',justifyContent:'center'}},h(Wordmark,{height:26,color:'var(--c-secondary)'})),
      h('div',{style:{width:42}})),
    h('div',{className:'ob-dots'},
      cfg.steps.map((_,i)=>h('span',{key:i,className:'ob-dot'+(i===step?' on':i<step?' done':'')}))),
    h('div',{className:'ob-head'},
      h('div',{className:'eyebrow'},'Step '+(step+1)+' of '+total),
      h('div',{className:'h-page'},s.head),
      h('div',{className:'t-muted',style:{fontSize:16,fontWeight:600,marginTop:2}},s.sub)),
    h('div',{className:'ob-fields'}, s.blocks.map(renderBlock)),
    h('div',{className:'mt-auto'}),
    h('button',{className:'btn btn-primary btn-block',onClick:goNext},
      last ? (cfg.processing?'Submit application':'Create listing') : 'Continue'),
    step===0 && h('div',{style:{textAlign:'center',marginTop:4}},
      h('span',{className:'t-muted',style:{fontSize:14}},'Already have an account? '),
      h('span',{className:'tlink',onClick:()=>go('login',{role:cfg.role})},'Log in')));
}

/* ---- login ---- */
function Login({go, state, params}){
  const role = (params && params.role) || 'driver';
  const dest = role==='owner' ? ['owner','owner-home'] : ['driver','home'];
  return h('div',{className:'screen-pad ob-wrap'},
    h('div',{className:'appbar',style:{padding:'6px 0 0'}},
      h('button',{className:'iconbtn ghost',onClick:()=>go(null,null,true),'aria-label':'Back'},h(Icon,{name:'back',size:26})),
      h('div',{className:'grow',style:{display:'flex',justifyContent:'center'}},h(Wordmark,{height:26,color:'var(--c-secondary)'})),
      h('div',{style:{width:42}})),
    h('div',{className:'ob-head',style:{marginTop:8}},
      h('div',{className:'h-page'},'Welcome back'),
      h('div',{className:'t-muted',style:{fontSize:16,fontWeight:600,marginTop:2}},'Log in to continue')),
    h('div',{className:'ob-fields'},
      h(Field,{label:'Email',icon:'mail',value:'justine@example.com',onChange:()=>{}}),
      h(Field,{label:'Password',icon:'lock',value:'••••••••',onChange:()=>{}}),
      h('div',{style:{textAlign:'right'}},h('span',{className:'tlink',style:{fontSize:14}},'Forgot password?'))),
    h('div',{className:'mt-auto'}),
    h('button',{className:'btn btn-primary btn-block',onClick:()=>state.switchMode(dest[0],dest[1])},'Log in'),
    h('div',{style:{textAlign:'center',marginTop:4}},
      h('span',{className:'t-muted',style:{fontSize:14}},'New here? '),
      h('span',{className:'tlink',onClick:()=>go('signup',{role})},'Create an account')));
}

export const OnboardingScreens = { Onboarding, Login };
export default OnboardingScreens;
