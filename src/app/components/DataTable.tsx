import React from "react";
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	flexRender,
	ColumnDef,
	SortingState,
} from "@tanstack/react-table";

type DataTableProps<T extends object> = {
	data: T[];
	columns: ColumnDef<T, unknown>[];
};

export function DataTable<T extends object>({
	data,
	columns,
}: DataTableProps<T>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<div className="overflow-x-auto my-6">
			<table className="border min-w-full max-w-screen border-gray-300 divide-y divide-gray-200">
				<thead className="bg-gray-100">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id} className="divide-x divide-gray-200">
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									onClick={header.column.getToggleSortingHandler()}
									className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer select-none hover:bg-gray-200"
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
										  )}
									{{
										asc: " (↑)",
										desc: " (↓)",
									}[header.column.getIsSorted() as string] ?? null}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody className=" divide-y divide-gray-200">
					{table.getRowModel().rows.map((row) => (
						<tr
							key={row.id}
							className="hover:bg-gray-50 transition-colors divide-x divide-gray-200"
						>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} className="px-4 py-2 text-sm text-gray-800">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
					{/* Add a message when the table is empty */}
					{data.length === 0 && (
						<tr className="w-full justify-center">
							<td colSpan={columns.length} className="text-center">
								No data available.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
