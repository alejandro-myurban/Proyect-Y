import { AlertTriangle, TrendingUp, Users, ShieldAlert } from 'lucide-react';

const CARDS = [
    {
        icon: <TrendingUp size={40} className="text-[#86b518]" />,
        title: 'Mayor Mejora',
        text: 'Priorizamos a los jugadores que recibirán la mayor mejora demostrada estadísticamente, utilizando herramientas de simulación y listas de BiS (Best in Slot) enviadas por los miembros.',
    },
    {
        icon: <Users size={40} className="text-[#86b518]" />,
        title: 'Asistencia y Rendimiento',
        text: 'El botín es una recompensa por la dedicación. Las altas tasas de asistencia y un rendimiento excepcional en la ejecución de mecánicas influyen en la decisión del consejo.',
    },
    {
        icon: <ShieldAlert size={40} className="text-[#86b518]" />,
        title: 'Prioridad de Rol',
        text: 'Durante la progresión temprana, los tanques y curadores clave pueden tener prioridad en piezas específicas de supervivencia para asegurar que podamos superar ciertos "checks" de los jefes.',
    },
    {
        icon: <AlertTriangle size={40} className="text-[#86b518]" />,
        title: 'Transparencia',
        text: 'Cada decisión de botín se registra y se puede consultar públicamente. Cualquier miembro puede solicitar una explicación al consejo por cualquier objeto distribuido.',
    },
];

const STEPS = [
    'Cuando cae un objeto, se enlaza a través del addon RC LootCouncil.',
    <>Los miembros seleccionan su nivel de necesidad: <em>BiS, Mejora Mayor, Mejora Menor, Offspec, Pasar</em>.</>,
    'El Consejo revisa las peticiones junto con los datos de daño/curación, registros de asistencia y botín previo recibido.',
    'Se emite un voto interno en 60 segundos. El objeto se otorga al miembro que más beneficie a la hermandad.',
];

function LootSystem() {
    return (
        <div className="max-w-[1440px] mx-auto px-8 pt-20">
            {/* Header */}
            <div className="mb-8">
                <h1 className="mb-3"><span className="text-[#86b518]">Sistema de Loot</span> (Council)</h1>
                <p className="text-[#8b8b99]">La equidad y la progresión son fundamentales en nuestra distribución de botín. Entiende cómo equipamos a nuestro roster.</p>
            </div>

            <div className="flex flex-col gap-8 pb-16">
                {/* Intro */}
                <div className="glass-panel text-[1.2rem] text-center max-w-[900px] mx-auto">
                    <p className="text-white">
                        Nuestra hermandad utiliza un sistema de <strong>Loot Council</strong> para distribuir el equipo durante el raideo de progresión. El objetivo de este sistema es maximizar la eficiencia general, el daño/curación y la supervivencia de la banda, en lugar de centrarse en la progresión individual.
                        Todas las decisiones son tomadas por un consejo rotativo de oficiales y miembros dedicados, asegurando total transparencia y justicia.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
                    {CARDS.map(({ icon, title, text }) => (
                        <div key={title} className="glass-panel text-center py-10 px-6 group transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(134,181,24,0.4)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.4),0_0_15px_rgba(134,181,24,0.05)]">
                            <div className="mx-auto mb-6 w-[70px] h-[70px] rounded-full flex justify-center items-center border border-[rgba(134,181,24,0.2)] bg-[rgba(134,181,24,0.05)] transition-all group-hover:bg-[rgba(134,181,24,0.15)] group-hover:border-[#86b518] group-hover:shadow-[0_0_15px_rgba(61,181,24,0.4)]">
                                {icon}
                            </div>
                            <h3 className="mb-4 text-[1.2rem]">{title}</h3>
                            <p className="text-[0.95rem] text-[#8b8b99]">{text}</p>
                        </div>
                    ))}
                </div>

                {/* Process */}
                <div className="glass-panel mt-8 p-12 border-l-4 border-l-[#86b518]">
                    <h2 className="text-[1.8rem] text-center mb-8">Cómo Funciona</h2>
                    <ul className="list-none max-w-[800px] mx-auto flex flex-col gap-6">
                        {STEPS.map((step, i) => (
                            <li key={i} className="text-[1.1rem] flex items-start bg-[#1c1c21] p-6 rounded-[4px] border border-[#2a2a33]">
                                <span className="font-['Changa_One'] text-[1.5rem] font-black mr-6 min-w-[30px] w-10 h-10 flex justify-center items-center rounded-full bg-[rgba(134,181,24,0.1)] border border-[#86b518] text-[#86b518] flex-shrink-0">
                                    {i + 1}
                                </span>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default LootSystem;
