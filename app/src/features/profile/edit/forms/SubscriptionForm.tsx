import {
  Blockquote,
  Chip,
  List,
  Grid,
  ThemeIcon,
  rem,
  Text,
  Switch,
  Flex,
} from "@mantine/core";
import { useMemo } from "react";
import { IconCircleCheck, IconForbid, IconMessage2 } from "@tabler/icons-react";

import { SubscriptionType } from "@/constants";

import { useProfileFormContext } from "./FormContext";

export default function SubscriptionForm() {
  const form = useProfileFormContext();
  const isUserSubscribed = form.getValues().subscribed;
  const userSubscriptions = form.getValues().subscriptions;

  const getSubscriptions = useMemo(() => {
    return Object.values(SubscriptionType).map((subscription) => {
      return userSubscriptions.includes(subscription)
        ? { name: subscription, isSubscribed: true }
        : { name: subscription, isSubscribed: false };
    });
  }, [userSubscriptions]);

  const onSwitchClickHandler = (checked: boolean, name: SubscriptionType) => {
    if (checked) {
      form.setFieldValue("subscriptions", [...userSubscriptions, name]);
    } else {
      form.setFieldValue(
        "subscriptions",
        userSubscriptions.filter((sub) => sub !== name)
      );
    }
  };

  const onChipClickHandler = () => {
    form.setFieldValue("subscribed", !isUserSubscribed);
    if (isUserSubscribed) {
      form.setFieldValue("subscriptions", []);
    }
  };

  return (
    <Grid gutter={{ base: "xs", lg: "md" }} grow p="md">
      <Grid.Col span={{ base: 8 }}>
        <Blockquote
          color="blue"
          cite={
            <Chip
              checked={isUserSubscribed}
              color="green"
              variant="light"
              onClick={onChipClickHandler}
              data-testid="subscription-chip"
            >
              Subscription alerts {!isUserSubscribed && "not"} activated
            </Chip>
          }
          icon={<IconMessage2 />}
          mt="md"
        >
          <Text
            size="xl"
            fw={900}
            variant="gradient"
            gradient={{ from: "blue", to: "cyan", deg: 90 }}
          >
            Stop taking advice from the dark side.
          </Text>
          <Text mt="md" fs="italic">
            Sign up for our email to be the first to see inspiring content, news
            ad exclusive offers.
          </Text>
        </Blockquote>
      </Grid.Col>
      <Grid.Col span={{ base: 4 }}>
        <List p="md" spacing="xs" size="sm" center>
          {getSubscriptions.map(({ name, isSubscribed }) => (
            <Flex align="center" justify="space-between" mb="md" key={name}>
              <List.Item
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
              <Switch
                size="md"
                onLabel="ON"
                offLabel="OFF"
                checked={isSubscribed}
                disabled={!isUserSubscribed}
                onChange={(event) =>
                  onSwitchClickHandler(event.currentTarget.checked, name)
                }
                data-testid={`subscription-switch-${name}`}
              />
            </Flex>
          ))}
        </List>
      </Grid.Col>
    </Grid>
  );
}
