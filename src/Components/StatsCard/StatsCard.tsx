import "./StatsCard.css";

type Props = {
  icon: string;
  title: string;
  value: number | string;
  subtitle?: string;
  color?: "blue" | "green" | "orange" | "red" | "purple" | "gray";
  percentage?: number;
};

export function StatsCard({
  icon,
  title,
  value,
  subtitle,
  color = "blue",
  percentage,
}: Props) {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-card-header">
        <span className="stats-card-icon">{icon}</span>
        <h3 className="stats-card-title">{title}</h3>
      </div>
      
      <div className="stats-card-value">{value}</div>
      
      {subtitle && <div className="stats-card-subtitle">{subtitle}</div>}
      
      {percentage !== undefined && (
        <div className="stats-card-progress">
          <div className="stats-card-progress-bar">
            <div
              className="stats-card-progress-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="stats-card-percentage">{percentage}%</span>
        </div>
      )}
    </div>
  );
}