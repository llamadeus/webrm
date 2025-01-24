<script lang="ts" setup>
import { computed, ref, shallowRef } from "vue";
import { toast } from "vue-sonner";
import { api } from "~/api";
import Stepper from "~/components/stepper/Stepper.vue";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import RestaurantForm from "~/features/register/components/RestaurantForm.vue";
import UserForm from "~/features/register/components/UserForm.vue";
import { type Handler, type RestaurantFormValues, type UserFormValues } from "~/features/register/types";
import { cn } from "~/lib/utils";
import { getErrorMessage } from "~/utils/error";


enum Step {
  Restaurant,
  Final,
}

// State
const onSubmit = shallowRef<Handler | undefined>(undefined);
const step = ref(Step.Restaurant);
const restaurantData = ref<RestaurantFormValues | null>(null);
const userData = ref<UserFormValues | null>(null);

function setSubmitHandler(handler: Handler) {
  onSubmit.value = handler;
}

function handleRestaurantSubmit(values: RestaurantFormValues) {
  restaurantData.value = values;
  step.value = Step.Final;
}

async function handleFinalSubmit(values: UserFormValues) {
  userData.value = values;

  if (restaurantData.value == null) {
    return;
  }

  try {
    await api("POST /register", {
      input: {
        restaurant: restaurantData.value.restaurant,
        email: values.email,
        password: values.password,
      },
    });

    window.location.reload();
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
}

const steps = computed(() => ([
  { key: Step.Restaurant, caption: "Restaurant", completed: restaurantData.value !== null },
  { key: Step.Final, caption: "Final step", completed: userData.value !== null },
]));
</script>

<template>
  <div class="flex flex-col flex-1 items-center justify-center">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-xl">Register</CardTitle>
        <CardDescription>
          Register now and start using <span class="font-serif italic text-blue-950">WebRM</span> today.
        </CardDescription>
      </CardHeader>

      <form @submit.prevent="onSubmit">
        <CardContent class="flex flex-col gap-4">
          <Stepper :active="step" :steps="steps" @change="step = $event as Step"/>

          <RestaurantForm
            v-if="step === Step.Restaurant"
            :initial-values="restaurantData ?? undefined"
            :set-submit-handler="setSubmitHandler"
            @submit="handleRestaurantSubmit"
          />
          <UserForm
            v-else-if="step === Step.Final"
            :initial-values="userData ?? undefined"
            :set-submit-handler="setSubmitHandler"
            @submit="handleFinalSubmit"
          />
        </CardContent>

        <CardFooter :class="cn(step === Step.Restaurant ? 'justify-between' : 'justify-end gap-2')">
          <Button v-if="step === Step.Restaurant" as-child class="px-0" variant="link">
            <RouterLink to="/login">
              Already registered?
            </RouterLink>
          </Button>
          <Button v-else variant="secondary" @click="step = Step.Restaurant">
            Back
          </Button>

          <Button type="submit" variant="default">
            <template v-if="step === Step.Restaurant">Next</template>
            <template v-else>Register</template>
          </Button>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
