import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Flex, Grid, Icon, IconButton, Textarea, useToast, useDisclosure, Portal, Fade, Text, Kbd } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { AiOutlineCloudSync } from 'react-icons/ai';
import { useBeforeunload } from 'react-beforeunload';
import MarkdownViewer from '../components/Organisms/MarkdownViwer';
import { useAppDispatch, useFileListSelector } from '../reducks/selectors';
import { fetchFileById } from '../reducks/slice/fileListSlice';
import { updateFile } from '../reducks/slice/fileListSlice';
import convertMarkdownToHTML from '../libs/sanitizer';

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

const Editor: React.FC = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { files } = useFileListSelector();
	const [value, setValue] = useState('');
	const [savedValue, setSavedValue] = useState('');
	const [isChanged, setIsChanged] = useState(false);
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	useBeforeunload((e) => {
		// if (value !== '') {
		if (isChanged) {
			console.log('unload');
			e.preventDefault();
		}
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
				if (_data) return _data;
				const res = await dispatch(fetchFileById({ id })).unwrap();
				return res && res.data;
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
		dispatch(updateFile({ id, value, updated_at, title, lead }));
		setSavedValue(value);
		setIsChanged(false);
		toast({
			title: 'save complete!',
			duration: 3000,
			isClosable: true,
			icon: <Icon as={AiOutlineCloudSync} w="7" h="7" />,
		});
		// TODO エラーハンドリングしたい
		// if (res) {
		// 	setSavedValue(value);
		// 	setIsChanged(false);
		// 	toast({
		// 		title: 'save complete!',
		// 		duration: 3000,
		// 		isClosable: true,
		// 		icon: <Icon as={AiOutlineCloudSync} w="7" h="7" />,
		// 	});
		// } else {
		// 	toast({
		// 		title: 'save incomplete!',
		// 		duration: 3000,
		// 		status: 'error',
		// 		isClosable: true,
		// 	});
		// }
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
	}, [value]);

	// 変更が保存されていない場合ドロワー表示
	useEffect(() => {
		isChanged ? onOpen() : onClose();
	}, [isChanged]);

	return (
		<>
			<Flex direction="column" gap={'5'} maxWidth="1440px" h={'100vh'} m="0 auto" px="5" pt="2">
				<IconButton
					aria-label="open new editor"
					icon={<ChevronLeftIcon w={6} h={6} />}
					colorScheme="teal"
					rounded="full"
					w="12"
					h="12"
					flex="none"
					onClick={() => navigate(-1)}
				></IconButton>
				<Flex overflow={'hidden'} direction={'column'} alignItems="start" flexGrow="1" pb="20">
					<Grid
						overflow={'hidden'}
						gap={30}
						templateColumns={{ base: 'none', lg: 'repeat(2, 1fr)' }}
						templateRows={{ base: 'min-content 1fr', lg: '100%' }}
						flexGrow="1"
						w="100%"
					>
						<Textarea
							placeholder="Here is a sample placeholder"
							value={value}
							onChange={handleInputTextarea}
							resize={{ base: 'vertical', lg: 'none' }}
							size="lg"
							rounded="md"
							height={{ base: '42vh', lg: '100%' }}
							variant="filled"
							overflow={'auto'}
						/>
						<MarkdownViewer markdownText={value} overflow="auto" />
					</Grid>
				</Flex>
			</Flex>
			<Portal>
				<Fade in={isOpen}>
					<Box pos="fixed" bottom="0" w="100%" boxShadow={'top'}>
						<Flex maxWidth={'1440px'} justify="space-between" align={'center'} mx="auto" px="5" py="3">
							<Text fontSize={'sm'}>You have not saved your changes...</Text>
							<Flex align="end" gap="2">
								<Text>
									<Kbd>command</Kbd>+<Kbd>s</Kbd>
								</Text>
								<Button justifySelf={'end'} colorScheme="teal" onClick={save}>
									SAVE
								</Button>
							</Flex>
						</Flex>
					</Box>
				</Fade>
			</Portal>
		</>
	);
};

export default Editor;
