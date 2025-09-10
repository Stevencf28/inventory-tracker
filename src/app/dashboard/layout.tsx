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
		<main className="flex flex-col md:flex-row min-w-screen min-h-screen">
			<Nav userName={userName} />
			<div className="pt-20 md:pt-8 p-8 w-full h-full">{children}</div>
		</main>
	);
}
