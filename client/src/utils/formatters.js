export const processResponseData = (items, subscriptions = []) => {
  const processed = items.map((item) => ({
    id: item.id.videoId || item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.high.url,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    viewCount: item.statistics?.viewCount,
    likeCount: item.statistics?.likeCount,
    fromSubscription: subscriptions.some(
      (sub) => sub.snippet.resourceId.channelId === item.snippet.channelId
    ),
  }));

  return deduplicateAndSort(processed);
};

const deduplicateAndSort = (items) => {
  const seen = new Set();
  return items
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .sort((a, b) => {
      if (a.fromSubscription && !b.fromSubscription) return -1;
      if (!a.fromSubscription && b.fromSubscription) return 1;

      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);
      const viewsA = parseInt(a.viewCount) || 0;
      const viewsB = parseInt(b.viewCount) || 0;

      const scoreA = dateA.getTime() * 0.6 + viewsA * 0.4;
      const scoreB = dateB.getTime() * 0.6 + viewsB * 0.4;

      return scoreB - scoreA;
    });
};
