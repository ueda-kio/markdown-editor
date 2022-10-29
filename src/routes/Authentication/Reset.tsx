import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { auth, db } from '../../firebase';
import { nanoid } from '@reduxjs/toolkit';
import { useAppDispatch, useUser } from '../../reducks/hooks';
import { useNavigate } from 'react-router-dom';
import { resetPassword, signUp } from '../../reducks/slice/userSlice';
import { Link } from '../../components/Atoms/Link';

const Reset = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { user } = useUser();
	const [email, setEmail] = useState('');

	const onSubmit: React.FormEventHandler = async (e) => {
		e.preventDefault();
		try {
			await dispatch(resetPassword({ email }));
			alert('An email to reset your password has been sent to the email address you entered.');
			navigate('/signin');
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<Box w="100vw" h="100vh" pos="relative">
			<Box
				as="form"
				pos="absolute"
				top="50%"
				left="50%"
				transform="translate(-50%, -50%)"
				p="10"
				rounded="md"
				boxShadow="base"
				onSubmit={onSubmit}
			>
				<Text as="h1" fontSize="2xl" fontWeight="bold">
					Reset
				</Text>
				<FormControl>
					<FormLabel>Email</FormLabel>
					<Input
						type="email"
						variant="filled"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete={'email'}
						isRequired
					/>
				</FormControl>
				<Button type="submit" size="md" w="100%" mt="5" {...(user.isLoading && { isLoading: true })}>
					submit
				</Button>
				<Box display={'flex'} justifyContent="center" mt="4">
					<Link to="/signin" fontSize={'14'} rounded="4" _hover={{ bg: 'teal.100' }}>
						to signin page
					</Link>
				</Box>
			</Box>
		</Box>
	);
};

export default Reset;
