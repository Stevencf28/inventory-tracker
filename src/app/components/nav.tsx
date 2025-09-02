import Link from "next/link";
import "./nav.css";
import { signout } from "../auth/auth";

export default function Nav({ userName }: { userName: string }) {
	return (
		<nav className="bg-white w-sm h-screen p-4 text-black flex flex-col space-y-2">
			<div className="flex flex-col w-full space-y-2">
				<Link href="/dashboard" className="border">
					Dashboard
				</Link>
				<Link href="/dashboard/inventory">Inventory</Link>
				<label>Welcome, {userName}.</label>
				<button
					className="w-fit bg-red-600 text-base p-2 px-4 text-white rounded-lg border-2 border-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
					onClick={signout}
				>
					Log Out
				</button>
			</div>
		</nav>
	);
}
