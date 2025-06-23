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
      url: "/vditorNote",
      items: [
        {
          title: "Routing",
          url: "#",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
        {
          title: "Rendering",
          url: "#",
        },
      ],
    },
    {
      title: "番茄钟",
      url: "/pomodoro",
      items: [],
    },
    {
      title: "设置",
      url: "/setting",
      items: [],
    },
  ],
};

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
        <SidebarGroup>
          <SidebarMenu>
            {routeData.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={item.url === location.pathname}
                >
                  <a href={item.url} className="font-medium">
                    {item.title}
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
