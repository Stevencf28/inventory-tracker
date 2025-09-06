"use client";

import {
	Button,
	Dialog,
	DialogPanel,
	DialogTitle,
	Field,
	Fieldset,
	Input,
	Label,
	Select,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { getCategory, addCategory } from "@/app/auth/data";
import SuccessPopup from "@/app/components/success-popup";
import ErrorPopup from "@/app/components/error-popup";
import Category from "@/app/models";

export default function Inventory() {
	const [openPanel, setOpenPanel] = useState(false);
	const [successOpen, setSuccessOpen] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");
	const [errMsg, setErrMsg] = useState("");
	const [errOpen, setErrOpen] = useState(false);
	const [openManageCategories, setOpenManageCategories] = useState(false);
	const [openAddProduct, setOpenAddProduct] = useState(false);
	const [categoryName, setCategoryName] = useState("");
	const [categories, setCategories] = useState<Category[]>([]);
	const [loadingCategories, setLoadingCategories] = useState(false);

	useEffect(() => {
		// Preload categories when opening the page
		getCategories();
	}, []);

	async function getCategories() {
		try {
			console.log("getting categories");
			setLoadingCategories(true);
			const res = await getCategory();
			if (res === null) {
				setErrMsg("Failed to get categories");
				setErrOpen(true);
				setLoadingCategories(false);
				return;
			}
			console.log("res", res);
			setCategories(res);
			console.log("categories set");
			setLoadingCategories(false);
		} catch (e) {
			setErrMsg(e instanceof Error ? e.message : "Something went wrong");
			setErrOpen(true);
			setLoadingCategories(false);
		}
	}

	async function handleAddCategory(categoryName: string) {
		try {
			const res = await addCategory(categoryName);
			if (!res) {
				setErrMsg("Failed to add category");
				setErrOpen(true);
				return;
			}
			setSuccessMsg("Category added successfully");
			setSuccessOpen(true);
			getCategories();
			setOpenManageCategories(false);
		} catch (e) {
			setErrMsg(e instanceof Error ? e.message : "Something went wrong");
			setErrOpen(true);
		}
	}

	return (
		<>
			<div className="flex flex-col px-4 mt-8 space-y-4">
				<h1 className="text-3xl font-semibold">Inventory</h1>
				<div className="flex flex-row space-x-2">
					<Button
						type="button"
						onClick={() => {
							setOpenPanel(true);
							setOpenAddProduct(true);
						}}
						className="bg-blue-500 border-2  text-white px-3 py-1 w-fit rounded-lg hover:cursor-pointer hover:bg-blue-600 transition-colors duration-200"
					>
						Add Product
					</Button>
					<Button
						type="button"
						onClick={() => {
							setOpenPanel(true);
							setOpenManageCategories(true);
						}}
						className="bg-blue-500 border-2 text-white px-3 py-1 w-fit rounded-lg hover:cursor-pointer hover:bg-blue-600 transition-colors duration-200"
					>
						Manage Categories
					</Button>
				</div>
				<div>
					<table>
						<thead></thead>
					</table>
				</div>
			</div>

			{/* Dialog Panel */}
			<Dialog
				open={openPanel}
				onClose={() => {
					setOpenPanel(false);
					setOpenAddProduct(false);
					setOpenManageCategories(false);
				}}
				className="relative z-40"
			>
				<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
				<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
					{/* Add Product */}
					{openAddProduct && (
						<DialogPanel className="mx-auto max-w-lg w-full rounded-lg bg-white p-6">
							<DialogTitle className="text-xl font-semibold text-gray-900 mb-4">
								Add a Product
							</DialogTitle>
							<form>
								<Fieldset className="flex flex-col space-y-2">
									<Field className="flex flex-col">
										<Label className="font-medium text-md">Product Name</Label>
										<Input
											required
											type="text"
											id="name"
											name="name"
											placeholder="Enter the Product Name"
											className="border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</Field>
									<Field className="flex flex-col">
										<Label className="font-medium text-md">Brand</Label>
										<Input
											required
											type="text"
											id="brand"
											name="brand"
											placeholder="Enter the product's brand"
											className="border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</Field>
									<Field className="flex flex-col">
										<Label className="font-medium text-md">Category</Label>
										<Select
											required
											id="Category"
											name="Category"
											defaultValue=""
											className="w-full border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										>
											<option value="" disabled>
												{loadingCategories ? "Loading..." : "Select a category"}
											</option>
											{categories.map((c) => (
												<option key={c.id} value={c.name}>
													{c.name}
												</option>
											))}
										</Select>
									</Field>
									<Field className="flex flex-col">
										<Label className="font-medium text-md">Brand</Label>
										<Input
											required
											type="text"
											id="brand"
											name="brand"
											placeholder="Enter the product's brand"
											className="border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</Field>
								</Fieldset>
							</form>
						</DialogPanel>
					)}
					{/* Manage Categories */}
					{openManageCategories && (
						<DialogPanel className="mx-auto max-w-lg w-full rounded-lg bg-white p-6">
							<DialogTitle className="text-xl font-semibold text-gray-900 mb-4">
								Categories
							</DialogTitle>
							<form className="flex flex-col space-y-2">
								<Field className="flex flex-col space-y-2">
									<Label className="font-medium text-md">Add a Category</Label>
									<Input
										required
										type="text"
										id="name"
										name="name"
										value={categoryName}
										onChange={(e) => setCategoryName(e.target.value)}
										placeholder="Enter the Category Name"
										className="border border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</Field>
								<Button
									type="button"
									onClick={() => handleAddCategory(categoryName)}
									className="bg-blue-500 border-2 text-white px-3 py-1 w-fit rounded-lg hover:cursor-pointer hover:bg-blue-600 transition-colors duration-200"
								>
									Add Category
								</Button>
								<div className="mt-4 overflow-x-auto">
									<table className="min-w-full table-auto text-sm">
										<thead className="bg-gray-50 sticky top-0">
											<tr>
												<th className="px-4 py-2 text-left font-medium text-gray-700">
													Name
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-200">
											{categories.length === 0 ? (
												<tr>
													<td className="px-4 py-3 text-gray-500">
														No categories found
													</td>
												</tr>
											) : (
												categories.map((c) => (
													<tr key={c.id}>
														<td className="px-4 py-3">{c.name}</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</form>
						</DialogPanel>
					)}
				</div>
			</Dialog>

			{/* Inventory Table */}
			<div className="flex flex-col px-4 mt-8 space-y-4">
				<table>
					<thead></thead>
				</table>
			</div>

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
		</>
	);
}
