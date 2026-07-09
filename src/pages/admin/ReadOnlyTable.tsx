import { useQuery } from '@tanstack/react-query'
import { Table } from 'react-bootstrap'
import { Loader } from '../../components/common/Loader'
import { ErrorState } from '../../components/common/ErrorState'

type ReadOnlyTableProps<T extends Record<string, unknown>> = {
  title: string
  queryKey: string[]
  queryFn: () => Promise<unknown[]>
  columns: Array<{
    label: string
    render: (item: T) => React.ReactNode
  }>
}

export function ReadOnlyTable<T extends Record<string, unknown>>({
  title,
  queryKey,
  queryFn,
  columns,
}: ReadOnlyTableProps<T>) {
  const { data = [], isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => (await queryFn()) as T[],
  })

  return (
    <section>
      <p className="eyebrow text-primary">Admin</p>
      <h1 className="h2 fw-bold mb-4">{title}</h1>
      {isLoading ? <Loader /> : null}
      {isError ? <ErrorState title={`Could not load ${title.toLowerCase()}`} /> : null}
      {!isLoading && !isError ? (
        <Table responsive hover className="admin-table bg-white">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.label}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={String(item._id ?? item.id ?? index)}>
                {columns.map((column) => (
                  <td key={column.label}>{column.render(item)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      ) : null}
    </section>
  )
}
