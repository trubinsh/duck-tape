import '@mantine/core/styles.css';
import {ColorSchemeScript, createTheme, MantineProvider, Text} from '@mantine/core';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {ApplicationLayout} from "@/components/layout/application-layout";
import {EncoderDecoderPage} from "@/pages/encoder-decoder-page.tsx";
import {Generator} from "@/pages/generator.tsx";

const theme = createTheme({
  fontFamily: 'JetBrains Mono',
  fontFamilyMonospace: 'JetBrains Mono, monospace',
  primaryColor: 'indigo',
  defaultRadius: 'md',
  colors: {
    // Customizing the dark scale for a "Deep Ocean" feel
    dark: [
      '#d5d7e0', '#acaebf', '#8c8fa3', '#666980', '#4d4f66',
      '#34354a', '#2b2c3d', '#1d1e30', '#0c0d21', '#01010a',
    ],
  },
  black: '#01010a',
  components: {
    Button: {defaultProps: {variant: 'light'}},
    Code: {defaultProps: {color: 'indigo'}},
  },
});

export default function App() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="dark"/>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <BrowserRouter>
          <ApplicationLayout>
            <Routes>
              <Route path="/" element={
                <Text size="xl" fw={700} mb="md">Main Content</Text>
              }/>
              <Route path="/encoder-decoder" element={<EncoderDecoderPage/>}/>
              <Route path="/generator" element={<Generator/>}/>
            </Routes>
          </ApplicationLayout>
        </BrowserRouter>
      </MantineProvider>
    </>
  );
}
