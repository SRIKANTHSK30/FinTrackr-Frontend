import Button, { type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Apple } from 'lucide-react';

interface SocialButtonProps extends ButtonProps {
  provider: 'google' | 'apple';
}

function GoogleGlyph() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#fff" />
      <text x="12" y="16" textAnchor="middle" fontSize="12" fontFamily="Arial, Helvetica, sans-serif" fill="#4285F4">G</text>
    </svg>
  );
}

export default function SocialButton({ provider, className, children, ...props }: SocialButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn("w-full justify-center gap-3 border-2", className)}
      {...props}
    >
      {provider === 'google' ? <GoogleGlyph /> : <Apple className="w-5 h-5" />}
      {children}
    </Button>
  );
}
