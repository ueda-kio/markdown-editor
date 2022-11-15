import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Auth from './Auth';
import Editor from './Editor';
import SideBar from './SideBar';
import SignIn from './Authentication/SignIn';
import SignUp from './Authentication/SignUp';
import Home from './Lists/Home';
import Trash from './Lists/Trash';
import Viwer from './Viwer';
import Reset from './Authentication/Reset';
import Archive from './Lists/Archive';
import Setting from './Setting';
import Privacy from './Privacy';

const Router = () => {
	return (
		<Routes>
			<Route path="/signin" element={<SignIn />} />
			<Route path="/signup" element={<SignUp />} />
			<Route path="/reset" element={<Reset />} />
			<Route
				path="*"
				element={
					<Auth>
						<Routes>
							<Route path="/" element={<SideBar />}>
								<Route index element={<Home />} />
								<Route path="trash" element={<Trash />} />
								<Route path="archive" element={<Archive />} />
								<Route path="setting" element={<Setting />} />
								<Route path="/privacy" element={<Privacy />} />
							</Route>
							<Route path="/file/:fileId/editor" element={<Editor />} />
							<Route path="/file/:fileId" element={<Viwer />} />
						</Routes>
					</Auth>
				}
			/>
		</Routes>
	);
};

export default Router;
