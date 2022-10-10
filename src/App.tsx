import { Box, ChakraProvider } from '@chakra-ui/react';
import Header from './Header';
import Editor from './Editor';
import Container from './Container';
import GlobalStyle from './style/GlobalStyle';
import RouterConfig from './RouterConfig';

const App = () => {
	return (
		<>
			<GlobalStyle />
			<ChakraProvider resetCSS>
				<Header />
				<Box as="main" pt="20" pb="10" px="5" height="100vh">
					{/* <Editor /> */}
					{/* <Container /> */}
					<RouterConfig />
				</Box>
			</ChakraProvider>
		</>
	);
};

export default App;
