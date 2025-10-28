import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SocialButtonProps extends ButtonProps {
  provider: 'google' | 'apple';
}

export function SocialButton({ provider, className, children, ...props }: SocialButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn("w-full justify-center gap-3 border-2", className)}
      {...props}
    >
      {provider === 'google' && (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12ViewBox="0 0 24 24"><path fill="#EA4335" d="M12 22.31c2.84 0 5.22-.95 6.96-2.58l-3.32-2.57c-.94.63-2.14.98-3.64.98-2.8 0-5.17-1.89-6.02-4.43L4.6 16.24c1.89 3.72 5.76 6.27 10.4 6.27z"/><path fill="#4285F4" d="M1 12.49c0-1.4.34-2.72.94-3.88L5.66 11c-.27.85-.42 1.75-.42 2.68 0 .93.15 1.83.42 2.68L1.94 20.24c-.6-1.16-.94-2.48-.94-3.88z"/><path fill="#FBBC05" d="M12 5.74c1.5 0 2.85.52 3.9 1.54L19.67 5C17.62 3.14 15.02 2.18 12 2.18 7.36 2.18 3.49 4.73 1.6 8.45l3.72 2.88C6.83 9.63 9.2 7.74 12 7.74z"/><path fill="#34A853" d="M12 19.74c2.8 0 5.17-1.89 6.02-4.43l3.72 2.88c-2.05 1.86-5.65 2.82-9.74 2.82-4.64 0-8.51-2.55-10.4-6.27l3.72-2.88c.85 2.54 3.22 4.43 6.02 4.43z"/><path fill="#34A853" d="M12 9.99c1.62 0 3.06.56 4.21 1.66l3.13- dominates
