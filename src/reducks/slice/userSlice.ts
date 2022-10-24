import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { auth } from '../../firebase';

export const signIn = createAsyncThunk<string | undefined, { email: string; password: string }>(
	'user/signIn',
	async ({ email, password }) => {
		try {
			const res = await auth.signInWithEmailAndPassword(email, password);
			if (!res.user) throw Error();
			const { uid } = res.user;
			return uid;
		} catch (e) {
			console.log(e);
		}
	}
);

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		isSignedIn: false,
		uid: '',
		isLoading: false,
	},
	reducers: {
		singIn: (state, action: PayloadAction<string>) => {
			return {
				...state,
				isSignedIn: true,
				uid: action.payload,
			};
		},
	},
	extraReducers: (builder) => {
		builder.addCase(signIn.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(signIn.fulfilled, (state, action) => {
			state.isLoading = false;
			state.uid = action.payload ?? '';
		});
	},
});

export default userSlice.reducer;
