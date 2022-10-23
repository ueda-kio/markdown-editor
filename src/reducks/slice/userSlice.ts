import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		isSignedIn: false,
		uid: '',
	},
	reducers: {
		singIn: (state, action: PayloadAction<string>) => {
			return {
				isSignedIn: true,
				uid: action.payload,
			};
		},
	},
});

export default userSlice.reducer;
