export default function DataTable({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-800 shadow-lg">
      <table className="min-w-full">
        <thead className="bg-slate-700/70">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-4 text-left text-sm font-semibold text-slate-200"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick && onRowClick(item)}
              className="border-t border-slate-700 hover:bg-slate-700/40 transition"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 text-sm text-slate-300"
                >
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}