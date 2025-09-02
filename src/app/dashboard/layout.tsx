import Nav from "../components/nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-row">
			<Nav />
			<main className="p-8">
				{children}
			</main>
		</div>
	);
}
