const { save } = require("../../inmems/booking");
const { getByUserID } = require("../../inmems/flight_info");
module.exports.handle = function (rq, rs, rqRaw, rsRaw) {
  if (rs.Result.Status == "Book-Error") return;
  if (rqRaw.originalUrl.includes("ancillary")) {
    return
  }
  const flightInfos = getByUserID(rq.Telegram.UserID);
  const info = flightInfos.find((v) => {
    return v.rs.Result.ID == rq.Body.ID
  })
  save(rq.Telegram.UserID, { rq, rs, info: info.rs });
};
