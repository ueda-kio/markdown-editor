import React, { useCallback, useEffect, useState } from 'react';
import { Button, Grid } from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/react';
import MarkdownViewer from './components/Organisms/MarkdownViwer';
import { useFileListSelector } from './reducks/hooks';
import { fetchFileById, updateFile } from './libs/firebase.operation';

const Editor = () => {
	const { fileList } = useFileListSelector();
	const [value, setValue] = useState('');

	/** urlの末尾から取得したファイルid */
	const id = (() => {
		const endOfPath = location.pathname.split(/(.*)\//).filter((t) => t !== '')[1];
		if (endOfPath === '') return '';
		return endOfPath;
	})();

	/** urlのidと同じファイルをstateから取得する */
	const getFileById = useCallback(() => {
		const files = fileList.files;
		const target = files.find((file) => file.id === id);
		return target;
	}, [id]);

	useEffect(() => {
		if (id === '') return;
		(async () => {
			// const target = getFileById();
			const target = await fetchFileById(id);
			if (!target) return;
			setValue(target.value);
		})();
	}, [id]);

	/** 保存ボタン押下時の挙動 */
	const handleSave = () => {
		const updated_at = new Date().toISOString();
		updateFile(id, value, updated_at);
	};

	return (
		<>
			<Button onClick={handleSave}>SAVE</Button>
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
		</>
	);
};

export default Editor;
