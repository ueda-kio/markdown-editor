import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import { store } from './reducks/store/store';
import { router } from './RouterConfig';
import GlobalStyle from './style/GlobalStyle';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<Provider store={store}>
		<ChakraProvider resetCSS>
			<GlobalStyle />
			<RouterProvider router={router} />
			{/* <App /> */}
		</ChakraProvider>
	</Provider>
);
