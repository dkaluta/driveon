/* DriveOn — static harness for the Figma import.
 *
 * Renders every screen as a FULL-BLEED, RESPONSIVE, semantic frame — no phone
 * bezel, no fixed device size, no clipping. Each screen is a flex COLUMN in
 * normal document flow (the direct analog of a Figma Auto Layout frame), so
 * html.to.design imports them as Auto Layout layers with sensible fill/hug
 * resizing instead of a flattened absolute-positioned mess.
 *
 * Exposed to scripts/build-figma.mjs:
 *   renderScreens()  → [{ name, html }]  one full-bleed <section> per screen
 *   renderGallery()  → string            all sections stacked (single capture)
 */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Icon, StatusBar, BottomTab, Wordmark } from '../ui.jsx';
import { DATA as D } from '../data.js';
import { DriverScreens as Dr } from '../screens-driver.jsx';
import { OwnerScreens as Ow } from '../screens-owner.jsx';
import { OnboardingScreens as Onb } from '../screens-onboarding.jsx';

const h = React.createElement;
const noop = () => {};

// ---- mock state: every field the screens read, no behaviour needed ----
const mockState = {
  likes:new Set(D.likes), toggleLike:noop,
  ratings:{}, rate:noop,
  query:'', setQuery:noop,
  filters:{gear:['auto'],mile:['low'],seats:['5'],price:46}, setFilters:noop,
  booking:null, setBooking:noop, startBooking:noop,
  notif:true, setNotif:noop,
  requests:D.requests, reqStatus:{}, decide:noop,
  mode:'driver', switchMode:noop,
  ownedIds:new Set(D.ownedIds),
};
const mockT = { dark:false, theme:'Turquoise', radius:22, uppercase:true };

// Splash lives in app.jsx (not exported) — recreate it for the export.
function Splash(){
  return h('div',{className:'splash'},
    h('div',{className:'bgimg'},h('img',{src:D.A('splash-bg.jpg'),alt:''})),
    h('div',{className:'inner'},
      h(Wordmark,{height:58,color:'#fff',className:'splash-wm'}),
      h('div',{className:'tag'},'Your next adventure is parked nearby'),
      h('div',{className:'choose'},
        h('button',{className:'btn btn-primary',style:{minWidth:260}},h(Icon,{name:'key',size:20}),'I want to drive'),
        h('button',{className:'btn btn-deep',style:{minWidth:260,background:'rgba(255,255,255,.16)'}},h(Icon,{name:'car',size:20}),'I want to rent out my car'),
        h('div',{style:{marginTop:4}},
          h('span',{style:{color:'hsl(173 40% 88%)',fontSize:15}},'Already have an account? '),
          h('span',{style:{color:'#fff',fontWeight:800,fontSize:15}},'Log in')))));
}

// The sign-up wizards are multi-step; render each step (+ processing/success)
// as its own frame so every screen shows up in the Figma export.
const driverSignup = [
  ['Driver · Sign up · Your details', Onb.Onboarding, {chrome:false, params:{role:'driver', step:0}}],
  ['Driver · Sign up · License',      Onb.Onboarding, {chrome:false, params:{role:'driver', step:1}}],
  ['Driver · Sign up · Insurance',    Onb.Onboarding, {chrome:false, params:{role:'driver', step:2}}],
  ['Driver · Sign up · Payment',      Onb.Onboarding, {chrome:false, params:{role:'driver', step:3}}],
  ['Driver · Sign up · Processing',   Onb.Onboarding, {chrome:false, params:{role:'driver', phase:'processing'}}],
  ['Driver · Sign up · Verified',     Onb.Onboarding, {chrome:false, params:{role:'driver', phase:'success'}}],
];
const ownerSignup = [
  ['Owner · Sign up · Your details', Onb.Onboarding, {chrome:false, params:{role:'owner', step:0}}],
  ['Owner · Sign up · Your car',     Onb.Onboarding, {chrome:false, params:{role:'owner', step:1}}],
  ['Owner · Sign up · Insurance',    Onb.Onboarding, {chrome:false, params:{role:'owner', step:2}}],
  ['Owner · Sign up · Payout',       Onb.Onboarding, {chrome:false, params:{role:'owner', step:3}}],
  ['Owner · Sign up · Listed',       Onb.Onboarding, {chrome:false, params:{role:'owner', phase:'success'}}],
];

