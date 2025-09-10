import Link from "next/link";
import "./nav.css";
import { signout } from "../auth/auth";
import Image from "next/image";

export default function Nav({ userName }: { userName: string }) {
	return (
		<nav className="bg-white w-sm h-screen p-4 text-black flex flex-col space-y-4">
			<div className="flex flex-col justify-center items-center space-y-2">
				<Image src="/logo.svg" alt="logo" width={140} height={140} />
				<h2 className="text-lg font-semibold">Welcome, {userName}.</h2>
				<button
					className="w-fit bg-red-500 text-sm py-2 px-3 text-white rounded-lg border-2 hover:bg-red-600 hover:cursor-pointer transition-colors duration-200 font-medium"
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
