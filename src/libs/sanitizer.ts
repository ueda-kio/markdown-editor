import DOMPurify from 'dompurify';
import { marked } from 'marked';

// dangerouslySetInnerHTMLに代入する変数の型.
type InnerHTML = {
	__html: string;
};

// 出力されるanchorタグにtarget属性とrel属性を付与.
const renderer = new marked.Renderer();
renderer.link = (href, _, text) => {
	return `<a rel="noopener" target="_blank" href="${href}">${text}</a>`;
};

export const convertMarkdownToHTML = (markdownText: string): InnerHTML => {
	// マークダウン記法のテキストをHTMLの文字列に変換.
	const markedText = marked(markdownText, {
		silent: true,
		breaks: true,
		renderer,
	});

	const htmlText = DOMPurify.sanitize(markedText, { USE_PROFILES: { html: true } });
	return { __html: htmlText };
};
