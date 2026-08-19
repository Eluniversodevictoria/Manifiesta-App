export function NoData({ reason }: { reason?: string }) {
  return (
    <div
      style={{
        padding: '2rem',
        textAlign: 'center',
        border: '1px dashed color-mix(in oklab, var(--text-tertiary) 30%, transparent)',
        borderRadius: 12,
        color: 'var(--text-tertiary)',
        fontSize: 14,
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: 4 }}>Sin datos</p>
      {reason && <p style={{ fontSize: 12 }}>{reason}</p>}
    </div>
  );
}
