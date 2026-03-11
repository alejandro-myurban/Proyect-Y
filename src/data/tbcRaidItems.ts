// TBC Classic Raid Item Database — generado por parse-atlasloot.mjs
// Fuente: AtlasLoot Enhanced (data-tbc.lua) + Wowhead TBC tooltip API
// Icons: https://wow.zamimg.com/images/wow/icons/medium/{icon}.jpg

export const TBC_RAIDS = ['Karazhan', "Gruul's Lair", 'Guarida de Magtheridon'];

export const QUALITY_COLORS = {
  uncommon: '#1eff00',
  rare:     '#0070dd',
  epic:     '#a335ee',
  legendary:'#ff8000',
};

export interface RaidItem {
  id: number;
  name: string;
  quality: 'uncommon' | 'rare' | 'epic' | 'legendary' | 'common';
  slot: string;
  boss: string;
  raid: string;
  icon: string;
}

const KZ = 'Karazhan';
const GR = "Gruul's Lair";
const MG = 'Guarida de Magtheridon';

export const TBC_RAID_ITEMS: RaidItem[] = [
  // ─── KARAZHAN ────────────────────────────────────────────────────

  // Attumen the Huntsman
  { id: 28477, name: 'Harbinger Bands'                            , quality: 'epic'      , slot: 'Muñecas'             , boss: 'Attumen the Huntsman'                , raid: KZ, icon: 'inv_bracer_13' },
  { id: 28507, name: 'Handwraps of Flowing Thought'               , quality: 'epic'      , slot: 'Manos'               , boss: 'Attumen the Huntsman'                , raid: KZ, icon: 'inv_gauntlets_17' },
  { id: 28508, name: 'Gloves of Saintly Blessings'                , quality: 'epic'      , slot: 'Manos'               , boss: 'Attumen the Huntsman'                , raid: KZ, icon: 'inv_gauntlets_17' },
  { id: 28453, name: 'Bracers of the White Stag'                  , quality: 'epic'      , slot: 'Muñecas'             , boss: 'Attumen the Huntsman'                , raid: KZ, icon: 'inv_bracer_02' },
  { id: 28506, name: 'Gloves of Dexterous Manipulation'           , quality: 'epic'      , slot: 'Manos'               , boss: 'Attumen the Huntsman'                , raid: KZ, icon: 'inv_gauntlets_28' },
  { id: 28503, name: 'Whirlwind Bracers'                          , quality: 'epic'      , slot: 'Muñecas'             , boss: 'Attumen the Huntsman'                , raid: KZ, icon: 'inv_bracer_02' },
  { id: 28454, name: "Stalker's War Bands"                        , quality: 'epic'      , slot: 'Muñecas'             , boss: 'Attumen the Huntsman'                , raid: KZ, icon: 'inv_bracer_02' },
  { id: 28502, name: 'Vambraces of Courage'                       , quality: 'epic'      , slot: 'Muñecas'             , boss: 'Attumen the Huntsman'                , raid: KZ, icon: 'inv_bracer_19' },
  { id: 28505, name: 'Gauntlets of Renewed Hope'                  , quality: 'epic'      , slot: 'Manos'               , boss: 'Attumen the Huntsman'                , raid: KZ, icon: 'inv_gauntlets_25' },
  { id: 28509, name: 'Worgen Claw Necklace'                       , quality: 'epic'      , slot: 'Cuello'              , boss: 'Attumen the Huntsman'                , raid: KZ, icon: 'inv_jewelry_necklace_22' },
  { id: 28510, name: 'Spectral Band of Innervation'               , quality: 'epic'      , slot: 'Anillo'              , boss: 'Attumen the Huntsman'                , raid: KZ, icon: 'inv_jewelry_ring_31' },
  { id: 28504, name: 'Steelhawk Crossbow'                         , quality: 'epic'      , slot: 'A distancia'         , boss: 'Attumen the Huntsman'                , raid: KZ, icon: 'inv_weapon_crossbow_18' },
  { id: 30480, name: "Fiery Warhorse's Reins"                     , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'Attumen the Huntsman'                , raid: KZ, icon: 'ability_mount_dreadsteed' },
  { id: 23809, name: 'Schematic: Stabilized Eternium Scope'       , quality: 'rare'      , slot: 'Miscelánea'          , boss: 'Attumen the Huntsman'                , raid: KZ, icon: 'inv_scroll_05' },

  // Rokad the Ravager
  { id: 30684, name: "Ravager's Cuffs"                            , quality: 'epic'      , slot: 'Muñecas'             , boss: 'Rokad the Ravager'                   , raid: KZ, icon: 'inv_bracer_10' },
  { id: 30685, name: "Ravager's Wrist-Wraps"                      , quality: 'epic'      , slot: 'Muñecas'             , boss: 'Rokad the Ravager'                   , raid: KZ, icon: 'inv_bracer_07' },
  { id: 30686, name: "Ravager's Bands"                            , quality: 'epic'      , slot: 'Muñecas'             , boss: 'Rokad the Ravager'                   , raid: KZ, icon: 'inv_bracer_02' },
  { id: 30687, name: "Ravager's Bracers"                          , quality: 'epic'      , slot: 'Muñecas'             , boss: 'Rokad the Ravager'                   , raid: KZ, icon: 'inv_bracer_07' },

  // Shadikith the Glider
  { id: 30680, name: "Glider's Foot-Wraps"                        , quality: 'epic'      , slot: 'Pies'                , boss: 'Shadikith the Glider'                , raid: KZ, icon: 'inv_boots_05' },
  { id: 30681, name: "Glider's Boots"                             , quality: 'epic'      , slot: 'Pies'                , boss: 'Shadikith the Glider'                , raid: KZ, icon: 'inv_boots_05' },
  { id: 30682, name: "Glider's Sabatons"                          , quality: 'epic'      , slot: 'Pies'                , boss: 'Shadikith the Glider'                , raid: KZ, icon: 'inv_boots_chain_05' },
  { id: 30683, name: "Glider's Greaves"                           , quality: 'epic'      , slot: 'Pies'                , boss: 'Shadikith the Glider'                , raid: KZ, icon: 'inv_boots_plate_04' },

  // Hyakiss the Lurker
  { id: 30675, name: "Lurker's Cord"                              , quality: 'epic'      , slot: 'Cintura'             , boss: 'Hyakiss the Lurker'                  , raid: KZ, icon: 'inv_belt_03' },
  { id: 30676, name: "Lurker's Grasp"                             , quality: 'epic'      , slot: 'Cintura'             , boss: 'Hyakiss the Lurker'                  , raid: KZ, icon: 'inv_belt_25' },
  { id: 30677, name: "Lurker's Belt"                              , quality: 'epic'      , slot: 'Cintura'             , boss: 'Hyakiss the Lurker'                  , raid: KZ, icon: 'inv_belt_03' },
  { id: 30678, name: "Lurker's Girdle"                            , quality: 'epic'      , slot: 'Cintura'             , boss: 'Hyakiss the Lurker'                  , raid: KZ, icon: 'inv_belt_22' },

  // Moroes
  { id: 28529, name: 'Royal Cloak of Arathi Kings'                , quality: 'epic'      , slot: 'Capa'                , boss: 'Moroes'                              , raid: KZ, icon: 'inv_misc_cape_10' },
  { id: 28570, name: 'Shadow-Cloak of Dalaran'                    , quality: 'epic'      , slot: 'Capa'                , boss: 'Moroes'                              , raid: KZ, icon: 'inv_misc_cape_20' },
  { id: 28565, name: 'Nethershard Girdle'                         , quality: 'epic'      , slot: 'Cintura'             , boss: 'Moroes'                              , raid: KZ, icon: 'inv_belt_08' },
  { id: 28545, name: 'Edgewalker Longboots'                       , quality: 'epic'      , slot: 'Pies'                , boss: 'Moroes'                              , raid: KZ, icon: 'inv_boots_plate_06' },
  { id: 28567, name: 'Belt of Gale Force'                         , quality: 'epic'      , slot: 'Cintura'             , boss: 'Moroes'                              , raid: KZ, icon: 'inv_belt_22' },
  { id: 28566, name: 'Crimson Girdle of the Indomitable'          , quality: 'epic'      , slot: 'Cintura'             , boss: 'Moroes'                              , raid: KZ, icon: 'inv_belt_27' },
  { id: 28569, name: 'Boots of Valiance'                          , quality: 'epic'      , slot: 'Pies'                , boss: 'Moroes'                              , raid: KZ, icon: 'inv_boots_chain_05' },
  { id: 28530, name: 'Brooch of Unquenchable Fury'                , quality: 'epic'      , slot: 'Cuello'              , boss: 'Moroes'                              , raid: KZ, icon: 'inv_jewelry_necklace_ahnqiraj_04' },
  { id: 28528, name: "Moroes' Lucky Pocket Watch"                 , quality: 'epic'      , slot: 'Reliquia'            , boss: 'Moroes'                              , raid: KZ, icon: 'inv_misc_pocketwatch_02' },
  { id: 28525, name: 'Signet of Unshakable Faith'                 , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'Moroes'                              , raid: KZ, icon: 'inv_jewelry_ring_60' },
  { id: 28568, name: 'Idol of the Avian Heart'                    , quality: 'epic'      , slot: 'Reliquia'            , boss: 'Moroes'                              , raid: KZ, icon: 'inv_misc_thegoldencheep' },
  { id: 28524, name: 'Emerald Ripper'                             , quality: 'epic'      , slot: 'Arma (1 mano)'       , boss: 'Moroes'                              , raid: KZ, icon: 'inv_weapon_shortblade_38' },
  { id: 22559, name: 'Formula: Enchant Weapon - Mongoose'         , quality: 'rare'      , slot: 'Miscelánea'          , boss: 'Moroes'                              , raid: KZ, icon: 'inv_misc_note_01' },

  // Maiden of Virtue
  { id: 28511, name: 'Bands of Indwelling'                        , quality: 'epic'      , slot: 'Muñecas'             , boss: 'Maiden of Virtue'                    , raid: KZ, icon: 'inv_bracer_13' },
  { id: 28515, name: 'Bands of Nefarious Deeds'                   , quality: 'epic'      , slot: 'Muñecas'             , boss: 'Maiden of Virtue'                    , raid: KZ, icon: 'inv_bracer_13' },
  { id: 28517, name: 'Boots of Foretelling'                       , quality: 'epic'      , slot: 'Pies'                , boss: 'Maiden of Virtue'                    , raid: KZ, icon: 'inv_boots_cloth_05' },
  { id: 28514, name: 'Bracers of Maliciousness'                   , quality: 'epic'      , slot: 'Muñecas'             , boss: 'Maiden of Virtue'                    , raid: KZ, icon: 'inv_bracer_15' },
  { id: 28521, name: 'Mitts of the Treemender'                    , quality: 'epic'      , slot: 'Manos'               , boss: 'Maiden of Virtue'                    , raid: KZ, icon: 'inv_gauntlets_25' },
  { id: 28520, name: 'Gloves of Centering'                        , quality: 'epic'      , slot: 'Manos'               , boss: 'Maiden of Virtue'                    , raid: KZ, icon: 'inv_gauntlets_25' },
  { id: 28519, name: 'Gloves of Quickening'                       , quality: 'epic'      , slot: 'Manos'               , boss: 'Maiden of Virtue'                    , raid: KZ, icon: 'inv_gauntlets_25' },
  { id: 28512, name: 'Bracers of Justice'                         , quality: 'epic'      , slot: 'Muñecas'             , boss: 'Maiden of Virtue'                    , raid: KZ, icon: 'inv_bracer_02' },
  { id: 28518, name: 'Iron Gauntlets of the Maiden'               , quality: 'epic'      , slot: 'Manos'               , boss: 'Maiden of Virtue'                    , raid: KZ, icon: 'inv_gauntlets_31' },
  { id: 28516, name: 'Barbed Choker of Discipline'                , quality: 'epic'      , slot: 'Cuello'              , boss: 'Maiden of Virtue'                    , raid: KZ, icon: 'inv_jewelry_necklace_ahnqiraj_02' },
  { id: 28523, name: 'Totem of Healing Rains'                     , quality: 'epic'      , slot: 'Reliquia'            , boss: 'Maiden of Virtue'                    , raid: KZ, icon: 'spell_nature_giftofthewaterspirit' },
  { id: 28522, name: 'Shard of the Virtuous'                      , quality: 'epic'      , slot: 'Arma principal'      , boss: 'Maiden of Virtue'                    , raid: KZ, icon: 'inv_hammer_26' },

  // The Wizard of Oz
  { id: 28586, name: "Wicked Witch's Hat"                         , quality: 'epic'      , slot: 'Cabeza'              , boss: 'The Wizard of Oz'                    , raid: KZ, icon: 'inv_helmet_30' },
  { id: 28585, name: 'Ruby Slippers'                              , quality: 'epic'      , slot: 'Pies'                , boss: 'The Wizard of Oz'                    , raid: KZ, icon: 'inv_boots_cloth_09' },
  { id: 28587, name: 'Legacy'                                     , quality: 'epic'      , slot: 'Dos manos'           , boss: 'The Wizard of Oz'                    , raid: KZ, icon: 'inv_axe_46' },
  { id: 28588, name: 'Blue Diamond Witchwand'                     , quality: 'epic'      , slot: 'A distancia'         , boss: 'The Wizard of Oz'                    , raid: KZ, icon: 'inv_wand_16' },
  { id: 28594, name: 'Trial-Fire Trousers'                        , quality: 'epic'      , slot: 'Piernas'             , boss: 'The Wizard of Oz'                    , raid: KZ, icon: 'inv_pants_cloth_05' },
  { id: 28591, name: 'Earthsoul Leggings'                         , quality: 'epic'      , slot: 'Piernas'             , boss: 'The Wizard of Oz'                    , raid: KZ, icon: 'inv_pants_mail_15' },
  { id: 28589, name: 'Beastmaw Pauldrons'                         , quality: 'epic'      , slot: 'Hombros'             , boss: 'The Wizard of Oz'                    , raid: KZ, icon: 'inv_shoulder_36' },
  { id: 28593, name: 'Eternium Greathelm'                         , quality: 'epic'      , slot: 'Cabeza'              , boss: 'The Wizard of Oz'                    , raid: KZ, icon: 'inv_helmet_03' },
  { id: 28590, name: 'Ribbon of Sacrifice'                        , quality: 'epic'      , slot: 'Reliquia'            , boss: 'The Wizard of Oz'                    , raid: KZ, icon: 'inv_misc_bandage_16' },
  { id: 28592, name: 'Libram of Souls Redeemed'                   , quality: 'epic'      , slot: 'Reliquia'            , boss: 'The Wizard of Oz'                    , raid: KZ, icon: 'inv_relics_libramofgrace' },

  // The Big Bad Wolf
  { id: 28582, name: "Red Riding Hood's Cloak"                    , quality: 'epic'      , slot: 'Capa'                , boss: 'The Big Bad Wolf'                    , raid: KZ, icon: 'inv_misc_cape_18' },
  { id: 28583, name: "Big Bad Wolf's Head"                        , quality: 'epic'      , slot: 'Cabeza'              , boss: 'The Big Bad Wolf'                    , raid: KZ, icon: 'inv_helmet_04' },
  { id: 28584, name: "Big Bad Wolf's Paw"                         , quality: 'epic'      , slot: 'Arma principal'      , boss: 'The Big Bad Wolf'                    , raid: KZ, icon: 'inv_misc_monsterclaw_04' },
  { id: 28581, name: 'Wolfslayer Sniper Rifle'                    , quality: 'epic'      , slot: 'A distancia'         , boss: 'The Big Bad Wolf'                    , raid: KZ, icon: 'inv_weapon_rifle_23' },
  { id: 28594, name: 'Trial-Fire Trousers'                        , quality: 'epic'      , slot: 'Piernas'             , boss: 'The Big Bad Wolf'                    , raid: KZ, icon: 'inv_pants_cloth_05' },
  { id: 28591, name: 'Earthsoul Leggings'                         , quality: 'epic'      , slot: 'Piernas'             , boss: 'The Big Bad Wolf'                    , raid: KZ, icon: 'inv_pants_mail_15' },
  { id: 28589, name: 'Beastmaw Pauldrons'                         , quality: 'epic'      , slot: 'Hombros'             , boss: 'The Big Bad Wolf'                    , raid: KZ, icon: 'inv_shoulder_36' },
  { id: 28593, name: 'Eternium Greathelm'                         , quality: 'epic'      , slot: 'Cabeza'              , boss: 'The Big Bad Wolf'                    , raid: KZ, icon: 'inv_helmet_03' },
  { id: 28590, name: 'Ribbon of Sacrifice'                        , quality: 'epic'      , slot: 'Reliquia'            , boss: 'The Big Bad Wolf'                    , raid: KZ, icon: 'inv_misc_bandage_16' },
  { id: 28592, name: 'Libram of Souls Redeemed'                   , quality: 'epic'      , slot: 'Reliquia'            , boss: 'The Big Bad Wolf'                    , raid: KZ, icon: 'inv_relics_libramofgrace' },

  // Romulo and Julianne
  { id: 28578, name: 'Masquerade Gown'                            , quality: 'epic'      , slot: 'Pecho'               , boss: 'Romulo and Julianne'                 , raid: KZ, icon: 'inv_chest_cloth_43' },
  { id: 28579, name: "Romulo's Poison Vial"                       , quality: 'epic'      , slot: 'Reliquia'            , boss: 'Romulo and Julianne'                 , raid: KZ, icon: 'inv_poison_mindnumbing' },
  { id: 28572, name: 'Blade of the Unrequited'                    , quality: 'epic'      , slot: 'Arma (1 mano)'       , boss: 'Romulo and Julianne'                 , raid: KZ, icon: 'inv_weapon_shortblade_39' },
  { id: 28573, name: 'Despair'                                    , quality: 'epic'      , slot: 'Dos manos'           , boss: 'Romulo and Julianne'                 , raid: KZ, icon: 'inv_sword_69' },
  { id: 28594, name: 'Trial-Fire Trousers'                        , quality: 'epic'      , slot: 'Piernas'             , boss: 'Romulo and Julianne'                 , raid: KZ, icon: 'inv_pants_cloth_05' },
  { id: 28591, name: 'Earthsoul Leggings'                         , quality: 'epic'      , slot: 'Piernas'             , boss: 'Romulo and Julianne'                 , raid: KZ, icon: 'inv_pants_mail_15' },
  { id: 28589, name: 'Beastmaw Pauldrons'                         , quality: 'epic'      , slot: 'Hombros'             , boss: 'Romulo and Julianne'                 , raid: KZ, icon: 'inv_shoulder_36' },
  { id: 28593, name: 'Eternium Greathelm'                         , quality: 'epic'      , slot: 'Cabeza'              , boss: 'Romulo and Julianne'                 , raid: KZ, icon: 'inv_helmet_03' },
  { id: 28590, name: 'Ribbon of Sacrifice'                        , quality: 'epic'      , slot: 'Reliquia'            , boss: 'Romulo and Julianne'                 , raid: KZ, icon: 'inv_misc_bandage_16' },
  { id: 28592, name: 'Libram of Souls Redeemed'                   , quality: 'epic'      , slot: 'Reliquia'            , boss: 'Romulo and Julianne'                 , raid: KZ, icon: 'inv_relics_libramofgrace' },

  // The Curator
  { id: 28612, name: 'Pauldrons of the Solace-Giver'              , quality: 'epic'      , slot: 'Hombros'             , boss: 'The Curator'                         , raid: KZ, icon: 'inv_shoulder_25' },
  { id: 28647, name: 'Forest Wind Shoulderpads'                   , quality: 'epic'      , slot: 'Hombros'             , boss: 'The Curator'                         , raid: KZ, icon: 'inv_shoulder_01' },
  { id: 28631, name: 'Dragon-Quake Shoulderguards'                , quality: 'epic'      , slot: 'Hombros'             , boss: 'The Curator'                         , raid: KZ, icon: 'inv_shoulder_14' },
  { id: 28621, name: 'Wrynn Dynasty Greaves'                      , quality: 'epic'      , slot: 'Piernas'             , boss: 'The Curator'                         , raid: KZ, icon: 'inv_pants_plate_05' },
  { id: 28649, name: "Garona's Signet Ring"                       , quality: 'epic'      , slot: 'Anillo'              , boss: 'The Curator'                         , raid: KZ, icon: 'inv_jewelry_ring_47' },
  { id: 28633, name: 'Staff of Infinite Mysteries'                , quality: 'epic'      , slot: 'Dos manos'           , boss: 'The Curator'                         , raid: KZ, icon: 'inv_weapon_halberd17' },
  { id: 29757, name: 'Gloves of the Fallen Champion'              , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'The Curator'                         , raid: KZ, icon: 'inv_gauntlets_27' },
  { id: 29758, name: 'Gloves of the Fallen Defender'              , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'The Curator'                         , raid: KZ, icon: 'inv_gauntlets_27' },
  { id: 29756, name: 'Gloves of the Fallen Hero'                  , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'The Curator'                         , raid: KZ, icon: 'inv_gauntlets_27' },

  // Terestian Illhoof
  { id: 28660, name: 'Gilded Thorium Cloak'                       , quality: 'epic'      , slot: 'Capa'                , boss: 'Terestian Illhoof'                   , raid: KZ, icon: 'inv_misc_cape_20' },
  { id: 28653, name: 'Shadowvine Cloak of Infusion'               , quality: 'epic'      , slot: 'Capa'                , boss: 'Terestian Illhoof'                   , raid: KZ, icon: 'inv_misc_cape_05' },
  { id: 28652, name: 'Cincture of Will'                           , quality: 'epic'      , slot: 'Cintura'             , boss: 'Terestian Illhoof'                   , raid: KZ, icon: 'inv_belt_08' },
  { id: 28654, name: 'Malefic Girdle'                             , quality: 'epic'      , slot: 'Cintura'             , boss: 'Terestian Illhoof'                   , raid: KZ, icon: 'inv_belt_03' },
  { id: 28655, name: "Cord of Nature's Sustenance"                , quality: 'epic'      , slot: 'Cintura'             , boss: 'Terestian Illhoof'                   , raid: KZ, icon: 'inv_belt_22' },
  { id: 28656, name: 'Girdle of the Prowler'                      , quality: 'epic'      , slot: 'Cintura'             , boss: 'Terestian Illhoof'                   , raid: KZ, icon: 'inv_belt_22' },
  { id: 28662, name: 'Breastplate of the Lightbinder'             , quality: 'epic'      , slot: 'Pecho'               , boss: 'Terestian Illhoof'                   , raid: KZ, icon: 'inv_chest_plate03' },
  { id: 28661, name: "Mender's Heart-Ring"                        , quality: 'epic'      , slot: 'Anillo'              , boss: 'Terestian Illhoof'                   , raid: KZ, icon: 'inv_jewelry_ring_36' },
  { id: 28785, name: 'The Lightning Capacitor'                    , quality: 'epic'      , slot: 'Reliquia'            , boss: 'Terestian Illhoof'                   , raid: KZ, icon: 'inv_trinket_naxxramas06' },
  { id: 28657, name: "Fool's Bane"                                , quality: 'epic'      , slot: 'Arma principal'      , boss: 'Terestian Illhoof'                   , raid: KZ, icon: 'inv_weapon_shortblade_44' },
  { id: 28658, name: "Terestian's Stranglestaff"                  , quality: 'epic'      , slot: 'Dos manos'           , boss: 'Terestian Illhoof'                   , raid: KZ, icon: 'inv_staff_55' },
  { id: 28659, name: 'Xavian Stiletto'                            , quality: 'epic'      , slot: 'A distancia'         , boss: 'Terestian Illhoof'                   , raid: KZ, icon: 'inv_weapon_shortblade_35' },
  { id: 22561, name: 'Formula: Enchant Weapon - Soulfrost'        , quality: 'rare'      , slot: 'Miscelánea'          , boss: 'Terestian Illhoof'                   , raid: KZ, icon: 'inv_misc_note_01' },

  // Shade of Aran
  { id: 28672, name: 'Drape of the Dark Reavers'                  , quality: 'epic'      , slot: 'Capa'                , boss: 'Shade of Aran'                       , raid: KZ, icon: 'inv_misc_cape_10' },
  { id: 28726, name: 'Mantle of the Mind Flayer'                  , quality: 'epic'      , slot: 'Hombros'             , boss: 'Shade of Aran'                       , raid: KZ, icon: 'inv_shoulder_25' },
  { id: 28670, name: 'Boots of the Infernal Coven'                , quality: 'epic'      , slot: 'Pies'                , boss: 'Shade of Aran'                       , raid: KZ, icon: 'inv_boots_05' },
  { id: 28663, name: 'Boots of the Incorrupt'                     , quality: 'epic'      , slot: 'Pies'                , boss: 'Shade of Aran'                       , raid: KZ, icon: 'inv_boots_fabric_01' },
  { id: 28669, name: 'Rapscallion Boots'                          , quality: 'epic'      , slot: 'Pies'                , boss: 'Shade of Aran'                       , raid: KZ, icon: 'inv_boots_plate_06' },
  { id: 28671, name: 'Steelspine Faceguard'                       , quality: 'epic'      , slot: 'Cabeza'              , boss: 'Shade of Aran'                       , raid: KZ, icon: 'inv_helmet_05' },
  { id: 28666, name: 'Pauldrons of the Justice-Seeker'            , quality: 'epic'      , slot: 'Hombros'             , boss: 'Shade of Aran'                       , raid: KZ, icon: 'inv_shoulder_35' },
  { id: 23933, name: "Medivh's Journal"                           , quality: 'common'    , slot: 'Miscelánea'          , boss: 'Shade of Aran'                       , raid: KZ, icon: 'inv_misc_book_06' },
  { id: 28674, name: 'Saberclaw Talisman'                         , quality: 'epic'      , slot: 'Cuello'              , boss: 'Shade of Aran'                       , raid: KZ, icon: 'inv_jewelry_necklace_34' },
  { id: 28675, name: 'Shermanar Great-Ring'                       , quality: 'epic'      , slot: 'Anillo'              , boss: 'Shade of Aran'                       , raid: KZ, icon: 'inv_jewelry_ring_19' },
  { id: 28727, name: 'Pendant of the Violet Eye'                  , quality: 'epic'      , slot: 'Reliquia'            , boss: 'Shade of Aran'                       , raid: KZ, icon: 'inv_trinket_naxxramas02' },
  { id: 28728, name: "Aran's Soothing Sapphire"                   , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'Shade of Aran'                       , raid: KZ, icon: 'inv_misc_gem_sapphire_02' },
  { id: 28673, name: 'Tirisfal Wand of Ascendancy'                , quality: 'epic'      , slot: 'A distancia'         , boss: 'Shade of Aran'                       , raid: KZ, icon: 'inv_wand_21' },
  { id: 22560, name: 'Formula: Enchant Weapon - Sunfire'          , quality: 'rare'      , slot: 'Miscelánea'          , boss: 'Shade of Aran'                       , raid: KZ, icon: 'inv_misc_note_01' },

  // Netherspite
  { id: 28744, name: 'Uni-Mind Headdress'                         , quality: 'epic'      , slot: 'Cabeza'              , boss: 'Netherspite'                         , raid: KZ, icon: 'inv_helmet_53' },
  { id: 28742, name: 'Pantaloons of Repentance'                   , quality: 'epic'      , slot: 'Piernas'             , boss: 'Netherspite'                         , raid: KZ, icon: 'inv_pants_cloth_13' },
  { id: 28732, name: 'Cowl of Defiance'                           , quality: 'epic'      , slot: 'Cabeza'              , boss: 'Netherspite'                         , raid: KZ, icon: 'inv_helmet_58' },
  { id: 28741, name: "Skulker's Greaves"                          , quality: 'epic'      , slot: 'Piernas'             , boss: 'Netherspite'                         , raid: KZ, icon: 'inv_pants_leather_13' },
  { id: 28735, name: 'Earthblood Chestguard'                      , quality: 'epic'      , slot: 'Pecho'               , boss: 'Netherspite'                         , raid: KZ, icon: 'inv_chest_plate08' },
  { id: 28740, name: 'Rip-Flayer Leggings'                        , quality: 'epic'      , slot: 'Piernas'             , boss: 'Netherspite'                         , raid: KZ, icon: 'inv_pants_plate_02' },
  { id: 28743, name: 'Mantle of Abrahmis'                         , quality: 'epic'      , slot: 'Hombros'             , boss: 'Netherspite'                         , raid: KZ, icon: 'inv_shoulder_29' },
  { id: 28733, name: 'Girdle of Truth'                            , quality: 'epic'      , slot: 'Cintura'             , boss: 'Netherspite'                         , raid: KZ, icon: 'inv_belt_22' },
  { id: 28731, name: 'Shining Chain of the Afterworld'            , quality: 'epic'      , slot: 'Cuello'              , boss: 'Netherspite'                         , raid: KZ, icon: 'inv_jewelry_necklace_32' },
  { id: 28730, name: 'Mithril Band of the Unscarred'              , quality: 'epic'      , slot: 'Anillo'              , boss: 'Netherspite'                         , raid: KZ, icon: 'inv_jewelry_ring_24' },
  { id: 28734, name: 'Jewel of Infinite Possibilities'            , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'Netherspite'                         , raid: KZ, icon: 'inv_misc_gem_ebondraenite_02' },
  { id: 28729, name: 'Spiteblade'                                 , quality: 'epic'      , slot: 'Arma (1 mano)'       , boss: 'Netherspite'                         , raid: KZ, icon: 'inv_sword_74' },

  // Chess Event
  { id: 28756, name: 'Headdress of the High Potentate'            , quality: 'epic'      , slot: 'Cabeza'              , boss: 'Chess Event'                         , raid: KZ, icon: 'inv_crown_01' },
  { id: 28755, name: 'Bladed Shoulderpads of the Merciless'       , quality: 'epic'      , slot: 'Hombros'             , boss: 'Chess Event'                         , raid: KZ, icon: 'inv_shoulder_29' },
  { id: 28750, name: 'Girdle of Treachery'                        , quality: 'epic'      , slot: 'Cintura'             , boss: 'Chess Event'                         , raid: KZ, icon: 'inv_belt_26' },
  { id: 28752, name: 'Forestlord Striders'                        , quality: 'epic'      , slot: 'Pies'                , boss: 'Chess Event'                         , raid: KZ, icon: 'inv_boots_chain_05' },
  { id: 28751, name: 'Heart-Flame Leggings'                       , quality: 'epic'      , slot: 'Piernas'             , boss: 'Chess Event'                         , raid: KZ, icon: 'inv_pants_mail_15' },
  { id: 28746, name: 'Fiend Slayer Boots'                         , quality: 'epic'      , slot: 'Pies'                , boss: 'Chess Event'                         , raid: KZ, icon: 'inv_boots_chain_05' },
  { id: 28748, name: 'Legplates of the Innocent'                  , quality: 'epic'      , slot: 'Piernas'             , boss: 'Chess Event'                         , raid: KZ, icon: 'inv_pants_plate_18' },
  { id: 28747, name: 'Battlescar Boots'                           , quality: 'epic'      , slot: 'Pies'                , boss: 'Chess Event'                         , raid: KZ, icon: 'inv_boots_plate_06' },
  { id: 28745, name: 'Mithril Chain of Heroism'                   , quality: 'epic'      , slot: 'Cuello'              , boss: 'Chess Event'                         , raid: KZ, icon: 'inv_jewelry_necklace_06' },
  { id: 28753, name: 'Ring of Recurrence'                         , quality: 'epic'      , slot: 'Anillo'              , boss: 'Chess Event'                         , raid: KZ, icon: 'inv_jewelry_ring_15' },
  { id: 28749, name: "King's Defender"                            , quality: 'epic'      , slot: 'Arma (1 mano)'       , boss: 'Chess Event'                         , raid: KZ, icon: 'inv_sword_74' },
  { id: 28754, name: 'Triptych Shield of the Ancients'            , quality: 'epic'      , slot: 'Mano izq.'           , boss: 'Chess Event'                         , raid: KZ, icon: 'inv_shield_31' },

  // Prince Malchezaar
  { id: 28765, name: 'Stainless Cloak of the Pure Hearted'        , quality: 'epic'      , slot: 'Capa'                , boss: 'Prince Malchezaar'                   , raid: KZ, icon: 'inv_misc_cape_06' },
  { id: 28766, name: 'Ruby Drape of the Mysticant'                , quality: 'epic'      , slot: 'Capa'                , boss: 'Prince Malchezaar'                   , raid: KZ, icon: 'inv_misc_cape_18' },
  { id: 28764, name: 'Farstrider Wildercloak'                     , quality: 'epic'      , slot: 'Capa'                , boss: 'Prince Malchezaar'                   , raid: KZ, icon: 'inv_misc_cape_17' },
  { id: 28762, name: 'Adornment of Stolen Souls'                  , quality: 'epic'      , slot: 'Cuello'              , boss: 'Prince Malchezaar'                   , raid: KZ, icon: 'inv_jewelry_necklace_29naxxramas' },
  { id: 28763, name: 'Jade Ring of the Everliving'                , quality: 'epic'      , slot: 'Anillo'              , boss: 'Prince Malchezaar'                   , raid: KZ, icon: 'inv_jewelry_ring_08' },
  { id: 28757, name: 'Ring of a Thousand Marks'                   , quality: 'epic'      , slot: 'Anillo'              , boss: 'Prince Malchezaar'                   , raid: KZ, icon: 'inv_jewelry_ring_ahnqiraj_05' },
  { id: 28770, name: 'Nathrezim Mindblade'                        , quality: 'epic'      , slot: 'Arma principal'      , boss: 'Prince Malchezaar'                   , raid: KZ, icon: 'inv_weapon_shortblade_41' },
  { id: 28768, name: 'Malchazeen'                                 , quality: 'epic'      , slot: 'Arma (1 mano)'       , boss: 'Prince Malchezaar'                   , raid: KZ, icon: 'inv_weapon_shortblade_40' },
  { id: 28767, name: 'The Decapitator'                            , quality: 'epic'      , slot: 'Arma principal'      , boss: 'Prince Malchezaar'                   , raid: KZ, icon: 'inv_axe_66' },
  { id: 28773, name: 'Gorehowl'                                   , quality: 'epic'      , slot: 'Dos manos'           , boss: 'Prince Malchezaar'                   , raid: KZ, icon: 'inv_axe_60' },
  { id: 28771, name: "Light's Justice"                            , quality: 'epic'      , slot: 'Arma principal'      , boss: 'Prince Malchezaar'                   , raid: KZ, icon: 'inv_mace_46' },
  { id: 28772, name: 'Sunfury Bow of the Phoenix'                 , quality: 'epic'      , slot: 'A distancia'         , boss: 'Prince Malchezaar'                   , raid: KZ, icon: 'inv_weapon_bow_18' },
  { id: 29760, name: 'Helm of the Fallen Champion'                , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'Prince Malchezaar'                   , raid: KZ, icon: 'inv_helmet_24' },
  { id: 29761, name: 'Helm of the Fallen Defender'                , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'Prince Malchezaar'                   , raid: KZ, icon: 'inv_helmet_24' },
  { id: 29759, name: 'Helm of the Fallen Hero'                    , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'Prince Malchezaar'                   , raid: KZ, icon: 'inv_helmet_24' },

  // Nightbane
  { id: 28602, name: 'Robe of the Elder Scribes'                  , quality: 'epic'      , slot: 'Pecho'               , boss: 'Nightbane'                           , raid: KZ, icon: 'inv_chest_cloth_12' },
  { id: 28600, name: 'Stonebough Jerkin'                          , quality: 'epic'      , slot: 'Pecho'               , boss: 'Nightbane'                           , raid: KZ, icon: 'inv_chest_leather_07' },
  { id: 28601, name: 'Chestguard of the Conniver'                 , quality: 'epic'      , slot: 'Pecho'               , boss: 'Nightbane'                           , raid: KZ, icon: 'inv_chest_leather_06' },
  { id: 28599, name: 'Scaled Breastplate of Carnage'              , quality: 'epic'      , slot: 'Pecho'               , boss: 'Nightbane'                           , raid: KZ, icon: 'inv_chest_chain_07' },
  { id: 28610, name: 'Ferocious Swift-Kickers'                    , quality: 'epic'      , slot: 'Pies'                , boss: 'Nightbane'                           , raid: KZ, icon: 'inv_boots_chain_04' },
  { id: 28597, name: "Panzar'Thar Breastplate"                    , quality: 'epic'      , slot: 'Pecho'               , boss: 'Nightbane'                           , raid: KZ, icon: 'inv_chest_plate02' },
  { id: 28608, name: 'Ironstriders of Urgency'                    , quality: 'epic'      , slot: 'Pies'                , boss: 'Nightbane'                           , raid: KZ, icon: 'inv_boots_plate_04' },
  { id: 31751, name: 'Blazing Signet'                             , quality: 'common'    , slot: 'Miscelánea'          , boss: 'Nightbane'                           , raid: KZ, icon: 'spell_fire_burnout' },
  { id: 24139, name: 'Faint Arcane Essence'                       , quality: 'common'    , slot: 'Miscelánea'          , boss: 'Nightbane'                           , raid: KZ, icon: 'inv_enchant_essencemagicsmall' },
  { id: 28609, name: 'Emberspur Talisman'                         , quality: 'epic'      , slot: 'Cuello'              , boss: 'Nightbane'                           , raid: KZ, icon: 'inv_jewelry_necklace_17' },
  { id: 28603, name: 'Talisman of Nightbane'                      , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'Nightbane'                           , raid: KZ, icon: 'inv_offhand_outlandraid_01' },
  { id: 28604, name: 'Nightstaff of the Everliving'               , quality: 'epic'      , slot: 'Dos manos'           , boss: 'Nightbane'                           , raid: KZ, icon: 'inv_staff_57' },
  { id: 28611, name: 'Dragonheart Flameshield'                    , quality: 'epic'      , slot: 'Mano izq.'           , boss: 'Nightbane'                           , raid: KZ, icon: 'inv_shield_37' },
  { id: 28606, name: 'Shield of Impenetrable Darkness'            , quality: 'epic'      , slot: 'Mano izq.'           , boss: 'Nightbane'                           , raid: KZ, icon: 'inv_shield_29' },
  // ─── GUARIDA DE MAGTHERIDON ──────────────────────────────────────

  // Magtheridon
  { id: 28777, name: 'Cloak of the Pit Stalker'                   , quality: 'epic'      , slot: 'Capa'                , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_misc_cape_14' },
  { id: 28780, name: "Soul-Eater's Handwraps"                     , quality: 'epic'      , slot: 'Manos'               , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_gauntlets_15' },
  { id: 28776, name: "Liar's Tongue Gloves"                       , quality: 'epic'      , slot: 'Manos'               , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_gauntlets_19' },
  { id: 28778, name: 'Terror Pit Girdle'                          , quality: 'epic'      , slot: 'Cintura'             , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_belt_20' },
  { id: 28775, name: 'Thundering Greathelm'                       , quality: 'epic'      , slot: 'Cabeza'              , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_helmet_58' },
  { id: 28779, name: 'Girdle of the Endless Pit'                  , quality: 'epic'      , slot: 'Cintura'             , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_belt_22' },
  { id: 28789, name: 'Eye of Magtheridon'                         , quality: 'epic'      , slot: 'Reliquia'            , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_elemental_mote_life01' },
  { id: 28781, name: 'Karaborian Talisman'                        , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_offhand_draenei_a_01' },
  { id: 28774, name: 'Glaive of the Pit'                          , quality: 'epic'      , slot: 'Dos manos'           , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_weapon_halberd16' },
  { id: 28782, name: 'Crystalheart Pulse-Staff'                   , quality: 'epic'      , slot: 'Dos manos'           , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_staff_53' },
  { id: 29458, name: 'Aegis of the Vindicator'                    , quality: 'epic'      , slot: 'Mano izq.'           , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_shield_33' },
  { id: 28783, name: 'Eredar Wand of Obliteration'                , quality: 'epic'      , slot: 'A distancia'         , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_wand_20' },
  { id: 29754, name: 'Chestguard of the Fallen Champion'          , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_chest_chain_03' },
  { id: 29753, name: 'Chestguard of the Fallen Defender'          , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_chest_chain_03' },
  { id: 29755, name: 'Chestguard of the Fallen Hero'              , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_chest_chain_03' },
  { id: 32385, name: "Magtheridon's Head"                         , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_misc_head_tauren_01' },
  { id: 34845, name: "Pit Lord's Satchel"                         , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_misc_bag_enchantedrunecloth' },
  { id: 34846, name: 'Black Sack of Gems'                         , quality: 'uncommon'  , slot: 'Miscelánea'          , boss: 'Magtheridon'                         , raid: MG, icon: 'inv_misc_bag_10_black' },
  // ─── GRUUL'S LAIR ────────────────────────────────────────────────

  // High King Maulgar
  { id: 28797, name: 'Brute Cloak of the Ogre-Magi'               , quality: 'epic'      , slot: 'Capa'                , boss: 'High King Maulgar'                   , raid: GR, icon: 'inv_misc_cape_16' },
  { id: 28799, name: 'Belt of Divine Inspiration'                 , quality: 'epic'      , slot: 'Cintura'             , boss: 'High King Maulgar'                   , raid: GR, icon: 'inv_belt_03' },
  { id: 28796, name: 'Malefic Mask of the Shadows'                , quality: 'epic'      , slot: 'Cabeza'              , boss: 'High King Maulgar'                   , raid: GR, icon: 'inv_helmet_58' },
  { id: 28801, name: "Maulgar's Warhelm"                          , quality: 'epic'      , slot: 'Cabeza'              , boss: 'High King Maulgar'                   , raid: GR, icon: 'inv_helmet_23' },
  { id: 28795, name: 'Bladespire Warbands'                        , quality: 'epic'      , slot: 'Muñecas'             , boss: 'High King Maulgar'                   , raid: GR, icon: 'inv_bracer_15' },
  { id: 28800, name: 'Hammer of the Naaru'                        , quality: 'epic'      , slot: 'Dos manos'           , boss: 'High King Maulgar'                   , raid: GR, icon: 'inv_hammer_28' },
  { id: 29763, name: 'Pauldrons of the Fallen Champion'           , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'High King Maulgar'                   , raid: GR, icon: 'inv_shoulder_22' },
  { id: 29764, name: 'Pauldrons of the Fallen Defender'           , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'High King Maulgar'                   , raid: GR, icon: 'inv_shoulder_22' },
  { id: 29762, name: 'Pauldrons of the Fallen Hero'               , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'High King Maulgar'                   , raid: GR, icon: 'inv_shoulder_22' },

  // Gruul the Dragonkiller
  { id: 28804, name: "Collar of Cho'gall"                         , quality: 'epic'      , slot: 'Cabeza'              , boss: 'Gruul the Dragonkiller'              , raid: GR, icon: 'inv_helmet_27' },
  { id: 28803, name: "Cowl of Nature's Breath"                    , quality: 'epic'      , slot: 'Cabeza'              , boss: 'Gruul the Dragonkiller'              , raid: GR, icon: 'inv_helmet_15' },
  { id: 28828, name: 'Gronn-Stitched Girdle'                      , quality: 'epic'      , slot: 'Cintura'             , boss: 'Gruul the Dragonkiller'              , raid: GR, icon: 'inv_belt_26' },
  { id: 28827, name: 'Gauntlets of the Dragonslayer'              , quality: 'epic'      , slot: 'Manos'               , boss: 'Gruul the Dragonkiller'              , raid: GR, icon: 'inv_gauntlets_25' },
  { id: 28810, name: 'Windshear Boots'                            , quality: 'epic'      , slot: 'Pies'                , boss: 'Gruul the Dragonkiller'              , raid: GR, icon: 'inv_boots_chain_05' },
  { id: 28824, name: 'Gauntlets of Martial Perfection'            , quality: 'epic'      , slot: 'Manos'               , boss: 'Gruul the Dragonkiller'              , raid: GR, icon: 'inv_gauntlets_31' },
  { id: 28822, name: 'Teeth of Gruul'                             , quality: 'epic'      , slot: 'Cuello'              , boss: 'Gruul the Dragonkiller'              , raid: GR, icon: 'inv_misc_bone_09' },
  { id: 28823, name: 'Eye of Gruul'                               , quality: 'epic'      , slot: 'Reliquia'            , boss: 'Gruul the Dragonkiller'              , raid: GR, icon: 'spell_shadow_unholyfrenzy' },
  { id: 28830, name: 'Dragonspine Trophy'                         , quality: 'epic'      , slot: 'Reliquia'            , boss: 'Gruul the Dragonkiller'              , raid: GR, icon: 'inv_misc_bone_03' },
  { id: 31750, name: 'Earthen Signet'                             , quality: 'common'    , slot: 'Miscelánea'          , boss: 'Gruul the Dragonkiller'              , raid: GR, icon: 'inv_ore_thorium_01' },
  { id: 29766, name: 'Leggings of the Fallen Champion'            , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'Gruul the Dragonkiller'              , raid: GR, icon: 'inv_pants_plate_17' },
  { id: 29767, name: 'Leggings of the Fallen Defender'            , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'Gruul the Dragonkiller'              , raid: GR, icon: 'inv_pants_plate_17' },
  { id: 29765, name: 'Leggings of the Fallen Hero'                , quality: 'epic'      , slot: 'Miscelánea'          , boss: 'Gruul the Dragonkiller'              , raid: GR, icon: 'inv_pants_plate_17' },
  { id: 28802, name: 'Bloodmaw Magus-Blade'                       , quality: 'epic'      , slot: 'Arma principal'      , boss: 'Gruul the Dragonkiller'              , raid: GR, icon: 'inv_sword_65' },
  { id: 28794, name: 'Axe of the Gronn Lords'                     , quality: 'epic'      , slot: 'Dos manos'           , boss: 'Gruul the Dragonkiller'              , raid: GR, icon: 'inv_axe_64' },
  { id: 28825, name: 'Aldori Legacy Defender'                     , quality: 'epic'      , slot: 'Mano izq.'           , boss: 'Gruul the Dragonkiller'              , raid: GR, icon: 'inv_shield_30' },
  { id: 28826, name: 'Shuriken of Negation'                       , quality: 'epic'      , slot: 'A distancia'         , boss: 'Gruul the Dragonkiller'              , raid: GR, icon: 'inv_misc_ahnqirajtrinket_03' },
];

// Helper: todos los bosses de una raid
export function getBossesForRaid(raidName: string) {
  return [...new Set(
    TBC_RAID_ITEMS
      .filter(i => i.raid === raidName)
      .map(i => i.boss)
  )];
}

interface GetItemsArgs {
  raid?: string | null;
  boss?: string | null;
  search?: string;
}

// Helper: items filtrados
export function getItems({ raid = null, boss = null, search = '' }: GetItemsArgs = {}) {
  return TBC_RAID_ITEMS.filter(item => {
    if (raid   && item.raid !== raid)   return false;
    if (boss   && item.boss !== boss)   return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
}
