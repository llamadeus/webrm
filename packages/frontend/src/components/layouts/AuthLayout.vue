<script lang="ts" setup>
import {
  ArrowRightToLine,
  BookOpenText,
  ClockArrowUp,
  Computer,
  LayoutDashboard,
  School,
  Users,
  UtensilsCrossed,
} from "lucide-vue-next";
import { AuthType } from "webrm-shared";
import { api } from "~/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "~/components/ui/sidebar";
import { useAuthStore } from "~/stores/auth";


// Stores
const authStore = useAuthStore();

async function logout() {
  await api("POST /logout", {});

  window.location.reload();
}
</script>

<template>
  <SidebarProvider>
    <Sidebar class="bg-background">
      <SidebarHeader>
        <RouterLink active-class="" class="flex items-center gap-3" exact-active-class="" to="/">
          <div class="flex size-11 rounded-lg bg-blue-950 text-white items-center justify-center">
            <UtensilsCrossed class="size-6"/>
          </div>
          <div class="flex flex-col">
            <span class="text-blue-950 text-lg font-medium font-serif italic">WebRM</span>
            <span class="text-xs">{{ authStore.auth?.restaurant }}</span>
          </div>
        </RouterLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <RouterLink to="/tables">
                    <LayoutDashboard/>
                    Tables
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <RouterLink to="/orders">
                    <ClockArrowUp/>
                    Orders
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup v-if="authStore.auth?.type === AuthType.Admin">
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <RouterLink to="/admin/menu">
                    <BookOpenText/>
                    Menu
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <RouterLink to="/admin/tables">
                    <LayoutDashboard/>
                    Tables
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <RouterLink to="/admin/waiters">
                    <Users/>
                    Waiters
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <RouterLink to="/admin/terminals">
                    <Computer/>
                    Terminals
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <RouterLink to="/admin/restaurant">
                    <School/>
                    Restaurant
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button class="group/logout hover:text-destructive focus:text-destructive" variant="ghost">
              Logout
              <span class="w-0 h-4 opacity-0 overflow-hidden text-inherit transition-[width,opacity] group-hover/logout:w-4 group-hover/logout:opacity-100 group-focus/logout:w-4 group-focus/logout:opacity-100">
                <ArrowRightToLine/>
              </span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Do you really want to logout?</AlertDialogTitle>
              <AlertDialogDescription>
                This will terminate your current session.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction @click="logout">I'm out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>

    <main class="flex flex-1 flex-col">
      <slot/>
    </main>
  </SidebarProvider>
</template>
