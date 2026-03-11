import { useState } from 'react';

const guidesData = [
    {
        id: 'boss-1',
        title: 'Amirdrassil: Gnarlroot',
        content: 'Fase 1: Separaos para el Rajar de Llama de las Sombras. Los tanques deben cambiar después de cada aliento. Fase 2 (Intermedio): Haced focus a las raíces rápidamente. Guardad Ansia de Sangre para cuando muera la última raíz, ya que recibe daño aumentado.',
        difficulty: 'Mítico',
    },
    {
        id: 'boss-2',
        title: 'Amirdrassil: Igira la Cruel',
        content: 'El posicionamiento es clave. La raid debe dividirse en tres grupos para soquear las lanzas. Los DPS a rango deben priorizar las lanzas más cercanas. Los tanques deben alejar a la jefa de los charcos de fuego.',
        difficulty: 'Mítico',
    },
    {
        id: 'boss-3',
        title: 'Amirdrassil: Volcoross',
        content: 'Dos grupos separados. Saltad sobre las olas de lava. Soquead los meteoritos masivos. Usad Ansia de Sangre solo al 30% cuando el contador de enrage apriete.',
        difficulty: 'Heroico / Mítico',
    },
    {
        id: 'boss-4',
        title: 'Amirdrassil: Tindral Sabioveloz',
        content: 'Una prueba agotadora de mecánicas. Recoged plumas para volar, esquivad las raíces, romped los escudos instantáneamente. Usad disipaciones en masa de forma coordinada en los debuffs de fuego. Preparaos para el caos absoluto en fase 3.',
        difficulty: 'Mítico',
    },
    {
        id: 'boss-5',
        title: 'Amirdrassil: Fyrakk',
        content: 'La prueba definitiva. Dejad los charcos en el borde. Curad a los espíritus amistosos en Fase 2. Esquivad los frontales gigantes. Los portadores de semillas deben coordinarse perfectamente. Sobrevivid a la fase de quemado.',
        difficulty: 'Mítico',
    }
];

function Guides() {
    const [activeTab, setActiveTab] = useState(guidesData[0].id);

    const activeGuide = guidesData.find(g => g.id === activeTab);

    return (
        <div className="max-w-[1440px] mx-auto px-8 pt-20">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="mb-3">Guías de <span className="text-[#86b518]">Raid</span></h1>
                <p className="text-[#8b8b99]">Estrategias detalladas, videos de recills y mapas de posicionamiento para nuestro tier de progresión.</p>
            </div>

            <div className="flex gap-8 mt-8 pb-16 max-[800px]:flex-col">
                {/* Sidebar */}
                <div className="glass-panel flex-1 min-w-[250px] max-w-[300px] p-6 max-[800px]:max-w-full">
                    <h3 className="mb-6 text-[1.2rem] border-b border-[#2a2a33] pb-2 text-white">Encuentros</h3>
                    <ul className="list-none flex flex-col gap-2">
                        {guidesData.map((guide) => (
                            <li key={guide.id}>
                                <button
                                    onClick={() => setActiveTab(guide.id)}
                                    className={`
                                        w-full flex items-center text-left px-4 py-3 rounded-[4px] cursor-pointer
                                        font-[inherit] text-base transition-all duration-150 border
                                        ${activeTab === guide.id
                                            ? 'bg-[rgba(134,181,24,0.1)] text-white border-[#86b518]'
                                            : 'bg-transparent border-transparent text-[#e2e2e2] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#86b518]'
                                        }
                                    `}
                                >
                                    <span className={`
                                        w-2 h-2 rounded-full mr-3 flex-shrink-0 transition-all duration-150
                                        ${activeTab === guide.id
                                            ? 'bg-[#86b518] shadow-[0_0_10px_#86b518]'
                                            : 'bg-[#2a2a33] group-hover:bg-[rgba(134,181,24,0.5)]'
                                        }
                                    `} />
                                    {guide.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Guide details */}
                <div className="glass-panel flex-[3] p-10 [animation:fadeIn_0.5s_ease]">
                    {activeGuide && (
                        <>
                            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#2a2a33]">
                                <h2 className="text-[2rem] text-white [text-shadow:0_0_10px_rgba(134,181,24,0.2)]">
                                    {activeGuide.title}
                                </h2>
                                <span className="font-['Changa_One'] bg-[#ff2a2a] text-white px-3 py-1 rounded-[3px] text-[0.8rem] uppercase font-bold tracking-wide">
                                    {activeGuide.difficulty}
                                </span>
                            </div>

                            <div className="leading-[1.8]">
                                <p className="text-[1.1rem] mb-8">{activeGuide.content}</p>

                                <div className="glass-panel w-full h-[400px] flex flex-col justify-center items-center border border-dashed border-[#86b518] bg-[rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-[rgba(134,181,24,0.05)]">
                                    <div className="w-[60px] h-[60px] bg-[#86b518] rounded-full mb-4 flex justify-center items-center cursor-pointer relative shadow-[0_0_15px_rgba(134,181,24,0.4)] after:content-[''] after:border-solid after:border-[10px_0_10px_16px] after:border-transparent after:border-l-[#0a0a0c] after:ml-[5px]" />
                                    <p>Video de Estrategia</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Guides;
