const { save } = require("../../inmems/history");
module.exports.handle = function (rq, rs, rqRaw, rsRaw) {
  if (rq.Body && rq.Body.Routes && rq.Body.Routes.length > 0 && rq.Telegram) {
    const route = rq.Body.Routes[0];
    save(rq.Telegram.UserID, route.Departure);
    save(rq.Telegram.UserID, route.Arrival);
  }
};
