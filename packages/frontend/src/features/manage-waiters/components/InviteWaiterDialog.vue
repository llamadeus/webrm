<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/zod";
import { CircleCheckBig } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";
import * as z from "zod";
import { api } from "~/api";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
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
  DialogTrigger,
} from "~/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getErrorMessage } from "~/utils/error";


const appUrl = import.meta.env.VITE_APP_URL;
const invitationToken = ref<string | null>(null);
const formSchema = z.object({
  name: z
    .string({ required_error: "This field is required." })
    .min(1, "The name must be at least 1 character.")
    .max(50, "The name must be less than 50 characters."),
});

const form = useForm({
  validationSchema: toTypedSchema(formSchema),
});

const onSubmit = form.handleSubmit(async (values) => {
  try {
    const response = await api("POST /waiters/invite", {
      input: {
        name: values.name,
      },
    });

    invitationToken.value = response.token;
    toast.success("Invitation ready");
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
});
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="default">
        Invite waiter
      </Button>
    </DialogTrigger>
    <DialogContent @interactOutside.prevent>

      <form @submit.prevent="onSubmit">
        <DialogHeader>
          <DialogTitle>Invite a waiter</DialogTitle>
          <DialogDescription>
            Enter the name of the waiter and hit invite to get a registration link.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <FormField v-if="invitationToken === null" v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="The name of your waiter" type="text" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
          <template v-else>
            <Alert class="bg-green-800/10 border-green-800/20">
              <CircleCheckBig class="size-4 stroke-green-900"/>
              <AlertTitle class="text-base text-green-900">All set!</AlertTitle>
              <AlertDescription class="text-green-800">
                Send the following invitation link to your waiter to register.
              </AlertDescription>
            </Alert>

            <div class="space-y-2">
              <Label>Invitation link</Label>
              <Input
                :model-value="`${appUrl}/register/${invitationToken}`"
                readonly
                type="text"
                @click="$event.target.select()"
              />
            </div>
          </template>
        </DialogBody>

        <DialogFooter>
          <template v-if="invitationToken === null">
            <DialogClose as-child>
              <Button variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="default">
              Invite
            </Button>
          </template>
          <template v-else>
            <DialogClose as-child>
              <Button variant="default">
                Done
              </Button>
            </DialogClose>
          </template>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
