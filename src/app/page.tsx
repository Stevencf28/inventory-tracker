import Form from 'next/form'

export default function Home() {
  return (
    <main className="flex justify-center items-center h-screen w-screen text-gray-800">
			<div className="flex flex-row bg-[#E0E7FF] border-2 drop-shadow-2xl min-w-fit min-h-fit w-2/3 h-2/3 space-x-2  rounded-lg justify-center items-center">
				<div className="w-full h-full flex flex-col justify-center items-center content-start p-4">
					<h1 className="text-4xl 2xl:text-6xl text-center mb-8">
						Inventory Tracker
					</h1>
					<p className="max-w-xs w-full justify-self-center 2xl:text-2xl">
						Track your inventory easily and efficiently with our Inventory
						Tracker app.
					</p>
				</div>
				<div className="w-full h-full flex justify-center items-center content-center px-4 bg-white p-4">
					<Form className="flex-col w-1/2" action={'/login'}>
						<h1 className="text-4xl 2xl:text-6xl text-center mb-8">Login</h1>
						<div className="flex flex-col space-y-4">
							<div className="flex flex-col space-y-2">
								<label htmlFor="username" className="text-sm font-medium text-gray-700">
									Username
								</label>
								<input
									required
									type="text"
									id="username"
									name="username"
									placeholder="Enter your username"
									className="border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
							<div className="flex flex-col space-y-2">
								<label htmlFor="password" className="text-sm font-medium text-gray-700">
									Password
								</label>
								<input
									required
									type="password"
									id="password"
									name="password"
									placeholder="Enter your password"
									className="border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
						</div>
						<button
							type="submit"
							className="w-full p-3 my-6 bg-blue-600 text-white rounded-lg border-2 border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
						>
							Login
						</button>
					</Form>
				</div>
			</div>
		</main>
  );
}
