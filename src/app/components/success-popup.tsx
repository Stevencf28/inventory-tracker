"use client";

import { useEffect, useState } from "react";

type Props = {
	open?: boolean;
	message?: string;
	autoHideMs?: number;
	onClose?: () => void;
};

export default function SuccessPopup({
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

			const fadeTimer = setTimeout(() => {
				setIsFadingOut(true);
			}, autoHideMs - 500);

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
			className={`fixed top-4 left-1/2 -translate-x-1/2 transform z-50 ${
				isFadingOut ? "animate-fade-out" : "animate-fade-in"
			}`}
		>
			<div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg border border-green-600">
				<div className="flex items-center">
					<p className="font-medium">{msg}</p>
				</div>
			</div>
		</div>
	);
}