// [label, Component, {mode, key, bare, params, sess, chrome}]
const SCREENS = [
  ['Splash', Splash, {chrome:false}],
  ...driverSignup,
  ...ownerSignup,
  ['Log in', Onb.Login, {chrome:false, params:{role:'driver'}}],
  ['Driver · Home', Dr.Home, {mode:'driver',key:'home'}],
  ['Driver · Home · Dark', Dr.Home, {mode:'driver',key:'home',dark:true}],
  ['Driver · Search list', Dr.SearchList, {mode:'driver'}],
  ['Driver · Search list · Filtered', Dr.SearchList, {mode:'driver',state:{query:'Cor'}}],
  ['Driver · Map', Dr.MapView, {mode:'driver',bare:true}],
  ['Driver · Filter', Dr.Filter, {mode:'driver'}],
  ['Driver · Car detail', Dr.CarDetail, {mode:'dynamic',sess:'driver',params:{id:'corolla'}}],
  ['Driver · Car detail · Liked', Dr.CarDetail, {mode:'dynamic',sess:'driver',params:{id:'corolla'},state:{likes:new Set(['corolla'])}}],
  ['Driver · Car detail · Dark', Dr.CarDetail, {mode:'dynamic',sess:'driver',params:{id:'corolla'},dark:true}],
  ['Driver · Car detail · Reserved', Dr.CarDetail, {mode:'dynamic',sess:'driver',params:{id:'corolla'},state:{booking:{carId:'corolla'}},new:true}],
  ['Owner · Car detail (own car)', Dr.CarDetail, {mode:'dynamic',sess:'owner',params:{id:'outlander'}}],
  ['Driver · Book dates', Dr.BookDates, {chrome:false,params:{id:'corolla'}}],
  ['Driver · Payment', Dr.Payment, {chrome:false,params:{id:'corolla'}}],
  ['Driver · Confirmed', Dr.Confirmed, {chrome:false}],
  ['Driver · Navigate to car', Dr.NavScreen, {chrome:false,params:{id:'seat-ibiza'},new:true}],
  ['Driver · Fuel check · Upload', Dr.FuelVerify, {chrome:false,params:{id:'seat-ibiza',phase:'pickup',fstate:'empty'},new:true}],
  ['Driver · Fuel check · Uploaded', Dr.FuelVerify, {chrome:false,params:{id:'seat-ibiza',phase:'pickup',fstate:'uploaded'},new:true}],
  ['Driver · Fuel check · Verified', Dr.FuelVerify, {chrome:false,params:{id:'seat-ibiza',phase:'pickup',fstate:'verified'},new:true}],
  ['Driver · End trip · Refuel', Dr.FuelVerify, {chrome:false,params:{id:'seat-ibiza',phase:'return',fstate:'verified'},new:true}],
  ['Driver · Trip completed', Dr.TripDone, {chrome:false,new:true}],
  ['Driver · Digital key · Locked', Dr.DigitalKey, {chrome:false,params:{id:'seat-ibiza',unlocked:false}}],
  ['Driver · Digital key · Unlocked', Dr.DigitalKey, {chrome:false,params:{id:'seat-ibiza',unlocked:true}}],
  ['Driver · Digital key · Too early', Dr.KeyEarly, {chrome:false,params:{id:'seat-ibiza'},new:true}],
  ['Driver · Rate your ride', Dr.RateRide, {chrome:false,params:{id:'corolla'},new:true}],
  ['Driver · History', Dr.History, {mode:'driver',key:'history'}],
  ['Driver · Likes', Dr.Likes, {mode:'driver',key:'likes'}],
  ['Driver · Likes · Empty', Dr.Likes, {mode:'driver',key:'likes',state:{likes:new Set()}}],
  ['Driver · Profile', Dr.Profile, {mode:'driver',key:'profile'}],
  ['Settings', Dr.Settings, {chrome:false}],
  ['Settings · Edit profile', Dr.SettingDetail, {chrome:false,params:{key:'profile'},new:true}],
  ['Settings · Payment methods', Dr.SettingDetail, {chrome:false,params:{key:'payment'},new:true}],
  ['Settings · Verification', Dr.SettingDetail, {chrome:false,params:{key:'verification'},new:true}],
  ['Settings · Dark', Dr.Settings, {chrome:false,dark:true}],
  ['Owner · Home', Ow.OwnerHome, {mode:'owner',key:'home'}],
  ['Owner · Home · Requests decided', Ow.OwnerHome, {mode:'owner',key:'home',state:{reqStatus:{0:'approved',1:'denied'}}}],
  ['Owner · Home · Dark', Ow.OwnerHome, {mode:'owner',key:'home',dark:true}],
  ['Owner · Earnings', Ow.OwnerEarnings, {chrome:false,new:true}],
  ['Owner · Car returned', Ow.OwnerReturn, {chrome:false,params:{idx:0},new:true}],
  ['Owner · Renter profile', Ow.OwnerRenter, {chrome:false,params:{who:'Mike Jakson',avatar:D.A('avatar-avi.jpg'),car:'Mitsubishi Outlander',time:'08:00 - 12:15',amount:96,day:'SUN',date:10,month:'May 2026'},new:true}],
  ['Owner · Schedule (This week)', Ow.OwnerCalendar, {mode:'owner',params:{week:0,sel:0},new:true}],
  ['Owner · Schedule (Next week)', Ow.OwnerCalendar, {mode:'owner',params:{week:1,sel:4},new:true}],
  ['Owner · History', Ow.OwnerHistory, {mode:'owner',key:'history'}],
  ['Owner · Garage', Ow.OwnerGarage, {mode:'owner',key:'garage'}],
  ['Owner · List a car', Ow.OwnerAddCar, {chrome:false}],
  ['Owner · Edit car', Ow.OwnerAddCar, {chrome:false,params:{edit:'outlander'},new:true}],
  ['Owner · Profile', Ow.OwnerProfile, {mode:'owner',key:'profile'}],
];

