import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { css } from '@emotion/react';

const style = {
	link: css`
		display: block;
		padding: 1rem;
		line-height: 1.5;
	`,
};

const Cassette = () => {
	return (
		<Box rounded="md" boxShadow="base" cursor="pointer" transition="box-shadow 0.3s" _hover={{ boxShadow: 'md' }}>
			<Link to="/editor/" css={style.link}>
				<Text fontSize="lg">test</Text>
			</Link>
		</Box>
	);
};

export default Cassette;
