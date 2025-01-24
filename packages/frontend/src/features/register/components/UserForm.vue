<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { onMounted } from "vue";
import * as z from "zod";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type UserFormValues } from "~/features/register/types";


const props = defineProps<{
  initialValues?: UserFormValues;
  setSubmitHandler: (handler: (e?: Event | undefined) => Promise<void | undefined>) => void;
}>();

const emit = defineEmits<{
  (event: "submit", values: UserFormValues): void;
}>();

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
  initialValues: props.initialValues,
});

onMounted(() => {
  props.setSubmitHandler(form.handleSubmit((values) => {
    emit("submit", values);
  }));
});
</script>

<template>
  <FormField v-slot="{ componentField }" name="email">
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input autofocus placeholder="Your email address" type="email" v-bind="componentField"/>
      </FormControl>
      <FormDescription>Your email address is required to login.</FormDescription>
      <FormMessage/>
    </FormItem>
  </FormField>

  <FormField v-slot="{ componentField }" name="password">
    <FormItem>
      <FormLabel>Password</FormLabel>
      <FormControl>
        <Input placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" type="password" v-bind="componentField"/>
      </FormControl>
      <FormMessage/>
    </FormItem>
  </FormField>

  <FormField v-slot="{ componentField }" name="confirm">
    <FormItem>
      <FormLabel>Confirm password</FormLabel>
      <FormControl>
        <Input placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" type="password" v-bind="componentField"/>
      </FormControl>
      <FormMessage/>
    </FormItem>
  </FormField>
</template>
