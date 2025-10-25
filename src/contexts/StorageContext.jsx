import { createContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import localforage from "../utils/storage.js";

const PING_KEY = "JamBattleLive:ping";

const StorageContext = createContext();

function StorageProvider({ children, schema = {}, pingKey = PING_KEY }) {
  const [data, setData] = useState({});
  const dataRef = useRef({}); // <— stable snapshot to diff against
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location); // <— keep latest location for onChange

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  const withDefaults = useCallback(
    (obj) => {
      const next = { ...obj };
      for (const [key, cfg] of Object.entries(schema)) {
        if (cfg && "default" in cfg && !(key in next)) {
          next[key] = typeof cfg.default === "function" ? cfg.default() : cfg.default;
        }
      }
      return next;
    },
    [schema]
  );

  // Stable loadAll (doesn't depend on 'data')
  const loadAll = useCallback(async () => {
    const next = {};
    await localforage.iterate((value, key) => {
      next[key] = value;
    });
    const result = withDefaults(next);

    // Diff against last snapshot (not against 'data' state)
    const prev = dataRef.current;

    for (const [key, cfg] of Object.entries(schema)) {
      if (!cfg?.onChange) continue;
      const prevVal = key in prev ? prev[key] : schema[key]?.default;
      const nextVal = result[key];
      if (prevVal !== nextVal) {
        cfg.onChange(nextVal, {
          navigate,
          location: locationRef.current,
          data: result,
          setData,
        });
      }
    }

    dataRef.current = result; // update snapshot BEFORE setState to avoid races
    setData(result);
  }, [withDefaults, schema, navigate]);

  const isValid = useCallback(
    (key, value) => {
      const cfg = schema[key];
      return cfg?.validate ? !!cfg.validate(value) : true;
    },
    [schema]
  );

  const ping = useCallback(() => {
    localStorage.setItem(pingKey, String(Date.now()));
  }, [pingKey]);

  const setValue = useCallback(
    async (key, value, { silent = false } = {}) => {
      if (!isValid(key, value)) return;

      await localforage.setItem(key, value);

      // optimistic local update
      setData((prev) => {
        const next = { ...prev, [key]: value };
        dataRef.current = next; // keep ref in sync
        return next;
      });

      // local side-effect (e.g., redirect)
      const cfg = schema[key];
      if (cfg?.onChange) {
        cfg.onChange(value, {
          navigate,
          location: locationRef.current,
          data: { ...dataRef.current, [key]: value },
          setData,
        });
      }

      if (!silent) ping();
    },
    [schema, isValid, navigate, ping]
  );

  const setMany = useCallback(
    async (entries, { silent = false } = {}) => {
      const ops = Object.entries(entries).map(([k, v]) =>
        isValid(k, v) ? localforage.setItem(k, v) : null
      );
      await Promise.all(ops);

      setData((prev) => {
        const next = { ...prev, ...entries };
        dataRef.current = next;
        return next;
      });

      for (const [k, v] of Object.entries(entries)) {
        const cfg = schema[k];
        if (cfg?.onChange) {
          cfg.onChange(v, {
            navigate,
            location: locationRef.current,
            data: dataRef.current,
            setData,
          });
        }
      }

      if (!silent) ping();
    },
    [schema, isValid, navigate, ping]
  );

  const removeValue = useCallback(
    async (key, { silent = false } = {}) => {
      await localforage.removeItem(key);
      setData((prev) => {
        const next = { ...prev };
        delete next[key];
        const withDef = withDefaults(next);
        dataRef.current = withDef;
        return withDef;
      });
      if (!silent) ping();
    },
    [withDefaults, ping]
  );

  const clearAll = useCallback(
    async ({ silent = false } = {}) => {
      await localforage.clear();
      const withDef = withDefaults({});
      dataRef.current = withDef;
      setData(withDef);
      if (!silent) ping();
    },
    [withDefaults, ping]
  );

  // Cross-window sync: run once (plus when ping key string changes)
  useEffect(() => {
    loadAll(); // initial
    const handler = (e) => {
      if (e.key === pingKey) loadAll();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [pingKey, loadAll]);

  const getValue = useCallback(
    (key, fallback) => {
      return key in data ? data[key] : fallback ?? schema[key]?.default ?? undefined;
    },
    [data, schema]
  );

  const value = useMemo(
    () => ({
      data,
      getValue,
      setValue,
      setMany,
      removeValue,
      clearAll,
    }),
    [data, getValue, setValue, setMany, removeValue, clearAll]
  );

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
}

export { StorageProvider, StorageContext };
