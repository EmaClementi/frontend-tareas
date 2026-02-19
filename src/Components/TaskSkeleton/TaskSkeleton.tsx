import "./TaskSkeleton.css";

export const TaskSkeleton = () => {
    return (
        <div className="task-skeleton-card">
            <div className="task-skeleton-header">
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-icon"></div>
            </div>
            <div className="task-skeleton-meta">
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text short"></div>
            </div>
            <div className="task-skeleton-footer">
                <div className="skeleton skeleton-badge"></div>
                <div className="skeleton skeleton-badge"></div>
            </div>
        </div>
    );
};
