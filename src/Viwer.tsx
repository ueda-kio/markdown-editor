import React, { useCallback, useEffect, useState } from 'react';
import MarkdownViewer from './components/Organisms/MarkdownViwer';
import { fetchFileById } from './libs/firebase.operation';
import { useAppDispatch, useFileListSelector } from './reducks/hooks';

const Viwer = () => {
	const dispatch = useAppDispatch();
	const { fileList } = useFileListSelector();
	const [value, setValue] = useState('');

	/** urlの末尾から取得したファイルid */
	const id = (() => {
		const endOfPath = location.pathname.split(/(.*)\//).filter((t) => t !== '')[1];
		if (endOfPath === '') return '';
		return endOfPath;
	})();

	/** urlのidと同じファイルをstateから取得する */
	const getFileById = useCallback(() => {
		const files = fileList.files;
		const target = files.find((file) => file.id === id);
		return target;
	}, [id]);

	// ファイルのvalueをテキストエリアに反映
	useEffect(() => {
		if (id === '') return;
		(async () => {
			const data = (async () => {
				const _data = getFileById(); // stateから取得
				if (_data) return _data;
				return await fetchFileById(id); // stateにない場合firestoreから取得
			})();
			const target = await data;
			if (!target) return;
			setValue(target.value);
		})();
	}, [id]);
	return (
		<>
			<MarkdownViewer markdownText={value} />
		</>
	);
};

export default Viwer;
