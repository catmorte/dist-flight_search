const fs = require('fs');
const filePath = './bookings.json';
let bookByUserID = {};
function saveData() {
  fs.writeFile(filePath, JSON.stringify(bookByUserID, null, 4), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log(`Data written to ${filePath}`);
    }
  });
}

module.exports.save = (id, v) => {
  let record = bookByUserID[id]
  if (!record) {
    record = [v];
  }
  else {
    let ind = record.findIndex((_) =>
      _.rs.Result.RecordNumber == v.rs.Result.RecordNumber
    );
    if (ind >= 0) {
      record[ind] = v
    } else {
      record.push(v)
    }
  }
  bookByUserID[id] = record;
  saveData()
}

module.exports.getByUserID = (id) => {
  return bookByUserID[id];
}

module.exports.loadData = () => {
  try {
    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath, 'utf8');
      bookByUserID = JSON.parse(rawData);
    } else {
      console.error("File does not exist:", filePath);
      return null;
    }
  } catch (err) {
    console.error("Error loading JSON file:", err);
    return null;
  }
}

