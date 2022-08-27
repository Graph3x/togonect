import {React} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Layout from './components/Layout';
import LoginBlock from './components/loginBlock';
import Profile from './components/profile';
import EditPage from './components/editPage';
import Homepage from './components/homepage';


const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<LoginBlock/>} />
                <Route path='homepage/' element={<Homepage/>} />
                <Route path='profile/:iden' element={<Profile/>} />
                <Route path='profile/:iden/edit' element={<EditPage/>} />

                <Route path='*' element={<h1>404: Not Found</h1>} />
            </Route>
        </Routes>
    </BrowserRouter>
    );