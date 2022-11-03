import React from 'react';
import { IconButton, Text, Popover as ChakraPopover, PopoverTrigger, PopoverContent, VStack, Portal } from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IconType } from 'react-icons';
import { FileType } from '../../reducks/slice/fileListSlice';
import IconLink from '../Atoms/IconLink';

type Props = {
	menuArray: {
		icon: IconType;
		onClick: ({ file }: { file: FileType }) => void;
		text: string;
	}[];
	file: FileType;
};
const Popover: React.FC<Props> = ({ menuArray, file }) => {
	return (
		<ChakraPopover>
			<PopoverTrigger>
				<IconButton
					position="absolute"
					top="50%"
					right="1rem"
					transform="translateY(-50%)"
					aria-label="open menu"
					rounded={'full'}
					bg="none"
					icon={<BsThreeDotsVertical />}
				>
					Trigger
				</IconButton>
			</PopoverTrigger>
			<Portal>
				<PopoverContent cursor="default" border="1px" borderColor={'gray.300'} overflow="hidden" w="auto" minWidth="5xs">
					<VStack spacing="1" p="1">
						{menuArray.map((menu) => (
							<IconLink
								key={menu.text}
								to=""
								type="button"
								tag="button"
								icon={menu.icon}
								onClick={() => menu.onClick({ file })}
								p="3"
								pr="4"
								w="100%"
							>
								<Text fontWeight={'bold'} fontSize={'sm'}>
									{menu.text}
								</Text>
							</IconLink>
						))}
					</VStack>
				</PopoverContent>
			</Portal>
		</ChakraPopover>
	);
};

export default Popover;
