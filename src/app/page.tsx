"use client";

import { useState, useEffect } from "react";
import { login, signup } from "./auth/auth";
import { useSearchParams } from "next/navigation";

export default function Home() {
	const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
	const [error, setError] = useState("");
	const searchParams = useSearchParams();

	useEffect(() => {
		const errorParam = searchParams.get("error");
		if (errorParam) {
			setError(decodeURIComponent(errorParam));
		}
	}, [searchParams]);

	return (
		<main className="flex justify-center items-center h-screen w-screen text-gray-800">
			<div className="flex flex-row bg-[#E0E7FF] border-2 drop-shadow-2xl min-w-fit min-h-fit w-2/3 h-2/3 space-x-2  rounded-lg justify-center items-center">
				<div className="w-full h-full flex flex-col justify-center items-center content-start p-4">
					<h1 className="text-4xl 2xl:text-6xl text-center font-semibold mb-8">
						Inventory Tracker
					</h1>
					<p className="max-w-xs xl:max-w-md text-center w-full xl:text-2xl">
						Track your inventory easily and efficiently with our Inventory
						Tracker app.
					</p>
					<br />
					<h6 className=" text-sm italic">Created by Steven Chen</h6>
				</div>
				<div className="w-full h-full flex justify-center items-center content-center px-4 bg-white p-4">
					<div id="auth-container" className="flex-col w-full px-8 max-h-full">
						{/* Tab Navigation */}
						<div className="flex border-b border-gray-200 w-full mb-4">
							<button
								type="button"
								onClick={() => setActiveTab("login")}
								className={`px-6 py-3 text-lg font-medium border-b-2 transition-colors w-full ${
									activeTab === "login"
										? "border-blue-600 text-blue-600"
										: "border-transparent text-gray-500 hover:text-gray-700"
								}`}
							>
								Login
							</button>
							<button
								type="button"
								onClick={() => setActiveTab("signup")}
								className={`px-6 py-3 text-lg font-medium border-b-2 transition-colors w-full ${
									activeTab === "signup"
										? "border-blue-600 text-blue-600"
										: "border-transparent text-gray-500 hover:text-gray-700"
								}`}
							>
								Sign Up
							</button>
						</div>
						{/* Error Message */}
						{error && (
							<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
								{error}
							</div>
						)}

						{/* Tab Contents */}
						<div className="flex justify-center items-center p-4">
							{/* Login Form */}
							{activeTab === "login" && (
								<form className="w-full h-full">
									<h1 className="text-xl 2xl:text-3xl text-center mb-4 font-semibold">
										Login
									</h1>
									<div className="flex flex-col space-y-2">
										<input
											required
											type="email"
											id="email"
											name="email"
											placeholder="Enter your email"
											className=" border-2 border-gray-300 rounded-md px-3 py-2 xl:px-4 xl:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
										<input
											required
											type="password"
											id="password"
											name="password"
											placeholder="Enter your password"
											className="border-2 border-gray-300 rounded-md px-3 py-2 xl:px-4 xl:py-3  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
									<button
										formAction={login}
										className="w-full p-2 my-3 bg-blue-600 text-base xl:text-lg text-white rounded-lg border-2 border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
									>
										Login
									</button>
								</form>
							)}

							{/* register Form */}
							{activeTab === "signup" && (
								<form action={signup} className="w-full h-full">
									<h1 className="text-xl 2xl:text-3xl text-center mb-4 font-semibold">
										Sign Up
									</h1>
									<div className="flex flex-col space-y-2">
										<input
											required
											type="email"
											id="register-email"
											name="email"
											placeholder="Enter your email"
											className="border-2 border-gray-300 rounded-md px-3 py-2 xl:px-4 xl:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
										<input
											required
											type="text"
											id="username"
											name="username"
											placeholder="Enter your Username"
											className=" border-2 border-gray-300 rounded-md px-3 py-2 xl:px-4 xl:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
										<input
											required
											type="password"
											id="register-password"
											name="password"
											placeholder="Create a password"
											minLength={6}
											className="border-2 border-gray-300 rounded-md px-3 py-2 xl:px-4 xl:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
										<input
											required
											type="password"
											id="confirm-password"
											name="confirmPassword"
											minLength={6}
											placeholder="Confirm your password"
											className="border-2 border-gray-300 rounded-md px-3 py-2 xl:px-4 xl:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
									<button
										formAction={signup}
										className="w-full p-2 my-3 bg-green-600 text-base xl:text-lg text-white rounded-lg border-2 border-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
									>
										Create Account
									</button>
								</form>
							)}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
