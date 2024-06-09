import {
  Blockquote,
  Chip,
  List,
  Paper,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { useMemo } from "react";
import { IconCircleCheck, IconForbid, IconMessage2 } from "@tabler/icons-react";

import { useAppSelector } from "@/store";
import { selectUser } from "@/store/userSlice";

import { SubscriptionType } from "@/constants";

export default function SubscriptionDetails() {
  const user = useAppSelector(selectUser);

  const getSubscriptions = useMemo(() => {
    return Object.values(SubscriptionType).map((subscription) => {
      return user.subscriptions
        .map((subscriptionItem) => subscriptionItem.name)
        .includes(subscription)
        ? { name: subscription, isSubscribed: true }
        : { name: subscription, isSubscribed: false };
    });
  }, [user.subscriptions]);

  return (
    <Paper radius="md" withBorder p="md">
      <Blockquote
        color="blue"
        cite={
          <Chip defaultChecked={user.subscribed} color="green" variant="light">
            Subscription alerts {!user.subscribed && "not"} activated
          </Chip>
        }
        icon={<IconMessage2 />}
        mb="lg"
      >
        <List mt="md" spacing="xs" size="sm" center>
          {getSubscriptions.map(({ name, isSubscribed }) => (
            <List.Item
              key={name}
              icon={
                isSubscribed ? (
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <IconCircleCheck
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                ) : (
                  <ThemeIcon color="red" size={24} radius="xl">
                    <IconForbid style={{ width: rem(16), height: rem(16) }} />
                  </ThemeIcon>
                )
              }
            >
              <Text tt="capitalize">{name}</Text>
            </List.Item>
          ))}
        </List>
      </Blockquote>
    </Paper>
  );
}
