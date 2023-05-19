import { parseStringPromise } from 'xml2js';
import { Item, RssData } from './types';
import { isToday } from 'date-fns';

// import raw from './sample';

interface Env {
	GUIDS: KVNamespace;
}

const COUNTRIES = ['UK'];
const PIS = ['PI4'];

async function get_pis(env: Env) {
	const response = await fetch('https://rpilocator.com/feed/');
	const raw = await response.text();

	const data: RssData = await parseStringPromise(raw, {
		explicitArray: false,
	});

	const meta_filtered = data.rss.channel.item
		.filter((pi) => pi.category.some((c) => PIS.includes(c)))
		.filter((pi) => pi.category.some((c) => COUNTRIES.includes(c)))
		.filter((pi) => isToday(new Date(pi.pubDate)));

	const filtered: Item[] = [];

	for (const pi of meta_filtered) {
		const GUID = pi.guid._;

		if (!(await env.GUIDS.get(GUID))) {
			filtered.push(pi);
			await env.GUIDS.put(GUID, GUID);
		}
	}

	return filtered;
}

export default {
	// async fetch(request: Request, env: Env, ctx: ExecutionContext) {
	// 	const url = new URL(request.url);

	// 	if (url.pathname == '/') {
	// 		const pis = await get_pis(env);

	// 		return new Response(JSON.stringify(pis), {
	// 			headers: {
	// 				'content-type': 'application/json',
	// 			},
	// 		});
	// 	}

	// 	return new Response('Not Found', { status: 404 });
	// },
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
		const pis = await get_pis(env);

		for (const pi of pis) {
			await fetch('https://webhook.willow.sh', {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					Status: 'PI Alert',
					Link: pi.link[0],
					Title: pi.title[0],
					Categories: pi.category.join(', '),
					Date: pi.pubDate,
				}),
			});
		}
	},
};