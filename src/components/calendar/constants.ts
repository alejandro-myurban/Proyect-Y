export type RaidType = 'karazhan' | 'gruul' | 'magtheridon';

export type RaidTypeCombo = [RaidType, RaidType];

export function isRaidTypeCombo(val: string): val is string {
  return val.includes('+');
}

export function parseRaidCombo(val: string): RaidTypeCombo | null {
  const parts = val.split('+');
  if (parts.length !== 2) return null;
  const r1 = parts[0].trim() as RaidType;
  const r2 = parts[1].trim() as RaidType;
  if (!RAID_CONFIG[r1] || !RAID_CONFIG[r2]) return null;
  return [r1, r2];
}

export function getComboConfig(types: RaidTypeCombo): {
  label: string;
  capacity: number;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  bgGradient: string;
  image: string;
  images: string[];
} {
  const c1 = RAID_CONFIG[types[0]];
  const c2 = RAID_CONFIG[types[1]];
  return {
    label: `${c1.label} + ${c2.label}`,
    capacity: c1.capacity + c2.capacity,
    accentColor: c1.accentColor,
    borderColor: c1.borderColor,
    glowColor: c1.glowColor,
    bgGradient: c1.bgGradient,
    image: c1.image,
    images: [c1.image, c2.image],
  };
}
export type CharRole = 'Tanque' | 'Sanador' | 'DPS';

export const CLASSES = [
  'Guerrero', 'Paladín', 'Cazador', 'Pícaro', 'Sacerdote', 'Caballero de la Muerte',
  'Chamán', 'Mago', 'Brujo', 'Monje', 'Druida', 'Cazador de Demonios', 'Evocador',
] as const;

export type WowClass = typeof CLASSES[number];

export const TANK_CLASSES: string[] = [
  'Guerrero', 'Paladín', 'Druida', 'Caballero de la Muerte', 'Monje', 'Cazador de Demonios',
];

export const HEALER_CLASSES: string[] = [
  'Paladín', 'Sacerdote', 'Chamán', 'Druida', 'Monje', 'Evocador',
];

export interface RaidConfig {
  label: string;
  capacity: number;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  description: string;
  bgGradient: string;
  image: string;
}

export const RAID_CONFIG: Record<RaidType, RaidConfig> = {
  karazhan: {
    label: 'Karazhan',
    capacity: 10,
    accentColor: '#9b59b6',
    borderColor: 'rgba(155, 89, 182, 0.6)',
    glowColor: 'rgba(155, 89, 182, 0.2)',
    description: 'La Torre de Medivh · 10 jugadores',
    bgGradient: 'linear-gradient(135deg, rgba(100,0,160,0.18) 0%, rgba(60,0,100,0.10) 50%, transparent 100%)',
    image: '/raid-karazhan.webp',
  },
  gruul: {
    label: "Guarida de Gruul",
    capacity: 25,
    accentColor: '#c0933f',
    borderColor: 'rgba(192, 147, 63, 0.6)',
    glowColor: 'rgba(192, 147, 63, 0.2)',
    description: 'El Señor de los Gigantes · 25 jugadores',
    bgGradient: 'linear-gradient(135deg, rgba(120,80,20,0.18) 0%, rgba(80,50,10,0.10) 50%, transparent 100%)',
    image: '/raid-gruul.webp',
  },
  magtheridon: {
    label: "Guarida de Magtheridon",
    capacity: 25,
    accentColor: '#27ae60',
    borderColor: 'rgba(39, 174, 96, 0.6)',
    glowColor: 'rgba(39, 174, 96, 0.2)',
    description: 'Señor del Pozo Negro · 25 jugadores',
    bgGradient: 'linear-gradient(135deg, rgba(0,120,60,0.18) 0%, rgba(0,80,40,0.10) 50%, transparent 100%)',
    image: '/raid-magtheridon.webp',
  },
};

export function getAvailableRoles(charClass: string): CharRole[] {
  const roles: CharRole[] = [];
  if (TANK_CLASSES.includes(charClass)) roles.push('Tanque');
  if (HEALER_CLASSES.includes(charClass)) roles.push('Sanador');
  roles.push('DPS');
  return roles;
}

export const slugClass = (name: string) =>
  name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '-');

export const CLASS_COLORS: Record<string, string> = {
  'Guerrero':               '#C79C6E',
  'Paladín':                '#F58CBA',
  'Cazador':                '#ABD473',
  'Pícaro':                 '#FFF569',
  'Sacerdote':              '#FFFFFF',
  'Chamán':                 '#0070DE',
  'Mago':                   '#69CCF0',
  'Brujo':                  '#9482C9',
  'Druida':                 '#FF7D0A',
};

const CLASS_SLUGS: Record<string, string> = {
  'Guerrero':               'warrior',
  'Paladín':                'paladin',
  'Cazador':                'hunter',
  'Pícaro':                 'rogue',
  'Sacerdote':              'priest',
  'Chamán':                 'shaman',
  'Mago':                   'mage',
  'Brujo':                  'warlock',
  'Druida':                 'druid',
};

export function getClassIcon(className: string) {
  const slug = CLASS_SLUGS[className] || 'warrior';
  return `https://wow.zamimg.com/images/wow/icons/medium/classicon_${slug}.jpg`;
}

// Set your admin emails here
export const ADMIN_EMAILS: string[] = ['kavaliergrau3@gmail.com', 'saralopmel9487@gmail.com', 'ivansym3@gmail.com'];
