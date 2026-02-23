import { middleEastCountries } from "./countries";

interface Props {
  hoveredCountry: string | null;
  onHover: (name: string | null) => void;
}

const MiddleEastSVGMap = ({ hoveredCountry, onHover }: Props) => (
  <svg
    viewBox="0 0 1000 700"
    className="w-full h-auto"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: "drop-shadow(8px 12px 16px rgba(0,0,0,0.25))" }}
  >
    <defs>
      <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(210, 15%, 88%)" />
        <stop offset="100%" stopColor="hsl(210, 10%, 82%)" />
      </linearGradient>
      <linearGradient id="landHover" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(215, 80%, 55%)" />
        <stop offset="100%" stopColor="hsl(215, 70%, 45%)" />
      </linearGradient>
      <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(210, 10%, 60%)" />
        <stop offset="100%" stopColor="hsl(210, 8%, 50%)" />
      </linearGradient>
      <filter id="countryShadow">
        <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.3)" />
      </filter>
    </defs>

    {/* 3D shadow layer - offset version of all countries */}
    {middleEastCountries.map((country) => (
      <path
        key={`shadow-${country.name}`}
        d={country.path}
        fill="hsl(210, 8%, 55%)"
        opacity="0.4"
        transform="translate(6, 8)"
        className="pointer-events-none"
      />
    ))}

    {/* Country shapes */}
    {middleEastCountries.map((country) => {
      const isHovered = hoveredCountry === country.name;
      return (
        <g key={country.name}>
          <path
            d={country.path}
            fill={isHovered ? "url(#landHover)" : "url(#landGrad)"}
            stroke={isHovered ? "hsl(215, 80%, 50%)" : "hsl(210, 10%, 72%)"}
            strokeWidth={isHovered ? "1.5" : "0.6"}
            filter={isHovered ? "url(#countryShadow)" : undefined}
            className="transition-all duration-300 cursor-pointer"
            onMouseEnter={() => onHover(country.name)}
            onMouseLeave={() => onHover(null)}
          />
          {/* Country name label */}
          <text
            x={country.labelX}
            y={country.labelY}
            textAnchor="middle"
            fill={isHovered ? "hsl(0, 0%, 100%)" : "hsl(210, 10%, 45%)"}
            fontSize={country.name === "Bahrain" || country.name === "Qatar" || country.name === "Palestine" ? "7" : "9"}
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
