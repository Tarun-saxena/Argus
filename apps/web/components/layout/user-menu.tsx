"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react"
import { api } from "@/lib/api"

interface User {
  username: string
  avatarUrl?: string
}

interface UserMenuProps {
  user?: User
  onLogout?: () => Promise<void>
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  // Default mock user for visual purposes when not logged in
  const currentUser = user ?? {
    username: "tarun-saxena",
    avatarUrl: "https://github.com/tarun-saxena.png",
  }

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout()
    } else {
      // Default client-side logout behavior
      try {
        await api.logout()
        window.location.href = "/"
      } catch (err) {
        console.error("Logout failed:", err)
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer focus:outline-hidden">
        <Avatar className="size-8 transition-opacity hover:opacity-80" size="default">
          <AvatarImage src={currentUser.avatarUrl} alt={currentUser.username} />
          <AvatarFallback className="font-semibold bg-accent text-accent-foreground text-xs uppercase">
            {currentUser.username[0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-1.5 bg-popover text-popover-foreground rounded-lg border border-border shadow-lg p-1">
        <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
          Logged in as <span className="font-semibold text-foreground">{currentUser.username}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-border" />
        <DropdownMenuItem
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          onClick={() => window.location.href = "/settings"}
        >
          <UserIcon className="size-4 text-muted-foreground" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          onClick={() => window.location.href = "/settings/preferences"}
        >
          <SettingsIcon className="size-4 text-muted-foreground" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-border" />
        <DropdownMenuItem
          variant="destructive"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer focus:bg-destructive/10 focus:text-destructive dark:focus:bg-destructive/20"
          onClick={handleLogout}
        >
          <LogOutIcon className="size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
