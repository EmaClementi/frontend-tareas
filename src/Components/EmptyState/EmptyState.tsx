import "./EmptyState.css";

interface Props {
    title: string;
    subtitle: string;
    type?: "tasks" | "search" | "dashboard";
}

export const EmptyState = ({ title, subtitle, type = "tasks" }: Props) => {
    const getIcon = () => {
        switch (type) {
            case "search": return "🔍";
            case "dashboard": return "📈";
            default: return "✨";
        }
    };

    return (
        <div className="empty-state">
            <div className="empty-state-illustration">
                <div className="illustration-circle"></div>
                <span className="illustration-icon">{getIcon()}</span>
            </div>
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-subtitle">{subtitle}</p>
        </div>
    );
};
