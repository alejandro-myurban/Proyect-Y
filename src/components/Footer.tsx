import { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Copy, Check } from 'lucide-react';

export default function Footer() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText('inyafacelol.strode497@passinbox.com');
    setCopied(true);
    setOpen(true);
    setTimeout(() => {
      setCopied(false);
      setOpen(false);
    }, 2000);
  };

  return (
    <footer className="w-full bg-black flex items-center justify-center py-4">
      <small>
        Created with ❤️ by{' '}
        <button 
          onClick={handleClick}
          className="text-primary hover:underline cursor-pointer font-medium"
        >
          Iny4face
        </button>
      </small>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[300px] p-0 overflow-hidden border-primary/30 bg-black/90 backdrop-blur-md">
          <div className="relative p-6 text-center">
            {/* Brillos decorativos */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-2 left-4 w-2 h-2 bg-primary/60 rounded-full animate-ping" />
              <div className="absolute top-4 right-2 w-1.5 h-1.5 bg-primary/80 rounded-full animate-pulse" />
              <div className="absolute bottom-3 left-2 w-1 h-1 bg-primary/70 rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
              <div className="absolute bottom-2 right-4 w-2 h-2 bg-primary/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                {copied ? (
                  <Check className="w-6 h-6 text-primary" />
                ) : (
                  <Copy className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <p className="text-white font-bold text-lg">¡Email copiado!</p>
                <p className="text-white/50 text-sm">inyafacelol.strode497@passinbox.com</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}