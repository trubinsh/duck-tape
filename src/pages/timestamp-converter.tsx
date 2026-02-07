import '@mantine/dates/styles.css';
import './timestamp-converter.css';
import {Grid, NumberInput, Text, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import {DateTimePicker} from "@mantine/dates";

const FromEpochConverter = () => {
  const [timestamp, setTimestamp] = useState<number>(parseInt((new Date().getTime() / 1000).toFixed()));
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (timestamp === 0 || !timestamp) setDate(undefined);
    else {
      let strTimestamp = timestamp.toString();
      if (strTimestamp.length <= 10) strTimestamp = strTimestamp.padEnd(strTimestamp.length + 3, '0');
      setDate(new Date(parseInt(strTimestamp)));
    }
  }, [timestamp]);

  return (
    <>
      <Title order={3} mb={"sm"}>From Epoch</Title>
      <NumberInput min={1} max={9999999999999} value={timestamp}
                   onChange={(v) => setTimestamp(v as number)} hideControls
                   placeholder={"Epoch timestamp"}/>
      {
        date && (
          <div className={"time-converter-output-container"}>
            <Text fw={1000}>Local time:</Text>
            <Text> {date.toString()}</Text>
            <p/>
            <Text fw={1000}>UTC time:</Text>
            <Text> {date.toUTCString()}</Text>
          </div>)
      }
    </>
  )
}

const ToEpochConverter = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <>
      <Title order={3} mb={"sm"}>To Epoch</Title>
      <DateTimePicker value={date} onChange={(v) => setDate(new Date(v!))} placeholder={"Select date and time"} withSeconds/>
      {
        date && (
          <div className={"time-converter-output-container"}>
            <Text fw={1000}>Epoch timestamp:</Text>
            <Text> {(date.getTime() / 1000).toFixed()}</Text>
          </div>)
      }
    </>
  )
}

function TimestampConverter() {

  return (
    <Grid ms={"sm"} mt={"sm"}>
      <Grid.Col span={6}>
        <FromEpochConverter/>
      </Grid.Col>
      <Grid.Col span={6}>
        <ToEpochConverter/>
      </Grid.Col>
    </Grid>
  )
}


export {TimestampConverter}