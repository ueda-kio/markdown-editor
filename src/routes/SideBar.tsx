import React, { ReactNode } from 'react';
import {
	IconButton,
	Box,
	CloseButton,
	Flex,
	Icon,
	useColorModeValue,
	Link,
	Drawer,
	DrawerContent,
	Text,
	useDisclosure,
	BoxProps,
	FlexProps,
	InputGroup,
	InputLeftElement,
	Input,
	DrawerOverlay,
} from '@chakra-ui/react';
import { CopyIcon, HamburgerIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import { AiOutlineHome, AiOutlineGithub, AiOutlineSetting } from 'react-icons/ai';
import { BiArchiveIn } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { ReactText } from 'react';
import { Outlet } from 'react-router-dom';

interface LinkItemProps {
	name: string;
	icon: any;
}
const LinkItems: Array<LinkItemProps> = [
	{ name: 'Home', icon: AiOutlineHome },
	{ name: 'Trash', icon: RiDeleteBin6Line },
	{ name: 'Archive', icon: BiArchiveIn },
	{ name: 'Github', icon: AiOutlineGithub },
	{ name: 'Settings', icon: AiOutlineSetting },
];

interface SidebarProps extends BoxProps {
	onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
	return (
		<Box
			bg={useColorModeValue('white', 'gray.900')}
			borderRight="1px"
			borderRightColor={useColorModeValue('gray.200', 'gray.700')}
			w={{ base: 'full', xl: 60 }}
			pos="fixed"
			h="full"
			{...rest}
		>
			<Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
				<Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
					Memo App.
				</Text>
				<CloseButton display={{ base: 'flex', xl: 'none' }} onClick={onClose} />
			</Flex>
			{LinkItems.map((link) => (
				<NavItem key={link.name} icon={link.icon}>
					{link.name}
				</NavItem>
			))}
		</Box>
	);
};

interface NavItemProps extends FlexProps {
	icon: any;
	children: ReactText;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
	return (
		<Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
			<Flex
				align="center"
				p="4"
				mx="4"
				borderRadius="lg"
				role="group"
				cursor="pointer"
				_hover={{
					bg: 'cyan.400',
					color: 'white',
				}}
				{...rest}
			>
				{icon && (
					<Icon
						mr="4"
						fontSize="16"
						_groupHover={{
							color: 'white',
						}}
						as={icon}
					/>
				)}
				{children}
			</Flex>
		</Link>
	);
};

interface MobileProps extends FlexProps {
	onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
	return (
		<Flex w="full" alignItems="center" justifyContent="flex-start" {...rest}>
			<IconButton variant="outline" rounded="full" onClick={onOpen} aria-label="open menu" icon={<HamburgerIcon />} />
			<Box px="3" w="full">
				<InputGroup>
					<InputLeftElement
						top="50%"
						transform="translateY(-50%)"
						pointerEvents="none"
						children={<SearchIcon w={5} h={5} color="gray.400" />}
					/>
					<Input placeholder="search" size="lg" rounded="3xl" variant="filled" />
				</InputGroup>
			</Box>
		</Flex>
	);
};

const SimpleSidebar = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Box minH="100vh">
			<SidebarContent onClose={() => onClose} display={{ base: 'none', xl: 'block' }} />
			<Drawer
				autoFocus={false}
				isOpen={isOpen}
				placement="left"
				onClose={onClose}
				returnFocusOnClose={false}
				onOverlayClick={onClose}
			>
				<DrawerOverlay />
				<DrawerContent>
					<SidebarContent onClose={onClose} />
				</DrawerContent>
			</Drawer>
			<Box height="100%" maxWidth="800px" mx="auto" id="ContainerWrapper">
				<Box px="3" height="100vh">
					<MobileNav onOpen={onOpen} />
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
};

export default SimpleSidebar;
