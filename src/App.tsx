import { ChakraProvider } from '@chakra-ui/react';
import GlobalStyle from './style/GlobalStyle';

const App = () => {
	return (
		<>
			<GlobalStyle />
			<ChakraProvider resetCSS></ChakraProvider>
		</>
	);
};

export default App;
