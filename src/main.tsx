import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from './reducks/store/store';
import theme from './theme';
import GlobalStyle from './style/GlobalStyle';
import Root from './routes/root';
import Loading from './components/Atoms/Loading';
import SignIn from './routes/Authentication/SignIn';
import AuthGuard from './routes/Auth';
import Router from './routes/Router';

const Container = lazy(() => import('./routes/Container'));
const Trashes = lazy(() => import('./routes/Trashes'));
const Viwer = lazy(() => import('./routes/Viwer'));
const Editor = lazy(() => import('./routes/Editor'));
const SideBar = lazy(() => import('./routes/SideBar'));

export const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<AuthGuard>
				<Root />
			</AuthGuard>
		),
		children: [
			{
				index: true,
				element: (
					<Suspense fallback={<Loading />}>
						<Container />
					</Suspense>
				),
			},
			{
				path: '/trash/',
				element: (
					<Suspense fallback={<Loading />}>
						<Trashes />
					</Suspense>
				),
			},
		],
	},
	{
		path: '/file/:fileId',
		element: (
			<Suspense fallback={<Loading />}>
				<Viwer />
			</Suspense>
		),
	},
	{
		path: '/file/:fileId/editor',
		element: (
			<Suspense fallback={<Loading />}>
				<Editor />
			</Suspense>
		),
	},
	{
		path: '/signin',
		element: <SignIn />,
	},
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<Provider store={store}>
		<ChakraProvider theme={theme} resetCSS>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<GlobalStyle />
			<BrowserRouter>
				<Router />
			</BrowserRouter>
			{/* <RouterProvider router={router} /> */}
		</ChakraProvider>
	</Provider>
);
