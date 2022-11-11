const cheerio = require("cheerio");
const axios = require("axios");

const siteUrl = "https://europeaidcontracts.com/";

let tableTitle = "";

const instNames = new Set();
const shortlistedCount = new Array();
const awardedCount = new Array();

const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

const getResults = async () => {
  const $ = await fetchData();

  // Table Title
  tableTitle = $("#container > #content > .top10 > div > h2").text();

  let tableRows = "#container > #content > .top10 > table > tbody > tr";

  // Institution Names
  $(`${tableRows} > .text-left > a`).each((index, element) => {
    let name = $(element).text();
    instNames.add(name);
  });

  // Shortlisted Count
  $(`.top10 td:nth-child(3)`).each((index, element) => {
    let count = $(element).text();
    shortlistedCount.push(count);
  });

  // Awarded Count
  $(tableRows).each((index, element) => {
    let count = $(element.lastChild).text();
    awardedCount.push(count);
  });

  return {
    instNames: [...instNames],
    awardedCount: [...awardedCount],
    shortlistedCount: [...shortlistedCount],
    tableTitle
  };
};

module.exports = getResults;
