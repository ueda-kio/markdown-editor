import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import isFileType from '../../libs/isFileType';
import { RootState } from '../store/store';
import { setNotNewRegistrant } from './userSlice';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	setDoc,
	query,
	orderBy,
	updateDoc,
	addDoc,
	deleteDoc,
	where,
	CollectionReference,
	DocumentData,
} from 'firebase/firestore';

export type FileType = {
	id: string;
	value: string;
	created_at: string;
	updated_at: string;
	title: string;
	lead: string;
};
export type FileListType = 'files' | 'trashes' | 'archives';
export const listTypeArray = ['list', 'panel'] as const;
export type ListType = typeof listTypeArray[number];

// const usersRef = db.collection('users');
// /**
//  * ドキュメントへの参照を取得する
//  * @param {string} uid ユーザーID
//  * @returns `CollectionReference`
//  */
// const getRefs = (uid: string) => {
// 	const fileRef = usersRef.doc(uid).collection('files');
// 	const trashRef = usersRef.doc(uid).collection('trashes');
// 	const archiveRef = usersRef.doc(uid).collection('archives');
// 	return { fileRef, trashRef, archiveRef };
// };

const getCollection = (uid: string) => {
	const userRef = doc(collection(db, 'users'), uid);
	const files = collection(userRef, 'files');
	const trashes = collection(userRef, 'trashes');
	const archives = collection(userRef, 'archives');
	const all = collection(userRef, 'all');
	return { files, trashes, archives, all };
};

/** ファイルを新規作成する */
export const createNewFile = createAsyncThunk<FileType | undefined, void, { state: RootState }>(
	'fileList/createNewFile',
	async (_, thunkApi) => {
		const { uid } = thunkApi.getState().user;
		const { files } = getCollection(uid);
		const document = doc(files);
		const id = document.id;
		const timestamp = new Date().toISOString();
		const data: FileType = {
			id,
			value: '',
			created_at: timestamp,
			updated_at: timestamp,
			title: '',
			lead: '',
		};

		try {
			await setDoc(document, data);
			return data;
		} catch (e) {
			console.error(e);
			return;
		}
	}
);

