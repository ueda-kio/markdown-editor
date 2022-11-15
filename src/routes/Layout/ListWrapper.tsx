import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IconType } from 'react-icons';
import { IoGridOutline } from 'react-icons/io5';
import { TfiViewList } from 'react-icons/tfi';
import { css } from '@emotion/react';
import { Box, BoxProps, Flex, Grid, Icon, IconButton, Stack, useColorModeValue } from '@chakra-ui/react';
import Cassette from '../../components/Cassette/Cassette';
import NoCassettes from '../../components/Cassette/NoCassettes';
import SearchInput from '../../components/Molecules/SearchInput';
import { useAppDispatch, useIsLoadingSelector, useListTypeSelector } from '../../reducks/selectors';
import { FileListType, FileType, setListType } from '../../reducks/slice/fileListSlice';
import SkeltonCassette from '../../components/Cassette/SkeltonCassette';

/** グラデーション装飾用スタイル */
const style = {
	gradient: css`
		&::before,
		&::after {
			content: '';
			position: absolute;
			left: 0;
			display: block;
			width: 100%;
			height: 12px;
			opacity: 1;
			transition: opacity 0.15s;
		}
		&::before {
			top: 0;
			background: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 1) 100%);
			z-index: 10;
		}
		&::after {
			bottom: 0;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 1) 100%);
		}
	`,
	'gradient-dark': css`
		&::before,
		&::after {
			content: '';
			position: absolute;
			left: 0;
			display: block;
			width: 100%;
			height: 12px;
			opacity: 1;
			transition: opacity 0.15s;
		}
		&::before {
			top: 0;
			background: linear-gradient(0deg, rgba(26, 32, 44, 0) 0%, rgba(26, 32, 44, 0.9) 50%, rgba(26, 32, 44, 1) 100%);
			z-index: 10;
		}
		&::after {
			bottom: 0;
			background: linear-gradient(180deg, rgba(26, 32, 44, 0) 0%, rgba(26, 32, 44, 0.9) 50%, rgba(26, 32, 44, 1) 100%);
		}
	`,
	isTop: css`
		&::before {
			opacity: 0;
		}
	`,
	isBottom: css`
		&::after {
			opacity: 0;
		}
	`,
};

type Props = {
	page: FileListType;
	list: FileType[];
	menus: {
		icon: IconType;
		onClick: ({ file }: { file: FileType }) => void;
		text: string;
	}[];
} & BoxProps;

const ListTypeWrapper = ({ children }: { children: React.ReactNode }) => {
	const { listType } = useListTypeSelector();

	if (listType === 'panel') {
		return (
			<Grid
				as="ol"
				templateColumns={'1fr 1fr'}
				rowGap={{ base: '2', md: '6' }}
				columnGap={{ base: '2', md: '4' }}
				alignContent="start"
				height="100%"
				mx="-1"
				p="1"
				overflowY="auto"
			>
				{children}
			</Grid>
		);
	} else {
		return (
			<Stack spacing="2" as="ol" mx="-1" p="1" height="100%" overflowY="auto">
				{children}
			</Stack>
		);
	}
};

const ListWrapper: React.FC<Props> = ({ page, list, menus, ...rest }) => {
	const dispatch = useAppDispatch();
	const { isLoading } = useIsLoadingSelector();
	const { listType } = useListTypeSelector();
	const [isTop, setIsTop] = useState(true);
	const [isBottom, setIsBottom] = useState(false);

	const wrapperRef = useRef<HTMLDivElement>(null);
	const topTargetRef = useRef<HTMLDivElement>(null);
	const bottomTargetRef = useRef<HTMLDivElement>(null);

	// グラデーションON/OFFのためのIntersection Observer
	useEffect(() => {
		const wrapper = wrapperRef.current;
		const topTarget = topTargetRef.current;
		const bottomTarget = bottomTargetRef.current;
		if (!wrapper || !topTarget || !bottomTarget) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (typeof entry === 'undefined') return;

				if (entry.target === topTarget) {
					entry.isIntersecting ? setIsTop(true) : setIsTop(false);
				} else if (entry.target === bottomTarget) {
					entry.isIntersecting ? setIsBottom(true) : setIsBottom(false);
				}
			},
			{
				root: wrapper,
				rootMargin: '0px',
				threshold: 0.99, //TODO PCサイズでのみ1がnot working
			}
		);

		observer.observe(topTarget);
		observer.observe(bottomTarget);

		return () => {
			observer.disconnect();
		};
	}, [isLoading, listType]);

	const gradient = useColorModeValue(style.gradient, style['gradient-dark']);

	const Empty = useMemo(() => <NoCassettes page={page} />, [page]);

	/** リストタイプ変更処理 */
	const handleChangeListType = useCallback(() => {
		listType === 'list' ? dispatch(setListType('panel')) : dispatch(setListType('list'));
	}, [listType]);

	// 選択されたリストタイプをlocalStorageに格納
	useEffect(() => {
		try {
			window.localStorage.setItem('list-type', listType);
		} catch (e) {
			console.error(e);
		}
	}, [listType]);

	return (
		<Box position="relative" mt="5" mx="-1" px="1" pb="8" flexGrow={'1'} overflow="auto" {...rest}>
			<Flex direction={'column'} gap="3" h="100%">
				<Flex alignItems={'center'} gap={{ base: '2', md: '4' }}>
					<SearchInput></SearchInput>
					<IconButton
						icon={
							listType === 'list' ? (
								<Icon w="5" h="5" color={useColorModeValue('gray.700', 'gray.200')} as={IoGridOutline} />
							) : (
								<Icon w="4" h="4" color={useColorModeValue('gray.700', 'gray.200')} as={TfiViewList} />
							)
						}
						variant="outline"
						aria-label="change list type"
						rounded={'full'}
						onClick={handleChangeListType}
					/>
				</Flex>
				{isLoading ? (
					<Box flexGrow="1" pos="relative" overflow={'hidden'}>
						<ListTypeWrapper>
							{list.length ? list.map((_, i) => <SkeltonCassette key={String(i)} />) : <SkeltonCassette />}
						</ListTypeWrapper>
					</Box>
				) : list.length ? (
					<Box
						ref={wrapperRef}
						flexGrow="1"
						pos="relative"
						mx="-1"
						px="1"
						overflow={'hidden'}
						{...(isTop ? { css: [gradient, style.isTop] } : isBottom ? { css: [gradient, style.isBottom] } : { css: gradient })}
					>
						<ListTypeWrapper>
							{list.map((file, i) => (
								<li key={`${file.id}_${i}`} css={{ height: 'fit-content' }}>
									<Cassette
										{...(i === 0
											? { _ref: topTargetRef }
											: i === list.length - 1
											? { _ref: bottomTargetRef }
											: undefined)}
										file={file}
										menus={menus}
									/>
								</li>
							))}
						</ListTypeWrapper>
					</Box>
				) : (
					<>{Empty}</>
				)}
			</Flex>
		</Box>
	);
};

export default ListWrapper;
