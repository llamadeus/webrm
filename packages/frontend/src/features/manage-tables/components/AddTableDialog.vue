<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";
import * as z from "zod";
import { api } from "~/api";
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


const formSchema = z.object({
  name: z
    .string({ required_error: "This field is required." })
    .min(1, "The name must be at least 1 character.")
    .max(50, "The name must be less than 50 characters."),
});

const open = ref(false);
const form = useForm({
  validationSchema: toTypedSchema(formSchema),
});

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await api("PUT /tables", {
      input: {
        name: values.name,
      },
    });

    toast.success("Table created");
    open.value = false;
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
});
</script>

<template>
  <Button variant="default" @click="open = true">
    Add table
  </Button>

  <Dialog v-model:open="open">
    <DialogContent @interactOutside.prevent>
      <form @submit.prevent="onSubmit">
        <DialogHeader>
          <DialogTitle>Add a table to your restaurant</DialogTitle>
          <DialogDescription>
            Enter the table name. Click save once you're done.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 38, 13, 87a, ..." type="text" v-bind="componentField"/>
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
