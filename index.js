const express = require("express");
const path = require("path");
const axios = require("axios");
const cors = require("cors");
const port = 3000;
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "dist")));
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/svg+xml",
];
const disallowedMimeTypes = ["text/html; charset=UTF-8"];
app.use("/api_airline/:id", express.json(), async (req, res, next) => {
  let url =
    "https://static.ws.run/images/airlines/icons/" + req.param("id") + ".png";
  axios({ method: "get", url, responseType: "arraybuffer" })
    .then((response) => {
      const fetchedContentType = response.headers["content-type"];
      if (allowedMimeTypes.includes(fetchedContentType)) {
        res.set("content-type", fetchedContentType);
        res.status(200);
        res.end(response.data, "binary");
      } else {
        res
          .status(502)
          .set("content-type", "text/plain")
          .send(`Invalid content type: ${fetchedContentType}`);
      }
    })
    .catch((error) => {
      const statusCode = error.response && error.response.status;
      res
        .status(statusCode || 500)
        .set("content-type", "text/plain")
        .send(error.message);
    });
});

app.use("/api(/*)?", express.json(), async (req, res, next) => {
  let url = req.originalUrl.replace(/^\/api/, "https://ws.dev.ws.run");
  let data = req.method === "GET" ? req.query : req.body;
  console.log(req.method, url);
  data.Auth = {
    Type: "Application",
    System: "Agent",
    Key: "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE",
    UserIP: "11.22.33.44",
    UserUUID: "",
  };
  console.log(data);
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
  res.send(rs.data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
