const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.LINE_ACCESS_TOKEN;
const axios = require("axios");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.post("/webhook", async (req, res) =>{
  if (req.body.events[0].type === "message") {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + TOKEN,
    };
    const replyToken = req.body.events[0].replyToken
    const text = req.body.events[0].message.text
    axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`)
      .then(async (response) => {
        const wordMeaning = response.data[0].meanings.map((item) => {
          return { text:`${item.partOfSpeech}: ${item.definitions[0].definition}`,type:"text"}
        })
        const dataString = JSON.stringify({
          replyToken,
          messages: wordMeaning
        });
        axios.post(`https://api.line.me/v2/bot/message/reply`,dataString,{headers})
        .then((response) => console.log(response.status===200?"success":"fail"))
        .catch((err) => console.log(err))
      }).catch((err) => {
        const dataString = JSON.stringify({
          replyToken,
          messages: [{
            text: "No Definitions Found",
            type: "text"
          }]
        });
        axios.post(`https://api.line.me/v2/bot/message/reply`,dataString,{headers})
        .then((response) => console.log(`${text}: No Definitions Found`))
        .catch((err) => console.log(err))
      })
  }
});

app.listen(PORT, () => {
  console.log(`App listening at port: ${PORT}`);
});