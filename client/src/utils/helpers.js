// Pluralizes word
export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

// IDB promise func
export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {

    // Open db connection
    const request = window.indexedDB.open('shop-shop', 1);

    // Initialize vars
    let db, tx, store;

    // If database needs an updateo or doesn't exist then create new DB
    request.onupgradeneeded = function(e) {
      const db = request.result;

      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    // If error log error
    request.onerror = function(e) {
      console.log('There was an error', e);
    };

    // On db request success, then store transaction and objectstore data
    request.onsuccess = function(e) {
      db = request.result;

      tx = db.transaction(storeName, 'readwrite');
      store = tx.objectStore(storeName);

      db.onerror = function(e) {
        console.log('error', e);
      };

      // Methods to interact with DB
      // Resolves promise after updating DB
      switch (method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }

      // On completion of transaction close db connection
      tx.oncomplete = function() {
        db.close();
      };
    };
  });
}