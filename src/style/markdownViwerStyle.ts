import { css } from '@emotion/react';

export const markdownViwerStyle = css`
	& > * + :where(h1, h2, h3, h4, h5) {
		margin-top: 4rem;
	}
	h1,
	h2,
	h3,
	h4,
	h5 {
		margin-bottom: 2.4rem;
	}
	h1 {
		font-size: 1.8rem;
		font-weight: bold;
		border-bottom: 1px solid var(--chakra-colors-chakra-border-color);
	}
	h2 {
		font-size: 1.6rem;
		font-weight: bold;
		border-bottom: 1px solid var(--chakra-colors-chakra-border-color);
	}
	h3 {
		font-size: 1.4rem;
		font-weight: bold;
	}
	h4 {
		font-size: 1.2rem;
		font-weight: bold;
	}
	h5 {
		font-size: 1rem;
		font-weight: bold;
	}
	p {
		line-height: 1.8;
		& + p {
			margin-top: 1.5rem;
		}
	}
	ul,
	ol {
		padding-left: 1.5rem;
		margin: 1.2rem 0;
		line-height: 1.9;
	}
	ul {
		list-style-type: disc;

		& ul {
			list-style-type: circle;
			margin: 0;
			& ul {
				list-style-type: square;
			}
		}
	}
	ol {
		list-style-type: decimal;
		& ul {
			margin: 0;
		}
	}
	em {
		font-weight: bold;
	}
	pre {
		margin: 1.5rem 0;
		padding: 1rem;
		background-color: #364549;
		color: #e3e3e3;
	}
	& :not(pre) > code {
		background-color: #364549;
		color: #e3e3e3;
		padding: 0.1em 0.4em;
	}
	code {
		font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
	}
	a {
		color: #3683bf;
		&:hover {
			text-decoration: underline;
		}
		&:visited {
			color: #6200ac;
		}
	}
	blockquote {
		border-left: 5px solid #ddd;
		color: #777;
		padding: 0.8rem;
		padding-right: 0;
		margin: 1.5rem 0;
	}
`;
