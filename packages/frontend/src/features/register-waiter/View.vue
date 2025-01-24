<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { toast } from "vue-sonner";
import type { BackendApi } from "webrm-shared";
import * as z from "zod";
import { api } from "~/api";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getErrorMessage } from "~/utils/error";


type Invitation = BackendApi["GET /invitation/:token"]["output"];

// Stores
const route = useRoute();

// State
const invitation = ref<Invitation | null>(null);

const formSchema = z.object({
  email: z
    .string({ required_error: "This field is required." })
    .email("The email address is invalid.")
    .min(1, "The name must be at least 1 character.")
    .max(50, "The name must be less than 50 characters."),
  password: z
    .string({ required_error: "This field is required." })
    .min(6, "The name must be at least 6 character.")
    .max(50, "The name must be less than 50 characters."),
  confirm: z
    .string({ required_error: "This field is required." })
    .min(6, "The name must be at least 6 character.")
    .max(50, "The name must be less than 50 characters."),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords don't match.",
  path: ["confirm"],
});

const form = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    name: "John Doe",
  },
});

const handleSubmit = form.handleSubmit(async (values) => {
  const { token } = route.params;
  if (typeof token != "string") {
    return;
  }

  try {
    await api("POST /register/:token", {
      input: {
        email: values.email,
        password: values.password,
      },
      params: {
        token,
      },
    });

    window.location.reload();
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
});

onMounted(async () => {
  const { token } = route.params;
  if (typeof token != "string") {
    return;
  }

  try {
    invitation.value = await api("GET /invitation/:token", {
      params: {
        token,
      },
    });
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
});
</script>

<template>
  <div v-if="invitation !== null" class="flex flex-col flex-1 items-center justify-center">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-xl">Register</CardTitle>
        <CardDescription>
          Register yourself at <span class="font-semibold italic font-serif">{{
            (invitation as Invitation).restaurant
          }}</span>.
        </CardDescription>
      </CardHeader>

      <form @submit.prevent="handleSubmit">
        <CardContent class="flex flex-col gap-4">
          <div class="space-y-2">
            <Label>Name</Label>
            <Input :model-value="(invitation as Invitation).name" disabled readonly/>
            <div class="text-sm text-muted-foreground">Your name cannot be changed.</div>
          </div>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email address" type="email" v-bind="componentField"/>
              </FormControl>
              <FormDescription>Your email address is required to login.</FormDescription>
              <FormMessage/>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  type="password"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="confirm">
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  type="password"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
        </CardContent>

        <CardFooter class="justify-end">
          <Button variant="default">
            Register
          </Button>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
