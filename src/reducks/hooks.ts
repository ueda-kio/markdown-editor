import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store/store';
import type { TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useFileListSelector = () => {
	const fileList = useAppSelector((state: RootState) => state.fileList);
	return { fileList };
};

export const useFilesSelector = () => {
	const files = useAppSelector((state: RootState) => state.fileList.files);
	return { files };
};

export const useTrashesSelector = () => {
	const trashes = useAppSelector((state: RootState) => state.fileList.trashes);
	return { trashes };
};

export const useIsLoadingSelector = () => {
	const isLoading = useAppSelector((state: RootState) => state.fileList.isLoading);
	return { isLoading };
};

export const useUser = () => {
	const user = useAppSelector((state: RootState) => state.user);
	return { user };
};
