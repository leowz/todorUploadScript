const program = require('commander');
const csv = require('csv-parser')
const fs = require('fs');
const path = require('path');
import Promise from 'bluebird';

program
    .usage('[options]')
    .option('-f, --file [file name]', 'file name for patent csv')
    .option('-g, --file2 [file name]', 'file name for patent csv')
    .option('-j, --json [file name]', 'file name for patent csv')
    .option('-n, --nameFilter', 'use a name filter for assignee', true)
    .option('-v, --verbose', 'Print the result list')
    .parse(process.argv);

// csvjson options
const options = {
  delimiter: ',', // optional
  quote: '"'
};

if (program.file) {
  const json = [];
  fs.createReadStream(program.file)
  .pipe(csv())
  .on('data', (data) => {
    json.push(data)
  })
  .on('end', async () => {
    // console.log("json", json.slice(0, 5));
    // write_ret_to_disk(json);
    // const name1 = row[keys.name1];
    // const name2 = row[keys.name2];
    // const ret = await Promise.mapSeries(['Validus', name2], async (name) => Company.reconcile({name, type: 'COMPANY'}));
    // await allCompanyNames(json);
    // await uploadMeetings(json);
    // await uploadBdopps(json);
    // updateUuidUpdatedCsv(json);
    // await handleElephantList(json);
    const dict = json.reduce((accu, i) => {
      accu[i['Name']] = i['ninja uuid'];
      return accu;
    } , {});
    const json1 = require("./updatedBdoppsUuidUsingUuid2.json");
    await uploadBdopps(json1, dict);
  });
} else {
  console.log("no input, quit");
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
