export function ErrorState({
  title = 'Something went wrong',
  message,
}: {
  title?: string
  message?: string
}) {
  return (
    <div className="rounded-4 bg-white p-4 text-center shadow-sm">
      <h2 className="h5 mb-2">{title}</h2>
      <p className="mb-0 text-muted">
        {message ?? 'Please refresh the page or try again shortly.'}
      </p>
    </div>
  )
}
