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
			<table className="border border-gray-300 divide-y divide-gray-200 flex flex-col">
				<thead className="bg-gray-100 w-full">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr
							key={headerGroup.id}
							className="divide-x divide-gray-200 w-full flex flex-row justify-center"
						>
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									onClick={header.column.getToggleSortingHandler()}
									className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer select-none hover:bg-gray-200"
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
				<tbody className="w-full divide-y divide-gray-200">
					{table.getRowModel().rows.map((row) => (
						<tr
							key={row.id}
							className="hover:bg-gray-50 transition-colors divide-x divide-gray-200 w-full flex flex-row justify-center"
						>
							{row.getVisibleCells().map((cell) => (
								<td
									key={cell.id}
									className="px-4 py-2 w-full text-sm text-gray-800"
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
