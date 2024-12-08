import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, ArrowLeftRight, HandCoins, User } from "lucide-react";
import { logout, getCurrentUserInfo } from "@/app/actions";
import { Button } from "@/components/ui/button";
import AuthLink from "@/components/layout/AuthLink";

export default async function Header() {
  const currentUser = await getCurrentUserInfo();

  return (
    <header className="bg-primary text-primary-foreground shadow">
      <div className="container py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/">NoterKapanmadan</Link>
        </h1>
        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer border-gray-50">
                <AvatarImage
                  src={currentUser.profilePicture || "/avatar.png"}
                />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{`${currentUser.forename} ${currentUser.surname}`}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/profile/${currentUser.account_id}`}>
                  <User size={16} />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/offers">
                  <HandCoins size={16} />
                  Offers
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/transactions">
                  <ArrowLeftRight size={16} />
                  Transactions
                </Link>
              </DropdownMenuItem>
              <form action={logout}>
                <button className="w-full">
                  <DropdownMenuItem>
                    <LogOut size={16} />
                    Logout
                  </DropdownMenuItem>
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex justify-center">
            <AuthLink refresh="true">
              <Button variant="link" className="w-full text-white">
                Login
              </Button>
            </AuthLink>
          </div>
        )}
      </div>
    </header>
  );
}
