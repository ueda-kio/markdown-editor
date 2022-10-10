import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { css } from '@emotion/react';
import { FileType } from '../../reducks/slice/fileListSlice';

const style = {
	link: css`
		display: block;
		padding: 1rem;
		line-height: 1.5;
	`,
};

type Props = {
	file: FileType;
};

const Cassette: React.FC<Props> = ({ file }) => {
	const { id } = file;
	return (
		<Box rounded="md" boxShadow="base" cursor="pointer" transition="box-shadow 0.3s" _hover={{ boxShadow: 'md' }}>
			<Link to={`/editor/${id}`} css={style.link}>
				<Text fontSize="lg">{id}</Text>
			</Link>
		</Box>
	);
};

export default Cassette;
