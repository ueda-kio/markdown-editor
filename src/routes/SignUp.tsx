import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { auth, db } from '../firebase';
import { nanoid } from '@reduxjs/toolkit';
import { useAppDispatch } from '../reducks/hooks';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../reducks/slice/userSlice';

const usersRef = db.collection('users');

const SignUp = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
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

	const handleClick = async () => {
		const id = nanoid();
		// const doc = usersRef.doc();
		// const id = doc.id;
		await usersRef.doc(id).set({ uid: id });
		const fileDoc = usersRef.doc(id).collection('files').doc();
		const fileId = fileDoc.id;
		await usersRef.doc(id).collection('files').doc(fileId).set({ id: fileId, title: 'test title' });
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
				<Button type="submit" size="md" w="100%" mt="5">
					submit
				</Button>
				<Button type="button" size="md" w="100%" mt="5" onClick={handleClick}>
					console
				</Button>
			</Box>
		</Box>
	);
};

export default SignUp;
