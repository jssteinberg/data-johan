// get all posts
// iterate over
// return json: title, subtitle, author, tags, edited, content, ...
import fs from 'fs';
import path from 'path';
import marked from 'marked';

marked.setOptions({
	smartLists: true,
	smartypants: true,
});

const renderer = new marked.Renderer();
const getJsonFromFolder = (contentFolder) => {
	try {
		// get all *.md files
		const files = fs.
			readdirSync(contentFolder).
			filter(filename => path.extname(filename) === '.md');
		// create json for one file/post at a time, recursively
		const getJsonFromFiles = (files, index = 0) => {
			const rawFile = fs.readFileSync(path.resolve(contentFolder, files[index]), 'utf8');
			const mdContent = marked(rawFile);
			const fullHtml = marked(rawFile, { renderer });
			// extract title, subtitle, author, tags, edited
			// extract ending json
			const res = [{
				html: fullHtml,
			}];

			// return if no more files, else iterate recursively
			if (typeof files[index + 1] === 'undefined') return res;
			else return res.concat(getJsonFromFiles(files, (index + 1)));
		};

		return getJsonFromFiles(files);//.
			// sort((a,b) => new Date(b.date) - new Date(a.date));
	} catch (error) {
		console.log(error);
		return [];
	}
};

export async function get(req, res) {
	const data = getJsonFromFolder('posts/');

	if (data) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(data));
	} else {
		res.writeHead(404, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ message: `Not found` }));
	}
}
