#!/usr/bin/node
const https = require('https');
const fs = require("fs");

/* many thanks to episodate */
const urls = {
	details : "https://www.episodate.com/api/show-details?q=",
	search  : "https://www.episodate.com/api/search?q=",
};
const today = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
const db = process.env.HOME + "/.serie_info";

// start of the work
start();


function start() {
	if (!fs.existsSync(db)) fs.mkdirSync(db);

	let lineHandler;
// TODO : option P and N to previous and next season
// TODO : option l to last episode
	switch (process.argv[2]) {
		case '--previous':
		case '-p': lineHandler = createHandler(specificPrevious); break;
		case '--update':
		case '-u': lineHandler = createHandler(specificUpdate); break;

		// default
		case '--next':
		case '-n':
		default: lineHandler = createHandler(specificNext);
	}

	let data = '';
	process.stdin.on('data', d => data += d);
	process.stdin.on('end', async () => {
		const lines = data.split('\n');
		lines.pop();
		const results = await Promise.all(lines.map(lineHandler));
		results.map(line => console.log(line));
	});
}

function createHandler (specificTreatment) {
	const tampon = ['', '', '', '', '', '', '', ''];
	async function handler(line) {
		// common treatment for all handlers

		// ignore empty line or line starting by #
		if (line.length === 0 || line.trim()[0] === '#') return line;

		// separate the fields
		const fields = line.split(';');
		const lengthes = fields.map(f => f.length);
		lengthes[0] += 1;

		let [name, id, season, episode, date, title, link, format, ...trash] = fields.map(f => f.trim()).concat(tampon);
		if (!id) {
			if (name) {
				const lines = await search(name, line);
				return lines.join('\n');
			}
			else return line;
		}

		if (season) season = Number(season);
		if (episode) episode = Number(episode);
		// putting id to none allows ones to keep track of shows by hand
		if (id !== 'none') {
			
			const details = await getShowDetails(id);

			// little trick: empty the name field and get the official name otherwise you can name it whatever you want
			if (!name) name = details.name;
			
			({season, episode, date, title} = await specificTreatment({id, season, episode, date, title}));
			if (date !== 'Available' && date < today) date = 'Available';
		}
		if (season && episode && format) link = format.replace(/{s}/g, season).replace(/{e}/g, episode);


		const rep = [name, id, season, episode, date, title, link, format]
			.map((f, i) => f.toString().padEnd(lengthes[i]-1))
			.join('; ');
		return rep;
	}
	return handler;
}

// ####################
// # specific actions # if you want to add some functionnality it's in this section
// ####################
async function specificPrevious(currentInfo) {
	const {season:s, episode:e} = currentInfo;
	if (!s || !e) return currentInfo;

	const showDetails = await getShowDetails(currentInfo.id);

	const length = showDetails.episodes.length;
	if (length === 0) return currentInfo;

	// the season and episode number might come from a 'next' operation and next increment the episode number when it guesses
	const index = showDetails.episodes.findIndex(
		({season, episode}) => (season == s && episode == e) || (season == s+1 && episode == 1)
	);
	if (index ===  -1) {
		return showDetails.episodes[length - 1];
	}
	else if (index === 0) return currentInfo;
	else return showDetails.episodes[index - 1];
}

async function specificUpdate(currentInfo) {
	const {season:s, episode:e, title, date, id} = currentInfo;
	if (!s || !e) return currentInfo;
	if (title && date !== '???') return currentInfo;
	// if (title && date && date !== '???' && date === 'Available') return currentInfo;

	const showDetails = await getShowDetails_online(currentInfo.id);
	const index = showDetails.episodes.findIndex(
		({season, episode}) => (season == s && episode == e) || (season == s+1 && episode == 1)
	);
	if (index === -1) return currentInfo;
	return showDetails.episodes[index];
}

async function specificNext(currentInfo) {
	const {season:s, episode:e} = currentInfo;
	if (!s || !e) return currentInfo;

	const showDetails = await getShowDetails(currentInfo.id);

	const length = showDetails.episodes.length;
	if (length === 0) return currentInfo;

	const index = showDetails.episodes.findIndex(({season, episode}) => season == s && episode == e);
	if (index ===  -1) return showDetails.episodes[length - 1];
	else if (index === length - 1) {
		if (showDetails.status === 'Ended') return ({season:s, episode:e, title:'', date:'Ended'});
		return ({season:s, episode:e+1, title:'???', date:'???'});
	}
	else return showDetails.episodes[index + 1];
}

// ###############
// # Data Loader #
// ###############
// keeps locally some files to improve speed, new data is loaded only when it is needed

async function search(query, line) {
	const lines = [line];
	const data = await fetchJSON(urls.search + query);

	lines.push(`${data.total} result${data.total > 1 ? 's' : ''} for: "${query}"`);
	let maxwidth = 0;
	data.tv_shows.forEach(({name}) => maxwidth = name.length > maxwidth ? name.length : maxwidth);
	data.tv_shows.forEach(({id, name}) => lines.push(name.padEnd(maxwidth, ' ') + " ; " + id + ";1;1;;;;"));
	return lines;
}

const showsDict = {};
function getShowDetails(id) {
	if (id in showsDict) return showsDict[id];

	const filename = db + '/' + id;
	// if file exist then read it and load it
	if (fs.existsSync(filename)) {
		const raw_data = fs.readFileSync(filename, {encoding:'utf8'});
		const data = JSON.parse(raw_data);
		showsDict[id] = data;
		return data;
	}

	return getShowDetails_online(id);
}

async function getShowDetails_online (id) {
	const data = (await fetchJSON(urls.details + id)).tvShow;

	data.episodes = data.episodes.map(({name, air_date, season, episode}) => {
		if (name === 'TBA') name='';
		return ({title:name, date:air_date, season, episode});
	});

	const filename = db + '/' + id;
	fs.writeFileSync(filename, JSON.stringify(data, null, 4));
	return data;
}

// utility function to get JSON from an url
function fetchJSON (url) {
	return new Promise((resolve, reject) => {
		https.get(url, response => {
			let data = '';
			response.on('data', d => data += d);
			response.on('end', () => resolve(JSON.parse(data)));
		}).on('error', err => reject(err));
	});
}
