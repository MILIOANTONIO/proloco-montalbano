type Point = { label: string; count: number };

export default function VisitsChart({ data }: { data: Point[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const width = 640;
  const height = 160;
  const barGap = 4;
  const barWidth = data.length > 0 ? width / data.length - barGap : 0;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height + 24}`} className="h-48 w-full min-w-[480px]">
        {data.map((d, i) => {
          const barHeight = max > 0 ? (d.count / max) * height : 0;
          const x = i * (barWidth + barGap);
          const y = height - barHeight;
          return (
            <g key={d.label}>
              <rect
                x={x}
                y={y}
                width={Math.max(barWidth, 1)}
                height={Math.max(barHeight, 1)}
                rx={3}
                className="fill-emerald-600"
              />
              <title>{`${d.label}: ${d.count}`}</title>
              {(i % Math.ceil(data.length / 8 || 1) === 0 || i === data.length - 1) && (
                <text
                  x={x + barWidth / 2}
                  y={height + 16}
                  textAnchor="middle"
                  className="fill-gray-500 text-[9px]"
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
