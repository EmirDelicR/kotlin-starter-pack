import { createFormContext } from "@mantine/form";

import { SubscriptionType } from "@/constants";
import { User } from "@/store/userSlice";

type AccountFormData = Pick<User, "firstName" | "lastName" | "age">;
type SubscriptionFormData = Pick<User, "subscribed"> & {
  subscriptions: SubscriptionType[];
};
type AvatarData = {
  [key: string]: unknown;
  image: string | null;
};

export type ProfileFormData = AccountFormData &
  SubscriptionFormData &
  AvatarData;

export const [ProfileFormProvider, useProfileFormContext, useProfileForm] =
  createFormContext<ProfileFormData>();

export const setFormDataDefaultValues = (user: User) => ({
  image: null,
  firstName: user.firstName,
  lastName: user.lastName,
  age: user.age || 0,
  preview: user.avatar,
  subscribed: user.subscribed,
  subscriptions: user.subscriptions.map((subscription) => subscription.name),
});
