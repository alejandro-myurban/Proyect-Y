// ── Spec Buffs / Utilidades por especialización (TBC Classic) ─────────────────
// Cada entrada mapea una spec key ("Class/Spec") a los buffs/utilidades que aporta.
// icon: slug del icono en wow.zamimg.com/images/wow/icons/small/{icon}.jpg
// category: tipo de utilidad para agrupar visualmente en el visor

export type BuffCategory =
  | 'buff_ofensivo'   // aumenta daño del grupo/raid
  | 'buff_defensivo'  // aumenta supervivencia
  | 'buff_mana'       // regeneración de maná
  | 'debuff'          // debilita al enemigo
  | 'aura'            // aura pasiva
  | 'cooldown';       // cooldown importante (Bloodlust, etc.)

export type BuffScope = 'raid' | 'party';

export interface SpecBuff {
  name: string;
  icon: string;
  category: BuffCategory;
  scope?: BuffScope; // 'raid' = afecta a todo el raid, 'party' = solo al grupo (default)
  description?: string;
}

// ── Buffs compartidos entre varias specs ─────────────────────────────────────
const BLOODLUST:           SpecBuff = { name: 'Ansia de sangre / Heroísmo', icon: 'spell_nature_bloodlust',       category: 'cooldown',      scope: 'raid', description: '+30% velocidad de ataque/casteo al raid' };
const BRILLANTEZ_ARCANA:   SpecBuff = { name: 'Brillantez arcana',           icon: 'spell_holy_magicalsentry',     category: 'buff_mana',     scope: 'raid', description: 'Aumenta Intelecto' };
const MARCA_SALVAJE:       SpecBuff = { name: 'Marca de lo Salvaje',         icon: 'spell_nature_regeneration',    category: 'buff_ofensivo', scope: 'raid', description: 'Aumenta stats, armadura y resistencias' };
const LIDER_MANADA:        SpecBuff = { name: 'Líder de la manada',          icon: 'spell_nature_unyeildingstamina', category: 'aura',        description: '+5% crítico melé al grupo' };
const ESTIMULAR:           SpecBuff = { name: 'Estimular',                   icon: 'spell_nature_lightning',         category: 'buff_mana', scope:"raid",   description: 'Regeneración de maná masiva a un aliado' };
const ENTEREZA:            SpecBuff = { name: 'Entereza',                    icon: 'spell_holy_wordfortitude',     category: 'buff_defensivo', scope: 'raid', description: 'Aumenta el Aguante del raid' };
const PROT_SOMBRAS:        SpecBuff = { name: 'Protección contra Sombras',   icon: 'spell_shadow_antishadow',      category: 'buff_defensivo', scope: 'raid', description: 'Aumenta la protección contra las sombras' };
const MALDICION_ELEMENTOS: SpecBuff = { name: 'Maldición de los Elementos',  icon: 'spell_shadow_chilltouch',      category: 'debuff',        description: '+10% daño de sombras/fuego/arcano' };
const PIEDRA_ALMA:         SpecBuff = { name: 'Piedra de alma',               icon: 'spell_shadow_soulgem',   scope:"raid",       category: 'cooldown',      description: 'Resurrección en combate' };
const PIEDRA_SALUD:        SpecBuff = { name: 'Piedra de salud',              icon: 'inv_stone_04',      scope:"raid",            category: 'buff_defensivo', description: 'Consumible de curación instantánea' };
const ATRONAR_MEJORADO:    SpecBuff = { name: 'Atronar Mejorado',            icon: 'spell_nature_thunderclap',     category: 'debuff',        description: '-20% velocidad de ataque del jefe' };
const GRITO_BATALLA:       SpecBuff = { name: 'Grito de Batalla',            icon: 'ability_warrior_battleshout',  category: 'buff_ofensivo', description: 'Aumenta el Poder de Ataque del grupo' };
const RENACER:             SpecBuff = { name: 'Renacer',               icon: 'spell_nature_reincarnation', scope:"raid",    category: 'cooldown', description: 'Resurrección en combate' };
const MARK_OF_THE_HUNTER:  SpecBuff = { name: 'Marca del Cazador', icon: 'ability_hunter_snipershot',   category: 'debuff',        description: 'Aumenta el Poder de Ataque a distancia contra el objetivo' };

