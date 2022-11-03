import { Box, BoxProps, Spinner, Stack } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { IconType } from 'react-icons';
import Cassette from '../../components/Cassette/Cassette';
import NoCassettes from '../../components/Cassette/NoCassettes';
import { useIsLoadingSelector } from '../../reducks/hooks';
import { FileListType, FileType } from '../../reducks/slice/fileListSlice';

type Props = {
	page: FileListType;
	list: {
		list: FileType[];
		isFetched: boolean;
	};
	icons: {
		icon: IconType;
		onClick: ({ file }: { file: FileType }) => void;
		ariaLabel: string;
	}[];
} & BoxProps;

const ListWrapper: React.FC<Props> = ({ page, list, icons, ...rest }) => {
	const { isLoading } = useIsLoadingSelector();
	const Empty = useMemo(() => <NoCassettes page={page} />, []);

	return (
		<Box position="relative" mt="5" pb="8" flexGrow={'1'} overflow="auto" _before={{ content: '""', display: 'block' }} {...rest}>
			{isLoading ? (
				<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
			) : list.list.length ? (
				<Stack spacing="2" as="ol" height="100%" overflowY="auto" px="3" pt="1" pb="3">
					{list.list.map((file, i) => (
						<li key={`${file.id}_${i}`}>
							<Cassette file={file} icons={icons} />
						</li>
					))}
				</Stack>
			) : (
				<>{Empty}</>
			)}
		</Box>
	);
};

export default ListWrapper;
