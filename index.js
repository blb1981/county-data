const fs = require('fs')
const path = require('path')
const axios = require('axios')
const cheerio = require('cheerio')

const wikiBaseName = 'https://en.wikipedia.org/'

const cleanText = (txt) => {
  return txt.trim(txt.replace(/(\r\n|\n|\r)/gm, ''))
}

async function main() {
  try {
    const result = await axios.get(
      'https://en.wikipedia.org/wiki/List_of_United_States_counties_and_county_equivalents'
    )

    const html = result.data
    const $ = cheerio.load(html)
    const outputPath = path.join(__dirname, 'test.csv')
    let rows = `county,state\n`
    let state, population

    $('#mw-content-text > div.mw-parser-output > table > tbody > tr').each(
      async function (i) {
        const name = $(this).children('td').first().text()
        let link =
          wikiBaseName + $(this).children('td').children('a').attr('href')

        if (i > 0) {
          if ($(this).children('td').length === 4) {
            state = $(this).children('td:nth-child(2)').text()
            population = $(this).children('td:nth-child(3)').text()
          } else {
            population = $(this).children('td:nth-child(2)').text()
          }

          rows += `"${cleanText(name)}","${cleanText(state)}","${cleanText(
            population
          )}"\n`
        }

        if (i > 1) {
          return false
        }
        
        
      }
    )

    fs.writeFile(outputPath, rows, function (error) {
      if (error) {
        console.log(error)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

main()
