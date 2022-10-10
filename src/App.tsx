import { Box, Button, ChakraProvider } from '@chakra-ui/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MarkdownViewer from './components/Organisms/MarkdownViwer';
import Editor from './Editor';
import Header from './Header';
import Container from './Container';
import GlobalStyle from './style/GlobalStyle';
import RouterConfig from './RouterConfig';
import { db, FirebaseTimestamp } from './firebase';
import { fetchFileList, trashFile } from './libs/firebase.operation';

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
