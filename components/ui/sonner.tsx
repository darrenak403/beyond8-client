'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="bottom-center"
      visibleToasts={9}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-primary group-[.toaster]:border-primary/20 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-primary/80',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground hover:group-[.toast]:bg-primary/90',
          cancelButton: 'group-[.toast]:bg-secondary group-[.toast]:text-secondary-foreground hover:group-[.toast]:bg-secondary/90',
          closeButton: 'group-[.toast]:bg-primary/10 group-[.toast]:text-primary hover:group-[.toast]:bg-primary/20 group-[.toast]:border-primary/20',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
