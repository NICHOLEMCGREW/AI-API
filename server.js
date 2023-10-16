const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const newspapers = [
    {
        name: 'artificialintelligence-news',
        address: 'https://www.artificialintelligence-news.com/',
        base: ''
    },
    {
        name: 'wired',
        address: 'https://www.wired.com/tag/artificial-intelligence/',
        base: ''
    },
    {
        name: 'aiweekly',
        address: 'https://aiweekly.co/',
        base: ''
    },
    {
        name: 'reddit',
        address: 'https://www.reddit.com',
        base: ''
    },
    {
        name: 'nbcnews',
        address: 'https://www.nbcnews.com/',
        base: ''
    },
    {
        name: 'foxnews',
        address: 'https://www.foxnews.com/category/good-news',
        base: ''
    },
]

const app = express()

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("AI")', html).each(function () {
               const title = $(this).text()
               const url = $(this).attr('href')

               articles.push({
                        title, 
                        url: newspaper.base + url,
                        source: newspaper.name
                       })
            })
        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my AI API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("AI")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title, 
                    url: newspaperBase + url, 
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))