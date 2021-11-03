const fs = require('fs')
const path = require('path')
const axios = require('axios')
const cheerio = require('cheerio')

const cleanText = (txt) => {
	return txt.replace(/(\r\n|\n|\r)/gm, '')
}

async function main() {
	try {
		const result = await axios.get(
			'https://en.wikipedia.org/wiki/List_of_United_States_counties_and_county_equivalents'
		)

		const html = result.data
		const $ = cheerio.load(html)
		const outputPath = path.join(__dirname, 'test.json')
		const rows = []
		let state
		$('#mw-content-text > div.mw-parser-output > table > tbody > tr').each(function (i) {
			const name = $(this).children('td').first().text()
			const population = $(this).children('td:nth-child(3)').text()
			if (i > 0) {
				if ($(this).children('td').length === 4) {
					state = $(this).children('td:nth-child(2)').text()
				}

				rows.push({
					name: cleanText(name),
					state: cleanText(state),
				})
			}

			if (i > 200) {
				return false
			}
		})

		fs.writeFile(outputPath, JSON.stringify(rows), function (error) {
			if (error) {
				console.log(error)
			}
		})
	} catch (error) {
		console.log(error)
	}
}

main()
