import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IconType } from 'react-icons';
import { css } from '@emotion/react';
import { Box, BoxProps, Flex, Spinner, Stack } from '@chakra-ui/react';
import Cassette from '../../components/Cassette/Cassette';
import NoCassettes from '../../components/Cassette/NoCassettes';
import SearchInput from '../../components/Molecules/SearchInput';
import { useIsLoadingSelector } from '../../reducks/hooks';
import { FileListType, FileType } from '../../reducks/slice/fileListSlice';

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
	list: {
		list: FileType[];
		isFetched: boolean;
	};
	menus: {
		icon: IconType;
		onClick: ({ file }: { file: FileType }) => void;
		text: string;
	}[];
} & BoxProps;

const ListWrapper: React.FC<Props> = ({ page, list, menus, ...rest }) => {
	const { isLoading } = useIsLoadingSelector();
	const [isTop, setIsTop] = useState(true);
	const [isBottom, setIsBottom] = useState(false);

	const wrapperRef = useRef<HTMLDivElement>(null);
	const topTargetRef = useRef<HTMLDivElement>(null);
	const bottomTargetRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const wrapper = wrapperRef.current;
		const topTarget = topTargetRef.current;
		const bottomTarget = bottomTargetRef.current;
		if (!wrapper || !topTarget || !bottomTarget) return;

		const observerForTop = new IntersectionObserver(
			([entry], observer) => {
				if (entry) {
					entry.isIntersecting ? setIsTop(true) : setIsTop(false);
				}
			},
			{
				root: wrapper,
				threshold: 1,
			}
		);

		const observerForBottom = new IntersectionObserver(
			([entry], observer) => {
				if (entry.isIntersecting) {
					console.log('entry', entry.target);
					console.log('root', observer.root);
				}

				if (entry) {
					entry.isIntersecting ? setIsBottom(true) : setIsBottom(false);
				}
			},
			{
				root: wrapper,
				threshold: 0.99,
			}
		);

		observerForTop.observe(topTarget);
		observerForBottom.observe(bottomTarget);

		return () => {
			observerForTop.disconnect();
			observerForBottom.disconnect();
		};
	}, [isLoading]);

	const Empty = useMemo(() => <NoCassettes page={page} />, []);

	return (
		<Box position="relative" mt="5" pb="8" flexGrow={'1'} overflow="auto" {...rest}>
			{isLoading ? (
				<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
			) : (
				<Flex direction={'column'} gap="3" h="100%">
					<SearchInput></SearchInput>
					{list.list.length ? (
						<Box
							ref={wrapperRef}
							flexGrow="1"
							pos="relative"
							overflow={'hidden'}
							{...(isTop
								? { css: [style.gradient, style.isTop] }
								: isBottom
								? { css: [style.gradient, style.isBottom] }
								: { css: style.gradient })}
						>
							<Stack spacing="2" as="ol" height="100%" overflowY="auto">
								{list.list.map((file, i) => (
									<li key={`${file.id}_${i}`}>
										<Cassette
											{...(i === 0
												? { _ref: topTargetRef }
												: i === list.list.length - 1
												? { _ref: bottomTargetRef }
												: undefined)}
											file={file}
											menus={menus}
										/>
									</li>
								))}
							</Stack>
						</Box>
					) : (
						<>{Empty}</>
					)}
				</Flex>
			)}
		</Box>
	);
};

export default ListWrapper;
