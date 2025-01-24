<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import * as z from "zod";
import { api } from "~/api";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { getErrorMessage } from "~/utils/error";


const formSchema = z.object({
  email: z
    .string({ required_error: "This field is required." })
    .email("The email address is invalid.")
    .max(50, "The name must be less than 50 characters."),
  password: z
    .string({ required_error: "This field is required." })
    .min(6, "The name must be at least 6 character.")
    .max(50, "The name must be less than 50 characters."),
});

const form = useForm({
  validationSchema: toTypedSchema(formSchema),
});

const handleSubmit = form.handleSubmit(async (values) => {
  try {
    await api("POST /login", {
      input: values,
    });

    window.location.reload();
  }
  catch (error) {
    toast.error(getErrorMessage(error), {
      duration: 500000,
    });
  }
});
</script>

<template>
  <div class="flex flex-col flex-1 items-center justify-center">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-xl">Login</CardTitle>
        <CardDescription>
          Log in to your WebRM account here.
        </CardDescription>
      </CardHeader>

      <form @submit.prevent="handleSubmit">
        <CardContent class="flex flex-col gap-4">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email address" type="email" v-bind="componentField"/>
              </FormControl>
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
        </CardContent>

        <CardFooter class="justify-between">
          <Button as-child class="px-0" variant="link">
            <RouterLink to="/register">
              Not registered yet?
            </RouterLink>
          </Button>

          <Button variant="default">
            Login
          </Button>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
