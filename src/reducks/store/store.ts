import { configureStore } from '@reduxjs/toolkit';
import fileListSlice from '../slice/fileListSlice';

export const store = configureStore({
	reducer: {
		fileList: fileListSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
