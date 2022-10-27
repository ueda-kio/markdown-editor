import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import { isFileType } from '../../libs/firebase.operation';
import { RootState } from '../store/store';
import { setNotNewRegistrant } from './userSlice';

export type FileType = {
	id: string;
	value: string;
	created_at: string;
	updated_at: string;
	title: string;
	lead: string;
};

const usersRef = db.collection('users');
/**
 * ドキュメントへの参照を取得する
 * @param {string} uid ユーザーID
 * @returns `CollectionReference`
 */
const getRefs = (uid: string) => {
	const fileRef = usersRef.doc(uid).collection('files');
	const trashRef = usersRef.doc(uid).collection('trashes');
	return { fileRef, trashRef };
};

/** ファイルを新規作成する */
export const createNewFile = createAsyncThunk<FileType | undefined, void, { state: RootState }>(
	'fileList/createNewFile',
	async (_, thunkApi) => {
		const { uid } = thunkApi.getState().user;
		const { fileRef } = getRefs(uid);

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
	}
);

/** ファイルを新規作成する */
export const createNewSampleFile = createAsyncThunk<FileType | undefined, void, { state: RootState }>(
	'fileList/createNewSampleFile',
	async (_, thunkApi) => {
		const { uid } = thunkApi.getState().user;
		const { fileRef } = getRefs(uid);

		const timestamp = new Date().toISOString();
		const doc = fileRef.doc();
		const id = doc.id;
		const sampleTitle = `This is Sample!`;
		const sampleLead = `Let's leave a nice note!\nThis memo can be written in markdown.`;
		const value = `# This is Sample!
		Let's leave a nice notes!
		This memo can be written in markdown.

		- this is list
		- *bold text*
		- ~delete text~
		- \`code snippet\`

		> this is quotation.

		\`\`\`
		const sample = 'this is code block.';
		\`\`\`
		`.replace(/\t/g, '');
		const data: FileType = {
			id,
			value,
			created_at: timestamp,
			updated_at: timestamp,
			title: sampleTitle,
			lead: sampleLead,
		};

		try {
			await fileRef.doc(id).set(data);
			thunkApi.dispatch(setNotNewRegistrant());
			return data;
		} catch (e) {
			console.error(e);
			return;
		}
	}
);

