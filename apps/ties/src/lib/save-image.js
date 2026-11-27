/**
 * A picture from a button: downloaded as a file, or with Shift held put on the clipboard.
 * PNG goes on the clipboard as an image everywhere. SVG goes as an image where the browser
 * takes one (Chrome and Edge 124 on) and as its markup in text, so it pastes into an editor,
 * everywhere. The clipboard write starts inside the click, with the picture still being made,
 * which Safari requires.
 */

/** @param {Blob} blob @param {string} name */
export function download(blob, name) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = name;
	a.click();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * @param {Promise<Blob>} picture @param {'image/png' | 'image/svg+xml'} type
 * @returns {Promise<'image' | 'text'>} what went on the clipboard
 */
export async function copyPicture(picture, type) {
	const Item = /** @type {any} */ (globalThis).ClipboardItem;
	if (!Item || !navigator.clipboard?.write) throw new Error('this browser cannot put pictures on the clipboard');
	if (type === 'image/png') {
		await navigator.clipboard.write([new Item({ 'image/png': picture })]);
		return 'image';
	}
	const text = picture.then(async (b) => new Blob([await b.text()], { type: 'text/plain' }));
	const image = Item.supports?.('image/svg+xml') === true;
	await navigator.clipboard.write([new Item(image ? { 'image/svg+xml': picture, 'text/plain': text } : { 'text/plain': text })]);
	return image ? 'image' : 'text';
}

/**
 * A click on a picture button: download `name`, or with Shift put it on the clipboard.
 * @param {MouseEvent} event @param {Promise<Blob>} picture @param {'image/png' | 'image/svg+xml'} type @param {string} name
 * @returns {Promise<'saved' | 'copied' | 'copied as text'>}
 */
export async function savePicture(event, picture, type, name) {
	if (event.shiftKey) return (await copyPicture(picture, type)) === 'image' ? 'copied' : 'copied as text';
	download(await picture, name);
	return 'saved';
}
