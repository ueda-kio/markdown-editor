import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { auth, googleProvider } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useUser } from '../../reducks/hooks';
import { listenAuthState, signIn } from '../../reducks/slice/userSlice';
import { Link } from '../../components/Atoms/Link';

const SignIn = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { user } = useUser();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onSubmit: React.FormEventHandler = async (e) => {
		e.preventDefault();
		try {
			await dispatch(signIn({ email, password }));
			navigate('/');
		} catch (e) {
			console.error(e);
		}
	};

	//TODO
	const googleSignIn = async () => {
		try {
			await dispatch(signInWithGoogleAPI());
			navigate('/');
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		console.log('signin', user.isSignedIn);
		dispatch(listenAuthState());
		// auth.onAuthStateChanged((user) => {
		// 	if (user) navigate('/');
		// });
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
					SignIn
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
				{/* <Button type="button" size="md" w="100%" mt="5" {...(user.isLoading && { isLoading: true })} onClick={googleSignIn}>
					Google
				</Button> */}
				<Box display={'flex'} justifyContent="center" mt="4">
					<Link to="/signup" fontSize={'14'} rounded="4" _hover={{ bg: 'teal.100' }}>
						Join This App
					</Link>
				</Box>
				<Box display={'flex'} justifyContent="center" mt="4">
					<Link to="/reset" fontSize={'14'} rounded="4" _hover={{ bg: 'teal.100' }}>
						Reset Password
					</Link>
				</Box>
			</Box>
		</Box>
	);
};

export default SignIn;
