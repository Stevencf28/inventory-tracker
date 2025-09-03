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
	let name = formData.get("username") as string;
	name = name.charAt(0).toUpperCase() + name.slice(1);
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

export async function requestPasswordReset(formData: FormData) {
	const supabase = await createClient();
	const email = formData.get("emailReset") as string;
	await supabase.auth.resetPasswordForEmail(email);
	redirect(
		"/?success=" +
			encodeURIComponent(
				"Password reset instructions has been sent to the email."
			)
	);
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
