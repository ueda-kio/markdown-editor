import { Dispatch } from '@reduxjs/toolkit';
import firebase from 'firebase';
import { db } from '../firebase';
import { FileType } from '../reducks/slice/fileListSlice';

const fileRef = db.collection('files');
const trashRef = db.collection('trashes');

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
