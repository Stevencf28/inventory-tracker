"use client";

import Link from "next/link";
import "./nav.css";
import { signout } from "../auth/auth";
import Image from "next/image";
import { useState } from "react";

export default function Nav({ userName }: { userName: string }) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	return (
		<>
			{/* Mobile Header */}
			<div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md p-4 flex items-center justify-between">
				<Image src="/logo.svg" alt="logo" width={120} height={120} />
				<button
					onClick={toggleMobileMenu}
					className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
					aria-label="Toggle mobile menu"
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d={"M4 6h16M4 12h16M4 18h16"}
						/>
					</svg>
				</button>
			</div>

			{/* Mobile Menu Overlay */}
			{isMobileMenuOpen && (
				<div
					className="md:hidden fixed inset-0 bg-black/30 bg-opacity-50 z-60"
					onClick={closeMobileMenu}
				/>
			)}

			{/* Mobile Menu Sidebar */}
			<div
				className={`md:hidden fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-70 transform transition-transform duration-300 ease-in-out ${
					isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="p-6 h-full flex flex-col">
					{/* Mobile Menu Header */}
					<div className="flex items-center justify-between mb-8">
						<Image src="/logo.svg" alt="logo" width={120} height={120} />
						<button
							onClick={closeMobileMenu}
							className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
							aria-label="Close mobile menu"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					{/* Mobile Menu Content */}
					<div className="flex-1 flex flex-col">
						<h2 className="text-lg font-semibold mb-6 text-gray-800">
							Welcome, {userName}.
						</h2>

						{/* Navigation Links */}
						<nav className="flex flex-col space-y-4 mb-8">
							<Link
								href="/dashboard"
								className="nav-link"
								onClick={closeMobileMenu}
							>
								Dashboard
							</Link>
							<Link
								href="/dashboard/inventory"
								className="nav-link"
								onClick={closeMobileMenu}
							>
								Inventory
							</Link>
						</nav>

						{/* Logout Button */}
						<button
							className="w-fit bg-red-500 text-sm py-2 px-3 text-white rounded-lg border-2 hover:bg-red-600 hover:cursor-pointer transition-colors duration-200 font-medium"
							onClick={() => {
								closeMobileMenu();
								signout();
							}}
						>
							Log Out
						</button>
					</div>
				</div>
			</div>

			{/* Desktop Navigation */}
			<nav className="hidden md:flex flex-col bg-white min-w-4xs lg:min-w-xs h-screen p-4 text-black">
				<div className="flex flex-col justify-center items-center space-y-2 mb-8">
					<Image src="/logo.svg" alt="logo" width={140} height={140} />
					<h2 className="text-lg font-semibold">Welcome, {userName}.</h2>
				</div>
				<div className="flex flex-col w-full space-y-2">
					<Link href="/dashboard" className="nav-link">
						Dashboard
					</Link>
					<Link href="/dashboard/inventory" className="nav-link">
						Inventory
					</Link>
					<button
						className="w-fit bg-red-500 text-sm py-2 px-3 text-white rounded-lg border-2 hover:bg-red-600 hover:cursor-pointer transition-colors duration-200 font-medium"
						onClick={signout}
					>
						Log Out
					</button>
				</div>
			</nav>
		</>
	);
}
