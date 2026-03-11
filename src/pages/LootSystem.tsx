import { TrendingUp, Users, ShieldAlert, Star, Heart, Target, Layers, ExternalLink } from 'lucide-react';

const CRITERIA = [
    {
        icon: <Star size={22} className="text-[#86b518]" />,
        title: 'BiS',
        text: 'Optarás a un item si es tu bis de fase. Se tendrá en cuenta que para ciertas clases un ítem puede ser bis durante varias fases futuras, lo cual aumentará su prioridad.',
    },
    {
        icon: <TrendingUp size={22} className="text-[#86b518]" />,
        title: 'Rendimiento y Desempeño',
        text: 'Conocimiento y ejecución de mecánicas, buen uso de tu clase, DPS o Healing realizado, uso de todos los consumibles, llevar tu equipo con enchants y gemas bis.',
    },
    {
        icon: <Users size={22} className="text-[#86b518]" />,
        title: 'Asistencia y Puntualidad',
        text: 'Priorizaremos a la gente que se apunte regularmente, asista con constancia y puntualidad, y demuestre compromiso a largo plazo.',
    },
    {
        icon: <Target size={22} className="text-[#86b518]" />,
        title: 'Mejora Relativa',
        text: 'Qué tanto te mejora ese ítem en comparación a la mejora que supone para otra clase. Aquí entran también principalmente los ítems que no sean los BiS pero supongan una mejora.',
    },
    {
        icon: <Heart size={22} className="text-[#86b518]" />,
        title: 'Actitud',
        text: 'Se valorará a jugadores que ayuden, trabajen en mejorar, no generen drama, que se hayan leído las guías de TBC de su clase, de raids y jefes, stats y lista de BiS.',
    },
];

const PRIORITIES = [
    {
        icon: <ShieldAlert size={20} className="text-[#c0933f]" />,
        title: 'Cap de Hit y Stats Imprescindibles',
        text: 'En las primeras fases algunos caps solo son alcanzables para ciertas clases con items de raid. Se priorizará cubrir estos caps a la hora de repartir, incluso cuando implique guardar piezas bis para equiparlas más adelante.',
        color: '#c0933f',
    },
    {
        icon: <Layers size={20} className="text-[#9b59b6]" />,
        title: 'Sets de Tier',
        text: 'El bonus de 2 y 4 piezas es muy bueno para ciertas clases. Se priorizará a quien le aporte una mayor mejora tanto individual como colectiva.',
        color: '#9b59b6',
    },
];

const STEPS = [
    {
        title: 'Aparece la ventana de RC Loot Council',
        text: 'Te aparecerá una ventana con opciones para cada item: BiS, Major Upgrade, Minor Upgrade, Off-spec, etc. El item BiS es el primero de la lista. Para los bis más bajos deberéis clicar en Major o Minor Upgrade según qué tanto os mejoren.',
        note: 'En la nota podéis poner cualquier consideración que creáis importante que debamos saber.',
    },
    {
        title: 'Elige la opción que corresponda',
        text: 'Selecciona honestamente la opción que mejor describe lo que ese item supone para ti. Tened presente vuestra lista de items bis — consultadla en wowtbc.gg. Es vuestra responsabilidad rollear por lo que toca.',
        note: null,
    },
    {
        title: 'El consejo decide',
        text: 'El consejo verá tu equipo actual junto con los criterios descritos y decidirá a quién se asigna la pieza. Cualquier decisión puede consultarse con los oficiales de forma privada al finalizar la raid.',
        note: null,
    },
];

