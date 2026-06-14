/* DriveOn data — derived from the Figma flows.
   Images live in /public/img and are served by Vite at /img/<file>. The same
   paths are rewritten to inline base64 data-URIs by scripts/build-figma.mjs so
   the Figma export is fully self-contained. */

// Asset path resolver. Kept as a function so call sites read `A('car-x.jpg')`.
// If a base64 image map is present (window.__IMG, injected by the single-file
// build) use it, so the prototype is fully self-contained; otherwise serve from /img.
export const A = (f) =>
  (typeof window !== 'undefined' && window.__IMG && window.__IMG[f]) || '/img/' + f;

const cars = [
  { id:'seat-ibiza', name:'Seat Ibiza', year:2021, price:10, rating:4.6, reviews:31,
    img:A('car-seat-ibiza.jpg'), seats:5, mileage:'62,000 km',
    chips:[['gear','Manual'],['leaf','ECO']],
    loc:'Tel Aviv · Rothschild Blvd', dist:'1.2km',
    owner:{name:'Noa Levi', avatar:A('avatar-tamar.jpg'), resp:96, verified:true},
    policy:{ fuelType:'Petrol 95', return:'Return with a full tank', short:'Refuel before return',
             mileage:'200 km/day included', extra:'$0.30 / km after', rules:[['ban','No smoking'],['leaf','Return clean']] },
    map:{x:18,y:38,price:10} },
  { id:'mazda-2', name:'Mazda 2', year:2020, price:7, rating:4.4, reviews:22,
    img:A('car-mazda2.jpg'), seats:5, mileage:'88,000 km',
    chips:[['auto','Auto'],['bolt','EV']],
    loc:'Tel Aviv · Dizengoff St', dist:'2.0km',
    owner:{name:'Tomer Cohen', avatar:A('avatar-avi.jpg'), resp:98, verified:true},
    policy:{ fuelType:'Electric', return:'Return charged to 80% or more', short:'Recharge to 80%',
             mileage:'150 km/day included', extra:'$0.25 / km after', rules:[['bolt','Cable in trunk'],['ban','No smoking']] },
    map:{x:47,y:24,price:20} },
  { id:'outlander', name:'Mitsubishi Outlander', year:2022, price:17, rating:4.7, reviews:40,
    img:A('car-outlander.jpg'), seats:7, mileage:'45,000 km',
    chips:[['auto','Auto'],['awd','AWD'],['bolt','EV']],
    loc:'Ramat Gan · Bialik St', dist:'3.1km',
    owner:{name:'Dana Mor', avatar:A('avatar-dana.jpg'), resp:94, verified:true},
    policy:{ fuelType:'Plug-in Hybrid', return:'Return with a full tank & charged', short:'Refuel & recharge',
             mileage:'250 km/day included', extra:'$0.30 / km after', rules:[['leaf','Return clean'],['user','Pets allowed']] },
    map:{x:82,y:34,price:30} },
  { id:'ferrari', name:'Ferrari LaFerrari', year:2019, price:100, rating:4.9, reviews:12,
    img:A('car-ferrari.jpg'), seats:2, mileage:'9,000 km',
    chips:[['gear','Manual'],['glass','High-End']],
    loc:'Herzliya · Marina', dist:'8.4km',
    owner:{name:'Idan Bar', avatar:A('avatar-user.jpg'), resp:90, verified:true},
    policy:{ fuelType:'Petrol 98', return:'Return with a full tank of 98', short:'Refuel with 98 octane',
             mileage:'100 km/day included', extra:'$2.00 / km after', rules:[['ban','No smoking'],['shield','Track use forbidden']] },
    map:{x:62,y:50,price:40} },
  { id:'cybertruck', name:'Tesla Cybertruck', year:2024, price:24, rating:4.5, reviews:18,
    img:A('car-cybertruck.jpg'), seats:5, mileage:'12,000 km',
    chips:[['bolt','EV'],['glass','High-End']],
    loc:'Tel Aviv · Port', dist:'4.7km',
    owner:{name:'Maya Gold', avatar:A('avatar-tamar.jpg'), resp:99, verified:true},
    policy:{ fuelType:'Electric', return:'Return charged to 80% or more', short:'Recharge to 80%',
             mileage:'200 km/day included', extra:'$0.20 / km after', rules:[['bolt','Supercharger access'],['ban','No smoking']] },
    map:{x:15,y:62,price:60} },
  { id:'corolla', name:'Toyota Corolla', year:2017, price:9, rating:4.3, reviews:47,
    img:A('car-corolla-hero.jpg'), seats:5, mileage:'74,000 km',
    chips:[['auto','Auto'],['bolt','EV'],['glass','High-End'],['leaf','ECO']],
    loc:'Jerusalem · 58 King George St', dist:'0.8km',
    owner:{name:'Tomer Cohen', avatar:A('avatar-avi.jpg'), resp:98, verified:true},
    policy:{ fuelType:'Hybrid', return:'Return with a full tank', short:'Refuel before return',
             mileage:'180 km/day included', extra:'$0.25 / km after', rules:[['leaf','Return clean'],['ban','No smoking']] },
    map:{x:58,y:66,price:50,sel:true} },
];
const byId = {}; cars.forEach(c=>byId[c.id]=c);

