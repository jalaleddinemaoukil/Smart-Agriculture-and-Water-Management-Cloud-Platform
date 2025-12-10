import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* ----------------------- HEADER ----------------------- */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="w-full h-14 bg-background"
              asChild
            >
              <a href="#" className="flex items-center gap-3">
                <img
                  src="/swamp-logo.svg"
                  alt="swamp logo"
                  className="h-full w-full rounded-md object-contain"
                />
                
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ----------------------- CONTENT ----------------------- */}
      <SidebarContent className="pt-2">
        <NavMain />
      </SidebarContent>

      {/* ----------------------- FOOTER ----------------------- */}
      <SidebarFooter className="pt-2">
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
