import { Box, BoxProps, Flex, Spinner, Stack } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { IconType } from 'react-icons';
import Cassette from '../../components/Cassette/Cassette';
import NoCassettes from '../../components/Cassette/NoCassettes';
import SearchInput from '../../components/Molecules/SearchInput';
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
		text: string;
	}[];
} & BoxProps;

const ListWrapper: React.FC<Props> = ({ page, list, icons, ...rest }) => {
	const { isLoading } = useIsLoadingSelector();
	const Empty = useMemo(() => <NoCassettes page={page} />, []);

	return (
		<Box position="relative" mt="5" pb="8" flexGrow={'1'} overflow="auto" {...rest}>
			{isLoading ? (
				<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
			) : (
				<Flex direction={'column'} gap="3" h="100%">
					<SearchInput></SearchInput>
					{list.list.length ? (
						<Stack spacing="2" as="ol" flexGrow={'1'} height="100%" overflowY="auto">
							{list.list.map((file, i) => (
								<li key={`${file.id}_${i}`}>
									<Cassette file={file} icons={icons} />
								</li>
							))}
						</Stack>
					) : (
						<>{Empty}</>
					)}
				</Flex>
			)}
		</Box>
	);
};

export default ListWrapper;
