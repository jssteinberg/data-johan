import getObjectListFromFolderOfMd from '../utils/getMdPosts.js';

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
