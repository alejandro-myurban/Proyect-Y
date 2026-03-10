import { useState } from 'react';
import './Guides.css';

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
        <div className="guides-container page-wrapper container">
            <div className="page-header">
                <h1 className="page-title">Guías de <span className="text-primary">Raid</span></h1>
                <p className="page-subtitle">Estrategias detalladas, videos de recills y mapas de posicionamiento para nuestro tier de progresión.</p>
            </div>

            <div className="guides-content">
                <div className="guides-sidebar glass-panel">
                    <h3 className="sidebar-title">Encuentros</h3>
                    <ul className="boss-list">
                        {guidesData.map((guide) => (
                            <li key={guide.id}>
                                <button
                                    className={`boss-btn ${activeTab === guide.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(guide.id)}
                                >
                                    <span className="boss-btn-indicator"></span>
                                    {guide.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="guide-details glass-panel">
                    {activeGuide && (
                        <>
                            <div className="guide-header">
                                <h2 className="guide-title">{activeGuide.title}</h2>
                                <span className="guide-difficulty">{activeGuide.difficulty}</span>
                            </div>

                            <div className="guide-body">
                                <p className="guide-text">{activeGuide.content}</p>

                                <div className="guide-placeholder-video glass-panel">
                                    <div className="play-btn"></div>
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
