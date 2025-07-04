import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import NoteIcon from "@mui/icons-material/Note";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import AppSidebarFooter from "./AppSideBarFooter";
import TauriSvg from "../../../assets/tauri.svg";

export interface IAppSidebarProps {}

const routeData = {
  navMain: [
    {
      title: "开始",
      url: "/",
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
        {
          title: "milkdown",
          url: "/noteEditor/milkdown",
        },
        {
          title: "cherry",
          url: "/noteEditor/cherry",
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
          <img className="w-[24px] h-[24px]" src={TauriSvg} alt="tauri" />
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
      <AppSidebarFooter />
    </Sidebar>
  );
}
export default AppSidebar;
