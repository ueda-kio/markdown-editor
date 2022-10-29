import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Auth from './Auth';
import Editor from './Editor';
import SideBar from './SideBar';
import SignIn from './Authentication/SignIn';
import SignUp from './Authentication/SignUp';
import Container from './Container';
import Trashes from './Trashes';
import Viwer from './Viwer';
import Reset from './Authentication/Reset';

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
								<Route index element={<Container />} />
								<Route path="trash" element={<Trashes />} />
							</Route>
							<Route path="/file/:fileId" element={<Viwer />} />
							<Route path="/file/:fileId/editor" element={<Editor />} />
						</Routes>
					</Auth>
				}
			/>
		</Routes>
	);
};

export default Router;
