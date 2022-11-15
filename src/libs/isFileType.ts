import { DocumentData } from 'firebase/firestore';
import { FileType } from '../reducks/slice/fileListSlice';

/** FileTypeへ絞り込みを行うユーザー定義型ガード */
const isFileType = (data: DocumentData): data is FileType => {
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

export default isFileType;
