import Nav from "../components/nav";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		redirect("/");
	}
	const userName = data.user.user_metadata.display_name;
	return (
		<div className="flex flex-row">
			<Nav userName={userName} />
			<main className="p-8">{children}</main>
		</div>
	);
}
