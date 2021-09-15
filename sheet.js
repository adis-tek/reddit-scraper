const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class Sheet {
    constructor() {
        this.doc = new GoogleSpreadsheet('15hO2rUgXD7uO7gyjUn06BOpt_znTsYZX6MBl-PzhStc');
    }
    async load() {
        await this.doc.useServiceAccountAuth(require('./credentials.json'));
        await this.doc.loadInfo();
    }
    async addRows(rows, i) {
        const sheet = this.doc.sheetsByIndex[i]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
        await sheet.addRows(rows);
    }
    async addSheet(title, headerValues) {
        await this.doc.addSheet({ title, headerValues });
        return this.doc.sheetsByIndex.length - 1;
    }
    async getRows(i) {
        const sheet = this.doc.sheetsByIndex[i];
        const rows = await sheet.getRows();
        return rows;
    }
}

//(async function() {
//const sheet = new Sheet()
//await sheet.load()
//sheet.addRows([
//    { title: 'Software Engineer', location: 'SF' },
//    { title: 'Designer', location: 'NY' },
//])
//})()