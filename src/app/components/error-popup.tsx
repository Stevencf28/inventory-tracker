// src/app/components/error-popup.tsx
"use client";
import { useEffect, useState } from "react";

type Props = {
	open?: boolean; // controlled
	message?: string; // controlled
	autoHideMs?: number; // optional
	onClose?: () => void;
};

export default function ErrorPopup({
	open,
	message,
	autoHideMs = 4500,
	onClose,
}: Props) {
	const [show, setShow] = useState(false);
	const [isFadingOut, setIsFadingOut] = useState(false);
	const [msg, setMsg] = useState("");

	useEffect(() => {
		if (open && message) {
			setMsg(message);
			setShow(true);
			setIsFadingOut(false);

			const fadeTimer = setTimeout(
				() => setIsFadingOut(true),
				autoHideMs - 500
			);
			const hideTimer = setTimeout(() => {
				setShow(false);
				setIsFadingOut(false);
				onClose?.();
			}, autoHideMs);
			return () => {
				clearTimeout(fadeTimer);
				clearTimeout(hideTimer);
			};
		}
	}, [open, message, autoHideMs]);

	if (!show) return null;

	return (
		<div
			className={`fixed top-0 mt-4 z-50 ${
				isFadingOut ? "animate-fade-out" : "animate-fade-in"
			}`}
		>
			<div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg border border-red-600">
				<div className="flex items-center">
					<p className="font-medium">{msg}</p>
				</div>
			</div>
		</div>
	);
}
