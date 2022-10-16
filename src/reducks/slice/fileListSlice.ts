import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import { isFileType } from '../../libs/firebase.operation';

export type FileType = {
	id: string;
	value: string;
	created_at: string;
	updated_at: string;
	title: string;
	lead: string;
};

const fileRef = db.collection('files');
const trashRef = db.collection('trashes');

/** firestoreから保存されているファイル一覧を取得する */
export const fetchFileList = createAsyncThunk('fileList/fetchFileList', async () => {
	const data = await fileRef
		.orderBy('updated_at', 'desc')
		.get()
		.then((snapshots) => {
			const dataArray: FileType[] = [];
			snapshots.forEach((snapshot) => {
				const data = snapshot.data();
				if (!isFileType(data)) return;
				dataArray.push(data);
			});
			return dataArray;
		})
		.catch((e) => {
			throw Error(e);
		});
	return data;
});

/**
 * idからファイルを取得する
 * @param {string} id ファイルid
 */
export const fetchFileById = createAsyncThunk<FileType | undefined, { id: string }>('fileList/fetchFileById', async ({ id }) => {
	try {
		const data = await (await fileRef.doc(id).get()).data();
		if (!data || !isFileType(data)) return;
		return data;
	} catch {
		return;
	}
});

/**
 * ファイルを更新する
 * @param {string} id ファイルid
 * @param {string} value 入力値
 * @param {string} updated_at 更新時のタイムスタンプ
 */
export const updateFile = createAsyncThunk<
	{ id: string; value: string; updated_at: string; title: string; lead: string },
	{ id: string; value: string; updated_at: string; title: string; lead: string }
>('fileList/updateFIle', async ({ id, value, updated_at, title, lead }) => {
	await fileRef.doc(id).set(
		{
			value,
			updated_at,
			title,
			lead,
		},
		{ merge: true }
	);
	return { id, value, updated_at, title, lead };
});

export const fileListSlice = createSlice({
	name: 'fileList',
	initialState: {
		files: {
			list: [] as FileType[],
			isFetched: false,
		},
		trashes: {
			list: [] as FileType[],
			isFetched: false,
		},
		isLoading: false,
	},
	reducers: {
		setState: (state, action: PayloadAction<FileType[]>) => {
			return {
				...state,
				files: {
					list: action.payload,
					isFetched: state.files.isFetched,
				},
			};
		},
		/**
		 * ファイルを新規作成する。
		 * @param {string} id 自動採番されたid
		 * @param {string} created_at 作成時のタイムスタンプ
		 * @param {string} updated_at 作成時のタイムスタンプ
		 */
		// addFile: (state, action: PayloadAction<{ id: string; created_at: string; updated_at: string }>) => {
		// 	const { id, created_at, updated_at } = action.payload;
		// 	state.files.push({ id, value: '', created_at, updated_at });
		// 	return {
		// 		...state,
		// 		files: state.files,
		// 	};
		// },
		/**
		 * ファイルをゴミ箱へ移動する。
		 * @param {string} id 削除対象のファイルid
		 */
		trashFile: (state, action: PayloadAction<string>) => {
			const target = state.files.list.find((files) => files.id === action.payload);
			const _files = state.files.list.filter((files) => files.id !== action.payload);
			target && state.trashes.list.push(target);
			return {
				...state,
				files: {
					list: _files,
					isFetched: state.files.isFetched,
				},
			};
		},
		/**
		 * ファイルを完全に削除する。
		 * @param {string} id 削除対象のファイルid
		 */
		deleteFile: (state, action: PayloadAction<string>) => {
			const _trash = state.trashes.list.filter((trashes) => trashes.id !== action.payload);
			return {
				...state,
				trashes: {
					list: _trash,
					isFetched: state.trashes.isFetched,
				},
			};
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchFileList.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(fetchFileList.fulfilled, (state, action) => {
			state.files.list = action.payload;
			state.isLoading = false;
			state.files.isFetched = true;
		});
		builder.addCase(fetchFileById.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(fetchFileById.fulfilled, (state, action) => {
			state.isLoading = false;
			if (!action.payload) return { ...state };
			const _file = [...state.files.list, action.payload];
			state.files.list = _file;
		});
		builder.addCase(updateFile.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(updateFile.fulfilled, (state) => {
			state.isLoading = false;
		});
	},
	// [fetchFileList.fulfilled]: (state, action: PayloadAction<FileType[]>) => {
	// 	state.fileList =
	// }
	// }
});

export const { setState, trashFile, deleteFile } = fileListSlice.actions;
export default fileListSlice.reducer;
