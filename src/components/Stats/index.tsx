import { stats } from './stats'
import StatItem from './StatItem'

export default function Stats() {
  return (
    <section className="stats">
      <div className="container stats-grid">
        {stats.map((stat, index) => (
          <StatItem key={stat.label} value={stat.value} label={stat.label} delay={index * 120} />
        ))}
      </div>
    </section>
  )
}
