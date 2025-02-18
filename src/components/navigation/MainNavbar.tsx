
import { Link } from "react-router-dom";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "./MobileMenu";
import { UserDropdown } from "./UserDropdown";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AccessibilitySettings } from "@/components/ui/accessibility-settings";
import { cn } from "@/lib/utils";

export function MainNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <MobileMenu />
        
        <Link 
          to="/" 
          className="mr-6 flex items-center space-x-2 min-h-[48px] px-2"
          aria-label="Go to homepage"
        >
          <span className="hidden font-bold sm:inline-block text-foreground">
            Kollect-It
          </span>
        </Link>

        <div className="hidden md:flex">
          <NavLinks />
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden sm:flex items-center space-x-4">
            <ThemeToggle />
            <AccessibilitySettings />
          </div>
          <UserDropdown
            items={[
              { path: "/profile-settings", label: "Profile Settings" },
              { path: "/purchase-history", label: "Purchase History" },
              { path: "/personal-collection", label: "My Collection" },
              { path: "/saved-searches", label: "Saved Searches" },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
