// indexedDB.js
import { openDB } from "idb";

const dbPromise = openDB("my-database", 1, {
  upgrade(db) {
    // Create impressions store
    const impressionStore = db.createObjectStore("impressions", {
      keyPath: "id",
      autoIncrement: true,
    });
    impressionStore.createIndex("name", "name");

    // Create routes store
    const routeStore = db.createObjectStore("routes", {
      keyPath: "id",
      autoIncrement: true,
    });
    routeStore.createIndex("name", "name");
  },
});

// Impressions CRUD operations
export const addImpression = async (impression) => {
  const db = await dbPromise;
  return db.add("impressions", impression);
};

export const getImpression = async (id) => {
  const db = await dbPromise;
  return db.get("impressions", id);
};

export const getAllImpressions = async () => {
  const db = await dbPromise;
  return db.getAll("impressions");
};

export const findImpressionByName = async (name) => {
  const db = await dbPromise;
  const tx = db.transaction("impressions", "readonly");
  const store = tx.objectStore("impressions");
  const index = store.index("name");
  return index.get(name);
};

export const updateImpression = async (impression) => {
  const db = await dbPromise;
  return db.put("impressions", impression);
};

export const deleteImpression = async (id) => {
  const db = await dbPromise;
  return db.delete("impressions", id);
};

// Route CRUD operations
export const addRoute = async (route) => {
  const db = await dbPromise;
  return db.add("routes", route);
};

export const getRoute = async (id) => {
  const db = await dbPromise;
  return db.get("routes", id);
};

export const getAllRoutes = async () => {
  const db = await dbPromise;
  return db.getAll("routes");
};

export const findRouteByName = async (name) => {
  const db = await dbPromise;
  const tx = db.transaction("routes", "readonly");
  const store = tx.objectStore("routes");
  const index = store.index("name");
  return index.get(name);
};

export const updateRoute = async (route) => {
  const db = await dbPromise;
  return db.put("routes", route);
};

export const deleteRoute = async (id) => {
  const db = await dbPromise;
  return db.delete("routes", id);
};

export const partialUpdateRoute = async (newData) => {
  const db = await dbPromise;
  const tx = db.transaction("routes", "readwrite");
  const store = tx.objectStore("routes");
  await store.put({ ...newData });
  await tx.done;
};
