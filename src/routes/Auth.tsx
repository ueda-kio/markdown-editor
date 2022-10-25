import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Atoms/Loading';
import { auth } from '../firebase';
import { useAppDispatch, useUser } from '../reducks/hooks';
import { listenAuthState } from '../reducks/slice/userSlice';

type Props = {
	children: React.ReactNode;
};

const Auth: React.FC<Props> = ({ children }) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { user } = useUser();

	useEffect(() => {
		console.log('auth');
		if (!user.isSignedIn) {
			dispatch(listenAuthState());
			auth.onAuthStateChanged((user) => {
				if (user === null) {
					navigate('/signin');
				}
			});
		}
	}, []);
	if (!user.isSignedIn) {
		return <Loading />;
	} else {
		return <>{children}</>;
	}
};

export default Auth;
