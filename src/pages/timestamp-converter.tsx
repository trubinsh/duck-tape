import {Grid, NumberInput, Text} from "@mantine/core";
import {useEffect, useState} from "react";

function TimestampConverter() {
  const [timestamp, setTimestamp] = useState<number | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (timestamp === 0 || !timestamp) setDate(undefined);
    else setDate(new Date(Number(timestamp.toString().padEnd(13, '0')).valueOf()));
  }, [timestamp]);

  return (
    <Grid ms={"sm"} mt={"sm"}>
      <Grid.Col span={6}>
        <NumberInput min={1} max={7999999999999999} value={timestamp}
                     onChange={(v) => setTimestamp(v as number)} hideControls
                     placeholder={"Epoch timestamp"} mb={"md"}/>
        {
          date && (
            <div>
              <Text fw={1000}>Local time:</Text>
              <Text> {date.toString()}</Text>
              <p/>
              <Text fw={1000}>UTC time:</Text>
              <Text> {date.toUTCString()}</Text>
            </div>)
        }
      </Grid.Col>
      <Grid.Col span={6}>
        Timestamp Converter
      </Grid.Col>
    </Grid>
  )
}


export {TimestampConverter}