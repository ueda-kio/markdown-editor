import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Auth from './Auth';
import Editor from './Editor';
import SideBar from './SideBar';
import SignIn from './SignIn';
import Container from './Container';
import Trashes from './Trashes';
import Viwer from './Viwer';

const Router = () => {
	return (
		<Routes>
			<Route path="/signin" element={<SignIn />} />
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
