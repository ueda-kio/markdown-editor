import { ChakraProvider } from '@chakra-ui/react';

const App = () => {
	return (
		<ChakraProvider resetCSS>
			<div>test</div>
		</ChakraProvider>
	)
}

export default App;
