import { LayoutDashboard, BarChart3, Settings, Map } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

} from "@/components/ui/sidebar";

export function NavMain() {
  const location = useLocation();

  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: location.pathname === "/dashboard",
    },
    {
      title: "Farm Map",
      url: "/map",
      icon: Map,
      isActive: location.pathname === "/map",
      badge: "Soon",
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
      isActive: location.pathname === "/analytics",
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      isActive: location.pathname === "/settings",
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={item.isActive}>
              <Link to={item.url}>
                <item.icon />
                <span>{item.title}</span>
                {item.badge && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}