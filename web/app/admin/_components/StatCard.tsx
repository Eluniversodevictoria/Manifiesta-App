export function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number | null | undefined;
  sub?: string;
  accent?: boolean;
}) {
  const isEmpty = value === null || value === undefined || value === '';
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid color-mix(in oklab, var(--text-tertiary) 14%, transparent)',
        borderRadius: 12,
        padding: '1rem 1.25rem',
      }}
    >
      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
        {label}
      </p>
      <p
        style={{
          fontSize: isEmpty ? 14 : 26,
          fontWeight: 600,
          color: isEmpty ? 'var(--text-tertiary)' : accent ? 'var(--accent)' : 'var(--text-primary)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {isEmpty ? 'Sin datos' : value}
      </p>
      {sub && !isEmpty && (
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{sub}</p>
      )}
    </div>
  );
}
