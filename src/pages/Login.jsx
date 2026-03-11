import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Chrome, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signIn, signUp, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = isSignUp
            ? await signUp({ email, password })
            : await signIn({ email, password });

        if (error) {
            setError(error.message);
        } else {
            navigate('/calendar');
        }
        setLoading(false);
    };

    return (
        <div className="pt-20 max-w-[450px] mx-auto px-8 min-h-[calc(100vh-100px)] flex flex-col justify-center">
            <div className="glass-panel p-10 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[rgba(134,181,24,0.05)] rounded-full blur-[60px]" />

                <h2 className="flex items-center gap-3 mb-6 text-2xl">
                    <LogIn className="text-[#86b518]" />
                    {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
                </h2>

                <p className="text-[#8b8b99] mb-8 text-[0.95rem]">
                    Únete a la hermandad para gestionar tu roster y ver el botín acumulado.
                </p>

                {error && (
                    <div className="mb-6 p-4 bg-[rgba(255,42,42,0.1)] border border-[rgba(255,42,42,0.2)] text-[#ff6b6b] text-sm rounded-[4px] glow-text">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-[0.85rem] text-[#8b8b99] mb-2 uppercase tracking-wide">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                className="input-field pl-10"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-[0.85rem] text-[#8b8b99] mb-2 uppercase tracking-wide">Contraseña</label>
                        <div className="relative">
                            <input
                                type="password"
                                className="input-field pl-10"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full py-4 mb-6" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                        {isSignUp ? 'Registrarse' : 'Entrar'}
                    </button>
                </form>

                <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] flex-1 bg-[#2a2a33]" />
                    <span className="text-[0.7rem] uppercase text-[#444] tracking-widest">O continúa con</span>
                    <div className="h-[1px] flex-1 bg-[#2a2a33]" />
                </div>

                <button
                    onClick={() => signInWithGoogle()}
                    className="btn w-full mb-8 hover:border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.02)]"
                >
                    <Chrome size={18} /> Google OAuth
                </button>

                <p className="text-center text-[#8b8b99] text-sm">
                    {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'} {' '}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-[#86b518] hover:text-white transition-colors border-none bg-transparent cursor-pointer font-bold ml-1"
                    >
                        {isSignUp ? 'Inicia Sesión' : 'Crea una aquí'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;
