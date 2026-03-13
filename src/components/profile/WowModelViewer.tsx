// Display IDs de WoWhead para modelos base de cada raza (WotLK)
// Tipo 1 = NPC/Character display en el viewer de WoWhead
const RACE_DISPLAY_IDS: Record<string, number> = {
  human_male:      49,
  human_female:    50,
  orc_male:        51,
  orc_female:      52,
  dwarf_male:      53,
  dwarf_female:    54,
  nightelf_male:   55,
  nightelf_female: 56,
  undead_male:     57,
  undead_female:   58,
  tauren_male:     59,
  tauren_female:   60,
  gnome_male:      1563,
  gnome_female:    1564,
  troll_male:      62,
  troll_female:    63,
  bloodelf_male:   10045,
  bloodelf_female: 10046,
  draenei_male:    16125,
  draenei_female:  16126,
};

// Mantener compat con Profile.tsx que usa RACE_MODEL_PATHS para la lista de razas disponibles
export const RACE_MODEL_PATHS: Record<string, string> = Object.fromEntries(
  Object.keys(RACE_DISPLAY_IDS).map((k) => [k, k])
);

interface WowModelViewerProps {
  avatarId: string;
  width?: number;
  height?: number;
  classColor?: string;
}

export function WowModelViewer({
  avatarId,
  width = 340,
  height = 460,
  classColor = '#86b518',
}: WowModelViewerProps) {
  const displayId = RACE_DISPLAY_IDS[avatarId];
  if (!displayId) return null;

  // WoWhead model viewer embed — corre en su dominio, sin CORS
  const src = `https://wow.zamimg.com/modelviewer/live/webjsapi.html#type=1&id=${displayId}&contentPath=//wow.zamimg.com/modelviewer/live/`;

  return (
    <div
      className="relative overflow-hidden rounded-[4px]"
      style={{
        width,
        height,
        background: 'radial-gradient(ellipse at 50% 80%, ' + classColor + '18 0%, #0a0a0d 70%)',
      }}
    >
      <iframe
        key={avatarId}
        src={src}
        width={width}
        height={height}
        style={{
          border: 'none',
          display: 'block',
          // Recorta la UI interna del viewer de WoWhead
          marginTop: -8,
        }}
        title={avatarId}
        allowFullScreen={false}
        scrolling="no"
      />
    </div>
  );
}
