import { api } from '../../services/api';

let intervalId: ReturnType<typeof setInterval> | null = null;
let bannerVisible = false;
let lastSeenPostId: string | null = null;

export function subscribeToFeedUpdates(getFeedPostIds: () => string[], onNewPosts: () => void, interval = 10000) {
  if (intervalId) {return;}
  lastSeenPostId = getFeedPostIds()[0] || null;
  intervalId = setInterval(async () => {
    if (bannerVisible) {return;}
    const feedPostIds = new Set(getFeedPostIds());
    const posts = await api.getPosts(1);
    const latestId = posts.length ? (posts[0].id || posts[0]._id) : null;
    // Debug logs
    console.log('[Polling] Feed post IDs:', Array.from(feedPostIds));
    console.log('[Polling] lastSeenPostId:', lastSeenPostId);
    console.log('[Polling] Latest post ID from API:', latestId);
    if (posts.length && latestId && !feedPostIds.has(latestId) && latestId !== lastSeenPostId) {
      console.log('[Polling] New post detected, showing banner.');
      onNewPosts();
      bannerVisible = true;
    }
  }, interval);
}

export function notifyBannerDismissed(getFeedPostIds: () => string[]) {
  bannerVisible = false;
  lastSeenPostId = getFeedPostIds()[0] || null;
}

export function unsubscribeFromFeedUpdates() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  bannerVisible = false;
  lastSeenPostId = null;
} 