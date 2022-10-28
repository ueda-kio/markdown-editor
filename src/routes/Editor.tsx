import React, { TextareaHTMLAttributes, useCallback, useEffect, useState } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { Box, Button, Grid, Icon, IconButton, Textarea, useToast } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import MarkdownViewer from '../components/Organisms/MarkdownViwer';
import { useAppDispatch, useFileListSelector, useFilesSelector } from '../reducks/hooks';
import { fetchFileById } from '../reducks/slice/fileListSlice';
import { updateFile } from '../reducks/slice/fileListSlice';
import convertMarkdownToHTML from '../libs/sanitizer';
import ViwerWrapper from './Layout/ViwerWrapper';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { AiOutlineCloudSync } from 'react-icons/ai';

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
	const navigate = useNavigate();
	const { files } = useFilesSelector();
	const [value, setValue] = useState('');
	const [savedValue, setSavedValue] = useState('');
	const [isChanged, setIsChanged] = useState(false);
	const toast = useToast();
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
			setSavedValue(target.value);
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

	/** 入力値の保存 */
	const save = async () => {
		const { title, lead } = getTitleAndLead(value);
		const updated_at = new Date().toISOString();
		const res = await dispatch(updateFile({ id, value, updated_at, title, lead })).unwrap();
		if (res) {
			setSavedValue(value);
			setIsChanged(false);
			toast({
				title: 'save complete!',
				duration: 3000,
				isClosable: true,
				icon: <Icon as={AiOutlineCloudSync} w="7" h="7" />,
			});
		} else {
			toast({
				title: 'save incomplete!',
				duration: 3000,
				status: 'error',
				isClosable: true,
			});
		}
	};

	/** ショートカットで保存 */
	const handlePressSaveKey = (e: KeyboardEvent) => {
		if (e.metaKey && e.key === 's') {
			e.preventDefault();
			save();
		}
	};

	/** テキスト入力時の処理 */
	const handleInputTextarea: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
		setValue(e.target.value);
		e.target.value === savedValue ? setIsChanged(false) : setIsChanged(true);
	};

	useEffect(() => {
		window.addEventListener('keydown', handlePressSaveKey);
		return () => window.removeEventListener('keydown', handlePressSaveKey);
	}, []);

	return (
		<Box maxWidth="1440px" m="0 auto" px="5" pt="2">
			<IconButton
				aria-label="open new editor"
				icon={<ChevronLeftIcon w={6} h={6} />}
				colorScheme="teal"
				rounded="full"
				w="12"
				h="12"
				onClick={() => navigate('/')}
			></IconButton>
			<Box>
				<Button onClick={save} {...(isChanged && { color: 'red' })}>
					SAVE
				</Button>
				<Grid gap={30} templateColumns={{ base: 'none', lg: 'repeat(2, 1fr)' }}>
					<Textarea
						placeholder="Here is a sample placeholder"
						value={value}
						onChange={handleInputTextarea}
						resize="none"
						size="lg"
						rounded="md"
						height="96"
						variant="filled"
					/>
					<MarkdownViewer markdownText={value} />
				</Grid>
			</Box>
		</Box>
	);
};

export default Editor;
