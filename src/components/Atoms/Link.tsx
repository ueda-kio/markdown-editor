import React from 'react';
import { Link as ChakraLink, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export type LinkProps = React.ComponentProps<typeof ChakraLink> &
	React.ComponentProps<typeof RouterLink> &
	React.ComponentProps<typeof Button>;

export const Link = ({ children, ...props }: LinkProps) => {
	return (
		<ChakraLink
			as={RouterLink}
			_hover={{
				textDecoration: 'none',
			}}
			{...props}
		>
			{children}
		</ChakraLink>
	);
};
