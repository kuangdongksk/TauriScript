import {
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { userInfoA } from "@/store/authStore";
import { useAtom } from "jotai";

export interface IAppSidebarFooterProps {}

function AppSidebarFooter(props: IAppSidebarFooterProps) {
  const {} = props;

  const [user] = useAtom(userInfoA);

  return (
    <SidebarFooter>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>{user?.username ?? "未登录"}</SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarTrigger />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarFooter>
  );
}
export default AppSidebarFooter;
