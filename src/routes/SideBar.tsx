import React, { ReactNode, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
	chakra,
	IconButton,
	Box,
	CloseButton,
	Flex,
	Icon,
	useColorModeValue,
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
	Stack,
} from '@chakra-ui/react';
import { ExternalLinkIcon, HamburgerIcon, SearchIcon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';
import { AiOutlineHome, AiOutlineGithub, AiOutlineSetting } from 'react-icons/ai';
import { BiArchiveIn } from 'react-icons/bi';
import { FaSignOutAlt } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Link } from '../components/Atoms/Link';
import Confirm from '../components/Organisms/Modal/Confirm';
import { useAppDispatch } from '../reducks/hooks';
import { signOut } from '../reducks/slice/userSlice';

type LinkItemProps = {
	name: string;
	path: string;
	icon: IconType;
};
const LinkItems: LinkItemProps[] = [
	{ name: 'Home', path: '/', icon: AiOutlineHome },
	{ name: 'Trash', path: '/trash', icon: RiDeleteBin6Line },
	{ name: 'Archive', path: '/archive', icon: BiArchiveIn },
	{ name: 'Settings', path: '/setting', icon: AiOutlineSetting },
	{ name: 'Github', path: 'https://github.com/ueda-kio/markdown-editor', icon: AiOutlineGithub },
];

type SidebarProps = {
	onClose: () => void;
} & BoxProps;
const SidebarContent: React.FC<SidebarProps> = ({ onClose, ...rest }) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose: onCloseModal } = useDisclosure();

	/** サインアウト押下時処理 */
	const handleClickSignOut = async () => {
		await dispatch(signOut());
		navigate('/signin');
	};

	return (
		<>
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
				<Stack spacing="2" as="ul" px="4">
					{LinkItems.map((link) => (
						<li key={link.name}>
							<NavItem name={link.name} icon={link.icon} path={link.path}>
								{link.name}
							</NavItem>
						</li>
					))}
				</Stack>
				<Box pos="absolute" bottom="4" w="100%" px="4" onClick={onOpen}>
					<NavItem name="SignOut" icon={FaSignOutAlt} path="">
						SignOut
					</NavItem>
				</Box>
			</Box>
			<Confirm isOpen={isOpen} onClose={onCloseModal} onConfirm={handleClickSignOut} blockScrollOnMount={false}>
				<Text fontWeight="bold" textAlign={'center'}>
					Would you like to signOut?
				</Text>
			</Confirm>
		</>
	);
};

type NavItemProps = {
	name: string;
	icon: IconType;
	path: string;
	onClick?: () => void;
	children: ReactNode;
} & FlexProps;
const NavItem: React.FC<NavItemProps> = ({ name, icon, path, onClick, children, ...rest }) => {
	const { pathname } = useLocation();
	const isCurrentPage = useMemo(() => pathname === path, [pathname]);

	return (
		<>
			{name === 'SignOut' ? (
				<chakra.button pos="relative" display="block" w="100%" {...(isCurrentPage && { 'aria-current': 'page' })} onClick={onClick}>
					<Box
						bg={isCurrentPage ? 'teal.100' : undefined}
						textDecoration={'none'}
						_focus={{ boxShadow: 'none' }}
						_hover={{
							bg: 'teal',
							color: 'white',
						}}
						borderRadius="lg"
						transition={'background 0.15s, color 0.15s'}
					>
						<Flex position="relative" align="center" p="4" role="group" cursor="pointer" {...rest}>
							<Icon
								mr="4"
								fontSize="16"
								_groupHover={{
									color: 'white',
								}}
								as={icon}
							/>
							{children}
						</Flex>
					</Box>
				</chakra.button>
			) : !path.startsWith('https') ? (
				<Link to={path} pos="relative" display="block" {...(isCurrentPage && { 'aria-current': 'page' })}>
					<Box
						bg={isCurrentPage ? 'teal.100' : undefined}
						textDecoration={'none'}
						_focus={{ boxShadow: 'none' }}
						_hover={{
							bg: 'teal',
							color: 'white',
						}}
						color={isCurrentPage ? 'black' : undefined}
						borderRadius="lg"
						transition={'background 0.15s, color 0.15s'}
					>
						<Flex position="relative" align="center" p="4" role="group" cursor="pointer" {...rest}>
							<Icon
								mr="4"
								fontSize="16"
								_groupHover={{
									color: 'white',
								}}
								as={icon}
							/>
							{children}
						</Flex>
					</Box>
				</Link>
			) : (
				<chakra.a href={path} pos="relative" display="block" target="_blank" rel="noreferrer">
					<Box
						bg={isCurrentPage ? 'teal.100' : undefined}
						textDecoration={'none'}
						_focus={{ boxShadow: 'none' }}
						_hover={{
							bg: 'teal',
							color: 'white',
						}}
						color={isCurrentPage ? 'black' : undefined}
						borderRadius="lg"
						transition={'background 0.15s, color 0.15s'}
					>
						<Flex position="relative" align="center" p="4" role="group" cursor="pointer" {...rest}>
							<Icon
								mr="4"
								fontSize="16"
								_groupHover={{
									color: 'white',
								}}
								as={icon}
							/>
							{children}
						</Flex>
						<ExternalLinkIcon position="absolute" top="50%" right="4" mx="2px" transform="translateY(-50%)" />
					</Box>
				</chakra.a>
			)}
		</>
	);
};

type HeaderProps = {
	onOpen: () => void;
} & FlexProps;
const Header: React.FC<HeaderProps> = ({ onOpen, ...rest }) => {
	return (
		<Flex w="full" alignItems="center" justifyContent="flex-start" gap="3" {...rest}>
			<IconButton
				variant="outline"
				rounded="full"
				onClick={onOpen}
				display={{ base: 'block', xl: 'none' }}
				aria-label="open menu"
				icon={<HamburgerIcon />}
			/>
			<Box w="full">Files</Box>
		</Flex>
	);
};

const Sidebar = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { pathname } = useLocation();

	// ページ変更時にドロワーを閉じる
	useEffect(() => onClose(), [pathname]);

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
			<Box height="100%" maxWidth="max" mx="auto">
				<Box height="100vh" display={'flex'} flexDirection="column" pt={{ base: '4', lg: '8' }} px="3">
					<Header onOpen={onOpen} />
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
};

export default Sidebar;
