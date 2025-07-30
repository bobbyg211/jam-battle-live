import { useEffect, useState } from "react";

// Import *all* static assets (images + audio) recursively from /src/assets
const allAssets = import.meta.glob("../assets/**/*.{png,jpg,jpeg,webp,wav,mp3,ogg}", {
  eager: true,
  import: "default",
});

export function usePreloadAssets({ parallel = true } = {}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const preload = async () => {
      const urls = Object.values(allAssets);

      // Helper to preload and decode images
      const loadImage = async (url) => {
        const res = await fetch(url);
        const blob = await res.blob();
        try {
          await createImageBitmap(blob); // decode into GPU memory
        } catch {
          // Some browsers may not support ImageBitmap for all formats (skip silently)
        }
      };

      // Helper to preload audio
      const loadAudio = async (url) => {
        try {
          const audio = new Audio(url);
          audio.preload = "auto";
          // Trigger a tiny load by playing muted for a moment (so it caches)
          await audio.play().catch(() => {});
          audio.pause();
          audio.currentTime = 0;
        } catch (err) {
          console.warn("Failed to preload audio:", url, err);
        }
      };

      // Separate image vs audio
      const imageURLs = urls.filter((u) => /\.(png|jpe?g|webp)$/i.test(u));
      const audioURLs = urls.filter((u) => /\.(wav|mp3|ogg)$/i.test(u));

      if (parallel) {
        // Load everything in parallel (faster but more bandwidth up front)
        await Promise.allSettled([...imageURLs.map(loadImage), ...audioURLs.map(loadAudio)]);
      } else {
        // Load sequentially (slower, but less bandwidth spike)
        for (const url of imageURLs) await loadImage(url);
        for (const url of audioURLs) await loadAudio(url);
      }

      setReady(true);
    };

    preload();
  }, [parallel]);

  return ready;
}
