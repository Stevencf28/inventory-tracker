import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const requestUrl = new URL(request.url);
	const token_hash = requestUrl.searchParams.get("token_hash");
	const type = requestUrl.searchParams.get("type");
	const next = requestUrl.searchParams.get("next") ?? "/";

	if (token_hash && type) {
		const supabase = await createClient();

		const { error } = await supabase.auth.verifyOtp({
			type: type as "recovery",
			token_hash,
		});

		if (!error) {
			// Redirect to the password reset page
			const redirectUrl = type === "recovery" ? "/password-reset" : next;
			return NextResponse.redirect(`${requestUrl.origin}${redirectUrl}`);
		}
	}

	// Return the user to an error page with instructions
	return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`);
}
