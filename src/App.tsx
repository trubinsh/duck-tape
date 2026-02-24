import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/code-highlight/styles.css';
import {
  ColorSchemeScript,
  createTheme,
  MantineProvider,
  Text
} from '@mantine/core';
import {Notifications} from '@mantine/notifications';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {ApplicationLayout} from "@/components/layout/application-layout";
import {loadSettings} from "@/lib/settings.ts";
import {ClipboardProvider} from "@/components/clipboard-provider.tsx";
import StructureFormatter from "@/pages/structure-formatter.tsx";
import {Encoder} from "@/pages/encoder.tsx";
import DiffViewer from "@/pages/diff-viewer.tsx";
import {PasswordGenerator} from "@/pages/password-generator.tsx";
import {UUIDGenerator} from "@/pages/uuid-generator.tsx";
import {TimestampConverter} from "@/pages/timestamp-converter.tsx";
import {RegexPage} from "@/pages/regex.tsx";
import {
  CodeHighlightAdapterProvider,
  createShikiAdapter
} from "@mantine/code-highlight";
import {TitleProvider} from "@/components/title-context.tsx";

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

async function loadShiki() {
  const {createHighlighter} = await import('shiki');
  return await createHighlighter({
    langs: ['json'],
    themes: [],
  });
}

const shikiAdapter = createShikiAdapter(loadShiki);

export default function App() {
  const settings = loadSettings();

  return (
    <>
      <ColorSchemeScript defaultColorScheme={settings.theme}/>
      <MantineProvider theme={theme} defaultColorScheme={settings.theme}>
        <Notifications/>
        <CodeHighlightAdapterProvider adapter={shikiAdapter}>
          <BrowserRouter>
            <ClipboardProvider>
              <TitleProvider>
                <ApplicationLayout>
                  <Routes>
                    <Route path="/" element={
                      <Text size="xl" fw={700} mb="md">Main Content</Text>
                    }/>
                    <Route path="/formatter" element={<StructureFormatter/>}/>
                    <Route path="/encoder" element={<Encoder/>}/>
                    <Route path="/diff-viewer" element={<DiffViewer/>}/>
                    <Route path="/password-generator"
                           element={<PasswordGenerator/>}/>
                    <Route path="/uuid-generator" element={<UUIDGenerator/>}/>
                    <Route path="/timestamp-converter"
                           element={<TimestampConverter/>}/>
                    <Route path="/regex" element={<RegexPage/>}/>
                  </Routes>
                </ApplicationLayout>
              </TitleProvider>
            </ClipboardProvider>
          </BrowserRouter>
        </CodeHighlightAdapterProvider>
      </MantineProvider>
    </>
  );
}
