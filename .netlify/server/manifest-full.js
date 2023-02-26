export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["comfy.png","emerald-certified.png","oasis-logo.png","sapphire-certified.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.6e3ac3b9.mjs","imports":["_app/immutable/entry/start.6e3ac3b9.mjs","_app/immutable/chunks/index.0127cf99.mjs","_app/immutable/chunks/singletons.5f948a91.mjs","_app/immutable/chunks/index.53f84939.mjs"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.0581932f.mjs","imports":["_app/immutable/entry/app.0581932f.mjs","_app/immutable/chunks/preload-helper.41c905a7.mjs","_app/immutable/chunks/index.0127cf99.mjs"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
