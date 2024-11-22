const { save } = require("../../inmems/flight_info");
module.exports.handle = function (rq, rs, rqRaw, rsRaw) {
  save(rq.Telegram.UserID, { rq, rs });
};
