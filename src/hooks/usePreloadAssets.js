import { useEffect, useState, useRef, useCallback } from "react";
import localforage from "localforage";

// Import all static assets from /src/assets
const allAssets = import.meta.glob("../assets/**/*.{png,jpg,jpeg,webp,wav,mp3,ogg}", {
  eager: true,
  import: "default",
});

export function usePreloadAssets({ parallel = true } = {}) {
  const [ready, setReady] = useState(false);
  const [assets, setAssets] = useState({});
  const activeBlobURLs = useRef([]);

  // Helper to revoke previous blob URLs
  const revokeBlobs = () => {
    activeBlobURLs.current.forEach(URL.revokeObjectURL);
    activeBlobURLs.current = [];
  };

  const refreshAssets = useCallback(async () => {
    const urls = [];
    const combinedAssets = {};

    // Static assets
    for (const [key, url] of Object.entries(allAssets)) {
      const name = key.replace("../assets/", "");
      combinedAssets[name] = url;
      urls.push(url);
    }

    // Clear old blob URLs
    revokeBlobs();

    // Dynamic assets from localForage
    const keys = await localforage.keys();
    for (const key of keys) {
      const data = await localforage.getItem(key);
      if (!data) continue;

      if (key === "stage" && data.image instanceof Blob) {
        const url = URL.createObjectURL(data.image);
        combinedAssets.stage = url;
        activeBlobURLs.current.push(url);
        urls.push(url);
      }

      if (key.startsWith("match_")) {
        ["player1", "player2"].forEach((playerKey) => {
          const player = data[playerKey];
          if (!player) return;

          if (player.avatar instanceof Blob) {
            const avatarURL = URL.createObjectURL(player.avatar);
            combinedAssets[`${key}_${playerKey}_avatar`] = avatarURL;
            activeBlobURLs.current.push(avatarURL);
            urls.push(avatarURL);
          }

          if (player.introSong instanceof Blob) {
            const songURL = URL.createObjectURL(player.introSong);
            combinedAssets[`${key}_${playerKey}_song`] = songURL;
            activeBlobURLs.current.push(songURL);
            urls.push(songURL);
          }
        });
      }
    }

    // Preload helper functions
    const loadImage = async (url) => {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        await createImageBitmap(blob);
      } catch (err) {
        console.error("Failed to preload image:", url, err);
      }
    };

    const loadAudio = async (url) => {
      try {
        const audio = new Audio(url);
        audio.preload = "auto";
        await audio.play().catch(() => {});
        audio.pause();
        audio.currentTime = 0;
      } catch (err) {
        console.error("Failed to preload audio:", url, err);
      }
    };

    const imageURLs = urls.filter((u) => /\.(png|jpe?g|webp)$/i.test(u));
    const audioURLs = urls.filter((u) => /\.(wav|mp3|ogg)$/i.test(u));

    if (parallel) {
      await Promise.allSettled([...imageURLs.map(loadImage), ...audioURLs.map(loadAudio)]);
    } else {
      for (const url of imageURLs) await loadImage(url);
      for (const url of audioURLs) await loadAudio(url);
    }

    setAssets(combinedAssets);
  }, [parallel]);

  useEffect(() => {
    refreshAssets().then(() => setReady(true));
    return () => revokeBlobs(); // Clean up blobs on unmount
  }, [refreshAssets]);

  return { ready, assets, refreshAssets };
}
