import sendWAMessage from '@/utils/whatsapp';
import * as cheerio from 'cheerio';

const WA_DELETE_COLS = [
  'Price',
  'GMP(₹)',
  'GMP Updated',
  'Listing',
  'BoA Dt',
  'Open',
  'Close',
  'Lot',
];

function processRows($: any, selectedRows: any) {
  return selectedRows
    .map((_, row) => {
      const rowData = {};
      $(row)
        .find('td')
        .each((_, td) => {
          const dataLabel = $(td).attr('data-label');
          const value = $(td).text().trim();
          if (dataLabel) {
            if (dataLabel === 'Fire Rating') {
              rowData[dataLabel] = $(td).find('img').attr('alt');
            } else {
              rowData[dataLabel] = value;
            }
          }
        });
      return rowData;
    })
    .get()
    .filter(
      (e) => Object.keys(e).length > 0 && !e['Status'].includes('[email')
    );
}

function generateWhatsAppTable(data) {
  data = JSON.parse(JSON.stringify(data));
  data.forEach((r) => {
    WA_DELETE_COLS.forEach((key) => delete r[key]);
  });
  // Determine the maximum width for each column
  const headers = Object.keys(data[0]);
  const columnWidths = headers.map((header) =>
    Math.max(header.length, ...data.map((row) => String(row[header]).length))
  );

  // Create a function to format a row
  const formatRow = (row) =>
    '| ' +
    headers
      .map((header, i) => String(row[header]).padEnd(columnWidths[i], ' '))
      .join(' | ') +
    ' |';

  // Generate the table
  const headerRow = formatRow(Object.fromEntries(headers.map((h) => [h, h])));
  const separatorRow =
    '|-' + columnWidths.map((width) => '-'.repeat(width)).join('-|-') + '-|';
  const dataRows = data.map(formatRow);

  // Combine all rows
  return [headerRow, separatorRow, ...dataRows].join('\n');
}

async function getIpoDetails() {
  const page = await fetch(
    'https://www.investorgain.com/report/live-ipo-gmp/331/ipo/'
  ).then((e) => e.text());
  const $ = cheerio.load(page);

  const allRows: any[] = processRows($, $('tr'));

  const open = allRows.filter((e) => e?.Status?.split(' ')[0] === 'Open');
  const closingToday = allRows.filter(
    (e) => e?.Status?.split(' ')[0] === 'Closing'
  );

  if (closingToday.length) {
    await Promise.all([
      sendWAMessage('CLOSING TODAY'),
      sendWAMessage('```' + generateWhatsAppTable(closingToday) + '```'),
    ]);
  }

  if (open.length) {
    await Promise.all([
      sendWAMessage('OPEN'),
      sendWAMessage('```' + generateWhatsAppTable(open) + '```'),
    ]);
  }

  return { open, closingToday };
}

export async function GET() {
  const { open, closingToday } = await getIpoDetails();
  return Response.json({ open, closingToday });
}
