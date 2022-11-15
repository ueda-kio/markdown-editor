import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useUser } from '../../reducks/selectors';
import { listenAuthState, signIn, signInWithGoogleAPI } from '../../reducks/slice/userSlice';
import AuthWrapper from '../Layout/AuthWrapper';

const SignIn = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
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
		dispatch(listenAuthState());
	}, []);

	const inputs = useMemo(
		() => [
			{
				type: 'email',
				value: email,
				placeholder: 'Email',
				onChange: (e: { target: { value: string } }) => setEmail(e.target.value),
				autoComplete: 'email',
				isRequired: true,
			},
			{
				type: 'password',
				value: password,
				placeholder: 'Password',
				onChange: (e: { target: { value: string } }) => setPassword(e.target.value),
				autoComplete: 'current-password',
				isRequired: true,
			},
		],
		[email, password]
	);

	const otherLinks = useMemo(
		() => [
			{ text: 'No account yet?', to: '/signup' },
			{ text: 'Forgot your password?', to: '/reset' },
		],
		[]
	);

	return (
		<AuthWrapper title="Log in" inputs={inputs} otherLinks={otherLinks} submitButtonLabel={'Log in'} onSubmit={onSubmit}>
			{/* <Button onClick={googleSignIn}>GOOGLE</Button> */}
		</AuthWrapper>
	);
};

export default SignIn;
