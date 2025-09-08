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
import {
	getCategory,
	addCategory,
	deleteCategory,
	editCategory,
	getInventory,
	addProduct,
	editProduct,
	deleteProduct,
} from "@/app/auth/data";
import SuccessPopup from "@/app/components/success-popup";
import ErrorPopup from "@/app/components/error-popup";
import { DataTable } from "@/app/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import Category from "@/app/models";
import Inventory from "@/app/models";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default function InventoryPage() {
	const [openPanel, setOpenPanel] = useState(false);
	const [successOpen, setSuccessOpen] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");
	const [errMsg, setErrMsg] = useState("");
	const [errOpen, setErrOpen] = useState(false);
	const [openManageCategories, setOpenManageCategories] = useState(false);
	const [openAddProduct, setOpenAddProduct] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loadingCategories, setLoadingCategories] = useState(false);
	const [openEditCategory, setOpenEditCategory] = useState(false);
	const [editCategoryName, setEditCategoryName] = useState("");
	const [editCategoryId, setEditCategoryId] = useState("");
	const [inventory, setInventory] = useState<Inventory[]>([]);
	const [loadingInventory, setLoadingInventory] = useState(false);
	const [error, setError] = useState("");
	const [openEditProduct, setOpenEditProduct] = useState(false);
	const [editProductId, setEditProductId] = useState("");

	{
		/* Categories Functions*/
	}
	const getCategories = useCallback(async () => {
		try {
			setLoadingCategories(true);
			const res = await getCategory();
			if (res === null) {
				setErrMsg("Failed to get categories");
				setErrOpen(true);
				setLoadingCategories(false);
				return;
			}
			res.sort((a, b) => a.name.localeCompare(b.name));
			setCategories(res);
			setLoadingCategories(false);
		} catch (e) {
			setErrMsg(e instanceof Error ? e.message : "Something went wrong");
			setErrOpen(true);
			setLoadingCategories(false);
		}
	}, []);

	async function handleAddCategory(name: string) {
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

	async function handleEditCategory(id: string, name: string) {
		try {
			const supabase = await createSupabaseClient();
			const { data: user, error: userError } = await supabase.auth.getUser();
			if (userError) {
				setErrMsg("Failed to get user");
				setErrOpen(true);
				redirect("/");
			}
			const res = await editCategory(id, name, user.user.id);
			if (!res) {
				setErrMsg("Failed to edit category");
				setErrOpen(true);
				return;
			}
			setSuccessMsg("Category edited successfully");
			setSuccessOpen(true);
			setOpenEditCategory(false);
		} catch (e) {
			setErrMsg(e instanceof Error ? e.message : "Something went wrong");
			setErrOpen(true);
		}
	}

	async function handleDeleteCategory(id: string) {
		try {
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

	{
		/* Inventory Functions */
	}
	const getInventoryList = useCallback(async () => {
		setLoadingInventory(true);
		try {
			//get user id
			const supabase = await createSupabaseClient();
			const { data: user, error: userError } = await supabase.auth.getUser();
			if (userError) {
				setErrMsg("Failed to get user");
				setErrOpen(true);
				redirect("/");
			}
			const res = await getInventory(user.user.id);
			if (!res) {
				setErrMsg("Failed to get inventory");
				setErrOpen(true);
				setLoadingInventory(false);
				return;
			}
			setInventory(res);
			setLoadingInventory(false);
		} catch (e) {
			setErrMsg(e instanceof Error ? e.message : "Something went wrong");
			setErrOpen(true);
		}
	}, []);

	async function handleAddProduct(formData: FormData) {
		console.log("Adding product");
		try {
			const res = await addProduct(formData);
			if (!res) {
				setError("Failed to add product");
				return;
			}
			setSuccessMsg("Product added successfully");
			setSuccessOpen(true);
			setOpenAddProduct(false);
			setOpenPanel(false);
		} catch (e) {
			setErrMsg(e instanceof Error ? e.message : "Something went wrong");
			setErrOpen(true);
		}
	}

	async function handleEditProduct(formData: FormData) {
		try {
			const res = await editProduct(formData);
			if (!res) {
				setError("Failed to edit product");
				return;
			}
			setSuccessMsg("Product edited successfully");
			setSuccessOpen(true);
			setOpenEditProduct(false);
		} catch (e) {
			setErrMsg(e instanceof Error ? e.message : "Something went wrong");
			setErrOpen(true);
		}
	}

	async function handleDeleteProduct(id: string) {
		try {
			const res = await deleteProduct(id);
			if (!res) {
				setErrMsg("Failed to delete product");
				setErrOpen(true);
				return;
			}
			setSuccessMsg("Product deleted successfully");
			setSuccessOpen(true);
			setOpenEditProduct(false);
		} catch (e) {
			setErrMsg(e instanceof Error ? e.message : "Something went wrong");
			setErrOpen(true);
		}
	}

	{
		/* Use Effects */
	}
	// Preload inventory and categories when opening the page
	useEffect(() => {
		getCategories();
		getInventoryList();
	}, [getCategories, getInventoryList]);

	{
		/* Realtime Channels:
		Supabase allows us to listen to changes in the database
		and update the UI automatically */
	}
	useEffect(() => {
		const supabase = createSupabaseClient();
		{
			/* Category Channel */
		}
		const categoryChannel = supabase
			.channel("realtime:category")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "category" },
				() => {
					getCategories();
				}
			)
			.subscribe();
		{
			/* Inventory Channel */
		}
		const inventoryChannel = supabase
			.channel("realtime:inventory")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "inventory" },
				() => {
					getInventoryList();
				}
			)
			.subscribe();
		return () => {
			supabase.removeChannel(categoryChannel);
			supabase.removeChannel(inventoryChannel);
		};
	}, [getCategories, getInventoryList]);

	{
		/* Columns for the inventory table */
	}
	const inventoryColumns: ColumnDef<Inventory, unknown>[] = [
		{ accessorKey: "category", header: "Category" },
		{ accessorKey: "name", header: "Name" },
		{ accessorKey: "brand", header: "Brand" },
		{ accessorKey: "cost", header: "Cost" },
		{ accessorKey: "quantity", header: "Quantity" },
		{ accessorKey: "available", header: "Available" },
		{ accessorKey: "in_use", header: "In Use" },
		{ accessorKey: "created_at", header: "Created At" },
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const i = row.original as Inventory;
				return (
					<div className="flex flex-row space-x-2">
						<Button
							onClick={() => {
								setOpenEditProduct(true);
								setEditProductId(i.id);
							}}
							className="bg-yellow-500 border-2 text-white px-3 py-1 w-fit rounded-lg hover:cursor-pointer hover:bg-red-600 transition-colors duration-200"
						>
							Edit
						</Button>
						<Button
							onClick={() => handleDeleteProduct(i.id)}
							className="bg-red-500 border-2 text-white px-3 py-1 w-fit rounded-lg hover:cursor-pointer hover:bg-red-600 transition-colors duration-200"
						>
							Delete
						</Button>
					</div>
				);
			},
		},
	];

	{
		/* Columns for the categories table */
	}
	const categoryColumns: ColumnDef<Category, unknown>[] = [
		{ accessorKey: "name", header: "Name" },
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const c = row.original as Category;
				return (
					<div className="flex flex-row space-x-2">
						<Button
							onClick={() => {
								setOpenEditCategory(true);
								setEditCategoryName(c.name);
								setEditCategoryId(c.id);
							}}
							className="bg-yellow-500 border-2 text-white px-3 py-1 w-fit rounded-lg hover:cursor-pointer hover:bg-red-600 transition-colors duration-200"
						>
							Edit
						</Button>
						<Button
							onClick={() => handleDeleteCategory(c.id)}
							className="bg-red-500 border-2 text-white px-3 py-1 w-fit rounded-lg hover:cursor-pointer hover:bg-red-600 transition-colors duration-200"
						>
							Delete
						</Button>
					</div>
				);
			},
		},
	];

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
							<DialogTitle className="text-lg font-bold text-black mb-4">
								Add a Product
							</DialogTitle>
							{error && (
								<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
									{error}
								</div>
							)}
							<form autoComplete="off">
								<Fieldset className="flex flex-col space-y-2">
									<Field className="flex flex-col">
										<Label className="font-medium text-md">Product Name</Label>
										<Input
											required
											type="text"
											id="name"
											name="name"
											className="border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</Field>

									<Field className="flex flex-col">
										<Label className="font-medium text-md">Category</Label>
										<Select
											required
											id="category"
											name="category"
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
											className="border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</Field>
									<div className="flex flex-row justify-between">
										<Field className="flex flex-col">
											<Label className="font-medium text-md">Cost</Label>
											<Input
												required
												type="number"
												id="cost"
												name="cost"
												step="0.01"
												className="border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</Field>
										<Field className="flex flex-col">
											<Label className="font-medium text-md">Quantity</Label>
											<Input
												required
												type="number"
												id="quantity"
												name="quantity"
												step="1"
												className="border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</Field>
									</div>
									<Button
										type="submit"
										formAction={handleAddProduct}
										className="bg-blue-500 border-2 text-white px-3 py-2 w-fit rounded-lg hover:cursor-pointer hover:bg-blue-600 transition-colors duration-200"
									>
										Add Product
									</Button>
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
							<div className="mt-4">
								<legend className="text-lg font-semibold my-2">
									Categories
								</legend>
								{loadingCategories ? (
									<div className="px-4 py-3 text-gray-500">Loading...</div>
								) : (
									<DataTable data={categories} columns={categoryColumns} />
								)}
							</div>
						</DialogPanel>
					)}
				</div>
			</Dialog>

			{/* Inventory Table */}
			<div className="flex flex-col px-4 mt-8 space-y-4">
				{}
				<table>
					<thead></thead>
				</table>
			</div>

			{/* Edit Category Dialog */}
			<Dialog
				open={openEditCategory}
				onClose={setOpenEditCategory}
				className="relative z-50"
			>
				<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
				<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
					<DialogPanel className="mx-auto max-w-lg w-full rounded-lg bg-white p-6">
						<DialogTitle className="text-xl font-semibold text-gray-900 mb-4">
							Edit Category
						</DialogTitle>
						<form>
							<Fieldset className="flex flex-col space-y-2">
								<Field className="flex flex-col">
									<Label className="font-medium text-md">Category Name</Label>
									<Input
										required
										type="text"
										id="name"
										name="name"
										value={editCategoryName}
										onChange={(e) => setEditCategoryName(e.target.value)}
										placeholder="Enter the Category Name"
										className="border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</Field>
								<Button
									type="button"
									onClick={() =>
										handleEditCategory(editCategoryId, editCategoryName)
									}
									className="bg-blue-500 border-2 text-white px-3 py-1 w-fit rounded-lg hover:cursor-pointer hover:bg-blue-600 transition-colors duration-200"
								>
									Edit Category
								</Button>
							</Fieldset>
						</form>
					</DialogPanel>
				</div>
			</Dialog>

			{/* Edit Product Dialog */}
			<Dialog open={openEditProduct} onClose={setOpenEditProduct}>
				<DialogPanel className="mx-auto max-w-lg w-full rounded-lg bg-white p-6">
					<DialogTitle className="text-lg font-bold text-black mb-4">
						Edit Product
					</DialogTitle>
					{error && (
						<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
							{error}
						</div>
					)}
					<form autoComplete="off">
						<Fieldset className="flex flex-col space-y-2">
							<Field className="flex flex-col">
								<Label className="font-medium text-md">Product Name</Label>
								<Input
									required
									type="text"
									id="name"
									name="name"
									className="border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</Field>

							<Field className="flex flex-col">
								<Label className="font-medium text-md">Category</Label>
								<Select
									required
									id="category"
									name="category"
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
									className="border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</Field>
							<div className="flex flex-row justify-between">
								<Field className="flex flex-col">
									<Label className="font-medium text-md">Cost</Label>
									<Input
										required
										type="number"
										id="cost"
										name="cost"
										step="0.01"
										className="border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</Field>
								<Field className="flex flex-col">
									<Label className="font-medium text-md">Quantity</Label>
									<Input
										required
										type="number"
										id="quantity"
										name="quantity"
										step="1"
										className="border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</Field>
							</div>
							<Button
								type="submit"
								formAction={handleAddProduct}
								className="bg-blue-500 border-2 text-white px-3 py-2 w-fit rounded-lg hover:cursor-pointer hover:bg-blue-600 transition-colors duration-200"
							>
								Add Product
							</Button>
						</Fieldset>
					</form>
				</DialogPanel>
			</Dialog>

			{/* Success Popup */}
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
