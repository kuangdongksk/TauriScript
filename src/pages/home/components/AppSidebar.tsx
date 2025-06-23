import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { mainRoute } from "@/routes";
import { NavLink } from "react-router-dom";

export interface IAppSidebarProps {}

function AppSidebar(props: IAppSidebarProps) {
  const {} = props;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">工具箱</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainRoute.map((route) => (
            <SidebarMenuItem key={route.path}>
              <NavLink to={route.path}>
                {({ isActive }) => (
                  <SidebarMenuButton isActive={isActive} tooltip={route.title}>
                    {route.icon}
                    <span>{route.title}</span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="text-right">
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
export default AppSidebar;
