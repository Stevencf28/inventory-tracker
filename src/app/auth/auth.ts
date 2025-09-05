"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
	const supabase = await createClient();
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		console.error("Login error:", error.message);
		return { status: false, errorMessage: error.message };
	}
	revalidatePath("/", "layout");
	return { status: true };
}

export async function signup(formData: FormData) {
	const supabase = await createClient();
	const firstName =
		(formData.get("firstName") as string).charAt(0).toUpperCase() +
		(formData.get("firstName") as string).slice(1);
	const lastName =
		(formData.get("lastName") as string).charAt(0).toUpperCase() +
		(formData.get("lastName") as string).slice(1);
	const name = firstName + " " + lastName;
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
		options: {
			data: {
				display_name: name,
			},
		},
	};

	const { error } = await supabase.auth.signUp(data);

	if (error) {
		console.error("Signup error:", error.message);
		return { status: false, errorMessage: error.message };
	}
	console.log("signed up");
	revalidatePath("/", "layout");
	return { status: true };
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

export async function requestPasswordReset(formData: FormData) {
	const supabase = await createClient();
	const email = formData.get("emailReset") as string;
	const req = await supabase.auth.resetPasswordForEmail(email);
	if (req.error) {
		console.error("Password reset error:", req.error.message);
		return false;
	}
	return true;
}

export async function resetPassword(formData: FormData) {
	const supabase = await createClient();
	const password = formData.get("password") as string;

	const { error } = await supabase.auth.updateUser({ password });

	if (error) {
		console.error("Password update error:", error.message);
		redirect("/password-reset?error=" + encodeURIComponent(error.message));
	}

	redirect(
		"/dashboard/?success=" +
			encodeURIComponent("Password updated successfully!")
	);
}
