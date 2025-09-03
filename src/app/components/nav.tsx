import Link from "next/link";
import "./nav.css";
import { signout } from "../auth/auth";

export default function Nav({ userName }: { userName: string }) {
	return (
		<nav className="bg-white w-sm h-screen p-4 text-black flex flex-col space-y-2">
			<div className="flex flex-row justify-center items-center space-x-2">
				<h2 className="text-xl">Welcome, {userName}.</h2>
				<button
					className="w-fit bg-red-500 text-sm py-2 px-3 text-white rounded-lg border-2 border-red-700 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
					onClick={signout}
				>
					Log Out
				</button>
			</div>
			<div className="flex flex-col w-full space-y-2 ">
				<Link href="/dashboard">Dashboard</Link>
				<Link href="/dashboard/inventory">Inventory</Link>
			</div>
		</nav>
	);
}
