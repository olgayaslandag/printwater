import Reveal from '@/src/components/Reveal'

interface TechItemProps {
  icon: string
  title: string
  description: string
  delay?: number
}

export default function TechItem({ icon, title, description, delay = 0 }: TechItemProps) {
  return (
    <Reveal as="div" className="tech-item" delay={delay}>
      <div className="tech-icon">{icon}</div>
      <div>
        <strong>{title}</strong>
        <small>{description}</small>
      </div>
    </Reveal>
  )
}
