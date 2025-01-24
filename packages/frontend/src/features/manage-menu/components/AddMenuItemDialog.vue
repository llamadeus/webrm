<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";
import * as z from "zod";
import { api } from "~/api";
import { Autocomplete } from "~/components/form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { getErrorMessage } from "~/utils/error";


const props = defineProps<{
  categories: string[],
}>();

const formSchema = z.object({
  name: z
    .string({ required_error: "This field is required." })
    .min(1, "The name must be at least 1 character.")
    .max(50, "The name must be less than 50 characters."),
  category: z.string({ required_error: "This field is required." })
    .min(1, "The category must be at least 1 character.")
    .max(50, "The category must be less than 50 characters."),
  price: z.number({ required_error: "This field is required." }).min(0, "The price must be greater than 0."),
});

const open = ref(false);
const form = useForm({
  validationSchema: toTypedSchema(formSchema),
});

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await api("PUT /menu-items", {
      input: {
        name: values.name,
        category: values.category,
        price: values.price,
      },
    });

    toast.success("Menu item created");
    open.value = false;
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
});
</script>

<template>
  <Button variant="default" @click="open = true">
    Add menu item
  </Button>

  <Dialog v-model:open="open">
    <DialogContent @interactOutside.prevent>
      <form @submit.prevent="onSubmit">
        <DialogHeader>
          <DialogTitle>Add an item to your menu</DialogTitle>
          <DialogDescription>
            Enter the name of the menu item, the category, and a price.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Pasta alla Norma, Water, Tiramisu, ..." type="text" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" :validate-on-blur="false" name="category" validate-on-model-update>
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Autocomplete
                  :options="props.categories"
                  placeholder="e.g., 1st Course, Beverages, Desert, ..."
                  type="text"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="price">
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="Price of your item" step="0.01" type="number" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
        </DialogBody>

        <DialogFooter>
          <DialogClose as-child>
            <Button variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" variant="default">
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
