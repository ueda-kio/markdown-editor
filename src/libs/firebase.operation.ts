import { Dispatch } from '@reduxjs/toolkit';
import { db } from '../firebase';

const fileRef = db.collection('files');
const trashRef = db.collection('trashes');

export const fetchFileList = () => {
	fileRef
		.orderBy('updated_at', 'desc')
		.get()
		.then((snapshots) => {
			console.log('snapshots', snapshots);
			snapshots.forEach((snapshot) => {
				const data = snapshot.data();
				console.log('data', data);
			});
		})
		.catch((e) => console.error(e));
};

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

export const deleteFile = (id: string) => {
	trashRef.doc(id).delete();
};
