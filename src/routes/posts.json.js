import fs from 'fs';
import path from 'path';
import markdown from 'marked';
import { JSDOM } from 'jsdom';

/** getHtmlFromMarkdown(string) - return string of HTML */
const getHtmlFromMarkdown = (markdownText) => {
	const renderer = new markdown.Renderer();

	markdown.setOptions({
		smartLists: true,
		smartypants: true,
	});

	return markdown(markdownText, { renderer });
};

/** getObjectFromRawMarkdown(string) - return {} */
const getObjectFromRawMarkdown = (markdownText = '') => {
	const markdownHeader = markdownText.match(/^([^]*?)(?=---)/)[0];
	// const markdownBody = markdownText.match(/(?<=---)[^]+/)[0];
	const fullHtml = getHtmlFromMarkdown(markdownText);
	const dom = new JSDOM(fullHtml);
	// Get relevant nodes
	const parentNodes = Array.from(dom.window.document.querySelectorAll('body > *'));
	// Get index from first <hr> - seperator
	const sepIndex = parentNodes.findIndex(node => node.outerHTML === '<hr>');
	// Split to nodes for header and body
	const headerNodes = parentNodes.filter((x,i) => i < sepIndex);
	const bodyNodes = parentNodes.filter((x,i) => i > sepIndex);

	// get meta data based on being a markdown list item
	const metaData = markdownHeader.
		split('\n').
		filter(x => x.match(/^\s*-\s*.+:\s*.+/)).
		map(mdLi => {
			let res = {};
			res[mdLi.replace(/-\s*([^:]+)[^]*/, '$1').trim().toLowerCase()] =
				mdLi.replace(/-[^:]+:(.*)/, '$1').trim().split(/\s*,\s*/);
			return res;
		});

	const getTitleAdjacentNodeNotUl = () => {
		return (
			typeof headerNodes[2] !== 'undefined' && !headerNodes[1].outerHTML.match(/^<ul/) ?
			headerNodes[1].innerHTML : undefined
		);
	};

	return {
		title: headerNodes[0].textContent,
		subtitle: getTitleAdjacentNodeNotUl(),
		...metaData,
		excerpt: (
			!headerNodes.slice(-1)[0].outerHTML.match(/^<ul/) ?
				headerNodes.slice(-1)[0].innerHTML : getTitleAdjacentNodeNotUl()
		),
		body: bodyNodes.map(node => node.outerHTML).join(),
	};
};

/** getObjectListFromMdFilesRecursively(string, string, [number=0]) - return [] */
const getObjectListFromMdFilesRecursively = (folder, files, index = 0) => {
	const rawFile = fs.readFileSync(path.resolve(folder, files[index]), 'utf8');
	const res = [getObjectFromRawMarkdown(rawFile)];

	// return if no more files, else iterate recursively
	if (typeof files[index + 1] === 'undefined') return res;
	else return res.concat(getObjectListFromMdFilesRecursively(folder, files, (index + 1)));
};

/** getObjectListFromFolderOfMd(string) - return [] */
const getObjectListFromFolderOfMd = (folder) => {
	try {
		// get all *.md files
		const files = fs.
			readdirSync(folder).
			filter(filename => path.extname(filename) === '.md');

		return getObjectListFromMdFilesRecursively(folder, files);//.
			// sort((a,b) => new Date(b.date) - new Date(a.date));
	} catch (error) {
		console.log(error);
		return [];
	}
};

export async function get(req, res) {
	const data = getObjectListFromFolderOfMd('posts/');

	if (data) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(data));
	} else {
		res.writeHead(404, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ message: `Not found` }));
	}
}
