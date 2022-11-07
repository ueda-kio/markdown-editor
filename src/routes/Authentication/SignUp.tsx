import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { auth, db } from '../../firebase';
import { nanoid } from '@reduxjs/toolkit';
import { useAppDispatch, useUser } from '../../reducks/hooks';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../reducks/slice/userSlice';
import { Link } from '../../components/Atoms/Link';
import AuthWrapper from '../Layout/AuthWrapper';

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

	const otherLinks = useMemo(() => [{ text: 'Already have an account?', to: '/signin' }], []);

	return (
		<AuthWrapper
			title="Sign up"
			inputs={inputs}
			otherLinks={otherLinks}
			submitButtonLabel={'Sign up'}
			onSubmit={onSubmit}
		></AuthWrapper>
	);
};

export default SignUp;
