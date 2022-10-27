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
			<ModalContent>
				{title && <ModalHeader>{title}</ModalHeader>}
				<ModalCloseButton />
				<ModalBody {...(!title && { pt: '12' })}>{children}</ModalBody>

				<ModalFooter>
					<Button mr={3} onClick={onClose}>
						Cancel
					</Button>
					<Button bg="red.500" _hover={{ bg: 'red.700' }} color="white" variant="ghost" onClick={onConfirm}>
						SignOut
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default Confirm;
