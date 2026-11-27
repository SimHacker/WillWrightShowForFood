/**
 * A picture from a button: opened in a new tab, downloaded as a file, or put on the clipboard.
 * PNG goes on the clipboard as an image everywhere. SVG goes as an image where the browser
 * takes one (Chrome and Edge 124 on) and as its markup in text, so it pastes into an editor,
 * everywhere. The clipboard write starts inside the click, which Safari requires.
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
 * A canvas as a PNG, made at once rather than by toBlob's callback, so a click can open it in a
 * tab before the click's permission to open one runs out.
 * @param {HTMLCanvasElement} canvas
 */
export function canvasPng(canvas) {
	const url = canvas.toDataURL('image/png');
	const bytes = Uint8Array.from(atob(url.slice(url.indexOf(',') + 1)), (c) => c.charCodeAt(0));
	return new Blob([bytes], { type: 'image/png' });
}

/**
 * A click on a picture button: open it in a new tab, with Shift put it on the clipboard, with
 * Option (Alt) download `name`. The tab is opened with the picture's URL inside the click,
 * since some browsers (Cursor's among them) hand back no window to point at it afterwards.
 * The URL is not revoked, so the tab can still be saved or reloaded while this page is open.
 * @param {MouseEvent} event @param {Blob} picture @param {'image/png' | 'image/svg+xml'} type @param {string} name
 * @returns {Promise<'opened' | 'saved' | 'copied' | 'copied as text'>}
 */
export async function savePicture(event, picture, type, name) {
	if (event.shiftKey) return (await copyPicture(Promise.resolve(picture), type)) === 'image' ? 'copied' : 'copied as text';
	if (event.altKey) {
		download(picture, name);
		return 'saved';
	}
	window.open(URL.createObjectURL(picture), '_blank');
	return 'opened';
}
