import '@mantine/dates/styles.css';
import './timestamp-converter.css';
import {Card, Grid, NumberInput, Text, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import {DateTimePicker} from "@mantine/dates";
import {TitleContent} from "@/components/title-context.tsx";

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
      <Card withBorder>
        <NumberInput label={"Timestamp"} min={1} max={9999999999999}
                     value={timestamp}
                     onChange={(v) => setTimestamp(v as number)} hideControls
                     placeholder={"Epoch timestamp"}/>
        {
          date && (
            <div className={"time-converter-output-container"}>
              <Card shadow={"sm"}  withBorder mb={"md"}>
                <Card.Section withBorder>
                  <Title order={4} m={"xs"}>Local time</Title>
                </Card.Section>
                <Card.Section>
                  <Text m={"xs"}>{date.toString()}</Text>
                </Card.Section>
              </Card>
              <Card shadow={"sm"}  withBorder>
                <Card.Section withBorder>
                  <Title order={4} m={"xs"}>UTC time</Title>
                </Card.Section>
                <Card.Section>
                  <Text m={"xs"}>{date.toUTCString()}</Text>
                </Card.Section>
              </Card>
            </div>)
        }
      </Card>
    </>
  )
}

const ToEpochConverter = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <>
      <Title order={3} mb={"sm"}>To Epoch</Title>
      <Card withBorder>
        <DateTimePicker label={"Date"} value={date}
                        onChange={(v) => setDate(new Date(v!))}
                        placeholder={"Select date and time"} withSeconds/>
        {
          date && (
            <div className={"time-converter-output-container"}>
              <Card shadow={"sm"} withBorder>
                <Card.Section withBorder>
                  <Title order={4} m={"xs"}>Epoch timestamp</Title>
                </Card.Section>
                <Card.Section>
                  <Text m={"xs"}>{(date.getTime() / 1000).toFixed()}</Text>
                </Card.Section>
              </Card>
            </div>)
        }
      </Card>
    </>
  )
}

function TimestampConverter() {

  return (
    <div className={"dt-flex-full-height"}>
      <TitleContent title={"Timestamp Converter"}/>
      <Grid mt={"sm"} style={{ flex: 1 }}>
        <Grid.Col span={6}>
          <FromEpochConverter/>
        </Grid.Col>
        <Grid.Col span={6}>
          <ToEpochConverter/>
        </Grid.Col>
      </Grid>
    </div>
  )
}


export {TimestampConverter}