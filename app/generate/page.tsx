import Renderer from '../../components/mvp/Renderer';
import { UserAccountNav } from '@/components/layout/user-account-nav';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default async function Generate() {
    const session = await auth();
    
    if (!session?.user) {
        redirect("/login");
    }
        

    return (
        <>
            <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-background px-4 lg:h-[60px] xl:px-8">
                <Link href="/" className="flex items-center space-x-1.5">
                    <span className="font-urban text-xl font-bold">
                      {siteConfig.name}
                    </span>
                </Link>
                <UserAccountNav/>
            </header>

            <Renderer />
        </>
    )
}