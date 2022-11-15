import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { FaEdit, FaCopy, FaTrash, FaArchive } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { useAppDispatch, useFileListSelector, useIsLoadingSelector, useUser } from '../../reducks/selectors';
import {
	copyFile,
	createNewFile,
	createNewSampleFile,
	fetchFileList,
	FileType,
	putFileInArchive,
	putFileInTrash,
	sortFiles,
} from '../../reducks/slice/fileListSlice';
import ListWrapper from '../Layout/ListWrapper';
import IconButton from '../../components/Atoms/IconButton';

const Home = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { files } = useFileListSelector();
	const { isLoading } = useIsLoadingSelector();
	const { user } = useUser();
	const menus = [
		{
			icon: FaEdit,
			onClick: ({ file: { id } }: { file: FileType }) => {
				navigate(`/file/${id}/editor/`);
			},
			text: 'Edit',
		},
		{
			icon: FaCopy,
			onClick: async ({ file }: { file: FileType }) => {
				await dispatch(copyFile(file));
			},
			text: 'Copy',
		},
		{
			icon: FaArchive,
			onClick: async ({ file: { id } }: { file: FileType }) => {
				await dispatch(putFileInArchive({ id }));
			},
			text: 'Archive',
		},
		{
			icon: FaTrash,
			onClick: async ({ file }: { file: FileType }) => {
				const { id } = file;
				await dispatch(putFileInTrash({ id }));
				dispatch(sortFiles({ listType: 'trashes', orderBy: 'desc' }));
			},
			text: 'Delete',
		},
	];

	// 既存登録者ならファイルをfetch
	useEffect(() => {
		if (!user.isNewRegistrant && !files.isFetched) dispatch(fetchFileList());
	}, [files.isFetched]);

	// 新規登録者ならサンプルメモを作成する
	useEffect(() => {
		if (user.isNewRegistrant) {
			dispatch(createNewSampleFile());
		}
	}, []);

	/**
	 * 新規作成ボタン押下挙動
	 */
	const handleClick = async () => {
		try {
			const originalPromiseResult = await dispatch(createNewFile()).unwrap();
			if (!originalPromiseResult) return;
			const { id } = originalPromiseResult;
			navigate(`/file/${id}/editor`);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<>
			<ListWrapper page="files" list={files.list} menus={menus} />
			<IconButton
				ariaLabel="open new editor"
				icon={PlusSquareIcon as IconType}
				position="absolute"
				bottom="4"
				right="4"
				boxShadow="lg"
				onClick={handleClick}
				isLoading={isLoading}
			></IconButton>
		</>
	);
};

export default Home;
