import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Inventory Tracker by Steven Chen",
};

export default function Dashboard() {
	return (
		<div className="flex flex-col px-4 mt-8 space-y-4">
			<h1 className="text-3xl font-semibold">Dashboard</h1>
			<div className="flex flex-row space-x-4">
				<input
					type="date"
					className="border-2 border-gray-300 rounded-md p-2 bg-white"
				/>
				<button className="bg-blue-500 text-white rounded-md p-2">
					Search
				</button>
			</div>
		</div>
	);
}
