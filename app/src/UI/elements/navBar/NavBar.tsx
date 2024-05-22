import { Box, Flex, List } from "@mantine/core";
import NavFooter from "@/UI/elements/footer/navFooter/NavFooter";

export default function NavBar() {
  return (
    <Flex direction="column" justify="space-between" flex={1} pr="lg">
      <Box>
        <List>
          <List.Item>Clone or download repository from GitHub</List.Item>
          <List.Item>Install dependencies with yarn</List.Item>
          <List.Item>
            To start development server run npm start command
          </List.Item>
          <List.Item>
            Run tests to make sure your changes do not break the build
          </List.Item>
          <List.Item>Submit a pull request once you are done</List.Item>
        </List>
      </Box>
      <NavFooter />
    </Flex>
  );
}
