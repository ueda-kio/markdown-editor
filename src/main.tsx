import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from './style/createEmotionCache';
import { store } from './reducks/store/store';
import theme from './style/theme';
import GlobalStyle from './style/GlobalStyle';
import Router from './routes/Router';

//TODO lazyの参考に残す
// const Container = lazy(() => import('./routes/Lists/Home'));
// const Trashes = lazy(() => import('./routes/Lists/Trash'));
// const Viwer = lazy(() => import('./routes/Viwer'));
// const Editor = lazy(() => import('./routes/Editor'));
// const SideBar = lazy(() => import('./routes/SideBar'));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<Provider store={store}>
		<CacheProvider value={createEmotionCache()}>
			<ChakraProvider theme={theme} resetCSS>
				<ColorModeScript initialColorMode={theme.config.initialColorMode} />
				<GlobalStyle />
				<BrowserRouter>
					<Router />
				</BrowserRouter>
			</ChakraProvider>
		</CacheProvider>
	</Provider>
);
