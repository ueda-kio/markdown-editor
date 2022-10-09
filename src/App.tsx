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
	const handleClick: React.MouseEventHandler = () => {
		const timestamp = new Date().toISOString();
		const ref = db.collection('files');
		const doc = ref.doc();
		const id = doc.id;
		const data = {
			id,
			value: '',
			created_at: timestamp,
			updated_at: timestamp,
		};
		ref.doc(id)
			.set(data)
			.then(() => console.log('set done!'))
			.catch((e) => console.error(e));
	};

	return (
		<>
			<GlobalStyle />
			<ChakraProvider resetCSS>
				<Header />
				<Box as="main" px="10" py="5">
					{/* <Editor /> */}
					{/* <Container /> */}
					<RouterConfig />
					<Button onClick={handleClick}>Button</Button>
					<Button onClick={fetchFileList}>Fetch</Button>
					<Button onClick={() => trashFile('id')}>Trash</Button>
				</Box>
			</ChakraProvider>
		</>
	);
};

export default App;
