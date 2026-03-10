import { AlertTriangle, TrendingUp, Users, ShieldAlert } from 'lucide-react';
import './LootSystem.css';

function LootSystem() {
    return (
        <div className="loot-container page-wrapper container">
            <div className="page-header">
                <h1 className="page-title"><span className="text-primary">Sistema de Loot</span> (Council)</h1>
                <p className="page-subtitle">La equidad y la progresión son fundamentales en nuestra distribución de botín. Entiende cómo equipamos a nuestro roster.</p>
            </div>

            <div className="loot-content">
                <div className="loot-intro glass-panel">
                    <p>
                        Nuestra hermandad utiliza un sistema de <strong>Loot Council</strong> para distribuir el equipo durante el raideo de progresión. El objetivo de este sistema es maximizar la eficiencia general, el daño/curación y la supervivencia de la banda, en lugar de centrarse en la progresión individual.
                        Todas las decisiones son tomadas por un consejo rotativo de oficiales y miembros dedicados, asegurando total transparencia y justicia.
                    </p>
                </div>

                <div className="loot-grid">
                    <div className="loot-card glass-panel">
                        <div className="loot-icon-wrapper">
                            <TrendingUp size={40} className="text-primary" />
                        </div>
                        <h3>Mayor Mejora</h3>
                        <p>Priorizamos a los jugadores que recibirán la mayor mejora demostrada estadísticamente, utilizando herramientas de simulación y listas de BiS (Best in Slot) enviadas por los miembros.</p>
                    </div>

                    <div className="loot-card glass-panel">
                        <div className="loot-icon-wrapper">
                            <Users size={40} className="text-primary" />
                        </div>
                        <h3>Asistencia y Rendimiento</h3>
                        <p>El botín es una recompensa por la dedicación. Las altas tasas de asistencia y un rendimiento excepcional en la ejecución de mecánicas influyen en la decisión del consejo.</p>
                    </div>

                    <div className="loot-card glass-panel">
                        <div className="loot-icon-wrapper">
                            <ShieldAlert size={40} className="text-primary" />
                        </div>
                        <h3>Prioridad de Rol</h3>
                        <p>Durante la progresión temprana, los tanques y curadores clave pueden tener prioridad en piezas específicas de supervivencia para asegurar que podamos superar ciertos "checks" de los jefes.</p>
                    </div>

                    <div className="loot-card glass-panel">
                        <div className="loot-icon-wrapper">
                            <AlertTriangle size={40} className="text-primary" />
                        </div>
                        <h3>Transparencia</h3>
                        <p>Cada decisión de botín se registra y se puede consultar públicamente. Cualquier miembro puede solicitar una explicación al consejo por cualquier objeto distribuido.</p>
                    </div>
                </div>

                <div className="loot-process glass-panel">
                    <h2 className="process-title">Cómo Funciona</h2>
                    <ul className="process-list">
                        <li><span className="step-num text-primary">1</span> Cuando cae un objeto, se enlaza a través del addon RC LootCouncil.</li>
                        <li><span className="step-num text-primary">2</span> Los miembros seleccionan su nivel de necesidad: <em>BiS, Mejora Mayor, Mejora Menor, Offspec, Pasar</em>.</li>
                        <li><span className="step-num text-primary">3</span> El Consejo revisa las peticiones junto con los datos de daño/curación, registros de asistencia y botín previo recibido.</li>
                        <li><span className="step-num text-primary">4</span> Se emite un voto interno en 60 segundos. El objeto se otorga al miembro que más beneficie a la hermandad.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default LootSystem;
