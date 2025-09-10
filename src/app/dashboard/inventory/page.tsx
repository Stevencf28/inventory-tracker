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
import { Category, Inventory } from "@/app/models";

// Raw inventory data from database (category is just an ID string)
interface RawInventory extends Omit<Inventory, "category"> {
	category: string;
}
import { createClient as createSupabaseClient } from "@/utils/supabase/client";
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
	const [rawInventory, setRawInventory] = useState<RawInventory[]>([]);
	const [loadingInventory, setLoadingInventory] = useState(false);
	const [error, setError] = useState("");
	const [openEditProduct, setOpenEditProduct] = useState(false);
	const [currentProduct, setCurrentProduct] = useState<Inventory>();

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
		if (categories.find((c) => c.name.toLowerCase() === name.toLowerCase())) {
			setErrMsg("Category already exists");
			setErrOpen(true);
			return;
		}
		try {
			const res = await addCategory(name);
			if (!res) {
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
			// Refresh both categories and inventory since deleting a category cascades to delete inventory items
			await Promise.all([getCategories(), getInventoryList()]);
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
			// Store raw inventory data without category mapping
			setRawInventory(res);
			setLoadingInventory(false);
		} catch (e) {
			setErrMsg(e instanceof Error ? e.message : "Something went wrong");
			setErrOpen(true);
		}
	}, []);

	async function handleAddProduct(formData: FormData) {
		try {
			const res = await addProduct(formData);
			if (!res) {
				setError("Failed to add product");
				return;
			}
			setSuccessMsg("Product added successfully");
			setSuccessOpen(true);
			await getInventoryList();

			setOpenAddProduct(false);
			setOpenPanel(false);
		} catch (e) {
			setErrMsg(e instanceof Error ? e.message : "Something went wrong");
			setErrOpen(true);
		}
	}

	async function handleEditProduct(id: string, formData: FormData) {
		try {
			const res = await editProduct(id, formData);
			if (!res) {
				setError("Failed to edit product");
				return;
			}
			setSuccessMsg("Product edited successfully");
			setSuccessOpen(true);
			await getInventoryList();
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
			await getInventoryList();
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

	// Map categories to inventory items when both are available
	useEffect(() => {
		if (rawInventory.length > 0 && categories.length > 0) {
			const mappedInventory = rawInventory
				.map((item) => {
					// Find the category object by ID
					const categoryObj = categories.find((c) => c.id === item.category);
					return {
						...item,
						category: categoryObj as Category,
					};
				})
				.filter((item) => item.category); // Filter out items with undefined categories
			setInventory(mappedInventory);
		} else if (rawInventory.length === 0) {
			// If no raw inventory, clear the mapped inventory
			setInventory([]);
		}
	}, [rawInventory, categories]);

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
				(payload) => {
					getCategories();
					// If a category was deleted, also refresh inventory since it cascades
					if (payload.eventType === "DELETE") {
						getInventoryList();
					}
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
		{ accessorKey: "id", header: "ID" },
		{
			accessorKey: "category",
			header: "Category",
			cell: ({ row }) => {
				const category = row.getValue("category") as Category;
				return category?.name || "NULL";
			},
		},
		{ accessorKey: "name", header: "Name" },
		{ accessorKey: "brand", header: "Brand" },
		{ accessorKey: "cost", header: "Cost" },
		{ accessorKey: "quantity", header: "Quantity" },
		{ accessorKey: "available", header: "Available" },
		{ accessorKey: "in_use", header: "In Use" },
		{ accessorKey: "date", header: "Date" },
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const product = row.original as Inventory;
				return (
					<div className="flex flex-row space-x-2">
						<Button
							onClick={() => {
								setOpenEditProduct(true);
								setCurrentProduct(product);
							}}
							className="bg-yellow-500 border-2 text-white px-3 py-1 w-fit rounded-lg hover:cursor-pointer hover:bg-red-600 transition-colors duration-200"
						>
							Edit
						</Button>
						<Button
							onClick={() => handleDeleteProduct(product.id)}
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
				{/* Inventory Table */}
				<div className="flex flex-col">
					{loadingInventory ? (
						<div className="px-4 py-3 text-gray-500">Loading...</div>
					) : (
						<DataTable data={inventory} columns={inventoryColumns} />
					)}
				</div>
			</div>

			{/* Dialog Panel */}
			<Dialog
				open={openPanel}
				onClose={() => {
					setOpenPanel(false);
					setOpenAddProduct(false);
					setOpenManageCategories(false);
					setError("");
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
										<Label className="font-medium text-md">
											Date of Purchase
										</Label>
										<Input
											required
											type="date"
											id="date"
											name="date"
											className="border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</Field>
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
												<option key={c.id} value={c.id}>
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

			{/* Edit Category Dialog */}
			<Dialog
				open={openEditCategory}
				onClose={setOpenEditCategory}
				className="relative z-40"
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
			<Dialog
				open={openEditProduct}
				onClose={() => {
					setOpenEditProduct(false);
					setError("");
				}}
				className="relative z-40"
			>
				<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
				<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
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
									<Label className="font-medium text-md">
										Date of Purchase
									</Label>
									<Input
										required
										type="date"
										id="date"
										name="date"
										defaultValue={currentProduct?.date}
										className="border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</Field>
								<Field className="flex flex-col">
									<Label className="font-medium text-md">Product Name</Label>
									<Input
										required
										type="text"
										id="name"
										name="name"
										defaultValue={currentProduct?.name}
										className="border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</Field>

								<Field className="flex flex-col">
									<Label className="font-medium text-md">Category</Label>
									<Select
										required
										id="category"
										name="category"
										defaultValue={currentProduct?.category.id}
										className="w-full border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									>
										<option value="" disabled>
											{loadingCategories ? "Loading..." : "Select a category"}
										</option>
										{categories.map((c) => (
											<option key={c.id} value={c.id}>
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
										defaultValue={currentProduct?.brand}
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
											defaultValue={currentProduct?.cost}
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
											defaultValue={currentProduct?.quantity}
											className="border-2 border-gray-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</Field>
								</div>
								<Button
									type="submit"
									formAction={(formData) => {
										if (!currentProduct) {
											setError("Product not found");
											return;
										}
										return handleEditProduct(currentProduct.id, formData);
									}}
									className="bg-blue-500 border-2 text-white px-3 py-2 w-fit rounded-lg hover:cursor-pointer hover:bg-blue-600 transition-colors duration-200"
								>
									Edit Product
								</Button>
							</Fieldset>
						</form>
					</DialogPanel>
				</div>
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
