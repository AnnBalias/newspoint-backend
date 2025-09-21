import type { Feed, FeedItem } from '../../../generated/prisma';

export function transformFeedForList(feed: Feed & { items: FeedItem[] }) {
  return {
    id: feed.id,
    title: feed.title,
    description: feed.description,
    link: feed.link,
    lastBuildDate: feed.lastBuildDate,
    language: feed.language,
    generator: feed.generator,
    category: feed.category,
    imageUrl: feed.imageUrl,
    imageTitle: feed.imageTitle,
    imageLink: feed.imageLink,
    createdAt: feed.createdAt.toISOString(),
    updatedAt: feed.updatedAt.toISOString(),
    itemsCount: feed.items.length,
  };
}

export function transformFeedWithItems(feed: Feed & { items: FeedItem[] }) {
  return {
    id: feed.id,
    title: feed.title,
    description: feed.description,
    link: feed.link,
    lastBuildDate: feed.lastBuildDate,
    language: feed.language,
    generator: feed.generator,
    category: feed.category,
    imageUrl: feed.imageUrl,
    imageTitle: feed.imageTitle,
    imageLink: feed.imageLink,
    createdAt: feed.createdAt.toISOString(),
    updatedAt: feed.updatedAt.toISOString(),
    items: feed.items.map(transformFeedItem),
  };
}

export function transformFeedItem(item: FeedItem) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    link: item.link,
    pubDate: item.pubDate,
    guid: item.guid,
    author: item.author,
    content: item.content,
    imageUrl: item.imageUrl,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    categories: item.categories,
  };
}

