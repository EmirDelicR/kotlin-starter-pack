import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Alert } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

import { normalizeError } from "@/utils";

interface Props {
  isError: boolean;
  error: FetchBaseQueryError | SerializedError | { error: string } | undefined;
}

export default function Error({ isError, error }: Props) {
  if (!isError) {
    return null;
  }

  const { message = "Unknown Error occurred!" } = normalizeError(error);

  return (
    <Alert
      variant="light"
      color="red"
      title="Error occurred"
      icon={<IconAlertTriangle />}
    >
      {message}
    </Alert>
  );
}
