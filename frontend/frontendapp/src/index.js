import {React} from 'react';
import {createRoot} from 'react-dom/client';
import LoginBlock from './components/loginBlock';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<LoginBlock/>);