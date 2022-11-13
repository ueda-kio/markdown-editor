import { ColorMode, colorModeType } from '../hooks/useCustomColorMode';

const IsColorModeType = (str: string): str is ColorMode => colorModeType.some((el) => el === str);

export default IsColorModeType;