export const DATA = {
  A, cars, byId,
  driver:{ name:'Avi', rating:3.6, reviews:47, rentals:47, listed:2, since:'3y', verified:true,
           avatar:A('avatar-avi.jpg') },
  likes:['ferrari','seat-ibiza','mazda-2'],
  upcoming:[
    { car:'seat-ibiza', total:35, date:'10/03/2026', time:'18:00 – 22:00', status:'confirmed' },
    { car:'mazda-2',    total:21, date:'16/10/2025', time:'08:30 – 12:30', status:'rejected' },
  ],
  rate:[
    { car:'corolla', total:37, date:'10/03/2026', time:'14:15 – 19:15', stars:0 },
  ],
  history:[
    { car:'ferrari',    total:100, date:'23/04/2026', time:'7 – 14',  status:'confirmed', stars:3 },
    { car:'outlander',  total:17,  date:'23/04/2026', time:'7 – 14',  status:'confirmed', stars:3 },
    { car:'corolla',    total:54,  date:'08/04/2024', time:'10 – 14', status:'confirmed', stars:0 },
    { car:'cybertruck', total:200, date:'27/05/2025', time:'13 – 20', status:'rejected' },
    { car:'mazda-2',    total:74,  date:'16/10/2025', time:'8 – 12',  status:'rejected' },
    { car:'seat-ibiza', total:37,  date:'10/03/2026', time:'18 – 22', status:'confirmed', stars:0 },
  ],
  // ---- DRIVER car reviews (shown on car detail) ----
  reviews:[
    { who:'Maya Gold',  avatar:A('avatar-tamar.jpg'), stars:5, date:'2 weeks ago',  text:'Spotless car and the digital-key pickup was effortless. Tank was full, exactly as described. Would book again!' },
    { who:'Idan Bar',   avatar:A('avatar-user.jpg'),  stars:4, date:'1 month ago',  text:'Great ride for the price. Owner was quick to respond and pickup was smooth.' },
    { who:'Noa Levi',   avatar:A('avatar-dana.jpg'),  stars:5, date:'2 months ago', text:'Super clean, drove perfectly. The whole trip from unlock to return just worked.' },
  ],
  // ---- OWNER side ----
  owner:{ name:'Dana', earnings:1964, change:5.2, rating:3.6, reviews:47, rentals:47, listed:2, since:'3y',
          verified:true, avatar:A('avatar-dana.jpg') },
  ownedIds:['outlander','cybertruck'],   // cars the current user owns → can't book your own
  ownerCars:[
    { car:'outlander', plate:'742-19-301', status:'rented', earned:1290 },
    { car:'cybertruck', plate:'88-204-55', status:'available', earned:674 },
  ],
  requests:[
    { who:'Avi',   avatar:A('avatar-avi.jpg'),   car:'Tesla Model X', date:'28/1', time:'10 – 16', amount:96 },
    { who:'Maya',  avatar:A('avatar-tamar.jpg'), car:'Cybertruck',    date:'02/2', time:'09 – 13', amount:72 },
  ],
  ownerUpcoming:[
    { who:'Tamar', avatar:A('avatar-tamar.jpg'), car:'Tesla X',  date:'15/1', time:'10 – 16', amount:108 },
    { who:'Idan',  avatar:A('avatar-user.jpg'),  car:'Outlander',date:'19/1', time:'08 – 12', amount:64 },
  ],
  // ---- OWNER weekly schedule (calendar week-view) ----
  // weeks[offset] = 7-day array (index 0=SUN … 6=SAT). Each day = list of bookings.
  weekStart:10,                 // date number under the first (SUN) column of "this week"
  weekMonth:'May 2026',
  ownerWeeks:{
    '0':[
      [ { who:'Mike Jakson', avatar:A('avatar-avi.jpg'),   car:'Mitsubishi Outlander', time:'08:00 - 12:15', amount:96 },
        { who:'Sarah Chai',  avatar:A('avatar-tamar.jpg'), car:'Tesla Cybertruck',     time:'15:00 - 17:45', amount:64 } ],
      [],
      [ { who:'Idan Bar',    avatar:A('avatar-user.jpg'),  car:'Tesla Cybertruck',     time:'09:30 - 13:00', amount:72 } ],
      [ { who:'Tamar Levi',  avatar:A('avatar-tamar.jpg'), car:'Mitsubishi Outlander', time:'13:00 - 18:30', amount:110 } ],
      [],
      [ { who:'Noa Mor',     avatar:A('avatar-dana.jpg'),  car:'Tesla Cybertruck',     time:'10:00 - 12:00', amount:48 } ],
      [],
    ],
    '1':[
      [],
      [ { who:'Dana Gold',   avatar:A('avatar-dana.jpg'),  car:'Mitsubishi Outlander', time:'07:00 - 09:30', amount:60 } ],
      [],
      [],
      [ { who:'Avi Cohen',   avatar:A('avatar-avi.jpg'),   car:'Tesla Cybertruck',     time:'11:00 - 16:00', amount:120 } ],
      [],
      [ { who:'Maya Bar',    avatar:A('avatar-tamar.jpg'), car:'Mitsubishi Outlander', time:'14:00 - 17:00', amount:72 } ],
    ],
    '-1':[
      [ { who:'Tomer Shai',  avatar:A('avatar-user.jpg'),  car:'Tesla Cybertruck',     time:'09:00 - 11:00', amount:48 } ],
      [],
      [ { who:'Lior Adam',   avatar:A('avatar-avi.jpg'),   car:'Mitsubishi Outlander', time:'12:00 - 18:00', amount:130 } ],
      [],
      [],
      [],
      [],
    ],
  },
  // ---- OWNER earnings breakdown (earnings screen) ----
  ownerEarnings:{
    total:1964, change:5.2, trips:23, avgTrip:85, bestMonth:'May',
    months:[ ['Jan',640],['Feb',910],['Mar',1180],['Apr',1520],['May',1964] ],
    byCar:[ {car:'outlander', amount:1290, trips:14}, {car:'cybertruck', amount:674, trips:9} ],
  },
  // ---- OWNER availability — PER-DAY booking windows (each day its own hours) ----
  // index 0=SUN … 6=SAT. on=false means the car isn't bookable that day.
  ownerAvailability:{ days:[
    { on:false, from:9,  to:18 },   // SUN
    { on:true,  from:8,  to:20 },   // MON
    { on:true,  from:8,  to:20 },   // TUE
    { on:true,  from:7,  to:19 },   // WED
    { on:true,  from:8,  to:22 },   // THU
    { on:true,  from:9,  to:14 },   // FRI
    { on:false, from:10, to:16 },   // SAT
  ] },
  // ---- OWNER car-return notifications (driver brought the car back) ----
  returns:[
    { who:'Mike Jakson', avatar:A('avatar-avi.jpg'), car:'cybertruck', when:'Today · 17:45',
      loc:'Tel Aviv · Port', sameSpot:true, fuel:'full', distance:'182 km', amount:64 },
  ],
};

export default DATA;
