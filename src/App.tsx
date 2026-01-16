import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@mantine/core/styles.css';
import {MantineProvider, createTheme, type MantineColorsTuple, Button} from '@mantine/core';

const myColor: MantineColorsTuple = [
    '#ecf4ff',
    '#dce4f5',
    '#b9c7e2',
    '#94a8d0',
    '#748dc0',
    '#5f7cb7',
    '#5474b4',
    '#44639f',
    '#3a5890',
    '#2c4b80'
];

const theme = createTheme({
    colors: {
        myColor,
    },
    primaryColor: 'myColor',
});

export default function App() {
    const [count, setCount] = useState(0);
    return <MantineProvider theme={theme}>
        <div>
            <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo"/>
            </a>
            <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo"/>
            </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
            <Button onClick={() => setCount((count) => count + 1)}>count is {count}</Button>
            <p>
                Edit <code>src/App.tsx</code> and save to test HMR
            </p>
        </div>
        <p className="read-the-docs">
            Click on the Vite and React logos to learn more
        </p>
    </MantineProvider>;
}
