import React from 'react';
import { css } from '@emotion/react';
import { Box } from '@chakra-ui/react';

const style = {
	wrapper: css`
		width: 100%;
		position: sticky;
		top: 0;
	`,
	title: css`
		font-size: 26px;
		font-family: monospace;
	`,
};

const Header = () => {
	return (
		<Box width="100%" position="sticky" top="0" as="header" boxShadow="base" padding="2">
			<h1 css={style.title}>Markdown Editor App</h1>
		</Box>
	);
};

export default Header;
