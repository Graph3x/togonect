import {React} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Layout from './components/Layout';
import LoginBlock from './components/loginBlock';
import Profile from './components/profile';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<p>INDEX</p>} />
                <Route path='login' element={<LoginBlock/>} />
                <Route path='profile/:iden' element={<Profile/>} />
            </Route>
        </Routes>
    </BrowserRouter>
    );