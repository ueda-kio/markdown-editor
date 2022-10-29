import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { auth, db } from '../../firebase';
import { nanoid } from '@reduxjs/toolkit';
import { useAppDispatch, useUser } from '../../reducks/hooks';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../reducks/slice/userSlice';
import { Link } from '../../components/Atoms/Link';

const usersRef = db.collection('users');

const SignUp = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { user } = useUser();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onSubmit: React.FormEventHandler = async (e) => {
		e.preventDefault();
		try {
			await dispatch(signUp({ email, password }));
			navigate('/');
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			console.log('user', user);
			console.log('currentUser', auth.currentUser);
		});
	}, []);

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
					SignUp
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
				<FormControl>
					<FormLabel>Password</FormLabel>
					<Input
						type="password"
						variant="filled"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete={'current-password'}
						isRequired
					/>
				</FormControl>
				<Button type="submit" size="md" w="100%" mt="5" {...(user.isLoading && { isLoading: true })}>
					submit
				</Button>
				<Box display={'flex'} justifyContent="center" mt="4">
					<Link to="/signin" fontSize={'14'} rounded="4" _hover={{ bg: 'teal.100' }}>
						Already a member?
					</Link>
				</Box>
			</Box>
		</Box>
	);
};

export default SignUp;
