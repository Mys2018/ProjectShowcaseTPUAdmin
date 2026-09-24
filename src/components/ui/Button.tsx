import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [
    'ui-btn',
    `ui-btn-${variant}`,
    size !== 'md' ? `ui-btn-${size}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...rest}>
      {loading ? 'Загрузка…' : children}
    </button>
  );
}
