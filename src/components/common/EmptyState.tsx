export function EmptyState({
  title,
  message,
}: {
  title: string
  message: string
}) {
  return (
    <div className="rounded-4 bg-white p-5 text-center shadow-sm">
      <h2 className="h4 mb-2">{title}</h2>
      <p className="mb-0 text-muted">{message}</p>
    </div>
  )
}
