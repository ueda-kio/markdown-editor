import { ChakraProvider } from '@chakra-ui/react';
// import Container from './Container';
import GlobalStyle from './style/GlobalStyle';

const App = () => {
	return (
		<>
			<GlobalStyle />
			<ChakraProvider resetCSS>{/* <Container /> */}</ChakraProvider>
		</>
	);
};

export default App;
