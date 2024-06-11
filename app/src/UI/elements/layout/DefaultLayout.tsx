import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Center, Loader } from '@mantine/core';

export default function DefaultLayout() {
  return (
    <Suspense
      fallback={
        <Center mih="90vh">
          <Loader type="bars" />
        </Center>
      }
    >
      <Outlet />
    </Suspense>
  );
}
