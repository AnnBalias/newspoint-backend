export interface CustomFeed {
  title: string;
  description: string;
  link: string;
  lastBuildDate: string;
  language: string;
  generator: string;
  category: string;
  image: {
    url: string;
    title: string;
    link: string;
  };
}

export interface CustomItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content: string;
  contentSnippet: string;
  guid: string;
  categories: string[];
  author: string;
  enclosure: {
    url: string;
    type: string;
  };
}

export interface ProcessedFeedData {
  title: string;
  description: string;
  link: string;
  lastBuildDate: string;
  language: string;
  generator: string;
  category: string;
  image: {
    url: string;
    title: string;
    link: string;
  } | null;
  items: ProcessedFeedItem[];
}

export interface ProcessedFeedItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid: string;
  categories: string[];
  author: string;
  image: string | null;
  content: string;
}
