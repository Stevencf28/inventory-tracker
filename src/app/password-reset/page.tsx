"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { resetPassword } from "../auth/auth";

export default function PasswordReset() {
	const [error, setError] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const searchParams = useSearchParams();

	useEffect(() => {
		const errorParam = searchParams.get("error");
		if (errorParam) {
			setError(decodeURIComponent(errorParam));
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
			<div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
				<h1 className="text-2xl font-semibold text-center mb-6">
					Reset Your Password
				</h1>

				{error && (
					<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
						{error}
					</div>
				)}

				<form action={resetPassword} className="space-y-4">
					<div>
						<input
							required
							type="password"
							name="password"
							placeholder="Enter your new password"
							minLength={6}
							value={password}
							onChange={handlePasswordChange}
							className={`w-full border-2 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								passwordError ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{passwordError && (
							<p className="text-red-500 text-sm mt-1">{passwordError}</p>
						)}
					</div>

					<div>
						<input
							required
							type="password"
							name="confirmPassword"
							placeholder="Confirm your new password"
							minLength={6}
							value={confirmPassword}
							onChange={handleConfirmPasswordChange}
							className={`w-full border-2 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
								confirmPasswordError ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{confirmPasswordError && (
							<p className="text-red-500 text-sm mt-1">
								{confirmPasswordError}
							</p>
						)}
					</div>

					<button
						type="submit"
						disabled={
							!!passwordError ||
							!!confirmPasswordError ||
							password.length < 6 ||
							confirmPassword.length < 6
						}
						className="w-full p-3 bg-blue-600 text-white rounded-lg border-2 border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Update Password
					</button>
				</form>
			</div>
		</main>
	);
}
