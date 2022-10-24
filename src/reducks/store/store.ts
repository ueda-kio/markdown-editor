import { configureStore } from '@reduxjs/toolkit';
import fileListSlice from '../slice/fileListSlice';
import userSlice from '../slice/userSlice';

export const store = configureStore({
	reducer: {
		fileList: fileListSlice,
		user: userSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
