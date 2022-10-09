import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export const fileListSlice = createSlice({
	name: 'fileList',
	initialState: {
		files: [] as { id: string; value: string }[],
		trashes: [] as { id: string; value: string }[],
	},
	reducers: {
		/**
		 * ファイルを新規作成する。
		 * @param {string} id 自動採番されたid
		 */
		addFile: (state, action: PayloadAction<string>) => {
			state.files.push({ id: action.payload, value: '' });
			return {
				files: state.files,
				trashes: state.trashes,
			};
		},
		/**
		 * ファイルをゴミ箱へ移動する。
		 * @param {string} id 削除対象のファイルid
		 */
		trashFile: (state, action: PayloadAction<string>) => {
			const target = state.files.find((files) => files.id === action.payload);
			const _files = state.files.filter((files) => files.id !== action.payload);
			target && state.trashes.push(target);
			return {
				files: _files,
				trashes: state.trashes,
			};
		},
		/**
		 * ファイルを完全に削除する。
		 * @param {string} id 削除対象のファイルid
		 */
		deleteFile: (state, action: PayloadAction<string>) => {
			const _trash = state.trashes.filter((trashes) => trashes.id !== action.payload);
			return {
				files: state.files,
				trashes: _trash,
			};
		},
	},
});

export const { addFile, trashFile, deleteFile } = fileListSlice.actions;
export default fileListSlice.reducer;