/* iOS home indicator — the rounded pill at the very bottom of every iPhone screen. */
function HomeIndicator(){
  return h('div',{className:'ga-home','data-name':'Home indicator'}, h('span',{className:'ga-home-bar'}));
}

/* One full-bleed, responsive iPhone screen.
   <section> = the Figma frame (vertical Auto Layout). Children flow normally:
   iPhone status bar (hugs top) → screen body (fills) → bottom nav (hugs, where
   the app has one) → home indicator (hugs bottom). data-name drives the Figma
   layer name. No fixed width/height → resizes responsively in Figma. */
function Frame({label, Comp, meta}){
  const barMode = meta.mode==='dynamic' ? (meta.sess||'driver') : meta.mode;
  // meta.state overrides specific app-state (likes, reqStatus, query, …) so each
  // hidden per-page state renders as its own static frame; meta.dark renders the
  // dark theme (the .dark class re-defines the CSS tokens for all descendants).
  const st = Object.assign({}, mockState, {mode: barMode||'driver'}, meta.state||{});
  const t = meta.dark ? Object.assign({}, mockT, {dark:true}) : mockT;
  const isSplash = label==='Splash';
  const cls = 'ga-frame'+(isSplash?' ga-splash':'')+(meta.bare?' ga-fixed':'')+(meta.dark?' dark':'');
  return h('section',{className:cls, 'data-name':label, 'aria-label':label},
    h('div',{className:'ga-statusbar-wrap','data-name':'Status bar'}, h(StatusBar,{dark:isSplash})),
    h('div',{className:'ga-content'+(meta.bare?' bare':''), 'data-name':'Screen body'},
      h(Comp,{go:noop,back:noop,params:meta.params||{},state:st,t:t,setTweak:noop})),
    barMode ? h('nav',{className:'ga-nav','data-name':'Tab bar'},
      h(BottomTab,{mode:barMode,tab:meta.key||null,onNav:noop,onFab:noop})) : null,
    h(HomeIndicator));
}

export function renderScreens(){
  return SCREENS.map(([label,Comp,meta])=>({
    name: label,
    html: renderToStaticMarkup(h(Frame,{label,Comp,meta})),
  }));
}

function Gallery({only}){
  const list = only ? SCREENS.filter(([,,m])=>m.new) : SCREENS;
  return h(React.Fragment,null,
    list.map(([label,Comp,meta],i)=>h('div',{key:i,className:'ga-cell'},
      h('p',{className:'ga-label'},(meta.new?'🆕  ':'')+label),
      h(Frame,{label,Comp,meta}))));
}

export function renderGallery(){
  return renderToStaticMarkup(h(Gallery));
}

/* Only the screens added/redesigned for the Frame-1 changes. */
export function renderGalleryNew(){
  return renderToStaticMarkup(h(Gallery,{only:true}));
}

export const screenCount = SCREENS.length;
export const newScreens = SCREENS.filter(([,,m])=>m.new).map(([label])=>label);
export default renderScreens;
