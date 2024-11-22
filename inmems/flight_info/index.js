const fs = require('fs');
const filePath = './flight_info.json';
let flightInfoByUserID = {};
function saveData() {
  fs.writeFile(filePath, JSON.stringify(flightInfoByUserID, null, 4), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log(`Data written to ${filePath}`);
    }
  });
}

module.exports.save = (id, v) => {
  let record = flightInfoByUserID[id]
  if (!record) record = [v];
  else record.push(v)
  flightInfoByUserID[id] = record;
  saveData()
}
module.exports.getByUserID = (id) => {
  return flightInfoByUserID[id];
}

module.exports.loadData = () => {
  try {
    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath, 'utf8');
      flightInfoByUserID = JSON.parse(rawData);
    } else {
      console.error("File does not exist:", filePath);
      return null;
    }
  } catch (err) {
    console.error("Error loading JSON file:", err);
    return null;
  }
}

