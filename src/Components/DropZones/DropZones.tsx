import { useState } from "react";
import "./DropZones.css";

type Props = {
  onDrop: (estado: string) => void;
  onDragLeave: () => void;
};

export function DropZones({ onDrop }: Props) { // 🔧 Removido onDragLeave de destructuring
  const [hoverZone, setHoverZone] = useState<string | null>(null);

  const zonas = [
    {
      estado: "PENDIENTE",
      label: "⏳ Pendiente",
      color: "red",
    },
    {
      estado: "EN_PROGRESO",
      label: "🚧 En Progreso",
      color: "blue",
    },
    {
      estado: "COMPLETADA",
      label: "✅ Completada",
      color: "green",
    },
    {
      estado: "CANCELADA",
      label: "❌ Cancelada",
      color: "gray",
    },
  ];

  const handleDragOver = (e: React.DragEvent, estado: string) => {
    e.preventDefault();
    e.stopPropagation();
    setHoverZone(estado);
  };

  const handleDrop = (e: React.DragEvent, estado: string) => {
    e.preventDefault();
    e.stopPropagation();
    onDrop(estado);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget === e.target) {
      setHoverZone(null);
    }
  };

  return (
    <div 
      className="drop-zones-overlay" 
      onDragLeave={handleDragLeave}
    >
      <div className="drop-zones-container">
        {zonas.map((zona) => (
          <div
            key={zona.estado}
            className={`drop-zone drop-zone-${zona.color} ${
              hoverZone === zona.estado ? "drop-zone-hover" : ""
            }`}
            onDragOver={(e) => handleDragOver(e, zona.estado)}
            onDragLeave={() => setHoverZone(null)}
            onDrop={(e) => handleDrop(e, zona.estado)}
          >
            <div className="drop-zone-content">
              <span className="drop-zone-icon">
                {zona.label.split(" ")[0]}
              </span>
              <span className="drop-zone-label">
                {zona.label.split(" ").slice(1).join(" ")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}