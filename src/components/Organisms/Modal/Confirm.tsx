import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	ModalProps,
} from '@chakra-ui/react';
import React from 'react';

type Props = {
	title?: string;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	children: React.ReactNode;
} & ModalProps;
const Confirm: React.FC<Props> = ({ title, isOpen, onClose, onConfirm, children, ...rest }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} {...rest} isCentered>
			<ModalOverlay />
			<ModalContent maxWidth={{ base: 'sm', md: 'md' }} mx={{ base: '5', md: undefined }}>
				{title && <ModalHeader fontSize={{ base: '18px', md: '20px' }}>{title}</ModalHeader>}
				<ModalCloseButton />
				<ModalBody {...(!title && { pt: '12' })} fontWeight="medium" fontSize={{ base: '14px', md: '16px' }}>
					{children}
				</ModalBody>

				<ModalFooter>
					<Button mr={3} size={{ base: 'sm', md: 'md' }} onClick={onClose}>
						Cancel
					</Button>
					<Button
						bg="red.500"
						color="white"
						variant="ghost"
						size={{ base: 'sm', md: 'md' }}
						_hover={{ bg: 'red.700' }}
						onClick={onConfirm}
					>
						Sign out
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default Confirm;
