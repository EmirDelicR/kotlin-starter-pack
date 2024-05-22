import { Box } from "@mantine/core";
import LogoSvg from "@/assets/Logo.svg";

interface Props {
  visibleFrom?: "sm" | "md" | "unset";
  hiddenFrom?: "sm" | "md" | "unset";
}

export default function Logo({
  visibleFrom = "unset",
  hiddenFrom = "unset",
}: Props) {
  return (
    <Box visibleFrom={visibleFrom} hiddenFrom={hiddenFrom}>
      <LogoSvg />
    </Box>
  );
}
