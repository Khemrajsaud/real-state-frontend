export function Loader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="py-5 text-center text-muted" role="status" aria-live="polite">
      <div className="spinner-border text-primary mb-3" aria-hidden="true" />
      <p className="mb-0">{label}</p>
    </div>
  )
}
