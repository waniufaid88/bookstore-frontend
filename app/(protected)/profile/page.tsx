import { cookies } from "next/headers";
import { baseUrl } from "@/lib/utils";

type User = { name: string; email: string };

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const response = await fetch(`${baseUrl}/auth/getuser`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load profile");
  }

  const data: { user: User } = await response.json();
  const user = data.user;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>
      <section className="rounded-md border p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Account details</h2>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium text-muted-foreground">Name</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">Email</dt>
            <dd>{user.email}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
