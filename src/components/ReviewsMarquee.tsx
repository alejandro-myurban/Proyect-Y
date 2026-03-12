import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Marquee } from "@/components/ui/marquee";
import { ReviewCard } from "./ReviewCard";
import { supabase } from '../lib/supabase';
import { reviews } from '@/data/reviews';

type ReviewItem = {
  id?: string;
  name: string;
  username: string;
  body: string;
  img?: string;
};

export function ReviewsMarquee() {
  const [voices, setVoices] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadVoices = async () => {
      const { data } = await supabase
        .from('raid_voices')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(20);
      if (data && data.length > 0) {
        setVoices(data);
      }
      setLoading(false);
    };
    loadVoices();
  }, []);

  // Usar datos de BD si existen, si no usar el mockup
  const displayVoices: ReviewItem[] = voices.length > 0 ? voices : reviews;
  const firstRow = displayVoices.slice(0, Math.ceil(displayVoices.length / 2));
  const secondRow = displayVoices.slice(Math.ceil(displayVoices.length / 2));

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-10">
      <Marquee pauseOnHover className="[--duration:30s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.id || review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:35s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.id || review.username} {...review} />
        ))}
      </Marquee>
      
      {/* Botón añadir voz */}
      <div className="mt-6">
        <button
          onClick={() => navigate('/añadir-voz')}
          className="px-6 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          ¿Quieres añadir tu voz?
        </button>
      </div>

      {/* Decorative gradients for the edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#0a0a0c]"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#0a0a0c]"></div>
    </div>
  );
}
