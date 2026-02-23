import { middleEastCountries, polygonToPath, getPolygonCentroid, MAP_BOUNDS } from "./countries";

interface Props {
  hoveredCountry: string | null;
  onHover: (name: string | null) => void;
}

const MiddleEastSVGMap = ({ hoveredCountry, onHover }: Props) => (
  <svg
    viewBox={`0 0 ${MAP_BOUNDS.width} ${MAP_BOUNDS.height}`}
    className="w-full h-auto"
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Country shapes */}
    {middleEastCountries.map((country) => {
      const isHovered = hoveredCountry === country.name;
      const [cx, cy] = getPolygonCentroid(country.polygons[0]);
      const isSmall = ["Bahrain", "Qatar", "Palestine", "Lebanon", "Cyprus", "Kuwait"].includes(country.name);

      return (
        <g key={country.name}>
          {country.polygons.map((polygon, pi) => (
            <path
              key={`${country.name}-${pi}`}
              d={polygonToPath(polygon)}
              className={`map-country transition-all duration-300 cursor-pointer ${isHovered ? "map-country-hover" : ""}`}
              onMouseEnter={() => onHover(country.name)}
              onMouseLeave={() => onHover(null)}
            />
          ))}
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            className={`pointer-events-none select-none transition-all duration-300 ${isHovered ? "fill-foreground" : "fill-muted-foreground"}`}
            fontSize={isSmall ? "7" : "9"}
            fontWeight="500"
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
