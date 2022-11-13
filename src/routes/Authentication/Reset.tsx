import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { auth, db } from '../../firebase';
import { nanoid } from '@reduxjs/toolkit';
import { useAppDispatch, useUser } from '../../reducks/selectors';
import { useNavigate } from 'react-router-dom';
import { resetPassword, signUp } from '../../reducks/slice/userSlice';
import { Link } from '../../components/Atoms/Link';
import AuthWrapper from '../Layout/AuthWrapper';

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
		],
		[email]
	);

	const otherLinks = useMemo(() => [{ text: 'Take me back to login', to: '/signin' }], []);

	return (
		<AuthWrapper
			title="Reset Your Password"
			inputs={inputs}
			otherLinks={otherLinks}
			submitButtonLabel={'Get reset link'}
			onSubmit={onSubmit}
		></AuthWrapper>
	);
};

export default Reset;
