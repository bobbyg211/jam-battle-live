export async function requestPersistentStorage() {
  if (navigator.storage?.persist) {
    const isAlready = await navigator.storage.persisted();
    if (isAlready) {
      alert("Persistence granted!");
      return true;
    }

    const granted = await navigator.storage.persist();
    alert(granted ? "Persistence granted!" : "Persistence denied.");
    return granted;
  } else {
    alert("Persistence API not supported.");
    return false;
  }
}
