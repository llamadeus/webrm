import { cva, type VariantProps } from "class-variance-authority";


export { default as DropdownMenu } from "./DropdownMenu.vue";

export { default as DropdownMenuCheckboxItem } from "./DropdownMenuCheckboxItem.vue";
export { default as DropdownMenuContent } from "./DropdownMenuContent.vue";
export { default as DropdownMenuGroup } from "./DropdownMenuGroup.vue";
export { default as DropdownMenuItem } from "./DropdownMenuItem.vue";
export { default as DropdownMenuLabel } from "./DropdownMenuLabel.vue";
export { default as DropdownMenuRadioGroup } from "./DropdownMenuRadioGroup.vue";
export { default as DropdownMenuRadioItem } from "./DropdownMenuRadioItem.vue";
export { default as DropdownMenuSeparator } from "./DropdownMenuSeparator.vue";
export { default as DropdownMenuShortcut } from "./DropdownMenuShortcut.vue";
export { default as DropdownMenuSub } from "./DropdownMenuSub.vue";
export { default as DropdownMenuSubContent } from "./DropdownMenuSubContent.vue";
export { default as DropdownMenuSubTrigger } from "./DropdownMenuSubTrigger.vue";
export { default as DropdownMenuTrigger } from "./DropdownMenuTrigger.vue";
export { DropdownMenuPortal } from "radix-vue";

export const dropdownMenuItemVariants = cva(
  "relative flex select-none items-center gap-2 w-full px-3 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "",
        destructive: "text-destructive focus:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type DropdownMenuItemVariants = VariantProps<typeof dropdownMenuItemVariants>;
