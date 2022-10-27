import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { auth, db } from '../../firebase';
import { createNewFile } from './fileListSlice';

const usersRef = db.collection('users');

export const signUp = createAsyncThunk<void, { email: string; password: string }>('user/signUp', async ({ email, password }, thunkApi) => {
	try {
		const res = await auth.createUserWithEmailAndPassword(email, password);
		if (!res.user) throw Error();
		const { uid } = res.user;
		thunkApi.dispatch(singInAction(uid));

		await usersRef.doc(uid).set({ uid });
	} catch (e) {
		console.log(e);
	}
});

export const signIn = createAsyncThunk<void, { email: string; password: string }>('user/signIn', async ({ email, password }, thunkApi) => {
	try {
		const res = await auth.signInWithEmailAndPassword(email, password);
		if (!res.user) throw Error();
		const { uid } = res.user;
		thunkApi.dispatch(singInAction(uid));
	} catch (e) {
		console.log(e);
	}
});

export const signOut = createAsyncThunk('user/signOut', async (_, thunkApi) => {
	thunkApi.dispatch(signOutAction());
});

export const listenAuthState = createAsyncThunk('user/listenAuthState', async (_, thunkApi) => {
	auth.onAuthStateChanged((user) => {
		if (!user) return;
		const { uid } = user;
		db.collection('users')
			.doc(uid)
			.get()
			.then(() => {
				thunkApi.dispatch(singInAction(uid));
			});
	});
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
	},
});

export const { singInAction, signOutAction, setNotNewRegistrant } = userSlice.actions;
export default userSlice.reducer;
