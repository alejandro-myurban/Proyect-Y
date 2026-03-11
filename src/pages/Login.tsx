import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Chrome, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { sileo } from 'sileo';
import { BorderBeam } from '@/components/ui/border-beam';
import { AuroraText } from '@/components/ui/aurora-text';
import { Ripple } from '@/components/ui/ripple';
const loginBg = '/bg-login.png';

function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn, signUp, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = isSignUp
                ? await signUp({ email, password })
                : await signIn({ email, password });

            if (error) {
                console.error('Auth error:', error);
                sileo.error({ 
                    styles: {
                        title: "text-white!",
                        description: "text-white/75!",
                    },
                    fill: "black",
                    title: 'Error de acceso', 
                    description: 'El usuario o la contraseña son incorrectos.' 
                });
            } else if (data.user || data.session) {
                sileo.success({ 
                    styles: {
                        title: "text-white!",
                        description: "text-white/75!",
                    },
                    fill: "black",
                    title: isSignUp ? '¡Registro exitoso!' : '¡Acceso concedido!',
                });
                navigate('/calendar');
            }
        } catch (err: any) {
            console.error('Unexpected error:', err);
            sileo.error({ 
                title: 'Error inesperado', 
                description: 'Algo salió mal. Por favor, inténtalo de nuevo.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background ">
            {/* Left side: Background Image */}
            <div className="hidden lg:flex relative overflow-hidden flex-col justify-between p-12 text-white">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform hover:scale-105 duration-[10s]"
                    style={{ backgroundImage: `url(${loginBg})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
                </div>
            

                <div className="relative z-10 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg font-medium italic">
                            &ldquo;Diez mil años he estado cautivo, y he luchado contra vuestra clase en incontables ocasiones. Yo soy el señor de Terrallende, y vosotros no estáis preparados.&rdquo;
                        </p>
                        <footer className="text-sm font-semibold text-primary">Illidan Tempestira</footer>
                    </blockquote>
                </div>
            </div>

            {/* Right side: Login Form */}
            <div className="flex items-center flex-col gap-4 justify-center p-8 bg-[#0a0a0c] relative overflow-hidden">
                <Ripple />
                <AuroraText className='text-4xl sm:text-6xl font-bold relative z-10'>Únete</AuroraText>
                <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-right-4 duration-500 relative z-10">
                    <Card className="relative border-border/50 bg-card/50 backdrop-blur-md shadow-2xl overflow-hidden">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                <LogIn className="size-5 text-primary" />
                                {isSignUp ? 'Crear nueva cuenta' : 'Iniciar sesión'}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                {isSignUp 
                                    ? 'Regístrate para unirte a la hermandad y empezar a raidear.' 
                                    : 'Introduce tus credenciales para acceder a la gestión de la guild.'}
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                                        <Input 
                                            id="email"
                                            type="email" 
                                            placeholder="ejemplo@hermandad.com" 
                                            className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Contraseña</Label>
                                        {!isSignUp && (
                                            <a href="#" className="text-xs text-primary hover:underline font-medium">¿Olvidaste tu contraseña?</a>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                                        <Input 
                                            id="password"
                                            type="password" 
                                            placeholder="••••••••"
                                            className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required 
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-11 font-semibold group relative overflow-hidden shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] transition-all" disabled={loading}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-foreground/0 via-primary-foreground/10 to-primary-foreground/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        isSignUp ? 'Registrarse' : 'Iniciar Sesión'
                                    )}
                                </Button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator className="w-full" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#121214] px-2 text-muted-foreground">O continúa con</span>
                                </div>
                            </div>

                            <Button 
                                variant="outline" 
                                className="w-full h-11  border-border/50 hover:bg-muted/50 transition-all font-medium"
                                onClick={() => signInWithGoogle()}
                                disabled={loading}
                            >
                                <Chrome className="mr-2 h-4 w-4" />
                                Google
                            </Button>
                        </CardContent>
                        
                        <CardFooter className="flex flex-col gap-4">
                            <p className="text-sm text-center text-muted-foreground">
                                {isSignUp ? '¿Ya eres miembro?' : '¿Aún no estás en la lista?'} {' '}
                                <button
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="text-primary font-bold hover:underline underline-offset-4 focus:outline-none"
                                >
                                    {isSignUp ? 'Inicia Sesión' : 'Crea una cuenta aquí'}
                                </button>
                            </p>
                        </CardFooter>
                        <BorderBeam duration={8} size={250} colorFrom="#86b518" colorTo="#3db518" />
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Login;

