import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { auth, db } from '../../firebase';
import { resetFileList } from './fileListSlice';
import {
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
	sendPasswordResetEmail,
	GoogleAuthProvider,
} from 'firebase/auth';
import { collection, addDoc, getDoc, getDocs, setDoc, doc } from 'firebase/firestore';

export const signUp = createAsyncThunk<void, { email: string; password: string }>('user/signUp', async ({ email, password }, thunkApi) => {
	try {
		const res = await createUserWithEmailAndPassword(auth, email, password);
		const { uid } = res.user;
		thunkApi.dispatch(singInAction(uid));
		setDoc(doc(db, 'users', uid), { uid });
	} catch (e) {
		console.log(e);
	}
});

export const signIn = createAsyncThunk<void, { email: string; password: string }>('user/signIn', async ({ email, password }, thunkApi) => {
	try {
		const res = await signInWithEmailAndPassword(auth, email, password);
		const { uid } = res.user;
		thunkApi.dispatch(singInAction(uid));
	} catch (e) {
		console.log(e);
	}
});

export const signInWithGoogleAPI = createAsyncThunk('user/signInWithGoogleAPI', async (_, thunkApi) => {
	try {
		const provider = new GoogleAuthProvider();
		provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
		const res = await signInWithPopup(auth, provider);
		const { uid } = res.user;
		thunkApi.dispatch(singInAction(uid));
	} catch (e) {
		console.log(e);
	}
});

export const signOut = createAsyncThunk('user/signOut', async (_, thunkApi) => {
	await auth.signOut();
	thunkApi.dispatch(signOutAction());
	thunkApi.dispatch(resetFileList());
});

export const listenAuthState = createAsyncThunk('user/listenAuthState', async (_, thunkApi) => {
	onAuthStateChanged(auth, async (user) => {
		if (!user) return;
		const { uid } = user;
		thunkApi.dispatch(singInAction(uid));

		// const querySnapshot = await getDocs(collection(db, 'users'));
		// querySnapshot.forEach((doc) => {
		// 	thunkApi.dispatch(singInAction(doc.id));
		// });

		// .collection('users')
		// .doc(uid)
		// .get()
		// .then(() => {
		// 	thunkApi.dispatch(singInAction(uid));
		// });
	});
});

export const resetPassword = createAsyncThunk<void, { email: string }>('user/resetPassword', async ({ email }) => {
	sendPasswordResetEmail(auth, email);
});

const initialState = {
	isSignedIn: false,
	uid: '',
	isLoading: false,
	isNewRegistrant: false,
};
export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		singInAction: (state, action: PayloadAction<string>) => {
			return {
				...state,
				isSignedIn: true,
				uid: action.payload,
			};
		},
		signOutAction: (state) => {
			return initialState;
		},
		setNotNewRegistrant: (state) => {
			return {
				...state,
				isNewRegistrant: false,
			};
		},
	},
	extraReducers: (builder) => {
		builder.addCase(signUp.pending, (state) => {
			state.isLoading = true;
			state.isNewRegistrant = true;
		});
		builder.addCase(signUp.fulfilled, (state) => {
			state.isLoading = false;
		});
		builder.addCase(signIn.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(signIn.fulfilled, (state) => {
			state.isLoading = false;
		});
		builder.addCase(listenAuthState.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(listenAuthState.fulfilled, (state) => {
			state.isLoading = false;
		});
		builder.addCase(resetPassword.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(resetPassword.fulfilled, (state) => {
			state.isLoading = false;
		});
	},
});

export const { singInAction, signOutAction, setNotNewRegistrant } = userSlice.actions;
export default userSlice.reducer;
