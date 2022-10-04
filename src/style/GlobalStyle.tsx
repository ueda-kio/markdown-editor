import emotionReset from 'emotion-reset';
import { Global, css } from '@emotion/react';

const resetStyle = css`
	/*
	Josh's Custom CSS Reset
	https://www.joshwcomeau.com/css/custom-css-reset/
	*/
	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}
	* {
		margin: 0;
	}
	html,
	body {
		height: 100%;
	}
	body {
		line-height: 1.5;
	}
	img,
	picture,
	video,
	canvas,
	svg {
		display: block;
		max-width: 100%;
	}
	input,
	button,
	textarea,
	select {
		font: inherit;
	}
	p,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		overflow-wrap: break-word;
	}
	#root,
	#__next {
		isolation: isolate;
	}
`;

const baseStyle = css`
	html {
		/* font-size: 62.5%; */
	}

	body {
		font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Arial, sans-serif;
		/* font-size: 1.4rem; */
		background-color: #f6f6f6;
	}
`;

const GlobalStyle = () => <Global styles={[emotionReset, resetStyle, baseStyle]} />;

export default GlobalStyle;
