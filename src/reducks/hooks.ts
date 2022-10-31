import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store/store';
import type { TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useFileListSelector = () => {
	const files = useAppSelector((state: RootState) => state.fileList.files);
	const trashes = useAppSelector((state: RootState) => state.fileList.trashes);
	const archives = useAppSelector((state: RootState) => state.fileList.archives);
	return { files, trashes, archives };
};

export const useIsLoadingSelector = () => {
	const isLoading = useAppSelector((state: RootState) => state.fileList.isLoading);
	return { isLoading };
};

export const useUser = () => {
	const user = useAppSelector((state: RootState) => state.user);
	return { user };
};