// ─────────────────────────────────────────────────────────────────────────────

export const SPEC_BUFFS: Record<string, SpecBuff[]> = {

  // ── GUERRERO ────────────────────────────────────────────────────────────────
  'Warrior/Arms': [
    { name: 'Frenesí sangriento', icon: 'ability_warrior_bloodfrenzy', category: 'buff_ofensivo', description: '+4% daño físico recibido por el objetivo' },
    GRITO_BATALLA,
    ATRONAR_MEJORADO,
  ],
  'Warrior/Fury': [
    GRITO_BATALLA,
    { name: 'Grito de Comandante', icon: 'ability_warrior_rallyingcry', category: 'buff_defensivo', description: 'Aumenta la vida máxima del grupo' },
  ],
  'Warrior/Protection': [
    ATRONAR_MEJORADO,
    { name: 'Grito Desmoralizador', icon: 'ability_warrior_warcry',    category: 'debuff', description: 'Reduce el Poder de Ataque del jefe' },
    { name: 'Hender Armadura',      icon: 'ability_warrior_sunder', category: 'debuff', description: 'Reduce la armadura del objetivo (acumulable)' },
  ],

  // ── PALADÍN ─────────────────────────────────────────────────────────────────
  'Paladin/Holy': [
    { name: 'Iluminación Divina',     icon: 'spell_holy_divineillumination',           category: 'cooldown',       description: '-50% coste de maná durante 15s' },
    { name: 'Bendición de Sabiduría', icon: 'spell_holy_greaterblessingofwisdom',      category: 'buff_mana',      description: 'Regeneración de maná constante' },
    { name: 'Bendición de Reyes',     icon: 'spell_magic_greaterblessingofkings',      category: 'buff_ofensivo', scope:"raid",  description: '+10% estadísticas totales' },
    { name: 'Bendición de Poderío',   icon: 'spell_holy_fistofjustice',                category: 'buff_ofensivo',  description: 'Aumenta el Poder de Ataque' },
    { name: 'Aura de Devoción',       icon: 'spell_holy_devotionaura',                 category: 'buff_defensivo', scope: 'party', description: 'Aumenta armadura del grupo' },
    { name: 'Aura de Concentración',  icon: 'spell_holy_mindsooth',                    category: 'buff_defensivo', description: 'Reduce retroceso de casteo por daño' },
  ],
  'Paladin/Protection': [
    { name: 'Bendición de Santuario', icon: 'spell_holy_greaterblessingofsanctuary',   category: 'buff_defensivo', description: 'Reduce daño recibido y devuelve maná al bloquear' },
    { name: 'Bendición de Sabiduría', icon: 'spell_holy_greaterblessingofwisdom',      category: 'buff_mana',      description: 'Regeneración de maná constante' },
    { name: 'Bendición de Poderío',   icon: 'spell_holy_fistofjustice',                category: 'buff_ofensivo',  description: 'Aumenta el Poder de Ataque' },
    { name: 'Aura de Devoción',       icon: 'spell_holy_devotionaura',                 category: 'buff_defensivo', scope: 'party', description: 'Aumenta armadura del grupo' },
  ],
  'Paladin/Retribution': [
    { name: 'Aura de Santidad Mejorada',      icon: 'spell_holy_mindvision',              category: 'aura',          description: '+10% daño sagrado aumentado' },
    { name: 'Bendición de Reyes',             icon: 'spell_magic_greaterblessingofkings', category: 'buff_ofensivo', scope:"raid", description: '+10% estadísticas totales' },
    { name: 'Bendición de Sabiduría',         icon: 'spell_holy_greaterblessingofwisdom', category: 'buff_mana',  scope:"raid",    description: 'Regeneración de maná constante' },
    { name: 'Bendición de Poderío Mejorada',  icon: 'spell_holy_greaterblessingofkings',  category: 'buff_ofensivo', scope:"raid", description: 'Aumenta el Poder de Ataque (versión mejorada, +20% AP)' },
    { name: 'Sello del Cruzado',            icon: 'spell_holy_holysmite',          category: 'debuff',        description: 'Aumenta un 3% la probabilidad de crítico de todos los ataques.' },
  ],

  // ── CAZADOR ─────────────────────────────────────────────────────────────────
  'Hunter/Beast Mastery': [
    MARK_OF_THE_HUNTER,
    { name: 'Inspiración Feroz', icon: 'ability_hunter_ferociousinspiration',  category: 'buff_ofensivo', description: '+3% daño al grupo tras crítico de mascota' },
    { name: 'Marca del Cazador', icon: 'ability_hunter_snipershot',   category: 'debuff',        description: 'Aumenta el Poder de Ataque a distancia contra el objetivo' },
  ],
  'Hunter/Marksmanship': [
    MARK_OF_THE_HUNTER,
    { name: 'Aura de disparo certero', icon: 'ability_trueshot', category: 'aura',   description: 'Aumenta el Poder de Ataque del grupo' },
    { name: 'Picadura de escorpido',   icon: 'ability_hunter_criticalshot', category: 'debuff', description: 'Reduce la probabilidad de acertar del jefe' },
  ],
  'Hunter/Survival': [
    MARK_OF_THE_HUNTER,
    { name: 'Debilidad expuesta', icon: 'ability_rogue_findweakness', category: 'debuff', description: 'Aumenta todo el daño de poder de ataque al objetivo.' },
    { name: 'Picadura de escorpido',   icon: 'ability_hunter_criticalshot', category: 'debuff', description: 'Reduce la probabilidad de acertar del jefe' },
  ],

  // ── PÍCARO ──────────────────────────────────────────────────────────────────
  'Rogue/Dps': [
    { name: 'Exponer armadura mejorado', icon: 'ability_warrior_riposte', category: 'debuff', description: 'Reduce armadura (más potente que Hender Armadura)' },
  ],

  // ── SACERDOTE ────────────────────────────────────────────────────────────────
  'Priest/Holy': [
    { name: 'Espíritu divino', icon: 'spell_holy_divinespirit', category: 'buff_defensivo', scope: 'raid', description: 'Aumenta el Espíritu (regeneración)' },
    ENTEREZA,
    PROT_SOMBRAS,
  ],
  'Priest/Shadow': [
    { name: 'Toque vampírico',   icon: 'spell_holy_stoicism',       category: 'buff_mana', description: 'Regenera maná al grupo basado en el daño de sombras' },
    { name: 'Miseria',           icon: 'spell_shadow_misery',       category: 'debuff',    description: '+5% daño con hechizos al objetivo' },
    { name: 'Tejido de Sombras', icon: 'spell_shadow_blackplague',  category: 'debuff',    description: '+10% daño de sombras al objetivo' },
    { name: 'Abrazo vampírico',  icon: 'spell_shadow_unsummonbuilding', category: 'buff_ofensivo', scope: 'party', description: 'Sana al grupo mientras hace daño' },
    ENTEREZA,
    PROT_SOMBRAS,
  ],

  // ── CHAMÁN ──────────────────────────────────────────────────────────────────
  'Shaman/Elemental': [
    BLOODLUST,
    { name: 'Tótem de Cólera',         icon: 'spell_fire_totemofwrath',    category: 'buff_ofensivo', scope: 'party', description: '+3% golpe y crítico con hechizos al grupo' },
  ],
  'Shaman/Enhancement': [
    BLOODLUST,
    { name: 'Furia desatada',               icon: 'spell_nature_unleashedrage', scope:"party",  category: 'buff_ofensivo', description: '+10% Poder de Ataque melé al grupo' },
  ],
  'Shaman/Restoration': [
    BLOODLUST,
    { name: 'Tótem Marea de maná', icon: 'spell_frost_summonwaterelemental', category: 'buff_mana', description: 'Restaura maná masivo al grupo' },
  ],

  // ── MAGO ────────────────────────────────────────────────────────────────────
  'Mage/Arcane': [
    BRILLANTEZ_ARCANA,
    { name: 'Poder arcano', icon: 'spell_nature_lightning', category: 'cooldown', description: 'Burst masivo de daño' },
  ],
  'Mage/Fire': [
    BRILLANTEZ_ARCANA,
    { name: 'Agostar mejorado', icon: 'spell_fire_soulburn', category: 'debuff', description: '+15% daño de fuego al objetivo' },
  ],
  'Mage/Frost': [
    BRILLANTEZ_ARCANA,
    { name: 'Escalofrío invernal', icon: 'spell_frost_chillingblast', category: 'debuff',   description: '+10% crítico de escarcha al objetivo' },
  ],

  // ── BRUJO ────────────────────────────────────────────────────────────────────
  'Warlock/Affliction': [
    { name: 'Pacto de sangre', icon: 'spell_shadow_bloodboil',        category: 'buff_defensivo', description: 'Aumenta la salud del grupo (Diablillo)' },
    MALDICION_ELEMENTOS,
    PIEDRA_ALMA,
    PIEDRA_SALUD,
  ],
  'Warlock/Destruction': [
    MALDICION_ELEMENTOS,
    PIEDRA_ALMA,
    PIEDRA_SALUD,
  ],
  'Warlock/Demonology': [
    { name: 'Aura vil', icon: 'spell_shadow_summonfelhunter', category: 'buff_mana', description: 'Regeneración de maná/vida (Manáfago)' },
    MALDICION_ELEMENTOS,
    PIEDRA_ALMA,
    PIEDRA_SALUD,
  ],

  // ── DRUIDA ───────────────────────────────────────────────────────────────────
  'Druid/Balance': [
    MARCA_SALVAJE,
    ESTIMULAR,
    RENACER,
    { name: 'Aura de lechúcico lunar', icon: 'spell_nature_moonglow',  category: 'aura',   description: '+5% crítico con hechizos al grupo' },
    { name: 'Fuego fatuo mejorado',    icon: 'spell_nature_faeriefire', category: 'debuff', description: '+3% probabilidad de golpe físico/hechizos' },
  ],
  'Druid/Bear': [
    MARCA_SALVAJE,
    ESTIMULAR,
    LIDER_MANADA,
    RENACER,
    { name: 'Rugido desmoralizador', icon: 'ability_druid_demoralizingroar', category: 'debuff',   description: 'Reduce el AP del jefe' },
    
    { name: 'Destrozar', icon: 'ability_druid_mangle2', category: 'debuff', description: '+30% daño por sangrados y Triturar' },
  ],
  'Druid/Cat': [
    MARCA_SALVAJE,
    ESTIMULAR,
    LIDER_MANADA,
    RENACER,
    { name: 'Destrozar', icon: 'ability_druid_mangle2', category: 'debuff', description: '+30% daño por sangrados y Triturar' },
  ],
  'Druid/Restoration': [
    MARCA_SALVAJE,
    ESTIMULAR,
    RENACER,
    { name: 'Árbol de vida', icon: 'ability_druid_treeoflife', category: 'aura', description: 'Aumenta la sanación recibida del grupo' },
  ],
};

