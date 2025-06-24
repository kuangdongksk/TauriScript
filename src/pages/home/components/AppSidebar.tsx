import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import NoteIcon from "@mui/icons-material/Note";
import { useNavigate } from "react-router-dom";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import SettingsIcon from "@mui/icons-material/Settings";

export interface IAppSidebarProps {}

const routeData = {
  navMain: [
    {
      title: "Getting Started",
      url: "/",
      items: [
        {
          title: "Installation",
          url: "/",
        },
        {
          title: "Project Structure",
          url: "/",
        },
      ],
    },
    {
      title: "笔记",
      url: "/noteEditor",
      icon: <NoteIcon />,
      items: [
        {
          title: "vditor",
          url: "/noteEditor/vditorNote",
        },
      ],
    },
    {
      title: "番茄钟",
      url: "/pomodoro",
      icon: <AccessAlarmsIcon />,
      items: [],
    },
    {
      title: "设置",
      url: "/setting",
      icon: <SettingsIcon />,
      items: [],
    },
  ],
};

function AppSidebar(props: IAppSidebarProps) {
  const {} = props;
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">工具箱</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {routeData.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={item.url === location.pathname}
                  onClick={() => {
                    navigate(item.url);
                  }}
                >
                  <a>
                    <span>{item.icon && item.icon}</span>
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={item.url === location.pathname}
                        >
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-right">
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
export default AppSidebar;
