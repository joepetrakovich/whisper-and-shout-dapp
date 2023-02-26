import { init } from '../serverless.js';

export const handler = init({
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["comfy.png","emerald-certified.png","oasis-logo.png","sapphire-certified.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.5446f18e.mjs","imports":["_app/immutable/entry/start.5446f18e.mjs","_app/immutable/chunks/index.0127cf99.mjs","_app/immutable/chunks/singletons.9243c478.mjs","_app/immutable/chunks/index.53f84939.mjs"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.c0999667.mjs","imports":["_app/immutable/entry/app.c0999667.mjs","_app/immutable/chunks/preload-helper.41c905a7.mjs","_app/immutable/chunks/index.0127cf99.mjs"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('../server/nodes/0.js'),
			() => import('../server/nodes/1.js'),
			() => import('../server/nodes/2.js')
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
});