/** サンプルファイルを作成する */
export const createNewSampleFile = createAsyncThunk<FileType | undefined, void, { state: RootState }>(
	'fileList/createNewSampleFile',
	async (_, thunkApi) => {
		const { uid } = thunkApi.getState().user;
		const { files, all } = getCollection(uid);
		const docRefToFiles = doc(files);
		const id = docRefToFiles.id;

		const timestamp = new Date().toISOString();
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

		// const docRefToAll = doc(all);

		try {
			// await setDoc(docRefToFiles)
			await setDoc(docRefToFiles, data);
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
	const { files } = getCollection(uid);

	try {
		const snapshots = await getDocs(files);
		const dataArray: FileType[] = [];
		snapshots.forEach((snapshot) => {
			const data = snapshot.data();
			if (!isFileType(data)) return;
			dataArray.push(data);
		});
		return dataArray;
	} catch {
		throw Error();
	}
});

/** ゴミ箱一覧を取得する */
export const fetchTrashList = createAsyncThunk<FileType[], void, { state: RootState }>('fileList/fetchTrashList', async (_, thunkApi) => {
	const { uid } = thunkApi.getState().user;
	const { trashes } = getCollection(uid);

	const q = query(trashes, orderBy('updated_at', 'desc'));
	try {
		const snapshots = await getDocs(q);
		const dataArray: FileType[] = [];
		snapshots.forEach((snapshot) => {
			const data = snapshot.data();
			if (!isFileType(data)) return;
			dataArray.push(data);
		});
		return dataArray;
	} catch {
		throw Error();
	}
});

/** アーカイブ一覧を取得する */
export const fetchArchiveList = createAsyncThunk<FileType[], void, { state: RootState }>(
	'fileList/fetchArchiveList',
	async (_, thunkApi) => {
		const { uid } = thunkApi.getState().user;
		const { archives } = getCollection(uid);

		const q = query(archives, orderBy('updated_at', 'desc'));
		try {
			const snapshots = await getDocs(q);
			const dataArray: FileType[] = [];
			snapshots.forEach((snapshot) => {
				const data = snapshot.data();
				if (!isFileType(data)) return;
				dataArray.push(data);
			});
			return dataArray;
		} catch {
			throw Error();
		}
	}
);

/**
 * 指定されたIDのファイルをユーザーの全コレクションの中から検索し取得する
 * @param {string} uid ユーザーID
 * @param {string} id ファイルID
 */
const getFile = async (uid: string, id: string) => {
	// const { fileRef, trashRef, archiveRef } = getRefs(uid);
	const { files, trashes, archives } = getCollection(uid);

	const snapshot = await getDocs(query(collection(db, uid), where('id', '==', id)));
	snapshot.forEach((snapshot) => console.log(snapshot));

	let fileListType!: FileListType;
	const data = await (async () => {
		const fromFiles = await getDoc(doc(files, id));
		const fromTrashes = await getDoc(doc(trashes, id));
		const fromArchives = await getDoc(doc(archives, id));

		// const fromFiles = (await fileRef.doc(id).get()).data();
		// const fromTrashes = (await trashRef.doc(id).get()).data();
		// const fromArchives = (await archiveRef.doc(id).get()).data();
		if (fromFiles.exists()) {
			fileListType = 'files';
			return fromFiles.data();
		}
		if (fromTrashes.exists()) {
			fileListType = 'trashes';
			return fromTrashes.data();
		}
		if (fromArchives.exists()) {
			fileListType = 'archives';
			return fromArchives.data();
		}
		return false as const;
	})();
	return { data, fileListType };
};

/**
 * idからファイルを取得する
 * @param {string} id ファイルid
 */
export const fetchFileById = createAsyncThunk<
	{ data: FileType; fileListType: FileListType } | undefined,
	{ id: string },
	{ state: RootState }
>('fileList/fetchFileById', async ({ id }, thunkApi) => {
	const { uid } = thunkApi.getState().user;

	try {
		const { data, fileListType } = await getFile(uid, id);
		if (data === false || !isFileType(data)) return;
		return { data, fileListType };
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
export const updateFile = createAsyncThunk<Omit<FileType, 'created_at'> | false, Omit<FileType, 'created_at'>, { state: RootState }>(
	'fileList/updateFile',
	async ({ id, value, updated_at, title, lead }, thunkApi) => {
		const { uid } = thunkApi.getState().user;
		const { files } = getCollection(uid);

		try {
			const targetFile = doc(files, id);
			await updateDoc(targetFile, {
				value,
				updated_at,
				title,
				lead,
			});
			return { id, value, updated_at, title, lead };
		} catch {
			return false;
		}
	}
);

export const copyFile = createAsyncThunk<FileType | void, FileType, { state: RootState }>(
	'fileList/copyFile',
	async ({ value, title, lead }, thunkApi) => {
		const { uid } = thunkApi.getState().user;
		// const { fileRef } = getRefs(uid);
		const { files } = getCollection(uid);

		const timestamp = new Date().toISOString();
		// const doc = fileRef.doc();
		const id = files.id;
		const data: FileType = {
			id,
			value,
			created_at: timestamp,
			updated_at: timestamp,
			title,
			lead,
		};

		try {
			const fileRef = doc(files, id);
			await setDoc(fileRef, data);
			// await fileRef.doc(id).set(data);
			return data;
		} catch (e) {
			console.error(e);
			return;
		}
	}
);

/**
 * 特定のファイルを別のコレクションへ移動させる
 * @param {string} fileId ファイルID
 * @param {CollectionReference<DocumentData>} from 移動元コレクション
 * @param {CollectionReference<DocumentData>} to 移動先コレクション
 */
const moveFileToAnotherCollection = async (
	fileId: string,
	from: CollectionReference<DocumentData>,
	to: CollectionReference<DocumentData>
) => {
	try {
		const targetFileSnap = await getDoc(doc(from, fileId));
		if (!targetFileSnap.exists) throw Error('doc is not exists');

		const data = targetFileSnap.data();
		if (typeof data === 'undefined') throw Error(`Failed to read data. file: ${from.path}/${fileId}`);

		await addDoc(to, data);
		await deleteDoc(doc(from, fileId));
	} catch (e) {
		console.error(e);
	}
};

/** 指定されたファイルをtrashesへ移動する */
export const putFileInTrash = createAsyncThunk<
	{ id: string; isArchive: boolean },
	{ id: string; isArchive?: boolean },
	{ state: RootState }
>('fileList/putFileInTrash', async ({ id, isArchive = false }, thunkApi) => {
	const { uid } = thunkApi.getState().user;
	const { files, trashes, archives } = getCollection(uid);
	const collectionRef = isArchive ? archives : files;

	await moveFileToAnotherCollection(id, collectionRef, trashes);
	return { id, isArchive };
});

/** 指定されたファイルをアーカイブへ移動する */
export const putFileInArchive = createAsyncThunk<string, { id: string }, { state: RootState }>(
	'fileList/putFileInArchive',
	async ({ id }, thunkApi) => {
		const { uid } = thunkApi.getState().user;
		const { files, archives } = getCollection(uid);
		await moveFileToAnotherCollection(id, files, archives);
		return id;
	}
);

/** ゴミ箱のファイルをrestoreする */
export const restoreTrashedFile = createAsyncThunk<string, { id: string }, { state: RootState }>(
	'fileList/restoreFile',
	async ({ id }, thunkApi) => {
		const { uid } = thunkApi.getState().user;
		const { files, trashes } = getCollection(uid);
		await moveFileToAnotherCollection(id, trashes, files);
		return id;
	}
);

/** アーカイブのファイルをrestoreする */
export const restoreArchivedFile = createAsyncThunk<string, { id: string }, { state: RootState }>(
	'fileList/restoreArchivedFile',
	async ({ id }, thunkApi) => {
		const { uid } = thunkApi.getState().user;
		const { files, archives } = getCollection(uid);
		await moveFileToAnotherCollection(id, archives, files);
		return id;
	}
);

/** ファイルを完全に削除する */
export const deleteFileCompletely = createAsyncThunk<string, { id: string }, { state: RootState }>(
	'fileList/deleteFile',
	async ({ id }, thunkApi) => {
		const { uid } = thunkApi.getState().user;
		const { trashes, all } = getCollection(uid);
		//TODO 並行で実行したい
		await deleteDoc(doc(trashes, id));
		// await deleteDoc(doc(all, id))
		return id;
	}
);

const initialState = {
	files: {
		list: [] as FileType[],
		isFetched: false,
	},
	trashes: {
		list: [] as FileType[],
		isFetched: false,
	},
	archives: {
		list: [] as FileType[],
		isFetched: false,
	},
	isLoading: false,
	listType: 'list' as ListType,
};
export const fileListSlice = createSlice({
	name: 'fileList',
	initialState,
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
		resetFileList: () => initialState,
		setListType: (state, action: PayloadAction<ListType>) => {
			return {
				...state,
				listType: action.payload,
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
		// アーカイブ一覧の取得
		builder.addCase(fetchArchiveList.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(fetchArchiveList.fulfilled, (state, action) => {
			state.archives.list = action.payload;
			state.isLoading = false;
			state.archives.isFetched = true;
		});
		// idからファイルの取得
		builder.addCase(fetchFileById.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(fetchFileById.fulfilled, (state, action) => {
			state.isLoading = false;
			if (!action.payload) return { ...state };
			const { data, fileListType } = action.payload;
			switch (fileListType) {
				case 'files': {
					state.files.list.push(data);
					break;
				}
				case 'trashes': {
					state.trashes.list.push(data);
					break;
				}
				case 'archives': {
					state.archives.list.push(data);
					break;
				}
			}
		});
		// ファイルの更新
		builder.addCase(updateFile.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(updateFile.fulfilled, (state, action) => {
			if (!action.payload) return;
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
		builder.addCase(putFileInTrash.rejected, (state) => {
			state.isLoading = false;
		});
		builder.addCase(putFileInTrash.fulfilled, (state, action) => {
			state.isLoading = false;

			// 削除対象ファイルを取得しtrashesへ格納
			const targetList = action.payload.isArchive === true ? state.archives.list : state.files.list;
			const trashTarget = targetList.find((files) => files.id === action.payload.id);
			trashTarget && state.trashes.list.unshift(trashTarget);

			// filesから削除対象ファイルを削除
			action.payload.isArchive === true
				? (state.archives.list = state.archives.list.filter((files) => files.id !== action.payload.id))
				: (state.files.list = state.files.list.filter((files) => files.id !== action.payload.id));
		});
		// ファイルをアーカイブへ移動
		builder.addCase(putFileInArchive.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(putFileInArchive.fulfilled, (state, action) => {
			state.isLoading = false;

			// 削除対象ファイルを取得しtrashesへ格納
			const archiveTarget = state.files.list.find((files) => files.id === action.payload);
			archiveTarget && state.archives.list.unshift(archiveTarget);

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

		// アーカイブをrestore
		builder.addCase(restoreArchivedFile.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(restoreArchivedFile.fulfilled, (state, action) => {
			state.isLoading = false;

			// 削除対象ファイルを取得しfilesへ格納
			const archiveTarget = state.archives.list.find((files) => files.id === action.payload);
			archiveTarget && state.files.list.unshift(archiveTarget);

			// アーカイブから削除対象ファイルを削除
			state.archives.list = state.archives.list.filter((files) => files.id !== action.payload);
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

export const { addFile, setState, trashFile, sortFiles, resetFileList, setListType } = fileListSlice.actions;
export default fileListSlice.reducer;
