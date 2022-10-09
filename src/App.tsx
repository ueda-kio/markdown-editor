import { ChakraProvider } from '@chakra-ui/react';
import { useState } from 'react';
import MarkdownViewer from './components/Organisms/MarkdownViwer';
import Editor from './Editor';
// import Container from './Container';
import GlobalStyle from './style/GlobalStyle';

const App = () => {
	const [text, setText] = useState('');

	return (
		<>
			<GlobalStyle />
			<ChakraProvider resetCSS>
				{/* <Container /> */}
				<Editor />
			</ChakraProvider>
		</>
	);
};

export default App;
