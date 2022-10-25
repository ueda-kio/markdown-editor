import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { auth, db } from '../../firebase';

export const signUp = createAsyncThunk<void, { email: string; password: string }>('user/signUp', async ({ email, password }, thunkApi) => {
	try {
		const res = await auth.createUserWithEmailAndPassword(email, password);
		if (!res.user) throw Error();
		const { uid } = res.user;
		thunkApi.dispatch(singInAction(uid));
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

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		isSignedIn: false,
		uid: '',
		isLoading: false,
	},
	reducers: {
		singInAction: (state, action: PayloadAction<string>) => {
			return {
				...state,
				isSignedIn: true,
				uid: action.payload,
			};
		},
	},
	extraReducers: (builder) => {
		builder.addCase(signUp.pending, (state) => {
			state.isLoading = true;
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

export const { singInAction } = userSlice.actions;
export default userSlice.reducer;
