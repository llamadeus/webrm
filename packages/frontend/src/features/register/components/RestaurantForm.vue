<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { onMounted } from "vue";
import * as z from "zod";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type RestaurantFormValues } from "~/features/register/types";


const props = defineProps<{
  initialValues?: RestaurantFormValues;
  setSubmitHandler: (handler: (e?: Event | undefined) => Promise<void | undefined>) => void;
}>();

const emit = defineEmits<{
  (event: "submit", values: RestaurantFormValues): void;
}>();

const formSchema = z.object({
  restaurant: z
    .string({ required_error: "This field is required." })
    .min(1, "The name must be at least 1 character.")
    .max(50, "The name must be less than 50 characters."),
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
  <FormField v-slot="{ componentField }" name="restaurant">
    <FormItem>
      <FormLabel>Restaurant</FormLabel>
      <FormControl>
        <Input autofocus placeholder="Your restaurant's name" type="text" v-bind="componentField"/>
      </FormControl>
      <FormDescription>We will show the restaurant name to your customers.</FormDescription>
      <FormMessage/>
    </FormItem>
  </FormField>
</template>
