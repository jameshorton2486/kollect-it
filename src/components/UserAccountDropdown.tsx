"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogOut, Package, Heart, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserAccountDropdown() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        aria-label="Account"
        className="h-10 w-10 flex items-center justify-center text-lux-cream hover:text-lux-gold-light hover:bg-white/5 rounded-full transition-colors duration-200"
      >
        <User className="h-5 w-5" />
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-10 w-10 flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-charcoal",
          isOpen ? "text-lux-gold bg-white/10" : "text-lux-cream hover:text-lux-gold-light hover:bg-white/5"
        )}
        aria-label="Account menu"
        aria-expanded={isOpen}
      >
        <User className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-lux-charcoal border border-white/10 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm text-lux-cream truncate font-medium">
              {session.user.name || "User"}
            </p>
            <p className="text-xs text-lux-silver truncate">
              {session.user.email}
            </p>
          </div>

          <div className="py-1">
            <Link
              href="/account"
              className="flex items-center px-4 py-2 text-sm text-lux-cream hover:bg-white/5 hover:text-lux-gold transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="mr-3 h-4 w-4" />
              My Account
            </Link>

            <Link
              href="/account?tab=orders"
              className="flex items-center px-4 py-2 text-sm text-lux-cream hover:bg-white/5 hover:text-lux-gold transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Package className="mr-3 h-4 w-4" />
              Orders
            </Link>

            <Link
              href="/wishlist"
              className="flex items-center px-4 py-2 text-sm text-lux-cream hover:bg-white/5 hover:text-lux-gold transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="mr-3 h-4 w-4" />
              Wishlist
            </Link>

            {session.user.role === "admin" && (
              <>
                <div className="border-t border-white/10 my-1" />
                <Link
                  href="/admin/dashboard"
                  className="flex items-center px-4 py-2 text-sm text-lux-cream hover:bg-white/5 hover:text-lux-gold transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="mr-3 h-4 w-4" />
                  Admin Dashboard
                </Link>
              </>
            )}

            <div className="border-t border-white/10 my-1" />
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-lux-cream hover:bg-white/5 hover:text-lux-gold transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
