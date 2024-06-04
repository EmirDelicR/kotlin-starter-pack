import { useEffect, useRef } from "react";

type AsyncFunction<T> = () => Promise<T>;

export default function useAsyncEffect<T>(
  action: AsyncFunction<T>,
  dependencies: unknown[] = []
) {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadTheThings() {
      // wait for the initial cleanup in Strict mode - avoids double mutation
      await Promise.resolve();

      if (!isMounted.current || ignore) {
        return;
      }

      try {
        await action();
      } catch (error) {
        console.log("useAsyncEffect Error: ", error);
      }
    }

    loadTheThings();

    return () => {
      ignore = true;
    };
  }, dependencies);
}
