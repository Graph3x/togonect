import {React} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Layout from './components/common/Layout';
import LoginPage from './components/login/loginPage';
import Profile from './components/profile/profile';
import EditPage from './components/edit_profile/editPage';
import Homepage from './components/homepage';
import FriendsPage from './components/friends/friendsPage';
import GamePage from './components/gamePage';
import AddInvPage from './components/invites/addInvPage';
import SearchPage from './components/searchPage';
import EventPage from './components/invites/eventPage';


const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<LoginPage/>} />
                <Route path='homepage/' element={<Homepage/>} />
                <Route path='profile/:iden' element={<Profile/>} />
                <Route path='profile/:iden/edit' element={<EditPage/>} />
                <Route path='friends/' element={<FriendsPage/>} />
                <Route path='games/:iden' element={<GamePage/>} />
                <Route path='sendinv' element={<AddInvPage/>} />
                <Route path='search' element={<SearchPage/>} />
                <Route path='events/:iden' element={<EventPage/>} />

                <Route path='*' element={<h1>404: Not Found</h1>} />
            </Route>
        </Routes>
    </BrowserRouter>
    );