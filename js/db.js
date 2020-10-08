const dbPromised = idb.open("EPL:info", 1, function(upgradeDb) {
  const matchScheduleObjectStore = upgradeDb.createObjectStore("matchSchedule", {
    keyPath: "matchId"
  });
  matchScheduleObjectStore.createIndex("utcDate", "utcDate", { unique: false });
});

async function dbSaveScheduleForLater(matchSchedule) {
  const resultSaved = await (async function() {
    try {
      const db = await dbPromised;
      const transaction = db.transaction('matchSchedule', 'readwrite');
      const store = transaction.objectStore('matchSchedule');
      store.add(matchSchedule);
      console.log('DB: Match schedule successfully saved.');
      return transaction.complete;
    } catch(e) {
      console.log('Error :' + e);
    }
  })();

  return resultSaved;
}

async function dbUnsaveMatchSchedule(matchId) {
  const resultDeleted = await (async function() {
    try {
      const db = await dbPromised;
      const transaction = db.transaction('matchSchedule', 'readwrite');
      const store = transaction.objectStore('matchSchedule');
      store.delete(matchId);
      console.log('DB: Match schedule succesfully deleted');
      return transaction.complete;
    } catch(e) {
      console.log('Error :' + e);
    }
  })();

  return resultDeleted;
}

async function dbGetAllSavedSchedule() {
  const resultSchedule = await (async function() {
    try {
      const db = await dbPromised;
      const transaction = db.transaction("matchSchedule", "readonly");
      const store = transaction.objectStore("matchSchedule");
      return store.getAll();
    } catch(e) {
      console.log('Error :' + e);
    }
  })();

  return resultSchedule;
}

export default {dbPromised, dbSaveScheduleForLater, dbUnsaveMatchSchedule, dbGetAllSavedSchedule};