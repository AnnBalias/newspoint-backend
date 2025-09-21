import type { PrismaClient } from '../../../generated/prisma';
import type {
  ProcessedFeedData,
  ProcessedFeedItem,
} from '../../../types/rss.types';

export class DatabaseService {
  constructor(private prisma: PrismaClient) {}

  async saveFeedData(feedData: ProcessedFeedData): Promise<void> {
    try {
      const existingFeed = await this.prisma.feed.findUnique({
        where: { link: feedData.link },
      });

      if (existingFeed) {
        await this.prisma.feed.update({
          where: { id: existingFeed.id },
          data: {
            title: feedData.title,
            description: feedData.description,
            lastBuildDate: feedData.lastBuildDate,
            language: feedData.language,
            generator: feedData.generator,
            category: feedData.category,
            imageUrl: feedData.image?.url || null,
            imageTitle: feedData.image?.title || null,
            imageLink: feedData.image?.link || null,
            updatedAt: new Date(),
          },
        });

        await this.prisma.feedItem.deleteMany({
          where: { feedId: existingFeed.id },
        });
      } else {
        const newFeed = await this.prisma.feed.create({
          data: {
            title: feedData.title,
            description: feedData.description,
            link: feedData.link,
            lastBuildDate: feedData.lastBuildDate,
            language: feedData.language,
            generator: feedData.generator,
            category: feedData.category,
            imageUrl: feedData.image?.url || null,
            imageTitle: feedData.image?.title || null,
            imageLink: feedData.image?.link || null,
          },
        });

        await this.saveFeedItems(newFeed.id, feedData.items);
        return;
      }

      await this.saveFeedItems(existingFeed.id, feedData.items);
    } catch (error) {
      throw new Error(
        `Failed to save feed data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async saveFeedItems(
    feedId: string,
    items: ProcessedFeedItem[]
  ): Promise<void> {
    for (const item of items) {
      try {
        const feedItem = await this.prisma.feedItem.upsert({
          where: { link: item.link },
          update: {
            title: item.title,
            description: item.description,
            pubDate: item.pubDate,
            guid: item.guid,
            author: item.author,
            content: item.content,
            imageUrl: item.image,
            updatedAt: new Date(),
          },
          create: {
            title: item.title,
            description: item.description,
            link: item.link,
            pubDate: item.pubDate,
            guid: item.guid,
            author: item.author,
            content: item.content,
            imageUrl: item.image,
            feedId: feedId,
          },
        });

        if (item.categories && item.categories.length > 0) {
          await this.saveItemCategories(feedItem.id, item.categories);
        }
      } catch (error) {
        console.error(`Failed to save feed item ${item.title}:`, error);
      }
    }
  }

  private async saveItemCategories(
    feedItemId: string,
    categories: string[]
  ): Promise<void> {
    try {
      await this.prisma.feedItem.update({
        where: { id: feedItemId },
        data: { categories: categories },
      });
    } catch (error) {
      console.error(`Failed to save categories for item ${feedItemId}:`, error);
    }
  }

  async getAllFeeds() {
    return await this.prisma.feed.findMany({
      include: {
        items: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async getFeedById(id: string) {
    return await this.prisma.feed.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async getFeedByUrl(url: string) {
    return await this.prisma.feed.findUnique({
      where: { link: url },
      include: {
        items: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }
}
