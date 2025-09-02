
import Link from "next/link";
import "./nav.css";

export default function Nav() {
	return (
		<nav className="bg-white w-sm h-screen p-4 text-black flex flex-col space-y-2">
			<div className="flex flex-col w-full space-y-2">
				<Link href="/dashboard" className="border">
					Dashboard
				</Link>
				<Link href="/dashboard/inventory">Inventory</Link>
			</div>
		</nav>
	);
}
