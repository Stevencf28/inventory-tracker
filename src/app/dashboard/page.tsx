import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Inventory Tracker by Steven Chen",
};

export default function Dashboard() {
	return (
		<main className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				<h1>Dashboard</h1>
			</div>
		</main>
	);
}
