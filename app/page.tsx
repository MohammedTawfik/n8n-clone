import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";

export default async function Home() {
  const users = await prisma.user.findMany();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Button variant="outline">Click me</Button>
        <pre>{JSON.stringify(users, null, 2)}</pre>
      </main>
    </div>
  );
}