/** ファイル一覧を取得する */
export const fetchFileList = createAsyncThunk<FileType[], void, { state: RootState }>('fileList/fetchFileList', async (_, thunkApi) => {
	const { uid } = thunkApi.getState().user;
	const { fileRef } = getRefs(uid);

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

/** ゴミ箱一覧を取得する */
export const fetchTrashList = createAsyncThunk<FileType[], void, { state: RootState }>('fileList/fetchTrashList', async (_, thunkApi) => {
	const { uid } = thunkApi.getState().user;
	const { trashRef } = getRefs(uid);

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
export const fetchFileById = createAsyncThunk<FileType | undefined, { id: string }, { state: RootState }>(
	'fileList/fetchFileById',
	async ({ id }, thunkApi) => {
		const { uid } = thunkApi.getState().user;
		const { fileRef } = getRefs(uid);

		try {
			const data = await (await fileRef.doc(id).get()).data();
			if (!data || !isFileType(data)) return;
			return data;
		} catch {
			return;
		}
	}
);

/**
 * ファイルを更新する
 * @param {string} id ファイルid
 * @param {string} value 入力値
 * @param {string} updated_at 更新時のタイムスタンプ
 */
export const updateFile = createAsyncThunk<Omit<FileType, 'created_at'>, Omit<FileType, 'created_at'>, { state: RootState }>(
	'fileList/updateFile',
	async ({ id, value, updated_at, title, lead }, thunkApi) => {
		const { uid } = thunkApi.getState().user;
		const { fileRef } = getRefs(uid);

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

export const copyFile = createAsyncThunk<FileType | void, FileType, { state: RootState }>(
	'fileList/copyFile',
	async ({ value, title, lead }, thunkApi) => {
		const { uid } = thunkApi.getState().user;
		const { fileRef } = getRefs(uid);

		const timestamp = new Date().toISOString();
		const doc = fileRef.doc();
		const id = doc.id;
		const data: FileType = {
			id,
			value,
			created_at: timestamp,
			updated_at: timestamp,
			title,
			lead,
		};

		try {
			await fileRef.doc(id).set(data);
			return data;
		} catch (e) {
			console.error(e);
			return;
		}
	}
);

/** 指定されたファイルをtrashesへ移動する */
export const putFileInTrash = createAsyncThunk<string, { id: string }, { state: RootState }>(
	'fileList/trashFile',
	async ({ id }, thunkApi) => {
		const { uid } = thunkApi.getState().user;
		const { fileRef, trashRef } = getRefs(uid);
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
	}
);

/** ゴミ箱のファイルをrestoreする */
export const restoreTrashedFile = createAsyncThunk<string, { id: string }, { state: RootState }>(
	'fileList/restoreFile',
	async ({ id }, thunkApi) => {
		const { uid } = thunkApi.getState().user;
		const { fileRef, trashRef } = getRefs(uid);

		await trashRef
			.doc(id)
			.get()
			.then((doc) => {
				const data = doc.data();
				if (!data) return;
				fileRef.doc(data.id).set(data);
				trashRef.doc(data.id).delete();
			});
		return id;
	}
);

/** ファイルを完全に削除する */
export const deleteFileCompletely = createAsyncThunk<string, { id: string }, { state: RootState }>(
	'fileList/deleteFile',
	async ({ id }, thunkApi) => {
		const { uid } = thunkApi.getState().user;
		const { trashRef } = getRefs(uid);

		await trashRef.doc(id).delete();
		return id;
	}
);

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
		sortFiles: (state, action: PayloadAction<{ listType: 'files' | 'trashes'; orderBy: 'asc' | 'desc' }>) => {
			const { listType, orderBy } = action.payload;
			const targetList = listType === 'files' ? state.files : state.trashes;
			targetList.list.sort((a, b) => {
				return orderBy === 'asc'
					? new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
					: new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
			});
		},
		/**
		 * ファイルを完全に削除する。
		 * @param {string} id 削除対象のファイルid
		 */
		// deleteFile: (state, action: PayloadAction<string>) => {
		// 	const _trash = state.trashes.list.filter((trashes) => trashes.id !== action.payload);
		// 	return {
		// 		...state,
		// 		trashes: {
		// 			list: _trash,
		// 			isFetched: state.trashes.isFetched,
		// 		},
		// 	};
		// },
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
		// サンプルファイルの新規作成
		builder.addCase(createNewSampleFile.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(createNewSampleFile.fulfilled, (state, action) => {
			state.isLoading = false;
			if (!action.payload) return;
			state.files.list.unshift(action.payload);
			state.files.isFetched = true;
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
		// idからファイルの取得
		builder.addCase(copyFile.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(copyFile.fulfilled, (state, action) => {
			if (!action.payload) return;
			state.files.list.unshift(action.payload);
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
		// ゴミ箱のファイルをrestore
		builder.addCase(restoreTrashedFile.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(restoreTrashedFile.fulfilled, (state, action) => {
			state.isLoading = false;

			// 削除対象ファイルを取得しfilesへ格納
			const trashTarget = state.trashes.list.find((files) => files.id === action.payload);
			trashTarget && state.files.list.unshift(trashTarget);

			// trashesから削除対象ファイルを削除
			state.trashes.list = state.trashes.list.filter((files) => files.id !== action.payload);
		});
		// ファイルを完全に削除
		builder.addCase(deleteFileCompletely.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(deleteFileCompletely.fulfilled, (state, action) => {
			state.isLoading = false;
			state.trashes.list = state.trashes.list.filter((file) => file.id !== action.payload);
		});
	},
});

export const { addFile, setState, trashFile, sortFiles } = fileListSlice.actions;
export default fileListSlice.reducer;
