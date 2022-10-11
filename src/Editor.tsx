import React, { useCallback, useEffect, useState } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { Button, Grid, Textarea } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import MarkdownViewer from './components/Organisms/MarkdownViwer';
import { useAppDispatch, useFileListSelector } from './reducks/hooks';
import { fetchFileById } from './libs/firebase.operation';
import { updateFile } from './reducks/slice/fileListSlice';

const Editor = () => {
	const dispatch = useAppDispatch();
	const { fileList } = useFileListSelector();
	const [value, setValue] = useState('');
	useBeforeunload((event) => {
		// if (value !== '') {
		console.log('unload');
		// event.preventDefault();
		// }
	});

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

	// ファイルのvalueをテキストエリアに反映
	useEffect(() => {
		if (id === '') return;
		(async () => {
			const data = (async () => {
				const _data = getFileById(); // stateから取得
				if (_data) return _data;
				return await fetchFileById(id); // stateにない場合firestoreから取得
			})();
			const target = await data;
			if (!target) return;
			setValue(target.value);
		})();
	}, [id]);

	// unload時に自動保存
	useEffect(() => {
		return () => {
			console.log('unload');
			const updated_at = new Date().toISOString();
			// updateFile(id, value, updated_at);
			dispatch(updateFile({ id, value, updated_at }));
		};
	}, [value]);

	/** 保存ボタン押下時の挙動 */
	const handleSave = () => {
		const updated_at = new Date().toISOString();
		// updateFile(id, value, updated_at);
		dispatch(updateFile({ id, value, updated_at }));
	};

	return (
		<>
			<Button onClick={handleSave}>SAVE</Button>
			<Link to="/">BACK to HOME</Link>
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
