const express = require('express')
const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs').promises

const app = express()
const port = 3000

app.use('*', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', '*')
  next()
})

app.use(express.json({ limit: '10mb' }))

app.get('/fetch', async (req, res) => {
  const { url } = req.query

  if (!url) {
    return res.status(400).send('No URL provided.')
  }

  const response = await fetch(url)
  const html = await response.text()

  res.send(html)
})

app.post('/export-pdf', async (req, res) => {
  const { html } = req.body

  if (!html) {
    return res.status(400).send('No HTML content provided.')
  }

  try {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    })

    await browser.close()

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdf.length,
      'Content-Disposition': 'attachment; filename=cv.pdf',
    })
    res.send(pdf)
  }
  catch (error) {
    console.error('Error generating PDF:', error)
    res.status(500).send('Failed to generate PDF.')
  }
})

app.use(express.static(__dirname))

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
