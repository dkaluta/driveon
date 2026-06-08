/* Figma Code Connect — GETAWAY shared blocks (src/blocks.jsx).
   Replace REPLACE_FILE_KEY + node-id placeholders with your Figma links.
   See src/ui.figma.jsx for the full how-to. */
import figma from '@figma/code-connect';
import {
  EntityRow, Toggle, SettingRow, NavCard, SectionCard, ProfileHeader,
} from './blocks.jsx';

// ---- EntityRow ⭐ (the universal list row) ----
figma.connect(EntityRow, 'https://www.figma.com/design/hCgqlk4CL9NDwY2LSiBjvs/Untitled?node-id=20-47', {
  props: {
    title: figma.string('Title'),
  },
  example: (props) => <EntityRow lead={{ src: '', w: 60, h: 48 }} title={props.title} />,
});

// ---- Toggle (boolean `On`) ----
figma.connect(Toggle, 'https://www.figma.com/design/hCgqlk4CL9NDwY2LSiBjvs/Untitled?node-id=12-41', {
  props: { on: figma.enum('On', { True: true, False: false }) },
  example: (props) => <Toggle on={props.on} onClick={() => {}} />,
});

// ---- SettingRow (text `Label`) ----
figma.connect(SettingRow, 'https://www.figma.com/design/hCgqlk4CL9NDwY2LSiBjvs/Untitled?node-id=20-8', {
  props: { label: figma.string('Label') },
  example: (props) => <SettingRow icon="moon" label={props.label} />,
});

// ---- NavCard (text `Label`) ----
figma.connect(NavCard, 'https://www.figma.com/design/hCgqlk4CL9NDwY2LSiBjvs/Untitled?node-id=20-17', {
  props: { label: figma.string('Label') },
  example: (props) => <NavCard icon="gear" label={props.label} onClick={() => {}} />,
});

// ---- SectionCard (text `Title`) ----
figma.connect(SectionCard, 'https://www.figma.com/design/hCgqlk4CL9NDwY2LSiBjvs/Untitled?node-id=20-26', {
  props: { title: figma.string('Title') },
  example: (props) => <SectionCard title={props.title} />,
});

// ---- ProfileHeader (text `Name`) ----
figma.connect(ProfileHeader, 'https://www.figma.com/design/hCgqlk4CL9NDwY2LSiBjvs/Untitled?node-id=20-33', {
  props: { name: figma.string('Name') },
  example: (props) => <ProfileHeader avatar="" name={props.name} />,
});
