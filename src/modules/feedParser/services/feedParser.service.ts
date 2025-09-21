import Parser from 'rss-parser';
import type {
  CustomFeed,
  CustomItem,
  ProcessedFeedData,
  ProcessedFeedItem,
} from '../../../types/rss.types';

export class FeedParserService {
  private parser: Parser<CustomFeed, CustomItem>;

  constructor() {
    this.parser = new Parser({
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      customFields: {
        feed: [
          'title',
          'description',
          'link',
          'lastBuildDate',
          'language',
          'generator',
          'category',
          'image',
        ],
        item: [
          'title',
          'link',
          'pubDate',
          'description',
          'content',
          'contentSnippet',
          'guid',
          'categories',
          'author',
          'enclosure',
        ],
      },
    });
  }

  public isRssUrl(url: string): boolean {
    return [
      '.rss',
      '/rss',
      '.xml',
      '/feed',
      'atom.xml',
      'rss.xml',
      'feed.xml',
      'feed.rss',
      'hnrss.org',
      'feeds.',
    ].some((indicator) => url.toLowerCase().includes(indicator));
  }

  private getDescription(item: CustomItem): string {
    return (
      item.description ||
      item.contentSnippet ||
      item.content ||
      'No description'
    );
  }

  public async parseFeed(url: string): Promise<ProcessedFeedData> {
    const feed = await this.parser.parseURL(url);

    return {
      title: feed.title || 'No title',
      description: feed.description || 'No description',
      link: feed.link || 'No link',
      lastBuildDate: feed.lastBuildDate || new Date().toISOString(),
      language: feed.language || 'Unknown',
      generator: feed.generator || 'Unknown',
      category: feed.category || 'No category',
      image: feed.image
        ? {
            url: feed.image.url || '',
            title: feed.image.title || '',
            link: feed.image.link || '',
          }
        : null,
      items: (feed.items || []).slice(0, 10).map(
        (item: CustomItem): ProcessedFeedItem => ({
          title: item.title || 'No title',
          description: this.getDescription(item),
          link: item.link || 'No link',
          pubDate: item.pubDate || new Date().toISOString(),
          guid: item.guid || item.link || 'No guid',
          categories: item.categories || [],
          author: item.author || 'Unknown',
          image: item.enclosure?.type?.includes('image')
            ? item.enclosure.url
            : null,
          content: item.content || item.contentSnippet || 'No content',
        })
      ),
    };
  }
}
