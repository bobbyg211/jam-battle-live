import localforage from "localforage";

localforage.config({
  name: "JamBattleLive",
  storeName: "appData",
  description: "Persistent storage for Jam Battle app",
});

export default localforage;
