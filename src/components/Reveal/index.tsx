import { ElementType, ReactNode, CSSProperties } from 'react'

type RevealDirection = 'up' | 'right'

interface RevealProps {
  children?: ReactNode
  as?: ElementType
  delay?: number
  direction?: RevealDirection
  className?: string
  style?: CSSProperties
  id?: string
}

export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  direction = 'up',
  className = '',
  style,
  id,
}: RevealProps) {
  const Comp: any = Tag
  const revealClass = direction === 'right' ? 'reveal-right' : 'reveal'

  return (
    <Comp
      id={id}
      className={`${revealClass} ${className}`.trim()}
      style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Comp>
  )
}