export interface RssData {
	rss: Rss;
}

export interface Rss {
	$: GeneratedType;
	channel: Channel;
}

export interface GeneratedType {
	'xmlns:taxo': string;
	'xmlns:rdf': string;
	'xmlns:itunes': string;
	'xmlns:dc': string;
	version: string;
}

export interface Channel {
	title: string;
	link: string;
	description: string;
	lastBuildDate: string;
	image: Image;
	item: Item[];
}

export interface Image {
	url: string;
	title: string;
	link: string;
	width: string;
	height: string;
}

export interface Item {
	title: string;
	description: string;
	link: string;
	category: string[];
	guid: Guid;
	pubDate: string;
}

export interface Guid {
	_: string;
	$: GeneratedType2;
}

export interface GeneratedType2 {
	isPermaLink: string;
}
