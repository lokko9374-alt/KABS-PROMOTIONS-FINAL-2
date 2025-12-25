'use client'

import Link from 'next/link'
import React from 'react'

type Variant = 'primary' | 'outline' | 'ghost'

export type ButtonProps = {
  variant?: Variant
  className?: string
  children: React.ReactNode

  // Common button props
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>

  // Optional link mode
  href?: string
  target?: string
  rel?: string
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export default function Button({
  variant = 'primary',
  className,
  children,
  type = 'button',
  disabled,
  onClick,
  href,
  target,
  rel,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-gold/40'

  const styles: Record<Variant, string> = {
    primary:
      'bg-accent-gold text-background hover:bg-accent-orange hover:text-background shadow-[0_0_30px_rgba(245,179,1,0.15)]',
    outline:
      'bg-transparent border border-border text-text-primary hover:border-accent-gold/50 hover:shadow-[0_0_30px_rgba(245,179,1,0.15)]',
    ghost: 'bg-transparent text-text-primary hover:bg-card/40',
  }

  const disabledStyles = disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''

  // Link mode
  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={cn(base, styles[variant], disabledStyles, className)}
        aria-disabled={disabled ? 'true' : undefined}
      >
        {children}
      </Link>
    )
  }

  // Button mode
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(base, styles[variant], disabledStyles, className)}
    >
      {children}
    </button>
  )
}
