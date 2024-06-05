import { Center, Loader } from "@mantine/core";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

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
