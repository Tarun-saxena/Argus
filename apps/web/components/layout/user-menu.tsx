"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
import { Skeleton } from "@/components/ui/skeleton"

export function UserMenu() {
  const router = useRouter()
  const [user, setUser] = React.useState<{ username: string; avatarUrl?: string | null } | null>(null)

  React.useEffect(() => {
    api.getMe()
      .then((u) => setUser({ username: u.username, avatarUrl: u.avatarUrl }))
      .catch(() => {
        // Fallback: show a generic avatar if the API fails
        setUser({ username: "user" })
      })
  }, [])

  const handleLogout = async () => {
    try {
      await api.logout()
      router.push("/")
    } catch (err) {
      console.error("Logout failed:", err)
      window.location.href = "/"
    }
  }

  if (!user) {
    return <Skeleton className="size-8 rounded-full" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="cursor-pointer focus:outline-hidden rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`Account menu for ${user.username}`}
      >
        <Avatar className="size-8 transition-opacity hover:opacity-80" size="default">
          {user.avatarUrl && (
            <AvatarImage src={user.avatarUrl} alt={user.username} />
          )}
          <AvatarFallback className="font-semibold bg-accent text-accent-foreground text-xs uppercase">
            {user.username[0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 mt-1.5 bg-popover text-popover-foreground rounded-lg border border-border shadow-lg p-1"
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
          Signed in as{" "}
          <span className="font-semibold text-foreground">{user.username}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-border" />
        <DropdownMenuItem
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          onClick={() => router.push("/settings")}
        >
          <UserIcon className="size-4 text-muted-foreground" aria-hidden="true" />
          <span>Profile &amp; Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-border" />
        <DropdownMenuItem
          variant="destructive"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer focus:bg-destructive/10 focus:text-destructive dark:focus:bg-destructive/20"
          onClick={handleLogout}
        >
          <LogOutIcon className="size-4" aria-hidden="true" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
