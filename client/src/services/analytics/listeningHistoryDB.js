// src/services/analytics/listeningHistoryDB.js
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("SynkDAnalytics", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object stores for our data
      if (!db.objectStoreNames.contains("playHistory")) {
        const playHistoryStore = db.createObjectStore("playHistory", {
          keyPath: "id",
          autoIncrement: true,
        });
        playHistoryStore.createIndex("videoId", "videoId", { unique: false });
        playHistoryStore.createIndex("playlistId", "playlistId", {
          unique: false,
        });
        playHistoryStore.createIndex("timestamp", "timestamp", {
          unique: false,
        });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject("IndexedDB error: " + event.target.errorCode);
    };
  });
};

export const recordPlay = async (videoId, playlistId, videoTitle, duration) => {
  try {
    const db = await initDB();
    const transaction = db.transaction(["playHistory"], "readwrite");
    const store = transaction.objectStore("playHistory");

    const playRecord = {
      videoId,
      playlistId,
      videoTitle,
      duration,
      timestamp: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const request = store.add(playRecord);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error recording play:", error);
    return false;
  }
};

export const getPlaylistHistory = async (playlistId) => {
  try {
    const db = await initDB();
    const transaction = db.transaction(["playHistory"], "readonly");
    const store = transaction.objectStore("playHistory");
    const index = store.index("playlistId");

    return new Promise((resolve, reject) => {
      const request = index.getAll(playlistId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error getting playlist history:", error);
    return [];
  }
};

export const getVideoPlayCount = async (videoId) => {
  try {
    const db = await initDB();
    const transaction = db.transaction(["playHistory"], "readonly");
    const store = transaction.objectStore("playHistory");
    const index = store.index("videoId");

    return new Promise((resolve, reject) => {
      const request = index.getAll(videoId);

      request.onsuccess = () => resolve(request.result.length);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error getting video play count:", error);
    return 0;
  }
};

export const getPlaylistStats = async (playlistId) => {
  try {
    const history = await getPlaylistHistory(playlistId);

    // Group by videoId
    const videoStats = history.reduce((acc, record) => {
      if (!acc[record.videoId]) {
        acc[record.videoId] = {
          videoId: record.videoId,
          title: record.videoTitle,
          playCount: 0,
          lastPlayed: null,
        };
      }

      acc[record.videoId].playCount++;

      const recordDate = new Date(record.timestamp);
      if (
        !acc[record.videoId].lastPlayed ||
        recordDate > new Date(acc[record.videoId].lastPlayed)
      ) {
        acc[record.videoId].lastPlayed = record.timestamp;
      }

      return acc;
    }, {});

    return Object.values(videoStats);
  } catch (error) {
    console.error("Error getting playlist stats:", error);
    return [];
  }
};
