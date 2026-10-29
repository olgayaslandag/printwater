import Reveal from '@/src/components/Reveal'
import Counter from './Counter'

interface StatItemProps {
  value: string
  label: string
  delay?: number
}

export default function StatItem({ value, label, delay = 0 }: StatItemProps) {
  return (
    <Reveal as="div" className="stat" delay={delay}>
      <strong>
        <Counter value={value} />
      </strong>
      <span>{label}</span>
    </Reveal>
  )
}
