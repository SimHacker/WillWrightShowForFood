// Every route prerenders: each article becomes a real HTML file, server-rendered at
// build time and then hydrated. ssr stays on, or prerender would save empty shells.
export const prerender = true;
export const trailingSlash = 'always';
