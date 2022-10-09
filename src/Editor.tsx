import React, { useState } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/react';
import { Flex, Spacer } from '@chakra-ui/react';
import MarkdownViewer from './components/Organisms/MarkdownViwer';

const Editor = () => {
	const [value, setValue] = useState('');

	return (
		<Grid gap={30} templateColumns={{ base: 'none', lg: 'repeat(2, 1fr)' }}>
			<Textarea
				placeholder="Here is a sample placeholder"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				resize="none"
				size="lg"
				rounded="md"
				height="96"
			/>
			<MarkdownViewer markdownText={value} />
		</Grid>
	);
};

export default Editor;
