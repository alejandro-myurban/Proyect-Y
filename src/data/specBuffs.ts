// ── Spec Buffs / Utilidades por especialización (TBC Classic) ─────────────────
// Cada entrada mapea una spec key ("Class/Spec") a los buffs/utilidades que aporta.
// icon: slug del icono en wow.zamimg.com/images/wow/icons/small/{icon}.jpg
// category: tipo de utilidad para agrupar visualmente en el visor

export type BuffCategory =
  | 'buff_ofensivo'   // aumenta daño del grupo
  | 'buff_defensivo'  // aumenta supervivencia
  | 'buff_mana'       // regeneración de maná
  | 'debuff'          // debilita al enemigo
  | 'aura'            // aura pasiva siempre activa
  | 'cooldown';       // cooldown importante

export interface SpecBuff {
  name: string;
  icon: string;
  category: BuffCategory;
  description?: string;
}

export const SPEC_BUFFS: Record<string, SpecBuff[]> = {

  // ── GUERRERO ────────────────────────────────────────────────────────────────
  'Warrior/Arms': [
    { name: 'Grito de Batalla', icon: 'ability_warrior_battleshout', category: 'buff_ofensivo', description: '+AP al grupo' },
    { name: 'Grito Desmoralizador', icon: 'ability_warrior_warcry', category: 'debuff', description: '-AP del jefe' },
    { name: 'Herida Sangrienta', icon: 'ability_warrior_bloodnova', category: 'debuff', description: '-75% curación recibida' },
  ],
  'Warrior/Fury': [
    { name: 'Grito de Batalla', icon: 'ability_warrior_battleshout', category: 'buff_ofensivo', description: '+AP al grupo' },
    { name: 'Grito Desmoralizador', icon: 'ability_warrior_warcry', category: 'debuff', description: '-AP del jefe' },
    { name: 'Imprudencia', icon: 'ability_warrior_rampage', category: 'buff_ofensivo', description: '+5% crit melee al grupo (talento)' },
  ],
  'Warrior/Protection': [
    { name: 'Grito Desmoralizador', icon: 'ability_warrior_warcry', category: 'debuff', description: '-AP del jefe' },
    { name: 'Grito de Batalla', icon: 'ability_warrior_battleshout', category: 'buff_ofensivo', description: '+AP al grupo' },
    { name: 'Berserker destrozado', icon: 'ability_warrior_sunder', category: 'debuff', description: '-armor acumulable' },
  ],

  // ── PALADÍN ─────────────────────────────────────────────────────────────────
  'Paladin/Holy': [
    { name: 'Bendición de los Reyes', icon: 'spell_magic_greaterblessingofkings', category: 'buff_ofensivo', description: '+10% stats' },
    { name: 'Bendición de Sabiduría', icon: 'spell_holy_greaterblessingofwisdom', category: 'buff_mana', description: '+mana/5s' },
    { name: 'Aura de Devoción', icon: 'spell_holy_devotionaura', category: 'buff_defensivo', description: '+armor área' },
    { name: 'Joya de la Luz', icon: 'spell_holy_divineillumination', category: 'cooldown', description: '-50% coste de maná 15s' },
  ],
  'Paladin/Protection': [
    { name: 'Bendición de los Reyes', icon: 'spell_magic_greaterblessingofkings', category: 'buff_ofensivo', description: '+10% stats' },
    { name: 'Bendición de Santuario', icon: 'spell_holy_greaterblessingoflight', category: 'buff_defensivo', description: '-daño recibido, devuelve maná al bloquear' },
    { name: 'Aura de Concentración', icon: 'spell_holy_mindsooth', category: 'buff_defensivo', description: 'Inmunidad a interrupciones de casteo' },
  ],
  'Paladin/Retribution': [
    { name: 'Bendición de los Reyes', icon: 'spell_magic_greaterblessingofkings', category: 'buff_ofensivo', description: '+10% stats' },
    { name: 'Bendición de Poder', icon: 'spell_holy_greaterblessingofstrength', category: 'buff_ofensivo', description: '+AP' },
    { name: 'Aura Retributiva', icon: 'spell_holy_auraoflight', category: 'aura', description: '+3% daño al raid (talento)' },
    { name: 'Juicio de Sabiduría', icon: 'spell_holy_righteousfury', category: 'buff_mana', description: 'Devuelve maná al golpear al jefe' },
  ],

  // ── CAZADOR ─────────────────────────────────────────────────────────────────
  'Hunter/Marksmanship': [
    { name: 'Aura Certero', icon: 'ability_hunter_trueshotaura', category: 'aura', description: '+AP/RAP al grupo' },
    { name: 'Marca del Cazador', icon: 'ability_hunter_humbleratmark', category: 'debuff', description: '+RAP contra el objetivo' },
  ],
  'Hunter/Beast Mastery': [
    { name: 'Inspiración Feroz', icon: 'ability_hunter_pet_bear', category: 'buff_ofensivo', description: '+3% daño al grupo cuando la mascota crit (talento)' },
    { name: 'Marca del Cazador', icon: 'ability_hunter_humbleratmark', category: 'debuff', description: '+RAP contra el objetivo' },
  ],
  'Hunter/Survival': [
    { name: 'Debilidad Expuesta', icon: 'ability_hunter_exposedweakness', category: 'buff_ofensivo', description: '+AP al raid en cada crit ágil (talento)' },
    { name: 'Marca del Cazador', icon: 'ability_hunter_humbleratmark', category: 'debuff', description: '+RAP contra el objetivo' },
  ],

  // ── PÍCARO ──────────────────────────────────────────────────────────────────
  'Rogue/Dps': [
    { name: 'Exponer Armadura', icon: 'ability_warrior_sunder', category: 'debuff', description: '-armor (alternativa a Berserker Destrozado)' },
    { name: 'Veneno Mortal', icon: 'ability_rogue_dualweild', category: 'debuff', description: 'Ralentiza ataques del jefe' },
  ],

  // ── SACERDOTE ────────────────────────────────────────────────────────────────
  'Priest/Holy': [
    { name: 'Fortaleza de Poder', icon: 'spell_holy_wordfortitude', category: 'buff_defensivo', description: '+Stamina al raid' },
    { name: 'Espíritu Divino', icon: 'spell_holy_divinespirit', category: 'buff_mana', description: '+Spirit al raid' },
    { name: 'Oración de Espíritu', icon: 'spell_holy_prayerofspirit', category: 'buff_mana', description: '+Spirit en área' },
    { name: 'Inspíración', icon: 'spell_holy_heal02', category: 'buff_defensivo', description: '-daño recibido al objetivo curado crit' },
  ],
  'Priest/Shadow': [
    { name: 'Toque Vampírico', icon: 'spell_holy_stoicism', category: 'buff_mana', description: 'Regenera maná al raid al hacer daño' },
    { name: 'Fortaleza de Poder', icon: 'spell_holy_wordfortitude', category: 'buff_defensivo', description: '+Stamina al raid' },
    { name: 'Tejido de Sombras', icon: 'spell_shadow_requiem', category: 'debuff', description: '-resistencia a sombras del objetivo' },
    { name: 'Miseria', icon: 'spell_shadow_misery', category: 'debuff', description: '+impacto de hechizos contra el objetivo' },
  ],

  // ── CHAMÁN ──────────────────────────────────────────────────────────────────
  'Shaman/Elemental': [
    { name: 'Totem de Cólera', icon: 'spell_fire_totemofwrath', category: 'buff_ofensivo', description: '+3% impacto/crit a hechizos al grupo' },
    { name: 'Totem Lluvia de Llamas', icon: 'spell_fire_selfdestruct', category: 'buff_ofensivo', description: 'Daño AoE pasivo' },
    { name: 'Totem Aire de la Ira', icon: 'spell_nature_slowingtotem', category: 'buff_ofensivo', description: '+5% haste a hechizos al grupo' },
    { name: 'Totem de la Fuente', icon: 'spell_nature_manaregentotem', category: 'buff_mana', description: '+maná al grupo' },
  ],
  'Shaman/Enhancement': [
    { name: 'Totem Furiaventos', icon: 'spell_nature_windfury', category: 'buff_ofensivo', description: '+melee haste al grupo' },
    { name: 'Totem de Fuerza de la Tierra', icon: 'spell_nature_earthbindtotem', category: 'buff_ofensivo', description: '+Strength al grupo' },
    { name: 'Totem de Gracia del Aire', icon: 'spell_nature_invisibilitytotem', category: 'buff_ofensivo', description: '+Agilidad al grupo' },
    { name: 'Totem de la Fuente', icon: 'spell_nature_manaregentotem', category: 'buff_mana', description: '+maná al grupo' },
  ],
  'Shaman/Restoration': [
    { name: 'Totem Fuente de Maná', icon: 'spell_nature_manaregentotem', category: 'buff_mana', description: '+maná/5s al grupo' },
    { name: 'Totem de Curación', icon: 'spell_nature_healingwavetotem', category: 'buff_defensivo', description: 'Regeneración de vida pasiva al grupo' },
    { name: 'Totem de Gracia del Aire', icon: 'spell_nature_invisibilitytotem', category: 'buff_ofensivo', description: '+Agilidad al grupo' },
    { name: 'Mareas de la Naturaleza', icon: 'spell_shaman_tidalwaves', category: 'cooldown', description: 'Potencia heals del grupo' },
  ],

  // ── MAGO ────────────────────────────────────────────────────────────────────
  'Mage/Arcane': [
    { name: 'Brillantez Arcana', icon: 'spell_holy_magicalsentry', category: 'buff_mana', description: '+Intelecto al raid' },
    { name: 'Magia Focalizada', icon: 'spell_arcane_focusedpower', category: 'buff_ofensivo', description: '+3% crit a un aliado (talento)' },
    { name: 'Magia de Arcano', icon: 'spell_arcane_arcaneresilience', category: 'debuff', description: '+resist hechizos del objetivo (debuff)' },
  ],
  'Mage/Fire': [
    { name: 'Brillantez Arcana', icon: 'spell_holy_magicalsentry', category: 'buff_mana', description: '+Intelecto al raid' },
    { name: 'Escorchado Mejorado', icon: 'spell_fire_soulburn', category: 'debuff', description: '-resistencia a fuego del objetivo' },
  ],
  'Mage/Frost': [
    { name: 'Brillantez Arcana', icon: 'spell_holy_magicalsentry', category: 'buff_mana', description: '+Intelecto al raid' },
    { name: 'Escalofrío Invernal', icon: 'spell_frost_chillingblast', category: 'debuff', description: '-resistencia a escarcha del objetivo' },
  ],

  // ── BRUJO ────────────────────────────────────────────────────────────────────
  'Warlock/Affliction': [
    { name: 'Maldición de los Elementos', icon: 'spell_shadow_chilltouch', category: 'debuff', description: '-resistencia a magia del objetivo' },
    { name: 'Maledicción', icon: 'spell_shadow_curseofachimonde', category: 'debuff', description: '+3% impacto de hechizos (talento)' },
    { name: 'Toque Vampírico del Brujo', icon: 'spell_shadow_lifedrain02', category: 'buff_mana', description: 'Drenar vida/maná' },
  ],
  'Warlock/Demonology': [
    { name: 'Maldición de los Elementos', icon: 'spell_shadow_chilltouch', category: 'debuff', description: '-resistencia a magia del objetivo' },
    { name: 'Alma Felina Mejorada', icon: 'spell_shadow_summonfelhunter', category: 'buff_mana', description: 'Regenera maná del grupo' },
  ],
  'Warlock/Destruction': [
    { name: 'Maldición de los Elementos', icon: 'spell_shadow_chilltouch', category: 'debuff', description: '-resistencia a magia del objetivo' },
    { name: 'Maldición de la Lengua de Sombras', icon: 'spell_shadow_shadowbolt', category: 'debuff', description: '+impacto de relámpago de sombras' },
  ],

  // ── DRUIDA ───────────────────────────────────────────────────────────────────
  'Druid/Balance': [
    { name: 'Aura Ósea de Luna', icon: 'spell_nature_starfall', category: 'aura', description: '+5% crit a hechizos al grupo' },
    { name: 'Fuego de las Hadas', icon: 'spell_nature_faeriefire', category: 'debuff', description: '-armor del objetivo, no puede volverse invisible' },
    { name: 'Tierra y Luna', icon: 'spell_arcane_starfire', category: 'debuff', description: '-resistencia a magia del objetivo (talento)' },
  ],
  'Druid/Restoration': [
    { name: 'Maná Salvaje', icon: 'spell_nature_lightning', category: 'cooldown', description: 'Restaura todo el maná de un aliado (Innervate)' },
    { name: 'Rugido del Árbol', icon: 'ability_druid_treeoflife', category: 'buff_defensivo', description: '+heal a aliados cercanos en Forma de Árbol' },
    { name: 'Tranquilidad', icon: 'spell_nature_tranquility', category: 'cooldown', description: 'AoE heal masivo de emergencia' },
  ],
  'Druid/Cat': [
    { name: 'Líder de la Manada', icon: 'spell_nature_unyeildingstamina', category: 'aura', description: '+5% crit melee al grupo' },
    { name: 'Desgarrar', icon: 'ability_druid_mangle2', category: 'debuff', description: '+30% daño de sangrado en el objetivo' },
    { name: 'Fuego de las Hadas', icon: 'spell_nature_faeriefire', category: 'debuff', description: '-armor del objetivo' },
  ],
  'Druid/Bear': [
    { name: 'Líder de la Manada', icon: 'spell_nature_unyeildingstamina', category: 'aura', description: '+5% crit melee al grupo' },
    { name: 'Rugido Desmoralizador', icon: 'ability_druid_demoralizingroar', category: 'debuff', description: '-AP del jefe (alternativa a guerrero)' },
    { name: 'Fuego de las Hadas', icon: 'spell_nature_faeriefire', category: 'debuff', description: '-armor del objetivo' },
  ],
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Dado un class name (español) y un rol, devuelve todos los buffs posibles agrupados por spec */
export function getBuffsForClassRole(
  charClass: string,
  charRole: string
): { specKey: string; specLabel: string; buffs: SpecBuff[] }[] {
  const CLASS_ROLE_MAP: Record<string, Partial<Record<string, string[]>>> = {
    'Guerrero':  { 'Tanque': ['Warrior/Protection'], 'DPS': ['Warrior/Arms', 'Warrior/Fury'] },
    'Paladín':   { 'Tanque': ['Paladin/Protection'], 'Sanador': ['Paladin/Holy'], 'DPS': ['Paladin/Retribution'] },
    'Cazador':   { 'DPS': ['Hunter/Marksmanship', 'Hunter/Beast Mastery', 'Hunter/Survival'] },
    'Pícaro':    { 'DPS': ['Rogue/Dps'] },
    'Sacerdote': { 'Sanador': ['Priest/Holy'], 'DPS': ['Priest/Shadow'] },
    'Chamán':    { 'Sanador': ['Shaman/Restoration'], 'DPS': ['Shaman/Elemental', 'Shaman/Enhancement'] },
    'Mago':      { 'DPS': ['Mage/Fire', 'Mage/Arcane', 'Mage/Frost'] },
    'Brujo':     { 'DPS': ['Warlock/Destruction', 'Warlock/Affliction', 'Warlock/Demonology'] },
    'Druida':    { 'Tanque': ['Druid/Bear'], 'Sanador': ['Druid/Restoration'], 'DPS': ['Druid/Cat', 'Druid/Balance'] },
  };

  const SPEC_LABELS: Record<string, string> = {
    'Warrior/Arms': 'Armas', 'Warrior/Fury': 'Furia', 'Warrior/Protection': 'Protección',
    'Paladin/Holy': 'Sagrado', 'Paladin/Protection': 'Protección', 'Paladin/Retribution': 'Reprensión',
    'Hunter/Marksmanship': 'Puntería', 'Hunter/Beast Mastery': 'Dom. Bestias', 'Hunter/Survival': 'Supervivencia',
    'Rogue/Dps': 'DPS',
    'Priest/Holy': 'Sagrado', 'Priest/Shadow': 'Sombras',
    'Shaman/Restoration': 'Restauración', 'Shaman/Elemental': 'Elemental', 'Shaman/Enhancement': 'Mejora',
    'Mage/Fire': 'Fuego', 'Mage/Arcane': 'Arcano', 'Mage/Frost': 'Escarcha',
    'Warlock/Destruction': 'Destrucción', 'Warlock/Affliction': 'Aflicción', 'Warlock/Demonology': 'Demonología',
    'Druid/Bear': 'Oso', 'Druid/Restoration': 'Restauración', 'Druid/Cat': 'Felino', 'Druid/Balance': 'Equilibrio',
  };

  const specKeys = CLASS_ROLE_MAP[charClass]?.[charRole] ?? [];
  return specKeys
    .map(k => ({ specKey: k, specLabel: SPEC_LABELS[k] ?? k.split('/')[1], buffs: SPEC_BUFFS[k] ?? [] }))
    .filter(s => s.buffs.length > 0);
}

/** Colores por categoría de buff */
export const BUFF_CATEGORY_COLORS: Record<BuffCategory, string> = {
  buff_ofensivo: '#d9534f',
  buff_defensivo: '#5bc0de',
  buff_mana:     '#5cb85c',
  debuff:        '#f0a500',
  aura:          '#a335ee',
  cooldown:      '#ff8000',
};

export const BUFF_CATEGORY_LABELS: Record<BuffCategory, string> = {
  buff_ofensivo: 'Ofensivo',
  buff_defensivo: 'Defensivo',
  buff_mana:     'Maná',
  debuff:        'Debuff',
  aura:          'Aura',
  cooldown:      'Cooldown',
};
