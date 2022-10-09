import { Box, ChakraProvider } from '@chakra-ui/react';
import { useState } from 'react';
import MarkdownViewer from './components/Organisms/MarkdownViwer';
import Editor from './Editor';
import Header from './Header';
// import Container from './Container';
import GlobalStyle from './style/GlobalStyle';

const App = () => {
	const [text, setText] = useState('');

	return (
		<>
			<GlobalStyle />
			<ChakraProvider resetCSS>
				<Header />
				<Box as="main" px="10" py="5">
					<Editor />
				</Box>
				{/* <Container /> */}
			</ChakraProvider>
		</>
	);
};

export default App;
