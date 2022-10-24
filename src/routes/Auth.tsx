import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

type Props = {
	children: React.ReactNode;
};

const Auth: React.FC<Props> = ({ children }) => {
	const navigate = useNavigate();
	console.log('auth');
	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user === null) {
				navigate('/signin');
			}
		});
	}, []);
	return <>{children}</>;
};

export default Auth;
