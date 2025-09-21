import Parser from 'rss-parser';
import type {
  CustomFeed,
  CustomItem,
  ProcessedFeedData,
  ProcessedFeedItem,
} from '../../../types/rss.types';
import type { DatabaseService } from './database.service';

export class FeedParserService {
  private parser: Parser<CustomFeed, CustomItem>;
  private databaseService?: DatabaseService;

  constructor(databaseService?: DatabaseService) {
    this.databaseService = databaseService;
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

    const processedData: ProcessedFeedData = {
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

    if (this.databaseService) {
      try {
        await this.databaseService.saveFeedData(processedData);
      } catch (error) {
        console.error('Failed to save feed data to database:', error);
      }
    }

    return processedData;
  }

  public async getFeedData(url: string, force: boolean = false): Promise<ProcessedFeedData> {
    if (force) {
      return await this.parseFeed(url);
    }

    if (this.databaseService) {
      try {
        const existingFeed = await this.databaseService.getFeedByUrl(url);
        if (existingFeed) {
          return {
            title: existingFeed.title,
            description: existingFeed.description || 'No description',
            link: existingFeed.link,
            lastBuildDate: existingFeed.lastBuildDate || new Date().toISOString(),
            language: existingFeed.language || 'Unknown',
            generator: existingFeed.generator || 'Unknown',
            category: existingFeed.category || 'No category',
            image: existingFeed.imageUrl
              ? {
                  url: existingFeed.imageUrl,
                  title: existingFeed.imageTitle || '',
                  link: existingFeed.imageLink || '',
                }
              : null,
            items: existingFeed.items.map((item) => ({
              title: item.title,
              description: item.description || 'No description',
              link: item.link,
              pubDate: item.pubDate || new Date().toISOString(),
              guid: item.guid || item.link,
              categories: item.categories,
              author: item.author || 'Unknown',
              image: item.imageUrl,
              content: item.content || 'No content',
            })),
          };
        }
      } catch (error) {
        console.error('Failed to check database for existing feed:', error);
      }
    }

    return await this.parseFeed(url);
  }
}
