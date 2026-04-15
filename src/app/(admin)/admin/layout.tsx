export const dynamic = "force-dynamic";
import { ReactNode } from "react";
import { AdminSidebar } from "./_components/admin-sidebar";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { requireAdminAccess } from "@/lib/admin-middleware";
import { ThemeProvider } from "@/components/common/theme-provider";
import { ModeToggle } from "@/components/common/mode-toggle";
import { CloseAdminConsole } from "./_components/close-admin-console";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdminAccess();
  // if (!session) {
  //   redirect("/sign-in");
  // }

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex min-h-screen w-full bg-muted/40">
          <AdminSidebar />
          <div className="flex flex-col flex-1 min-w-0">
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
              <div className="flex flex-1 items-center gap-4">
                <div className="relative w-full max-w-md hidden md:flex">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search tenants, logs, invoices..."
                    className="w-full bg-muted pl-9 md:w-75 lg:w-100 border-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-muted-foreground hover:text-foreground"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-background" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <ModeToggle />
                <div className="h-6 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-3 pl-2">
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium leading-none">
                      {session?.user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Super Admin
                    </p>
                  </div>
                  <Avatar className="h-9 w-9 border cursor-pointer">
                    <AvatarImage
                      src={session?.user?.image || ""}
                      alt={session?.user?.name || "Admin"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {session?.user?.name?.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CloseAdminConsole />
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
          </div>
        </div>
      </ThemeProvider>
    </>


  );
}
