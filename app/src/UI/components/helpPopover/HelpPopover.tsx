import { ReactNode } from 'react';

import { Button, Popover, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHelpCircle } from '@tabler/icons-react';

interface Props {
  buttonText?: string | ReactNode;
  hintText: string;
}

export default function HelpPopover({
  hintText,
  buttonText = <IconHelpCircle />
}: Props) {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <Popover
      width={250}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
    >
      <Popover.Target>
        <Button
          px="xs"
          onMouseEnter={open}
          onMouseLeave={close}
          variant="light"
        >
          {buttonText}
        </Button>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: 'none' }}>
        <Text size="sm">{hintText}</Text>
      </Popover.Dropdown>
    </Popover>
  );
}
