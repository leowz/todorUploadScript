const program = require('commander');
const csv = require('csv-parser')
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const axios = require('axios');

csv({ separator: ';' });

program
    .usage('[options]')
    .option('-f, --file [file name]', 'file name for patent csv')
    .option('-g, --file2 [file name]', 'file name for patent csv')
    .option('-j, --json [file name]', 'file name for patent csv')
    .option('-n, --nameFilter', 'use a name filter for assignee', true)
    .option('-v, --verbose', 'Print the result list')
    .parse(process.argv);

const api = 'https://i8i7s543g6.execute-api.us-west-2.amazonaws.com/production/';
const apiKey = 'v6ZBsS9BK59GlP7O7Eb3x1WHQ83spOlj4mDIk3c9';
const devApi = 'https://q2dfmruvb9.execute-api.us-west-2.amazonaws.com/dev/';
const devApiKey = 'lwr8kOIKWl4I9mq6eMo9n8RTEMkAEsGz4pT3ZJaF';

if (program.file) {
  const json = [];
  fs.createReadStream(program.file)
  .pipe(csv({ separator: ';' }))
  .on('data', (data) => {
    json.push(data)
  })
  .on('end', async () => {
    const ret = await makeComments(json);
    console.log(ret);
  });
} else {
  console.log("no input, quit");
}

async function makeComments(json) {
    return await Promise.mapSeries(json, async (item) => {
        const data = formatData(item);
        return sendToApi(data, api, apiKey);
    });
}

function formatData(item) {
    return {
        uuid: item.uuid,
        userEmail: 'todor.khristov@jolt-capital.com',
        content: item.comment,
    }
}

async function sendToApi(data, url, key) {
    return axios
    .request({
      method: 'post',
      url: url + '/connector/comment/new',
      data,
      headers: { 'x-api-key': key },
    }).catch(e => console.log(e)).then(ret => ret.data);
}

async function test(data, url, key) {
    const endPoint = url + 'connector/sources';
    console.log(endPoint);
    const ret = await axios
    .request({
      method: 'get',
      url: endPoint,
      headers: { 'x-api-key': key },
    }).catch(e => console.log(e));
    console.log(ret);
    return ret;
}



// %-----------------------------------------
// eslint-disable-next-line
function write_ret_to_disk(data, name) {
  const csvData = JSON.stringify(data);
  const date = new Date();
  const fileName = name + '.json';
  fs.writeFileSync(path.join(__dirname, fileName), csvData, (err) => {
    if (err) {
      console.error(err);
    }
  });
}
