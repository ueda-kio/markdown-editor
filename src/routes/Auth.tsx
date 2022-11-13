import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Atoms/Loading';
import { auth } from '../firebase';
import { isListType } from '../libs/isListType';
import { useAppDispatch, useUser } from '../reducks/selectors';
import { setListType } from '../reducks/slice/fileListSlice';
import { listenAuthState } from '../reducks/slice/userSlice';

type Props = {
	children: React.ReactNode;
};

const Auth: React.FC<Props> = ({ children }) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { user } = useUser();

	useEffect(() => {
		// get listType by localStorage
		const listTypeByStorage = window.localStorage.getItem('list-type') ?? 'list';
		if (isListType(listTypeByStorage)) {
			dispatch(setListType(listTypeByStorage));
		}

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
