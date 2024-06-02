import { useState } from "react";
import { UnstyledButton, Text, Paper, Group, rem } from "@mantine/core";
import {
  IconBug,
  IconTool,
  IconClockPause,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";

import classes from "./StatsControl.module.scss";

const data = [
  { icon: IconTool, label: "Working" },
  { icon: IconBug, label: "Debugging" },
  { icon: IconClockPause, label: "Break" },
];

const MAX_DAY = 5;
const MIN_DAY = 1;

export function StatsControl() {
  const [day, setDay] = useState(1);

  const increaseDay = () => {
    setDay((current) => (current === MAX_DAY ? MIN_DAY : current + 1));
  };

  const decreaseDay = () => {
    setDay((current) => (current === MIN_DAY ? MAX_DAY : current - 1));
  };

  const stats = data.map((stat) => (
    <Paper
      className={classes.stat}
      radius="md"
      shadow="md"
      p="xs"
      key={stat.label}
    >
      <stat.icon
        style={{ width: rem(32), height: rem(32) }}
        className={classes.icon}
        stroke={1.5}
      />
      <div>
        <Text className={classes.label}>{stat.label}</Text>
        <Text fz="xs" className={classes.count}>
          <span className={classes.value}>
            {Math.floor(Math.random() * 3 + 1)}h
          </span>{" "}
          / 10h
        </Text>
      </div>
    </Paper>
  ));

  return (
    <div className={classes.root}>
      <div className={classes.controls}>
        <UnstyledButton className={classes.control} onClick={increaseDay}>
          <IconChevronUp
            style={{ width: rem(16), height: rem(16) }}
            className={classes.controlIcon}
            stroke={1.5}
          />
        </UnstyledButton>

        <div className={classes.date}>
          <Text className={classes.day}>{day}</Text>
        </div>

        <UnstyledButton className={classes.control} onClick={decreaseDay}>
          <IconChevronDown
            style={{ width: rem(16), height: rem(16) }}
            className={classes.controlIcon}
            stroke={1.5}
          />
        </UnstyledButton>
      </div>
      <Group style={{ flex: 1 }}>{stats}</Group>
    </div>
  );
}
