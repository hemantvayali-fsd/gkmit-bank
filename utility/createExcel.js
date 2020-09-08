/* eslint-disable array-callback-return */
const ExcelJS = require('exceljs');
const moment = require('moment');

module.exports = (dataList = [], configObj = {}) => {
  // create workbook and set initial properties
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'GMKIT-Bank';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Workbook Views
  workbook.views = [{
    x: 0,
    y: 0,
    width: 10000,
    height: 20000,
    firstSheet: 0,
    activeTab: 1,
    visibility: 'visible'
  }];

  // initialize a new sheet
  const worksheet = workbook.addWorksheet('My Sheet');

  // add columns
  worksheet.columns = [
    {
      header: 'Amount',
      key: 'amount',
      width: 20,
      alignment: 'left'
    },
    {
      header: 'Type',
      key: 'type',
      width: 20,
      alignment: 'left'
    },
    {
      header: 'Date',
      key: 'date',
      width: 40,
      alignment: 'left'
    }
  ];

  // add values to the rows
  dataList.map((item) => {
    worksheet.addRow({
      amount: item.amount.toFixed(2),
      type: item.type === 'deposit' ? 'credit' : 'debit',
      date: moment(item.createdAt).format('LLL')
    });
  });

  // return readable stream
  return workbook.xlsx;
};
