import { createContext, useState, useEffect, useCallback } from "react";
import localforage from "localforage";

// Static import
const allAssets = import.meta.glob("../assets/**/*.{png,jpg,jpeg,webp,wav,mp3,ogg}", {
  eager: true,
  import: "default",
});

const AssetsContext = createContext({
  assets: {},
  ready: false,
  refreshAssets: () => {},
});

const AssetsProvider = ({ children }) => {
  const [assets, setAssets] = useState({});
  const [ready, setReady] = useState(false);

  const preload = useCallback(async () => {
    const urls = [];
    const combinedAssets = {};

    // Static assets
    for (const [key, url] of Object.entries(allAssets)) {
      const name = key.replace("../assets/", "");
      combinedAssets[name] = url;
      urls.push(url);
    }

    const keys = await localforage.keys();
    for (const key of keys) {
      const data = await localforage.getItem(key);
      if (!data) continue;

      if (key === "stage" && data.image instanceof Blob) {
        const url = URL.createObjectURL(data.image);
        combinedAssets.stage = url;
        urls.push(url);
      }

      if (key.startsWith("match_")) {
        ["player1", "player2"].forEach((playerKey) => {
          const player = data[playerKey];
          if (!player) return;

          if (player.avatar instanceof Blob) {
            const avatarURL = URL.createObjectURL(player.avatar);
            combinedAssets[`${key}_${playerKey}_avatar`] = avatarURL;
            urls.push(avatarURL);
          }

          if (player.introSong instanceof Blob) {
            const songURL = URL.createObjectURL(player.introSong);
            combinedAssets[`${key}_${playerKey}_song`] = songURL;
            urls.push(songURL);
          }
        });
      }
    }

    setAssets(combinedAssets);
    setReady(true);
  }, []);

  useEffect(() => {
    preload();
  }, [preload]);

  return (
    <AssetsContext.Provider value={{ assets, ready, refreshAssets: preload }}>
      {children}
    </AssetsContext.Provider>
  );
};

export { AssetsContext, AssetsProvider };
