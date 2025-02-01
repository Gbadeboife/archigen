import Renderer from '../../components/mvp/Renderer';
import { UserAccountNav } from '@/components/layout/user-account-nav';
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Generate() {
    /*const session = await auth();
    
    if (!session?.user) {
        redirect("/login");
    }
        */

    return (
        <>
            <header className="sticky top-0 z-50 flex h-14 items-center justify-end bg-background px-4 lg:h-[60px] xl:px-8">
                <UserAccountNav/>
            </header>

            <Renderer />
        </>
    )
}