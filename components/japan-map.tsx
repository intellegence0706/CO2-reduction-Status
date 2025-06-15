"use client"

import { useState } from "react"

interface MapProps {
  data: any
  selectedPrefecture: string | null
  onPrefectureSelect: (prefecture: string | null) => void
  viewLevel: "prefecture" | "city"
}

export default function JapanMap({ data, selectedPrefecture, onPrefectureSelect, viewLevel }: MapProps) {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null)

  const getAreaColor = (areaKey: string, areaData: any) => {
    if (!areaData) return "#e5e7eb"

    switch (areaData.status) {
      case "excellent":
        return "#10b981"
      case "good":
        return "#3b82f6"
      case "progress":
        return "#f59e0b"
      case "warning":
        return "#f97316"
      case "danger":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const handleAreaClick = (areaKey: string) => {
    if (viewLevel === "prefecture") {
      onPrefectureSelect(areaKey === selectedPrefecture ? null : areaKey)
    }
  }

  if (viewLevel === "city" && selectedPrefecture) {
    const prefectureData = data.prefectures[selectedPrefecture]
    if (!prefectureData?.cities) return <div>No city data available</div>

    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full">
          {Object.entries(prefectureData.cities).map(([cityKey, cityData]: [string, any]) => (
            <div
              key={cityKey}
              className="relative bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border-2"
              style={{ borderColor: getAreaColor(cityKey, cityData) }}
              onMouseEnter={() => setHoveredArea(cityKey)}
              onMouseLeave={() => setHoveredArea(null)}
            >
              <div className="text-center space-y-2">
                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: getAreaColor(cityKey, cityData) }}
                >
                  {cityData.reduction}%
                </div>
                <h3 className="font-semibold text-sm">{cityData.name}</h3>
                <p className="text-xs text-gray-600">Target: {cityData.target}%</p>
              </div>

              {hoveredArea === cityKey && (
                <div className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                  {cityData.reduction}% reduction
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg relative overflow-hidden">
      <svg viewBox="0 0 800 600" className="w-full h-full" style={{ maxWidth: "100%", height: "auto" }}>
        {/* Simplified Japan Map - Prefecture Shapes */}
        {Object.entries(data.prefectures).map(([prefKey, prefData]: [string, any], index) => {
          const isSelected = selectedPrefecture === prefKey
          const isHovered = hoveredArea === prefKey

          // Simplified prefecture shapes (you would replace with actual SVG paths)
          const prefectureShapes = {
            tokyo: "M 200 300 L 250 280 L 280 320 L 230 340 Z",
            osaka: "M 150 350 L 200 330 L 220 370 L 170 380 Z",
            kanagawa: "M 220 320 L 270 300 L 290 340 L 240 360 Z",
          }

          return (
            <g key={prefKey}>
              <path
                d={
                  prefectureShapes[prefKey as keyof typeof prefectureShapes] ||
                  `M ${100 + index * 80} 200 L ${150 + index * 80} 180 L ${180 + index * 80} 220 L ${130 + index * 80} 240 Z`
                }
                fill={getAreaColor(prefKey, prefData)}
                stroke={isSelected ? "#1f2937" : "#ffffff"}
                strokeWidth={isSelected ? 3 : 1}
                className="cursor-pointer transition-all duration-200 hover:opacity-80"
                onClick={() => handleAreaClick(prefKey)}
                onMouseEnter={() => setHoveredArea(prefKey)}
                onMouseLeave={() => setHoveredArea(null)}
                style={{
                  filter: isHovered ? "brightness(1.1)" : "none",
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                  transformOrigin: "center",
                }}
              />

              {/* Prefecture Labels */}
              <text
                x={120 + index * 80}
                y={215}
                textAnchor="middle"
                className="text-xs font-semibold fill-white pointer-events-none"
                style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.5)" }}
              >
                {prefData.name}
              </text>

              {/* Reduction Percentage */}
              <text
                x={120 + index * 80}
                y={230}
                textAnchor="middle"
                className="text-xs font-bold fill-white pointer-events-none"
                style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.5)" }}
              >
                {prefData.reduction}%
              </text>
            </g>
          )
        })}

        {/* Tooltip */}
        {hoveredArea && data.prefectures[hoveredArea] && (
          <g>
            <rect x="10" y="10" width="200" height="80" fill="rgba(0,0,0,0.8)" rx="4" className="pointer-events-none" />
            <text x="20" y="30" className="text-sm font-semibold fill-white pointer-events-none">
              {data.prefectures[hoveredArea].name}
            </text>
            <text x="20" y="50" className="text-xs fill-white pointer-events-none">
              Reduction: {data.prefectures[hoveredArea].reduction}%
            </text>
            <text x="20" y="65" className="text-xs fill-white pointer-events-none">
              Target: {data.prefectures[hoveredArea].target}%
            </text>
            <text x="20" y="80" className="text-xs fill-white pointer-events-none">
              Population: {data.prefectures[hoveredArea].population.toLocaleString()}
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}
