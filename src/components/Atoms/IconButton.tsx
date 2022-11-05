import React from 'react';
import { ButtonProps, Icon as ChakraIcon, IconButton as ChakraIconButton, IconButtonProps } from '@chakra-ui/react';
import { IconType } from 'react-icons';

type Props = {
	onClick: () => void;
	icon: IconType;
	ariaLabel: string;
} & ButtonProps;

const Icon = React.memo(({ icon }: { icon: IconType }) => (
	<ChakraIcon as={icon} w={{ base: '5', md: '6' }} h={{ base: '5', md: '6' }}></ChakraIcon>
));
const IconButton: React.FC<Props> = ({ ariaLabel, icon, onClick, ...rest }) => {
	return (
		<ChakraIconButton
			aria-label={ariaLabel}
			onClick={onClick}
			icon={<Icon icon={icon} />}
			w={{ base: '12', md: '16' }}
			h={{ base: '12', md: '16' }}
			colorScheme="teal"
			rounded="full"
			{...rest}
		></ChakraIconButton>
	);
};

export default IconButton;
