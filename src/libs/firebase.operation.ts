import firebase from 'firebase';
import { db } from '../firebase';
import { FileType } from '../reducks/slice/fileListSlice';

const fileRef = db.collection('files');
const trashRef = db.collection('trashes');

/** FileTypeへ絞り込みを行うユーザー定義型ガード */
const isFileType = (data: firebase.firestore.DocumentData): data is FileType => {
	const { id, created_at, updated_at, value } = data;
	if (
		typeof id !== 'undefined' &&
		typeof value !== 'undefined' &&
		typeof created_at !== 'undefined' &&
		typeof updated_at !== 'undefined'
	) {
		return true;
	}
	return false;
};

/** firestoreから保存されているファイル一覧を取得する */
export const fetchFileList = async () => {
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
};

/**
 * idからファイルを取得する
 * @param {string} id ファイルid
 */
export const fetchFileById = async (id: string) => {
	const data = await (await fileRef.doc(id).get()).data();
	if (!data || !isFileType(data)) return;
	return data;
};

/**
 * ファイルを更新する
 * @param {string} id ファイルid
 * @param {string} value 入力値
 * @param {string} updated_at 更新時のタイムスタンプ
 */
export const updateFile = async (id: string, value: string, updated_at: string) => {
	fileRef.doc(id).set(
		{
			value,
			updated_at,
		},
		{ merge: true }
	);
};

/** 指定されたファイルをtrashesへ移動する */
export const trashFile = (id: string) => {
	fileRef
		.doc(id)
		.get()
		.then((doc) => {
			const data = doc.data();
			if (!data) return;
			trashRef.doc(data.id).set(data);
			fileRef.doc(data.id).delete();
		});
};

/** 指定されたファイルをtrashesから完全に削除する */
export const deleteFile = (id: string) => {
	trashRef.doc(id).delete();
};
