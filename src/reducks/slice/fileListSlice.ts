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

/** ファイルを新規作成する */
export const createNewFile = createAsyncThunk<FileType | void>('fileList/createNewFile', async () => {
	const timestamp = new Date().toISOString();
	const doc = fileRef.doc();
	const id = doc.id;
	const data: FileType = {
		id,
		value: '',
		created_at: timestamp,
		updated_at: timestamp,
		title: '',
		lead: '',
	};

	try {
		await fileRef.doc(id).set(data);
		return data;
	} catch (e) {
		console.error(e);
		return;
	}
});

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

/** firestoreから保存されているファイル一覧を取得する */
export const fetchTrashList = createAsyncThunk('fileList/fetchTrashList', async () => {
	const data = await trashRef
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
export const updateFile = createAsyncThunk<Omit<FileType, 'created_at'>, Omit<FileType, 'created_at'>>(
	'fileList/updateFile',
	async ({ id, value, updated_at, title, lead }) => {
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
	}
);

/** 指定されたファイルをtrashesへ移動する */
export const putFileInTrash = createAsyncThunk<string, { id: string }>('fileList/trashFile', async ({ id }) => {
	await fileRef
		.doc(id)
		.get()
		.then((doc) => {
			const data = doc.data();
			if (!data) return;
			trashRef.doc(data.id).set(data);
			fileRef.doc(data.id).delete();
		});
	return id;
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
		addFile: (state, action: PayloadAction<FileType>) => {
			state.files.list.push(action.payload);
			return {
				...state,
				files: state.files,
			};
		},
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
		// ファイルの新規作成
		builder.addCase(createNewFile.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(createNewFile.fulfilled, (state, action) => {
			state.isLoading = false;
			if (!action.payload) return;
			state.files.list.unshift(action.payload);
		});
		// ファイル一覧の取得
		builder.addCase(fetchFileList.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(fetchFileList.fulfilled, (state, action) => {
			state.files.list = action.payload;
			state.isLoading = false;
			state.files.isFetched = true;
		});
		// ゴミ箱一覧の取得
		builder.addCase(fetchTrashList.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(fetchTrashList.fulfilled, (state, action) => {
			state.trashes.list = action.payload;
			state.isLoading = false;
			state.trashes.isFetched = true;
		});
		// idからファイルの取得
		builder.addCase(fetchFileById.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(fetchFileById.fulfilled, (state, action) => {
			state.isLoading = false;
			if (!action.payload) return { ...state };
			const _file = [...state.files.list, action.payload];
			state.files.list = _file;
		});
		// ファイルの更新
		builder.addCase(updateFile.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(updateFile.fulfilled, (state, action) => {
			const { id, value, updated_at, title, lead } = action.payload;
			const others = state.files.list.filter((file) => file.id !== id);
			const changedFile = state.files.list.find((file) => file.id === id);
			if (!changedFile) return;

			const updatedFile = {
				id,
				value,
				updated_at,
				title,
				lead,
				created_at: changedFile.created_at,
			};
			state.files.list = [updatedFile, ...others];
			state.isLoading = false;
		});
		// ファイルをゴミ箱へ移動
		builder.addCase(putFileInTrash.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(putFileInTrash.fulfilled, (state, action) => {
			state.isLoading = false;

			// 削除対象ファイルを取得しtrashesへ格納
			const trashTarget = state.files.list.find((files) => files.id === action.payload);
			trashTarget && state.trashes.list.unshift(trashTarget);

			// filesから削除対象ファイルを削除
			state.files.list = state.files.list.filter((files) => files.id !== action.payload);
		});
	},
});

export const { addFile, setState, trashFile, deleteFile } = fileListSlice.actions;
export default fileListSlice.reducer;
