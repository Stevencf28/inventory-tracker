"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPopup() {
	const [showPopup, setShowPopup] = useState(false);
	const [isFadingOut, setIsFadingOut] = useState(false);
	const [message, setMessage] = useState("");
	const searchParams = useSearchParams();

	useEffect(() => {
		const successParam = searchParams.get("success");
		if (successParam) {
			setMessage(decodeURIComponent(successParam));
			setShowPopup(true);
			setIsFadingOut(false);

			// Start fade-out animation after 4 seconds
			const fadeTimer = setTimeout(() => {
				setIsFadingOut(true);
			}, 4000);

			// Completely hide after 4.5 seconds (0.5s animation)
			const hideTimer = setTimeout(() => {
				setShowPopup(false);
				setIsFadingOut(false);
			}, 4500);

			return () => {
				clearTimeout(fadeTimer);
				clearTimeout(hideTimer);
			};
		}
	}, [searchParams]);

	if (!showPopup) return null;

	return (
		<div
			className={`fixed top-0 mt-4 transform z-50 ${
				isFadingOut ? "animate-fade-out" : "animate-fade-in"
			}`}
		>
			<div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg border border-green-600">
				<div className="flex items-center space-x-2">
					<svg
						className="w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clipRule="evenodd"
						/>
					</svg>
					<p className="font-medium">{message}</p>
				</div>
			</div>
		</div>
	);
}
