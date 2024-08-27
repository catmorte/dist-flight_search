const ExpiryMap = require("expiry-map");
const history = new ExpiryMap(172800000, []);
module.exports.save = (id, v) => {
  let historyRecord = history.get("" + id);
  if (!historyRecord) {
    historyRecord = new ExpiryMap(172800000, []);
  }
  historyRecord.set(v, Date.now());
  history.set("" + id, historyRecord);
};
module.exports.keys = (id) => {
  const record = history.get(id);
  if (record) {
    let result = [];
    for (const k of record.keys()) {
      result.push(k);
    }
    return result;
  }
  return [];
};
