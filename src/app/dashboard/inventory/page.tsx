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
import { useEffect, useState, useCallback } from "react";
import { getCategory, addCategory, deleteCategory } from "@/app/auth/data";
import SuccessPopup from "@/app/components/success-popup";
import ErrorPopup from "@/app/components/error-popup";
import Category from "@/app/models";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

export default function Inventory() {
	const [openPanel, setOpenPanel] = useState(false);
	const [successOpen, setSuccessOpen] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");
	const [errMsg, setErrMsg] = useState("");
	const [errOpen, setErrOpen] = useState(false);
	const [openManageCategories, setOpenManageCategories] = useState(false);
	const [openAddProduct, setOpenAddProduct] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loadingCategories, setLoadingCategories] = useState(false);

	const getCategories = useCallback(async () => {
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
	}, []);

	useEffect(() => {
		// Preload categories when opening the page
		getCategories();
	}, [getCategories]);

	useEffect(() => {
		const supabase = createSupabaseClient();
		const channel = supabase
			.channel("realtime:category")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "category" },
				() => {
					getCategories();
				}
			)
			.subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [getCategories]);

	async function handleAddCategory(name: string) {
		console.log("adding category: ", name);
		if (name.trim().length === 0) {
			setErrMsg("Category name is required");
			setErrOpen(true);
			return;
		}
		if (name.length > 255) {
			setErrMsg("Category name must be less than 255 characters");
			setErrOpen(true);
			return;
		}
		if (categories.some((c) => c.name === name)) {
			setErrMsg("Category already exists");
			setErrOpen(true);
			return;
		}
		try {
			const res = await addCategory(name);
			console.log("res", res);
			if (!res || res instanceof PostgrestError) {
				setErrMsg("Failed to add category");
				setErrOpen(true);
				return;
			}
			setSuccessMsg("Category added successfully");
			setSuccessOpen(true);
		} catch (e) {
			setErrMsg(e instanceof Error ? e.message : "Something went wrong");
			setErrOpen(true);
		}
	}

	// async function handleEditCategory(id: string, name: string) {
	// 	try{
	// 		console.log("editing category", id);
	// 		const res = await editCategory(id, name);
	// 		if (!res) {
	// 			setErrMsg("Failed to edit category");
	// 			setErrOpen(true);
	// 			return;
	// 		}
	// 		setSuccessMsg("Category edited successfully");
	// 		setSuccessOpen(true);
	// 	} catch (e) {
	// 		setErrMsg(e instanceof Error ? e.message : "Something went wrong");
	// 		setErrOpen(true);
	// 	}
	// }

	async function handleDeleteCategory(id: string) {
		try {
			console.log("deleting category: ", id);
			const res = await deleteCategory(id);
			if (!res) {
				setErrMsg("Failed to delete category");
				setErrOpen(true);
				return;
			}
			setSuccessMsg("Category deleted successfully");
			setSuccessOpen(true);
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
							<Field className="flex flex-col space-y-2">
								<Label className="font-medium text-md">Add a Category</Label>
								<Input
									type="text"
									id="name"
									name="name"
									placeholder="Enter the Category Name"
									className="border border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</Field>
							<Button
								type="button"
								onClick={() => {
									const input = document.getElementById(
										"name"
									) as HTMLInputElement | null;
									if (input && input.value.trim().length > 0) {
										handleAddCategory(input.value);
									} else {
										setErrMsg("Category name is required");
										setErrOpen(true);
									}
								}}
								className="bg-blue-500 border-2 text-white px-3 py-1 w-fit rounded-lg hover:cursor-pointer hover:bg-blue-600 transition-colors duration-200"
							>
								Add Category
							</Button>
							{/* Categories Table */}
							<div className="mt-4 overflow-x-auto">
								<legend className="text-lg font-semibold my-2">
									Categories
								</legend>
								<table className="min-w-full table-auto text-sm border-2 border-gray-500">
									<thead className="bg-gray-50 sticky top-0">
										<tr>
											<th className="px-4 py-2 text-left w-full font-medium text-gray-700">
												Name
											</th>
											<th className="px-4 py-2 text-left w-full font-medium text-gray-700">
												Actions
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
													<td className="px-4 py-3">
														<Button className="bg-yellow-500 border-2 text-white px-3 py-1 w-fit rounded-lg hover:cursor-pointer hover:bg-red-600 transition-colors duration-200">
															Edit
														</Button>
													</td>
													<td className="px-4 py-3">
														<Button
															onClick={() => handleDeleteCategory(c.id)}
															className="bg-red-500 border-2 text-white px-3 py-1 w-fit rounded-lg hover:cursor-pointer hover:bg-red-600 transition-colors duration-200"
														>
															Delete
														</Button>
													</td>
												</tr>
											))
										)}
									</tbody>
								</table>
							</div>
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
