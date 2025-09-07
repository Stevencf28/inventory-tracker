"use server";
import { createClient } from "@/utils/supabase/server";

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
		console.log("error: ", error);
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
	const { data, error } = await supabase
		.from("category")
		.insert({ name, user_id: user.user.id });
	if (error) {
		return error;
	}
	return true;
}

export async function deleteCategory(id: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("category").delete().eq("id", id);
	if (error) {
		return false;
	}
	return true;
}
