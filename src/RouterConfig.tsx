import React from 'react';
import { createBrowserRouter, BrowserRouter, Routes, Route } from 'react-router-dom';
import Editor from './Editor';
import Container from './Container';
import Root from './routes/root';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		children: [
			{
				path: '/',
				element: <Container />,
			},
			{
				path: '/editor/:fileId',
				element: <Editor />,
			},
		],
	},
]);

const RouterConfig = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={`/`} element={<Container />} />
				<Route path={`/editor/:fileId`} element={<Editor />} />
			</Routes>
		</BrowserRouter>
	);
};

export default RouterConfig;
