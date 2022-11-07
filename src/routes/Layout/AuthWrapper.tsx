import React from 'react';
import { Box, Button, FormControl, Input, InputProps, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { useUser } from '../../reducks/hooks';
import { Link } from '../../components/Atoms/Link';

type InputType = {
	value: string;
	placeholder: string;
} & InputProps;

type OtherLinks = {
	text: string;
	to: string;
};

type Props = {
	title: string;
	inputs: InputType[];
	otherLinks: OtherLinks[];
	submitButtonLabel: string;
	onSubmit: React.FormEventHandler;
	children?: React.ReactNode;
};
const AuthWrapper: React.FC<Props> = ({ title, inputs, otherLinks, submitButtonLabel, onSubmit, children }) => {
	const { user } = useUser();
	return (
		<Box w="100vw" h="100vh" pos="relative">
			<Box
				as="form"
				pos="absolute"
				top="50%"
				left="50%"
				width={{ base: '50vw', md: 'auto' }}
				minWidth={{ base: '300px', md: '450px' }}
				p={{ base: '8', md: '10' }}
				rounded="lg"
				border="1px"
				borderColor="gray.300"
				transform="translate(-50%, -50%)"
				onSubmit={onSubmit}
			>
				<Text as="h1" fontSize="2xl" fontWeight="bold" align={'center'}>
					{title}
				</Text>
				<Box mt="10">
					<VStack gap={'4'}>
						{inputs.map((input, i) => (
							<FormControl key={String(i)}>
								<Input
									type={input.type}
									variant="filled"
									size="lg"
									value={input.value}
									onChange={input.onChange}
									autoComplete={input.autoComplete || undefined}
									placeholder={input.placeholder}
									isRequired={input.isRequired}
								/>
							</FormControl>
						))}
					</VStack>
					<Button type="submit" size="md" w="100%" mt="5" colorScheme="teal" {...(user.isLoading && { isLoading: true })}>
						{submitButtonLabel}
					</Button>
					<VStack mt="4" gap="2">
						{otherLinks.map((otherLink) => (
							<Box key={otherLink.text} display={'flex'} justifyContent="center" mt="4">
								<Link
									to={otherLink.to}
									fontSize={'14'}
									rounded="4"
									transition={'color 0.15s'}
									_hover={{ color: useColorModeValue('teal', 'teal.300'), textDecoration: 'underline' }}
								>
									{otherLink.text}
								</Link>
							</Box>
						))}
					</VStack>
					{children}
				</Box>
			</Box>
		</Box>
	);
};

export default AuthWrapper;
