const express = require('express')
const app = express()
const http = require('http').createServer(app)
const nodemailer = require("nodemailer")
const port = 5001
require('dotenv').config()

import * as languages from './locales'

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'POST')
  // res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

const languageZones = ['tw', 'hk', 'cn', 'sg']
app.post('/getLocale', (req, res) => {
  const { locale } = req.body
  const zone = locale.split('-')[1] || 'en'
  if (languageZones.includes(zone.toLowerCase())) {
    if (locale === 'zh-tw' || locale === 'zh-hk') {
      res.send({ message: languages.zh.tradtional_Chinese })
    } else if (locale === 'zh-cn' || locale === 'zh-sg') {
      res.send({ message: languages.zh.simplified_Chinese })
    }
  } else {
    // if "locale" is not included, return "en" as default.
    res.send({ message: languages.en })
  }
  res.end()
})

app.post('/getLanguagetest', (req, res) => {
  res.status(400).end()
})

app.post('/clientInform', (req, res) => {
  const { clientInform } = req.body

  async function email() {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "kaiminghk@gmail.com", // sender address
      to: "korise.k3767@gmail.com, korise.k3767@msa.hinet.net", // list of receivers
      subject: "客戶聯繫", // Subject line
      html: `
      <h1>收到客戶在公司網站留下聯繫資料：</h1>
      <p>姓名：${clientInform.name}</p>
      <p>職稱：${clientInform.title}</p>
      <p>公司名稱：${clientInform.firmName}</p>
      <p>產業類別：${clientInform.industry}</p>
      <p>Email：${clientInform.email}</p>
      <p>聯絡電話 (分機)：${clientInform.phoneNumber}</p>
      <p>地址：${clientInform.address}</p>
      <p>需求：${clientInform.demand}</p>
      `
    });
  }
  email().catch(console.error);
  res.end()
})

http.listen(port, function () {
  console.log(`listening on localhost:${port}`)
})