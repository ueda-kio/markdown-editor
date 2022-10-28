import React, { useCallback, useEffect, useState } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { Box, Button, Grid, Textarea } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import MarkdownViewer from '../components/Organisms/MarkdownViwer';
import { useAppDispatch, useFileListSelector, useFilesSelector } from '../reducks/hooks';
import { fetchFileById } from '../reducks/slice/fileListSlice';
import { updateFile } from '../reducks/slice/fileListSlice';
import convertMarkdownToHTML from '../libs/sanitizer';
import ViwerWrapper from './Layout/ViwerWrapper';

const getTitleAndLead = (value: string) => {
	const getTag = (txt: string) => {
		const tag = txt.split(/\>|\s/)[0].substring(1);
		return tag;
	};

	const removeTag = (txt: string) => {
		return txt.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
	};

	const isHeading = (text: string) => {
		const tag = getTag(text);
		return /^h[0-9]+$/.test(tag);
	};

	const split = (text: string) => {
		const split = text.split(/\n/);
		const first = split.shift() ?? '';
		const second = split.join('\n') ?? '';
		return { first, second };
	};

	const marked = convertMarkdownToHTML(value.trim()).__html;
	const { first, second } = split(marked);
	const hasHeading = isHeading(first);

	let title = '';
	let lead = '';
	if (hasHeading) {
		title = removeTag(first);
		lead = removeTag(second);
	} else {
		lead = `${removeTag(first)}\n${removeTag(second)}`;
	}
	return { title, lead };
};

const Editor = () => {
	const dispatch = useAppDispatch();
	const { files } = useFilesSelector();
	const [value, setValue] = useState('');
	useBeforeunload((event) => {
		// if (value !== '') {
		// console.log('unload');
		// event.preventDefault();
		// }
	});

	/** urlから取得したファイルid */
	const id = (() => {
		const idByUrl = location.pathname.match(/(?<=file\/).+(?=\/editor)/)?.[0] ?? '';
		if (idByUrl === '') return '';
		return idByUrl;
	})();

	/** urlのidと同じファイルをstateから取得する */
	const getFileById = useCallback(() => {
		const target = files.list.find((file) => file.id === id);
		return target;
	}, [id]);

	// ファイルのvalueをテキストエリアに反映
	useEffect(() => {
		if (id === '') return;
		(async () => {
			const data = (async () => {
				const _data = getFileById(); // stateから取得
				return _data ? _data : await dispatch(fetchFileById({ id })).unwrap();
			})();
			const target = await data;
			if (!target) return;
			setValue(target.value);
		})();
	}, [id]);

	// unload時に自動保存
	// useEffect(() => {
	// 	return () => {
	// 		console.log('unload');
	// 		const updated_at = new Date().toISOString();
	// 		// updateFile(id, value, updated_at);
	// 		dispatch(updateFile({ id, value, updated_at }));
	// 	};
	// }, [value]);

	/** 保存ボタン押下時の挙動 */
	const handleSave = () => {
		const { title, lead } = getTitleAndLead(value);
		const updated_at = new Date().toISOString();
		dispatch(updateFile({ id, value, updated_at, title, lead }));
	};

	const handlePressSaveKey = (e: KeyboardEvent) => {
		console.log(e.metaKey);
		if (e.metaKey && e.key === 'KeyS') {
			e.preventDefault();
			console.log('is done!');
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handlePressSaveKey);
		() => window.removeEventListener('keydown', handlePressSaveKey);
	}, []);

	return (
		<ViwerWrapper>
			<Box>
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
						variant="filled"
					/>
					<MarkdownViewer markdownText={value} />
				</Grid>
			</Box>
		</ViwerWrapper>
	);
};

export default Editor;
