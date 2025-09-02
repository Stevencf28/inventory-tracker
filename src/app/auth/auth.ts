"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
	const supabase = await createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		console.error("Login error:", error.message);
		redirect("/?error=" + encodeURIComponent(error.message));
	}

	revalidatePath("/", "layout");
	redirect("/dashboard");
}

export async function signup(formData: FormData) {
	const supabase = await createClient();
	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
		options: {
			data: {
				display_name: formData.get("username") as string,
			},
		},
	};

	const { error } = await supabase.auth.signUp(data);

	if (error) {
		console.error("Signup error:", error.message);
		redirect("/?error=" + encodeURIComponent(error.message));
	}

	revalidatePath("/", "layout");
	redirect("/dashboard");
}

export async function signout() {
	const supabase = await createClient();
	// Check if a user's logged in
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (user) {
		await supabase.auth.signOut();
	}
	console.log("logged out");
	revalidatePath("/", "layout");
	redirect("/");
}
