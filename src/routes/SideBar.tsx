import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate, useOutlet, useParams } from 'react-router-dom';
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
	Heading,
	useColorMode,
} from '@chakra-ui/react';
import { ExternalLinkIcon, HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';
import { AiOutlineHome, AiOutlineGithub, AiOutlineSetting } from 'react-icons/ai';
import { BiArchiveIn } from 'react-icons/bi';
import { FaSignOutAlt } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Link } from '../components/Atoms/Link';
import Confirm from '../components/Organisms/Modal/Confirm';
import { useAppDispatch } from '../reducks/selectors';
import { signOut } from '../reducks/slice/userSlice';
import IconLink from '../components/Atoms/IconLink';

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
	const isExternalLink = path.startsWith('https');

	const tag = useMemo(() => {
		if (name === 'SignOut') return 'button';
		if (isExternalLink) return 'a';
		return 'Link';
	}, [name]);

	return (
		<IconLink
			tag={tag}
			to={path}
			icon={icon}
			onClick={onClick}
			isActive={isCurrentPage}
			target={isExternalLink ? '_blank' : undefined}
			w={'100%'}
		>
			{children}
		</IconLink>
	);
};

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
					<Heading
						as="h1"
						fontSize="2xl"
						fontFamily="var(SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace)"
						fontWeight="bold"
					>
						Editor App.
					</Heading>
					<CloseButton display={{ base: 'flex', xl: 'none' }} rounded="full" onClick={onClose} />
				</Flex>
				<Stack spacing="2" as="ul" px="4">
					{LinkItems.map((link) => (
						<li key={link.name}>
							{link.name === 'Github' ? (
								<NavItem name={link.name} icon={link.icon} path={link.path}>
									{link.name}
									<ExternalLinkIcon position="absolute" top="50%" right="4" mx="2px" transform="translateY(-50%)" />
								</NavItem>
							) : (
								<NavItem name={link.name} icon={link.icon} path={link.path}>
									{link.name}
								</NavItem>
							)}
						</li>
					))}
				</Stack>
				<Box pos="absolute" bottom="4" w="100%" px="4" onClick={onOpen}>
					<NavItem name="SignOut" icon={FaSignOutAlt} path="">
						Sign out
					</NavItem>
				</Box>
			</Box>
			<Confirm
				isOpen={isOpen}
				onClose={onCloseModal}
				onConfirm={handleClickSignOut}
				blockScrollOnMount={false}
				title="Confirm Sign out"
			>
				<Text textAlign={'start'}>Are you sure to sign out?</Text>
			</Confirm>
		</>
	);
};

type HeaderProps = {
	onOpen: () => void;
	title: string;
} & FlexProps;
const Header: React.FC<HeaderProps> = ({ onOpen, title, ...rest }) => {
	const { colorMode, toggleColorMode } = useColorMode();

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
			<Heading w="full">{title}</Heading>
			{title !== 'Setting' && (
				<IconButton
					variant="outline"
					rounded="full"
					justifySelf={'end'}
					onClick={toggleColorMode}
					aria-label="toggle color mode"
					icon={colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
				/>
			)}
		</Flex>
	);
};

const Sidebar = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { pathname } = useLocation();
	const [headerTitle, setHeaderTitle] = useState('');

	// ページ変更時にドロワーを閉じる
	useEffect(() => onClose(), [pathname]);
	useEffect(() => {
		switch (pathname) {
			case '/trash':
				setHeaderTitle('Trash');
				break;
			case '/archive':
				setHeaderTitle('Archive');
				break;
			case '/setting':
				setHeaderTitle('Setting');
				break;
			default:
				setHeaderTitle('Files');
		}
	}, [pathname]);

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
			<Box
				// height="100%"
				maxWidth="max"
				mx="auto"
				position={'relative'}
				height="100vh"
				display={'flex'}
				flexDirection="column"
				pt={{ base: '5', lg: '8' }}
				px="5"
			>
				<Header onOpen={onOpen} title={headerTitle} />
				<Outlet />
			</Box>
		</Box>
	);
};

export default Sidebar;