// ── Helpers ──────────────────────────────────────────────────────────────────

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
    'Rogue/Dps': 'Asesinato/Combate',
    'Priest/Holy': 'Sagrado/Disciplina', 'Priest/Shadow': 'Sombras',
    'Shaman/Restoration': 'Restauración', 'Shaman/Elemental': 'Elemental', 'Shaman/Enhancement': 'Mejora',
    'Mage/Fire': 'Fuego', 'Mage/Arcane': 'Arcano', 'Mage/Frost': 'Escarcha',
    'Warlock/Destruction': 'Destrucción', 'Warlock/Affliction': 'Aflicción', 'Warlock/Demonology': 'Demonología',
    'Druid/Bear': 'Feral (Oso)', 'Druid/Restoration': 'Restauración', 'Druid/Cat': 'Feral (Gato)', 'Druid/Balance': 'Equilibrio',
  };

  const specKeys = CLASS_ROLE_MAP[charClass]?.[charRole] ?? [];
  return specKeys
    .map(k => ({ specKey: k, specLabel: SPEC_LABELS[k] ?? k.split('/')[1], buffs: SPEC_BUFFS[k] ?? [] }))
    .filter(s => s.buffs.length > 0);
}

/** Todas las specs de una clase sin filtrar por rol — para el selector manual de spec */
export function getAllSpecsForClass(charClass: string): { specKey: string; specLabel: string }[] {
  const CLASS_ALL_SPECS: Record<string, string[]> = {
    'Guerrero':  ['Warrior/Arms', 'Warrior/Fury', 'Warrior/Protection'],
    'Paladín':   ['Paladin/Holy', 'Paladin/Protection', 'Paladin/Retribution'],
    'Cazador':   ['Hunter/Marksmanship', 'Hunter/Beast Mastery', 'Hunter/Survival'],
    'Pícaro':    ['Rogue/Dps'],
    'Sacerdote': ['Priest/Holy', 'Priest/Shadow'],
    'Chamán':    ['Shaman/Restoration', 'Shaman/Elemental', 'Shaman/Enhancement'],
    'Mago':      ['Mage/Fire', 'Mage/Arcane', 'Mage/Frost'],
    'Brujo':     ['Warlock/Destruction', 'Warlock/Affliction', 'Warlock/Demonology'],
    'Druida':    ['Druid/Bear', 'Druid/Restoration', 'Druid/Cat', 'Druid/Balance'],
  };
  const SPEC_LABELS: Record<string, string> = {
    'Warrior/Arms': 'Armas', 'Warrior/Fury': 'Furia', 'Warrior/Protection': 'Protección',
    'Paladin/Holy': 'Sagrado', 'Paladin/Protection': 'Protección Paladín', 'Paladin/Retribution': 'Reprensión',
    'Hunter/Marksmanship': 'Puntería', 'Hunter/Beast Mastery': 'Dom. Bestias', 'Hunter/Survival': 'Supervivencia',
    'Rogue/Dps': 'Asesinato/Combate',
    'Priest/Holy': 'Sagrado/Disciplina', 'Priest/Shadow': 'Sombras',
    'Shaman/Restoration': 'Restauración', 'Shaman/Elemental': 'Elemental', 'Shaman/Enhancement': 'Mejora',
    'Mage/Fire': 'Fuego', 'Mage/Arcane': 'Arcano', 'Mage/Frost': 'Escarcha',
    'Warlock/Destruction': 'Destrucción', 'Warlock/Affliction': 'Aflicción', 'Warlock/Demonology': 'Demonología',
    'Druid/Bear': 'Feral (Oso)', 'Druid/Restoration': 'Restauración Druida', 'Druid/Cat': 'Feral (Gato)', 'Druid/Balance': 'Equilibrio',
  };
  return (CLASS_ALL_SPECS[charClass] ?? []).map(k => ({ specKey: k, specLabel: SPEC_LABELS[k] ?? k.split('/')[1] }));
}

/** Colores por categoría (usando paleta WoW clásica) */
export const BUFF_CATEGORY_COLORS: Record<BuffCategory, string> = {
  buff_ofensivo: '#FF4500',
  buff_defensivo: '#1E90FF',
  buff_mana:     '#32CD32',
  debuff:        '#BA55D3',
  aura:          '#FFD700',
  cooldown:      '#FF8C00',
};

export const BUFF_CATEGORY_LABELS: Record<BuffCategory, string> = {
  buff_ofensivo: 'Daño',
  buff_defensivo: 'Supervivencia',
  buff_mana:     'Recursos/Maná',
  debuff:        'Debuff Enemigo',
  aura:          'Aura Pasiva',
  cooldown:      'Habilidad Clave',
};
