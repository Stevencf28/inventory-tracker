"use server";
import { createClient } from "@/utils/supabase/server";

export async function getCategory() {
	const supabase = await createClient();

	//get user id
	const { data: user, error: userError } = await supabase.auth.getUser();
	if (userError) {
		return [];
	}
	const { data, error } = await supabase
		.from("category")
		.select("name")
		.eq("user_id", user.user.id);
	if (error) {
		return [];
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
	return data;
}
