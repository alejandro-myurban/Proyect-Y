import { Link } from 'react-router-dom';
import { ArrowRight, Swords, Shield, ScrollText } from 'lucide-react';
import './Home.css';

function Home() {
    return (
        <div className="home-container page-wrapper">
            <section className="hero-section">
                <div className="hero-video-container">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="hero-video"
                    >
                        <source src="/video-hero.mp4" type="video/mp4" />
                    </video>
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-content">
                    <h1 className="hero-title">
                        Únete a la <span className="text-primary glow-text">Spanish Mafia</span>
                    </h1>
                    <p className="hero-subtitle">
                        Únete a la hermandad de raideo más agresiva y coordinada. Buscamos jugadores dedicados dispuestos a conquistar el contenido más difícil que World of Warcraft tiene para ofrecer.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/calendar" className="btn btn-primary btn-large">
                            Aplicar Ahora <ArrowRight size={20} className="icon-right" />
                        </Link>
                        <Link to="/guides" className="btn btn-large">
                            Ver Estrategias
                        </Link>
                    </div>
                </div>
            </section>

            <section className="features-section container">
                <div className="features-grid">
                    <div className="feature-card glass-panel">
                        <div className="feature-icon-wrapper">
                            <Swords size={40} className="text-primary" />
                        </div>
                        <h3 className="feature-title">Raideo Hardcore</h3>
                        <p className="feature-text">
                            Empujamos por el Cutting Edge cada tier. Nuestras estrategias son refinadas y nuestra ejecución impecable.
                        </p>
                    </div>

                    <div className="feature-card glass-panel">
                        <div className="feature-icon-wrapper">
                            <ScrollText size={40} className="text-primary" />
                        </div>
                        <h3 className="feature-title">Tácticas Personalizadas</h3>
                        <p className="feature-text">
                            Accede a nuestro repositorio exclusivo de guías de jefes adaptadas a nuestra composición específica de clases y plantilla.
                        </p>
                    </div>

                    <div className="feature-card glass-panel">
                        <div className="feature-icon-wrapper">
                            <Shield size={40} className="text-primary" />
                        </div>
                        <h3 className="feature-title">Loot Council Justo</h3>
                        <p className="feature-text">
                            Nuestro Loot Council transparente asegura que el equipo vaya a donde más beneficie a la raid, maximizando nuestra progresión.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
