import { useNavigate } from 'react-router-dom';

import {
  AspectRatio,
  Button,
  Center,
  Container,
  Stack,
  Text
} from '@mantine/core';

import NotFound from '@/assets/404.png';
import { NavRoutes } from '@/constants';

export default function NotFoundPage() {
  const navigation = useNavigate();

  const onButtonClickHandler = () => {
    navigation(`/${NavRoutes.HOME}`);
  };

  return (
    <Container mih="100vh" pt="20vh" size="lg">
      <AspectRatio ratio={16 / 9} maw={700} mx="auto">
        <img src={NotFound} alt="Not Found image" />
      </AspectRatio>

      <Center mt="lg" p="md">
        <Stack>
          <Text
            ta="center"
            size="xl"
            fw={900}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
          >
            Oops! The page that you requested was not found!
          </Text>
          <Button onClick={onButtonClickHandler}>Go to home page</Button>
        </Stack>
      </Center>
    </Container>
  );
}
