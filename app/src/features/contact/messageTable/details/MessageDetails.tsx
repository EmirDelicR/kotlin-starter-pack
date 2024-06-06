import {
  Alert,
  Badge,
  Blockquote,
  Box,
  Center,
  Checkbox,
  Grid,
  Loader,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { IconInfoCircle, IconMessage } from "@tabler/icons-react";

import {
  useGetMessageQuery,
  useUpdateMessageMutation,
} from "../../store/contactApiSlice";

import { formatDate } from "@/utils";

import Error from "@/UI/components/error/Error";

export default function MessageDetails({ id }: { id: string }) {
  const clipboard = useClipboard({ timeout: 500 });
  const { data, isLoading, isError, error } = useGetMessageQuery({
    messageId: id,
  });

  const [updateMessage, { isError: isUpdateError, error: updateError }] =
    useUpdateMessageMutation();

  if (isLoading) {
    return (
      <Center py="lg">
        <Loader type="bars" />
      </Center>
    );
  }

  if (isError) {
    return <Error isError={isError} error={error} />;
  }

  if (!data) {
    return (
      <Error
        isError={true}
        error={{ error: "There is no data for this message" }}
      />
    );
  }

  const onCheckboxChange = async () => {
    await updateMessage(id);
  };

  return (
    <Blockquote
      color="blue"
      icon={<IconInfoCircle />}
      mt="md"
      cite={`Message from ${data.sender}`}
    >
      <Box p="md">
        <Grid gutter={{ base: "xs", lg: "md" }}>
          <Grid.Col span={{ base: 12, lg: 6 }} fw="bold">
            Send on date:
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Badge w="100%" color="blue">
              {formatDate(data!.createdAt)}
            </Badge>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }} fw="bold">
            Sender:
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Badge w="100%" color="blue">
              {data?.sender}
            </Badge>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }} fw="bold">
            Email:
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Badge
              w="100%"
              color={clipboard.copied ? "green" : "blue"}
              onClick={() => clipboard.copy(data?.email)}
              style={{ cursor: "pointer" }}
              title="Copy"
            >
              {data?.email}
            </Badge>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }} fw="bold">
            Mark as {data?.unread ? "readed" : "unread"}
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Checkbox
              checked={!data?.unread}
              id={data?.id}
              name={data?.id}
              onChange={onCheckboxChange}
            />
          </Grid.Col>
        </Grid>
        <Alert
          my="sm"
          variant="light"
          color="blue"
          title="Message"
          icon={<IconMessage />}
        >
          {data?.message}
        </Alert>

        <Error isError={isUpdateError} error={updateError} />
      </Box>
    </Blockquote>
  );
}
