import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Editor from './Editor';
import Container from './Container';

const RouterConfig = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={`/`} element={<Container />} />
				<Route path={`/editor/`} element={<Editor />} />
			</Routes>
		</BrowserRouter>
	);
};

export default RouterConfig;
