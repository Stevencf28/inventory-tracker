"use client";

import { useState, useEffect } from "react";
import { login, requestPasswordReset, signup } from "./auth/auth";
import { useSearchParams } from "next/navigation";
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Tab,
	TabGroup,
	TabList,
	TabPanel,
	TabPanels,
} from "@headlessui/react";

export default function Home() {
	const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const [openReset, setOpenReset] = useState(false);
	const searchParams = useSearchParams();

	useEffect(() => {
		const errorParam = searchParams.get("error");
		const messageParam = searchParams.get("message");
		if (errorParam) {
			setError(decodeURIComponent(errorParam));
		}
		if (messageParam) {
			setMessage(decodeURIComponent(messageParam));
		}
	}, [searchParams]);

	// Password validation
	const validatePassword = (value: string) => {
		if (value.length < 6) {
			return "Password must be at least 6 characters long";
		}
		return "";
	};

	const validateConfirmPassword = (value: string) => {
		if (value !== password) {
			return "Passwords do not match";
		}
		return "";
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setPassword(value);
		setPasswordError(validatePassword(value));

		// Also validate confirm password if it has a value
		if (confirmPassword) {
			setConfirmPasswordError(validateConfirmPassword(confirmPassword));
		}
	};

	const handleConfirmPasswordChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setConfirmPassword(value);
		setConfirmPasswordError(validateConfirmPassword(value));
	};

	return (
		<main className="flex justify-center items-center h-screen w-screen text-gray-800">
			<div className="flex flex-row bg-[#E0E7FF] w-full h-full space-x-2 justify-center items-center">
				<div className="w-full h-full flex flex-col justify-center items-end content-center px-8">
					<h1 className="text-4xl 2xl:text-5xl text-center font-semibold mb-8">
						Inventory Tracker
					</h1>
					<p className="max-w-xs 2xl:max-w-md text-end w-full 2xl:text-3xl">
						Track your inventory easily and efficiently with our Inventory
						Tracker app.
					</p>
					<br />
					<h6 className=" text-sm 2xl:text-lg italic">
						Created by Steven Chen
					</h6>
				</div>
				<div className="w-full h-full flex justify-start items-center content-center px-4 bg-white p-4">
					<div
						id="auth-container"
						className="flex-col w-full max-w-lg px-8 max-h-full"
					>
						{/* Tab Navigation */}
						<TabGroup
							selectedIndex={activeTab === "login" ? 0 : 1}
							onChange={(index) =>
								setActiveTab(index === 0 ? "login" : "signup")
							}
						>
							<TabList className="flex border-b border-gray-200 w-full mb-4">
								<Tab className="px-6 py-3 text-lg font-medium transition-colors w-full data-selected:border-blue-600 data-selected:border-b-2 data-selected:text-blue-600 data-not-selected:border-transparent data-not-selected:text-gray-500 data-not-selected:hover:text-gray-700">
									Login
								</Tab>
								<Tab className="px-6 py-3 text-lg font-medium transition-colors w-full data-selected:border-blue-600 data-selected:border-b-2 data-selected:text-blue-600 data-not-selected:border-transparent ui-not-selected:text-gray-500 ui-not-selected:hover:text-gray-700">
									Sign Up
								</Tab>
							</TabList>
							{/* Error Message */}
							{error && (
								<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
									{error}
								</div>
							)}

							{/* Success Message */}
							{message && (
								<div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
									{message}
								</div>
							)}

							{/* Tab Contents */}
							<TabPanels className="flex justify-center items-center p-4">
								<TabPanel className="w-full transition-all duration-300 ease-in-out">
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
												className="border-2 border-gray-300 rounded-md px-3 py-2 xl:px-4 xl:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
											<input
												required
												type="password"
												id="password"
												name="password"
												placeholder="Enter your password"
												className="border-2 border-gray-300 rounded-md px-3 py-2 xl:px-4 xl:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</div>
										<button
											type="button"
											onClick={() => setOpenReset(true)}
											className="underline text-blue-500 my-2 hover:text-blue-600 hover:cursor-pointer"
										>
											Forgot Password?
										</button>
										<button
											formAction={login}
											className="w-full p-2 my-3 bg-blue-600 text-base xl:text-lg text-white rounded-lg border-2 border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
										>
											Login
										</button>
									</form>
								</TabPanel>

								<TabPanel className="w-full transition-all duration-300 ease-in-out">
									<form className="w-full h-full">
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
												placeholder="Enter your Name"
												className="border-2 border-gray-300 rounded-md px-3 py-2 xl:px-4 xl:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
											<input
												required
												type="password"
												id="register-password"
												name="password"
												placeholder="Create a password"
												minLength={6}
												value={password}
												onChange={handlePasswordChange}
												className={`border-2 rounded-md px-3 py-2 xl:px-4 xl:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
													passwordError ? "border-red-500" : "border-gray-300"
												}`}
											/>
											{passwordError && (
												<p className="text-red-500 text-sm mt-1">
													{passwordError}
												</p>
											)}
											<input
												required
												type="password"
												id="confirm-password"
												name="confirmPassword"
												minLength={6}
												placeholder="Confirm your password"
												value={confirmPassword}
												onChange={handleConfirmPasswordChange}
												className={`border-2 rounded-md px-3 py-2 xl:px-4 xl:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
													confirmPasswordError
														? "border-red-500"
														: "border-gray-300"
												}`}
											/>
											{confirmPasswordError && (
												<p className="text-red-500 text-sm mt-1">
													{confirmPasswordError}
												</p>
											)}
										</div>
										<button
											formAction={signup}
											disabled={
												!!passwordError ||
												!!confirmPasswordError ||
												password.length < 6 ||
												confirmPassword.length < 6
											}
											className="w-full p-2 my-3 bg-green-600 text-base xl:text-lg text-white rounded-lg border-2 border-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
										>
											Create Account
										</button>
									</form>
								</TabPanel>
							</TabPanels>
						</TabGroup>
					</div>
				</div>
			</div>

			{/* Password Reset Dialog */}
			<Dialog open={openReset} onClose={setOpenReset} className="relative z-50">
				<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
				<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
					<DialogPanel className="mx-auto max-w-sm w-full rounded-lg bg-white p-6">
						<DialogTitle className="text-lg font-semibold text-gray-900 mb-4">
							Reset Password
						</DialogTitle>
						<form className="space-y-4">
							<input
								required
								type="email"
								id="emailReset"
								name="emailReset"
								placeholder="Enter your email"
								className="w-full border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							<div className="flex space-x-3">
								<button
									type="button"
									onClick={() => setOpenReset(false)}
									className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
								>
									Cancel
								</button>
								<button
									formAction={requestPasswordReset}
									className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									Send Reset Link
								</button>
							</div>
						</form>
					</DialogPanel>
				</div>
			</Dialog>
		</main>
	);
}
