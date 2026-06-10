/* Figma Code Connect — DriveOn UI kit (src/ui.jsx).
 *
 * Each figma.connect() links a Figma component to its React source so Figma
 * Dev Mode shows real code. The URLs are PLACEHOLDERS — replace REPLACE_FILE_KEY
 * and node-id with your own once the Figma components exist:
 *
 *   1. In Figma, right-click the component → Copy link to selection.
 *   2. Paste it over the placeholder URL below.
 *      (Or run `npx figma connect create "<url>"` to auto-generate a stub.)
 *   3. The figma.enum/boolean property names ('Status', 'Mode', …) must match
 *      the Figma component's property names exactly.
 *   4. `npm run figma:parse` to validate, `npm run figma:publish` to push.
 */
import figma from '@figma/code-connect';
import {
  Icon, Badge, Chips, Stars, Heart, Header, BottomTab, StatusBar,
} from './ui.jsx';

// ---- Icon (one component set, variant `Name`) ----
figma.connect(Icon, 'https://www.figma.com/design/hCgqlk4CL9NDwY2LSiBjvs/Untitled?node-id=17-90', {
  props: {
    name: figma.enum('Name', {
      Home: 'home', History: 'history', Car: 'car', Heart: 'heart', User: 'user',
      Search: 'search', Filter: 'filter', Map: 'map', Calendar: 'calendar',
      Star: 'star', Key: 'key', Shield: 'shield', Card: 'card', Location: 'location',
      Settings: 'gear', Bolt: 'bolt', Fuel: 'fuel', Gauge: 'gauge', Check: 'check',
    }),
  },
  example: (props) => <Icon name={props.name} size={24} />,
});

// ---- Badge (variant `Status`) ----
figma.connect(Badge, 'https://www.figma.com/design/hCgqlk4CL9NDwY2LSiBjvs/Untitled?node-id=12-13', {
  props: {
    status: figma.enum('Status', {
      Confirmed: 'confirmed', Rejected: 'rejected', Pending: 'pending',
      Available: 'available', Rented: 'rented',
    }),
  },
  example: (props) => <Badge status={props.status} />,
});

// ---- Chip (variant `Type` → the chip's [icon, label] pair) ----
figma.connect(Chips, 'https://www.figma.com/design/hCgqlk4CL9NDwY2LSiBjvs/Untitled?node-id=12-35', {
  props: {
    type: figma.enum('Type', {
      Manual: [['gear', 'Manual']], Auto: [['auto', 'Auto']], EV: [['bolt', 'EV']],
      AWD: [['awd', 'AWD']], 'High-End': [['glass', 'High-End']], ECO: [['leaf', 'ECO']],
    }),
  },
  example: (props) => <Chips items={props.type} />,
});

// ---- Stars (variant `Value` 0--5) ----
figma.connect(Stars, 'https://www.figma.com/design/hCgqlk4CL9NDwY2LSiBjvs/Untitled?node-id=12-109', {
  props: {
    value: figma.enum('Value', { '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 }),
  },
  example: (props) => <Stars value={props.value} />,
});

// ---- Heart (boolean `On`) ----
figma.connect(Heart, 'https://www.figma.com/design/hCgqlk4CL9NDwY2LSiBjvs/Untitled?node-id=40-8', {
  props: { on: figma.enum('On', { True: true, False: false }) },
  example: (props) => <Heart on={props.on} />,
});

// ---- Header / app bar (text `Title`) ----
figma.connect(Header, 'https://www.figma.com/design/hCgqlk4CL9NDwY2LSiBjvs/Untitled?node-id=20-2', {
  props: { title: figma.string('Title') },
  example: (props) => <Header title={props.title} onBack={() => {}} />,
});

// ---- Bottom tab / nav bar (variant `Mode` × `Active`) ----
figma.connect(BottomTab, 'https://www.figma.com/design/hCgqlk4CL9NDwY2LSiBjvs/Untitled?node-id=107-287', {
  props: {
    mode: figma.enum('Mode', { Driver: 'driver', Owner: 'owner' }),
    tab: figma.enum('Active', { Home: 'home', History: 'history', Fourth: 'likes', Profile: 'profile', None: undefined }),
  },
  example: (props) => <BottomTab mode={props.mode} tab={props.tab} onNav={() => {}} onFab={() => {}} />,
});

// ---- Status bar (boolean `On dark`) ----
// Maps to the iOS UI-kit "Status bar - iPhone" set (Appearance = Light / Dark).
// Appearance=Dark = white glyphs (for dark backgrounds) → React `dark`.
figma.connect(StatusBar, 'https://www.figma.com/design/hCgqlk4CL9NDwY2LSiBjvs/Untitled?node-id=95-1400', {
  props: { dark: figma.enum('Appearance', { Dark: true, Light: false }) },
  example: (props) => <StatusBar dark={props.dark} />,
});
