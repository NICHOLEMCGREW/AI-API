const PORT = process.env.PORT || 8001
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const inspirations = [
    {
        name: 'goodnewsnetwork',
        address: 'https://www.goodnewsnetwork.org/',
        base: ''
    },
    {
        name: 'today',
        address: 'https://www.today.com/news/good-news',
        base: ''
    },
    // {
    //     name: 'telegraph',
    //     address: 'https://www.telegraph.co.uk/inspirations-change/',
    //     base: 'https://www.telegraph.co.uk'
    // },
]

const app = express()

const articles = []

inspirations.forEach(inspiration => {
    axios.get(inspiration.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("inspiration")', html).each(function () {
               const title = $(this).text()
               const url = $(this).attr('href')

               articles.push({
                        title, 
                        url: inspiration.base + url,
                        source: inspiration.name
                       })
            })
        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my Inspirational API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:inspirationId', (req, res) => {
    const inspirationId = req.params.inspirationId

    const inspirationAddress = inspirations.filter(inspiration => inspiration.name == inspirationId)[0].address
    const inspirationBase = inspirations.filter(inspiration => inspiration.name == inspirationId)[0].base

    axios.get(inspirationAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("inspiration")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title, 
                    url: inspirationBase + url, 
                    source: inspirationId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))