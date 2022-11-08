import { ListType, listTypeArray } from '../reducks/slice/fileListSlice';

export const isListType = (str: string): str is ListType => listTypeArray.some((elm) => elm === str);
