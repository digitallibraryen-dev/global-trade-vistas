import { middleEastCountries, polygonToPath, getPolygonCentroid } from "./countries";

interface Props {
  hoveredCountry: string | null;
  onHover: (name: string | null) => void;
}

const MiddleEastSVGMap = ({ hoveredCountry, onHover }: Props) => (
  <svg
    viewBox="0 0 1000 700"
    className="w-full h-auto"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(220, 8%, 12%)" />
        <stop offset="100%" stopColor="hsl(220, 10%, 10%)" />
      </linearGradient>
      <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(220, 6%, 28%)" />
        <stop offset="100%" stopColor="hsl(220, 5%, 22%)" />
      </linearGradient>
      <linearGradient id="landHover" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(220, 8%, 36%)" />
        <stop offset="100%" stopColor="hsl(220, 6%, 30%)" />
      </linearGradient>
      <filter id="countryShadow">
        <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.4)" />
      </filter>
      <filter id="glowEffect">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Water background */}
    <rect width="1000" height="700" fill="url(#waterGrad)" rx="12" />

    {/* Grid lines */}
    {[100, 200, 300, 400, 500, 600].map((y) => (
      <line
        key={`h${y}`}
        x1="0" y1={y} x2="1000" y2={y}
        stroke="hsl(220, 8%, 16%)"
        strokeWidth="0.4"
        strokeDasharray="6 12"
      />
    ))}
    {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => (
      <line
        key={`v${x}`}
        x1={x} y1="0" x2={x} y2="700"
        stroke="hsl(220, 8%, 16%)"
        strokeWidth="0.4"
        strokeDasharray="6 12"
      />
    ))}

    {/* Country shapes */}
    {middleEastCountries.map((country) => {
      const isHovered = hoveredCountry === country.name;
      const [cx, cy] = getPolygonCentroid(country.polygons[0]);
      const isSmall = country.name === "Bahrain" || country.name === "Qatar" || country.name === "Palestine" || country.name === "Lebanon" || country.name === "Cyprus" || country.name === "Kuwait";

      return (
        <g key={country.name}>
          {/* Render all polygons for this country */}
          {country.polygons.map((polygon, pi) => (
            <path
              key={`${country.name}-${pi}`}
              d={polygonToPath(polygon)}
              fill={isHovered ? "url(#landHover)" : "url(#landGrad)"}
              stroke={isHovered ? "hsl(var(--primary))" : "hsl(220, 10%, 38%)"}
              strokeWidth={isHovered ? "1.5" : "0.7"}
              filter={isHovered ? "url(#countryShadow)" : undefined}
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => onHover(country.name)}
              onMouseLeave={() => onHover(null)}
            />
          ))}
          {/* Country name label */}
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fill={isHovered ? "hsl(0, 0%, 95%)" : "hsl(0, 0%, 60%)"}
            fontSize={isSmall ? "7" : "9"}
            fontWeight="500"
            className="pointer-events-none select-none transition-all duration-300"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            {country.name}
          </text>
        </g>
      );
    })}
  </svg>
);

export default MiddleEastSVGMap;
