"use client";

import { useState } from "react";
import { login, requestPasswordReset, signup } from "./auth/auth";
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
import SuccessPopup from "./components/success-popup";
import ErrorPopup from "./components/error-popup";
import { useRouter } from "next/navigation";
import Image from "next/image";

function isNextRedirectError(err: unknown): boolean {
	if (typeof err !== "object" || err === null) return false;
	return (
		"digest" in err && (err as { digest?: unknown }).digest === "NEXT_REDIRECT"
	);
}

export default function Home() {
	const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const [openReset, setOpenReset] = useState(false);
	const [successOpen, setSuccessOpen] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");
	const [errOpen, setErrOpen] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const router = useRouter();

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

	async function handleRequestPasswordReset(formdata: FormData) {
		try {
			const res = await requestPasswordReset(formdata);
			if (res) {
				setSuccessMsg(
					"Password reset instructions has been sent to the email."
				);
				setSuccessOpen(true);
				setOpenReset(false);
			}
		} catch (e) {
			setErrMsg(e instanceof Error ? e.message : "Something went wrong");
			setErrOpen(true);
		}
	}

	async function handleLogin(formdata: FormData) {
		try {
			const res = await login(formdata);
			if (!res.status) {
				setErrMsg(res.errorMessage ?? "Something went wrong");
				setErrOpen(true);
			} else {
				router.push("/dashboard");
			}
		} catch (e) {
			// Ignore Next.js redirect exceptions so success doesn't look like an error
			if (isNextRedirectError(e)) {
				return;
			}
			setErrMsg(e instanceof Error ? e.message : "Something went wrong");
			setErrOpen(true);
		}
	}

	async function handleSignup(formdata: FormData) {
		try {
			const res = await signup(formdata);
			console.log(res.status);
			if (!res.status) {
				setErrMsg(res.errorMessage ?? "Something went wrong");
				setErrOpen(true);
				setPassword("");
				setConfirmPassword("");
			} else {
				router.push("/dashboard");
			}
		} catch (e) {
			// Ignore Next.js redirect exceptions so success doesn't look like an error
			if (isNextRedirectError(e)) {
				return;
			}
			setErrMsg(e instanceof Error ? e.message : "Something went wrong");
			setErrOpen(true);
			setPassword("");
			setConfirmPassword("");
		}
	}
	return (
		<main className="min-w-screen min-h-screen text-gray-800 overflow-auto">
			<div className="flex lg:flex-row flex-col max-w-screen h-full lg:h-screen lg:space-x-2 justify-center items-center">
				{/* Logo and description */}
				<div className="w-full h-fit lg:h-full bg-[#E0E7FF] flex flex-col justify-center items-center lg:items-end content-center lg:px-8 lg:p-0 px-4 py-8 ">
					<Image
						src="/logo.svg"
						alt="Inventory Tracker"
						width={256}
						height={256}
						priority
						className="mb-8 right-0"
					/>
					{/* <h1 className="text-3xl sm:text-4xl 2xl:text-5xl text-center font-semibold mb-8">
						Inventory Tracker
					</h1> */}
					<p className="max-w-xs 2xl:max-w-md text-center lg:text-end w-full text-sm sm:text-base 2xl:text-3xl text-balance">
						Track your inventory easily and efficiently with our Inventory
						Tracker app.
					</p>
					<h6 className=" text-sm 2xl:text-lg italic">
						Created by Steven Chen
					</h6>
				</div>
				{/* Auth container */}
				<div className="w-full h-full flex xl:justify-start justify-center lg:items-center lg:content-center px-4  p-4 overflow-auto">
					<div
						id="auth-container"
						className="w-full max-w-lg px-8 justify-center items-center"
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
												className="border-2 border-gray-300 rounded-md px-3 py-2 xl:px-4 xl:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
											<input
												required
												type="password"
												id="password"
												name="password"
												placeholder="Enter your password"
												className="border-2 border-gray-300 rounded-md px-3 py-2 xl:px-4 xl:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
											formAction={handleLogin}
											className="w-full p-2 my-3 bg-blue-600 text-sm sm:text-base xl:text-lg text-white rounded-lg border-2 border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
										>
											Login
										</button>
									</form>
								</TabPanel>

								<TabPanel className="w-full transition-all duration-300 ease-in-out">
									<form className="w-full h-full" autoComplete="off">
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
												className="border-2 border-gray-300 rounded-md px-3 py-2 xl:px-4 xl:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
											<div className="flex flex-col sm:flex-row gap-2">
												<input
													required
													type="text"
													id="firstName"
													name="firstName"
													placeholder="Enter your First Name"
													className="border-2 border-gray-300 rounded-md py-2 px-3 xl:px-4 xl:py-3 w-full min-w-0 sm:flex-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												/>
												<input
													required
													type="text"
													id="lastName"
													name="lastName"
													placeholder="Enter your Last Name"
													className="border-2 border-gray-300 rounded-md py-2 px-3 xl:px-4 xl:py-3 w-full min-w-0 sm:flex-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												/>
											</div>
											<input
												required
												type="password"
												id="register-password"
												name="password"
												placeholder="Create a password"
												minLength={6}
												value={password}
												onChange={handlePasswordChange}
												className={`border-2 rounded-md px-3 py-2 xl:px-4 xl:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
												className={`border-2 rounded-md px-3 py-2 xl:px-4 xl:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
											formAction={handleSignup}
											disabled={
												!!passwordError ||
												!!confirmPasswordError ||
												password.length < 6 ||
												confirmPassword.length < 6
											}
											className="w-full p-2 my-3 bg-green-600 text-sm sm:text-base xl:text-lg text-white rounded-lg border-2 border-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
								className="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
									formAction={handleRequestPasswordReset}
									className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									Send Reset Link
								</button>
							</div>
						</form>
					</DialogPanel>
				</div>
			</Dialog>

			<SuccessPopup
				open={successOpen}
				message={successMsg}
				onClose={() => setSuccessOpen(false)}
			/>
			<ErrorPopup
				open={errOpen}
				message={errMsg}
				onClose={() => setErrOpen(false)}
			/>
		</main>
	);
}
