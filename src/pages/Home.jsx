import { Link } from 'react-router-dom';
import { ArrowRight, Swords, Shield, ScrollText } from 'lucide-react';

function Home() {
    return (
        <div className="flex flex-col gap-6">
            {/* Hero */}
            <section className="min-h-[50vh] flex flex-col justify-center items-center text-center relative overflow-hidden py-24 bg-black">
                {/* Video */}
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay loop muted playsInline
                        className="w-full h-full object-cover [animation:slowZoom_20s_infinite_alternate_ease-in-out]"
                    >
                        <source src="/video-hero.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0c] z-[2]" />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-[#0a0a0c] to-transparent z-[1]" />

                {/* Content */}
                <div className="max-w-[800px] px-8 z-[2] [animation:fadeUp_1s_ease-out]">
                    <h1 className="text-[clamp(2.5rem,8vw,5rem)] mb-6 leading-[1.1] [text-shadow:0_5px_15px_rgba(0,0,0,0.8),0_0_20px_rgba(134,181,24,0.2)]">
                        Únete a la <span className=" glow-text">Spanish Mafia</span>
                    </h1>
                    <p className="text-[1.25rem] text-white mb-12 max-w-[600px] mx-auto [text-shadow:0_2px_4px_rgba(0,0,0,0.8)]">
                        Únete a la hermandad de raideo más agresiva y coordinada. Buscamos jugadores dedicados dispuestos a conquistar el contenido más difícil que World of Warcraft tiene para ofrecer.
                    </p>
                    <div className="flex gap-6 justify-center items-center max-[768px]:flex-col max-[768px]:gap-4">
                        <Link to="/calendar" className="btn btn-primary py-4 px-12 text-[1.1rem]">
                            Aplicar Ahora <ArrowRight size={20} className="ml-2" />
                        </Link>
                        <Link to="/guides" className="btn py-4 px-12 text-[1.1rem] max-[768px]:w-full">
                            Ver Estrategias
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-8 relative z-[3] max-w-[1440px] mx-auto w-full">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
                    {[
                        { icon: <Swords size={40} className="text-[#86b518]" />, title: 'Raideo Hardcore', text: 'Empujamos por el Cutting Edge cada tier. Nuestras estrategias son refinadas y nuestra ejecución impecable.' },
                        { icon: <ScrollText size={40} className="text-[#86b518]" />, title: 'Tácticas Personalizadas', text: 'Accede a nuestro repositorio exclusivo de guías de jefes adaptadas a nuestra composición específica de clases y plantilla.' },
                        { icon: <Shield size={40} className="text-[#86b518]" />, title: 'Loot Council Justo', text: 'Nuestro Loot Council transparente asegura que el equipo vaya a donde más beneficie a la raid, maximizando nuestra progresión.' },
                    ].map(({ icon, title, text }) => (
                        <div key={title} className="glass-panel text-center group transition-all duration-300 hover:-translate-y-[10px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(134,181,24,0.1)] hover:border-[rgba(134,181,24,0.3)]">
                            <div className="w-20 h-20 mx-auto mb-6 bg-[#121215] rounded-full flex justify-center items-center border border-[#2a2a33] shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:bg-[rgba(134,181,24,0.1)] group-hover:border-[#86b518] group-hover:shadow-[0_0_20px_rgba(134,181,24,0.2)]">
                                <span className="transition-transform duration-300 group-hover:[transform:scale(1.1)_rotate(5deg)] flex">
                                    {icon}
                                </span>
                            </div>
                            <h3 className="text-2xl mb-4 text-white">{title}</h3>
                            <p className="text-[#8b8b99] text-base leading-relaxed">{text}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Home;
