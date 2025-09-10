"use server";
import { createClient } from "@/utils/supabase/server";

export async function getInventory(user_id: string) {
	console.log("Getting inventory");
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("inventory")
		.select("*")
		.eq("user_id", user_id);
	if (error) {
		console.log("Failed to get inventory: ", error);
		return false;
	}
	return data;
}

export async function addProduct(formData: FormData) {
	const supabase = await createClient();
	const { data: user, error: userError } = await supabase.auth.getUser();
	if (userError) {
		return false;
	}
	const { error } = await supabase.from("inventory").insert({
		date: formData.get("date") as string,
		name:
			(formData.get("name") as string).charAt(0).toUpperCase() +
			(formData.get("name") as string).slice(1),
		category: formData.get("category"),
		brand:
			(formData.get("brand") as string).charAt(0).toUpperCase() +
			(formData.get("brand") as string).slice(1),
		cost: formData.get("cost"),
		quantity: formData.get("quantity"),
		user_id: user.user.id,
	});
	if (error) {
		console.log("Failed to add product: ", error);
		return false;
	}
	return true;
}

export async function editProduct(id: string, formData: FormData) {
	const supabase = await createClient();
	const { data: user, error: userError } = await supabase.auth.getUser();
	if (userError) {
		return false;
	}
	const { error } = await supabase
		.from("inventory")
		.update({
			date: formData.get("date"),
			name:
				(formData.get("name") as string).charAt(0).toUpperCase() +
				(formData.get("name") as string).slice(1),
			category:
				(formData.get("category") as string).charAt(0).toUpperCase() +
				(formData.get("category") as string).slice(1),
			brand:
				(formData.get("brand") as string).charAt(0).toUpperCase() +
				(formData.get("brand") as string).slice(1),
			cost: formData.get("cost"),
			quantity: formData.get("quantity"),
		})
		.eq("user_id", user.user.id)
		.eq("id", id);
	if (error) {
		console.log("Failed to edit product: ", error);
		return false;
	}
	return true;
}

export async function deleteProduct(id: string) {
	const supabase = await createClient();
	const { data: user, error: userError } = await supabase.auth.getUser();
	if (userError) {
		return false;
	}
	const { error } = await supabase
		.from("inventory")
		.delete()
		.eq("id", id)
		.eq("user_id", user.user.id);
	if (error) {
		console.log("Failed to delete product: ", error);
		return false;
	}
	return true;
}

export async function getCategory() {
	const supabase = await createClient();

	//get user id
	const { data: user, error: userError } = await supabase.auth.getUser();
	if (userError) {
		return null;
	}

	const { data, error } = await supabase
		.from("category")
		.select("id, name, user_id")
		.eq("user_id", user.user.id);

	if (error) {
		console.log("Failed to get categories: ", error);
		return null;
	}
	return data;
}

export async function addCategory(name: string) {
	const supabase = await createClient();
	//get user id
	const { data: user, error: userError } = await supabase.auth.getUser();
	if (userError) {
		return false;
	}
	name = name.charAt(0).toUpperCase() + name.slice(1);
	const { error } = await supabase
		.from("category")
		.insert({ name, user_id: user.user.id });
	if (error) {
		console.log("Failed to add category: ", error);
		return false;
	}
	return true;
}

export async function deleteCategory(id: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("category").delete().eq("id", id);
	if (error) {
		console.log("Failed to delete category: ", error);
		return false;
	}
	return true;
}

export async function editCategory(id: string, name: string, user_id: string) {
	const supabase = await createClient();
	name = name.charAt(0).toUpperCase() + name.slice(1);
	const { error } = await supabase
		.from("category")
		.update({ name })
		.eq("id", id)
		.eq("user_id", user_id);
	if (error) {
		console.log("Failed to edit category: ", error);
		return false;
	}
	return true;
}