function LootSystem() {
    return (
        <div className="max-w-[1100px] mx-auto px-8 pt-20 pb-20">
            {/* Header */}
            <div className="mb-12">
                <h1 className="mb-3">
                    <span className="text-[#86b518]">Sistema de Loot</span> Council
                </h1>
                <p className="text-[#8b8b99] max-w-[700px] leading-relaxed">
                    Para asegurar el buen progreso de la guild y recompensar el esfuerzo de manera justa.
                    Este sistema busca que cada pieza de equipo caiga donde más beneficie al grupo en su conjunto.
                </p>
            </div>

            <div className="flex flex-col gap-12">
                {/* Intro block */}
                <div className="glass-panel p-8 border-l-4 border-l-[#86b518]">
                    <p className="text-[1rem] text-[#c8c8d0] leading-relaxed">
                        Nuestra hermandad utiliza un sistema de <strong className="text-white">Loot Council</strong> durante
                        el raideo de progresión. El objetivo es maximizar la eficiencia general del grupo —
                        daño, curación y supervivencia — en lugar de centrarse en la progresión individual.
                        Todas las decisiones son tomadas por los oficiales siguiendo criterios objetivos.
                        Ningún sistema es perfecto, pero es el que mejor nos permitirá progresar.
                    </p>
                </div>

                {/* Criterios */}
                <div>
                    <h2 className="text-[1.3rem] mb-6">Criterios de Reparto</h2>
                    <div className="flex flex-col gap-3">
                        {CRITERIA.map(({ icon, title, text }, i) => (
                            <div
                                key={title}
                                className="flex items-start gap-5 glass-panel px-6 py-5 hover:border-[rgba(134,181,24,0.25)] transition-all duration-200"
                            >
                                <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-[4px] border border-[rgba(134,181,24,0.2)] bg-[rgba(134,181,24,0.06)] mt-0.5">
                                    {icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-white text-[1rem] m-0">{title}</h4>
                                    </div>
                                    <p className="text-[0.9rem] text-[#8b8b99] leading-relaxed m-0">{text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prioridades adicionales */}
                <div>
                    <h2 className="text-[1.3rem] mb-2">Prioridades de Progresión</h2>
                    <p className="text-[0.88rem] text-[#8b8b99] mb-6">
                        Además de los criterios anteriores, se tendrán en cuenta estas prioridades para garantizar
                        el avance óptimo en las raids presentes y futuras.
                    </p>
                    <div className="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
                        {PRIORITIES.map(({ icon, title, text, color }) => (
                            <div
                                key={title}
                                className="glass-panel p-6"
                                style={{ borderLeftWidth: 3, borderLeftColor: color }}
                            >
                                <div className="flex items-center gap-2.5 mb-3">
                                    {icon}
                                    <h4 className="text-white text-[0.95rem] m-0">{title}</h4>
                                </div>
                                <p className="text-[0.87rem] text-[#8b8b99] leading-relaxed m-0">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cómo funciona */}
                <div>
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                        <h2 className="text-[1.3rem] m-0">Cómo Funciona · RC Loot Council</h2>
                        <a
                            href="https://wowtbc.gg"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[0.78rem] text-[#8b8b99] hover:text-[#86b518] transition-colors"
                        >
                            <ExternalLink size={13} />
                            Consulta tu BiS en wowtbc.gg
                        </a>
                    </div>
                    <div className="flex flex-col gap-4">
                        {STEPS.map((step, i) => (
                            <div key={i} className="flex items-start gap-5 glass-panel px-6 py-5">
                                <span className="font-['Changa_One'] text-[1.2rem] w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-[rgba(134,181,24,0.1)] border border-[#86b518] text-[#86b518]">
                                    {i + 1}
                                </span>
                                <div className="flex-1 min-w-0 pt-1">
                                    <h4 className="text-white text-[0.95rem] mb-1.5 m-0">{step.title}</h4>
                                    <p className="text-[0.88rem] text-[#8b8b99] leading-relaxed m-0">{step.text}</p>
                                    {step.note && (
                                        <p className="mt-2 text-[0.82rem] text-[#86b518] bg-[rgba(134,181,24,0.06)] border border-[rgba(134,181,24,0.15)] rounded-[4px] px-3 py-2 m-0">
                                            * {step.note}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nota final */}
                <div className="glass-panel p-8 border border-[rgba(134,181,24,0.2)] bg-[rgba(134,181,24,0.03)]">
                    <h3 className="text-[#86b518] text-[1rem] mb-4">Nota Final</h3>
                    <p className="text-[0.9rem] text-[#8b8b99] leading-relaxed mb-4">
                        Hemos intentado ser lo más objetivos y justos posibles. Si venís con constancia y hacéis las cosas bien
                        todos acabaréis mejorando vuestro equipo, pero es imposible que todo el mundo vaya full bis —
                        hay que establecer criterios de prioridad que aseguren un mejor progreso y que a la vez os recompensen
                        de manera justa vuestro desempeño y compromiso.
                    </p>
                    <p className="text-[0.9rem] text-[#8b8b99] leading-relaxed m-0">
                        Quizá se tome alguna decisión que no guste, aunque nos esforcemos en ser lo más justos posible.
                        Valorad también que todo esto cuesta tiempo y trabajo, y que vosotros podéis hacérnoslo mucho más
                        fácil con todo lo que podéis aportar.{' '}
                        <span className="text-white">Estaremos encantados de resolver cualquier duda al finalizar la raid.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LootSystem;
