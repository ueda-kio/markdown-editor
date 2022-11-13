import React from 'react';
import { chakra, Box, Flex, Icon, ChakraComponent } from '@chakra-ui/react';
import { Link, LinkProps } from './Link';
import { IconType } from 'react-icons/lib';

type TagType = 'a' | 'Link' | 'button';

type LinkWrapperType = { tag: TagType; children: React.ReactNode } & LinkProps;
const LinkWrapper: React.FC<LinkWrapperType> = ({ tag, to = '', type = 'button', children, ...rest }) => {
	switch (tag) {
		case 'a':
			return (
				<chakra.a
					href={to ? `${to}` : ''}
					_focusVisible={{ boxShadow: 'var(--chakra-shadows-outline)', outline: 'none' }}
					{...rest}
				>
					{children}
				</chakra.a>
			);
		case 'button':
			return (
				<chakra.button type={type} _focusVisible={{ boxShadow: 'var(--chakra-shadows-outline)', outline: 'none' }} {...rest}>
					{children}
				</chakra.button>
			);
		default:
			return (
				<Link to={to} {...rest}>
					{children}
				</Link>
			);
	}
};

type Props = {
	tag: TagType;
	type?: 'button' | 'reset' | 'submit';
	icon: IconType;
	isActive?: boolean;
	children: React.ReactNode;
} & LinkProps;

const IconLink: React.FC<Props> = ({ tag, type, icon, isActive, children, to = '', ...rest }) => {
	return (
		<LinkWrapper
			tag={tag}
			type={type}
			pos="relative"
			display="flex"
			alignItems={'center'}
			p="4"
			cursor="pointer"
			bg={isActive ? 'teal.100' : undefined}
			textDecoration={'none'}
			color={isActive ? 'black' : undefined}
			borderRadius="lg"
			_hover={{
				bg: 'teal',
				color: 'white',
			}}
			transitionProperty="var(--chakra-transition-property-common)"
			transitionDuration="var(--chakra-transition-duration-normal)"
			{...(isActive && { 'aria-current': 'page' })}
			to={to}
			{...rest}
		>
			<Icon mr="4" fontSize="16" as={icon} />
			{children}
		</LinkWrapper>
	);
};

export default IconLink;
