import Renderer from '../../components/mvp/Renderer';
import { UserAccountNav } from '@/components/layout/user-account-nav';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";



export const metadata = constructMetadata({
  title: "Generate – Generate Photorealistic Architecture Renderings in Seconds Using AI | ArchiGen",
  description: "Explore our subscription plans.",
});


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
                <div>
                    <Button
                        className="px-3 py-0 mr-3 align-top"
                        variant="default"
                        size="sm"
                        rounded="full"
                    >
                        <Link href='/pricing' className='text-sm'>Upgrade</Link>
                    </Button>
                    
                    <UserAccountNav/>
                </div>
            </header>

            <Renderer />
        </>
    )
}