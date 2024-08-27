const express = require("express");
const express = require("express");
const path = require("path");
const axios = require("axios");
const cors = require("cors");
const processors = require("./processors");
const history = require("./inmems/history");
const locations = require("./inmems/locations");
const port = 3000;
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "dist")));

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use("/api/history/:id", express.json(), async (req, res, next) => {
  let result = [];
  let keys = history.keys(req.param("id"));
  if (keys.length == 0) {
    keys = ["IST", "MOW", "LED", "AER"];
  }
  keys.forEach((k) => result.push(locations.getByCode(k)));
  res.status(200).set("content-type", "application/json").send(result);
});

app.use("/raw(/*)?", express.json(), async (req, res, next) => {
  let url = req.originalUrl.replace(/^\/raw/, "https://ws.dev.ws.run");
  let data = req.method === "GET" ? req.query : req.body;
  try {
    data.Auth = {
      Type: "Application",
      System: "Agent",
      Key: "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE",
      UserIP: "11.22.33.44",
      UserUUID: "",
    };
    const tg = data.Telegram;
    data.Telegram = undefined;
    let rs = await axios({
      method: req.method,
      url: url,
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });
    res.status(rs.status);
    res.set(rs.headers);
    let p = processors[data.Method];
    if (p) {
      data.Telegram = tg;
      p(data, rs.data);
    }
    res.send(rs.data);
  } catch (error) {
    const statusCode = error.response && error.response.status;
    res
      .status(statusCode || 500)
      .set("content-type", "text/plain")
      .send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
