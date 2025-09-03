import Link from "next/link";

export default function AuthCodeErrorPage() {
	return (
		<main className="flex justify-center items-center h-screen w-screen text-gray-800">
			<div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-center">
				<h1 className="text-2xl font-semibold text-red-600 mb-4">
					Authentication Error
				</h1>

				<p className="text-gray-600 mb-6">
					The authentication link you clicked is invalid or has expired. Please
					request a new password reset link.
				</p>

				<div className="space-y-3">
					<Link
						href="/"
						className="block w-full p-3 bg-blue-600 text-white rounded-lg border-2 border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
					>
						Back to Homepage
					</Link>
				</div>
			</div>
		</main>
	);
}
