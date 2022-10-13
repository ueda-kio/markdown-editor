import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from './reducks/store/store';
import GlobalStyle from './style/GlobalStyle';
import Root from './routes/root';

const Container = lazy(() => import('./routes/Container'));
const Viwer = lazy(() => import('./routes/Viwer'));
const Editor = lazy(() => import('./routes/Editor'));

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
				path: '/file/:fileId/editor',
				element: <Editor />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<Provider store={store}>
		<ChakraProvider resetCSS>
			<GlobalStyle />
			<RouterProvider router={router} />
		</ChakraProvider>
	</Provider>
);
