import React, { lazy } from 'react';
import { createBrowserRouter, BrowserRouter, Routes, Route } from 'react-router-dom';
import Root from './routes/root';
import Viwer from './VIwer';

const Editor = lazy(() => import('./Editor'));
const Container = lazy(() => import('./Container'));

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		children: [
			{
				index: true,
				element: <Container />,
			},
			{
				path: '/file/:fileId',
				element: <Viwer />,
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
