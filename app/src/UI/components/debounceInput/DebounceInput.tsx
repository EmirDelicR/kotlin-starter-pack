import { useState } from 'react';

import { Loader, TextInput, TextInputProps } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';

interface Props extends Omit<TextInputProps, 'onChange'> {
  initialValue: string;
  onChange: (value: string) => void;
}

export default function DebounceInput({
  initialValue,
  onChange,
  ...props
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const handleDebouncedChange = useDebouncedCallback(async (query: string) => {
    onChange(query);
    setLoading(false);
  }, 500);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
    setLoading(true);
    handleDebouncedChange(event.currentTarget.value);
  };

  return (
    <TextInput
      {...props}
      value={value}
      onChange={handleChange}
      rightSection={
        loading && <Loader size={20} data-testid="debounce-input-loader" />
      }
    />
  );
}
