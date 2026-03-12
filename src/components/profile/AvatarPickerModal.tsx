import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export const WOW_AVATARS = [
  // Alliance
  { id: 'generic', label: 'Generic', faction: 'Alianza', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-prince-malchezaar.png' },
  { id: 'human_male',     label: 'Humano',      faction: 'Alianza', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_human_male.jpg' },
  { id: 'human_female',   label: 'Humana',      faction: 'Alianza', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_human_female.jpg' },
  { id: 'dwarf_male',     label: 'Enano',       faction: 'Alianza', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_dwarf_male.jpg' },
  { id: 'dwarf_female',   label: 'Enana',       faction: 'Alianza', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_dwarf_female.jpg' },
  { id: 'nightelf_male',  label: 'Elfo Nocturno',   faction: 'Alianza', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_nightelf_male.jpg' },
  { id: 'nightelf_female',label: 'Elfa Nocturna',   faction: 'Alianza', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_nightelf_female.jpg' },
  { id: 'gnome_male',     label: 'Gnomo',       faction: 'Alianza', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_gnome_male.jpg' },
  { id: 'gnome_female',   label: 'Gnoma',       faction: 'Alianza', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_gnome_female.jpg' },
  { id: 'draenei_male',   label: 'Draenei',     faction: 'Alianza', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_draenei_male.jpg' },
  { id: 'draenei_female', label: 'Draenei',     faction: 'Alianza', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_draenei_female.jpg' },
  // Horde
  { id: 'orc_male',       label: 'Orco',        faction: 'Horda', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_orc_male.jpg' },
  { id: 'orc_female',     label: 'Orca',        faction: 'Horda', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_orc_female.jpg' },
  { id: 'undead_male',    label: 'No-Muerto',   faction: 'Horda', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_undead_male.jpg' },
  { id: 'undead_female',  label: 'No-Muerta',   faction: 'Horda', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_undead_female.jpg' },
  { id: 'tauren_male',    label: 'Tauren',      faction: 'Horda', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_tauren_male.jpg' },
  { id: 'tauren_female',  label: 'Tauren',      faction: 'Horda', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_tauren_female.jpg' },
  { id: 'troll_male',     label: 'Troll',       faction: 'Horda', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_troll_male.jpg' },
  { id: 'troll_female',   label: 'Troll',       faction: 'Horda', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_troll_female.jpg' },
  { id: 'bloodelf_male',  label: 'Elfo de Sangre', faction: 'Horda', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_bloodelf_male.jpg' },
  { id: 'bloodelf_female',label: 'Elfa de Sangre', faction: 'Horda', url: 'https://wow.zamimg.com/images/wow/icons/large/achievement_character_bloodelf_female.jpg' },
  // Bosses — Karazhan
  { id: 'attumen',      label: 'Attumen',         faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-attumen-the-huntsman.png' },
  { id: 'moroes',       label: 'Moroes',          faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-moroes.png' },
  { id: 'maiden',       label: 'Maiden',          faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-maiden-of-virtue.png' },
  { id: 'curator',      label: 'The Curator',     faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-the-curator.png' },
  { id: 'aran',         label: 'Shade of Aran',   faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-shade-of-aran.png' },
  { id: 'illhoof',      label: 'Illhoof',         faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-terestian-illhoof.png' },
  { id: 'netherspite',  label: 'Netherspite',     faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-netherspite.png' },
  { id: 'nightbane',    label: 'Nightbane',       faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-nightbane.png' },
  { id: 'malchezaar',   label: 'Prince Malchezaar', faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-prince-malchezaar.png' },
  // Bosses — TBC
  { id: 'gruul',        label: 'Gruul',           faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-gruul.png' },
  { id: 'maulgar',      label: 'High King Maulgar', faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-high-king-maulgar.png' },
  { id: 'magtheridon',  label: 'Magtheridon',     faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-magtheridon.png' },
  { id: 'vashj',        label: 'Lady Vashj',      faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-lady-vashj.png' },
  { id: 'kael',         label: "Kael'thas",       faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-kaelthas-sunstrider.png' },
  { id: 'illidan',      label: 'Illidan',         faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-illidan-stormrage.png' },
  { id: 'archimonde',   label: 'Archimonde',      faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-archimonde.png' },
  { id: 'kiljaeden',    label: "Kil'jaeden",      faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-kiljaeden.png' },
  // Bosses — Classic
  { id: 'ragnaros',     label: 'Ragnaros',        faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-ragnaros.png' },
  { id: 'nefarian',     label: 'Nefarian',        faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-nefarian.png' },
  { id: 'cthun',        label: "C'Thun",          faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-cthun.png' },
  { id: 'kelthuzad',    label: "Kel'Thuzad",      faction: 'Bosses', url: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-kelthuzad.png' },
];

interface AvatarPickerModalProps {
  currentUrl: string | null;
  onSelect: (url: string) => void;
  onClose: () => void;
}

export function AvatarPickerModal({ currentUrl, onSelect, onClose }: AvatarPickerModalProps) {
  const alliance = WOW_AVATARS.filter(a => a.faction === 'Alianza');
  const horde    = WOW_AVATARS.filter(a => a.faction === 'Horda');
  const bosses   = WOW_AVATARS.filter(a => a.faction === 'Bosses');

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-[640px] bg-[#0d0d10] border border-[#2a2a33] rounded-[6px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a33]">
          <h3 className="font-['Changa_One'] uppercase tracking-widest text-[0.95rem] text-white">
            Elige tu Avatar
          </h3>
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
          {[
            { label: 'Alianza', list: alliance, color: '#6ab0f5' },
            { label: 'Horda',   list: horde,    color: '#d9534f' },
            { label: 'Bosses',  list: bosses,   color: '#c084fc' },
          ].map(({ label, list, color }) => (
            <div key={label}>
              <p
                className="text-[0.68rem] uppercase tracking-widest font-['Changa_One'] mb-2.5"
                style={{ color }}
              >
                {label}
              </p>
              <div className="grid grid-cols-5 gap-2">
                {list.map((avatar) => {
                  const selected = currentUrl === avatar.url;
                  return (
                    <button
                      key={avatar.id}
                      onClick={() => onSelect(avatar.url)}
                      className="flex flex-col items-center gap-1.5 group w-[60px] cursor-pointer"
                      title={avatar.label}
                    >
                      <div
                        className="w-full aspect-square rounded-[4px] overflow-hidden border-2 transition-all duration-150"
                        style={{
                          borderColor: selected ? color : 'transparent',
                          boxShadow: selected ? `0 0 10px ${color}66` : 'none',
                          outline: selected ? `1px solid ${color}44` : 'none',
                        }}
                      >
                        <img
                          src={avatar.url}
                          alt={avatar.label}
                          className="w-full h-full object-cover transition-transform duration-150 group-hover:scale-105"
                          onError={(e: any) => { e.target.src = ''; }}
                        />
                      </div>
                      <span className="text-[0.6rem] text-[#555] group-hover:text-[#8b8b99] transition-colors truncate w-full text-center">
                        {avatar.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
