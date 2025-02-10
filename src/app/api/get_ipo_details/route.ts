import sendWAMessage from '@/utils/whatsapp';

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
  const data = await fetch(
    'https://webnodejs.investorgain.com/cloud/report/data-read/331/1/2/2025/2024-25/0/ipo?search=&v=20-49/'
  ).then((e) => e.json().then((e) => e.reportTableData));

  const open = data
    .filter((e) => e?.Status?.indexOf('Open') !== -1)
    .map((e) => e.IPO)
    .join(', ');
  const closingToday = data
    .filter((e) => e?.Status?.indexOf('Closing') !== -1)
    .map((e) => e.IPO)
    .join(', ');

  if (closingToday.length) {
    await Promise.all([
      sendWAMessage(`CLOSING TODAY\n${closingToday}`),
      // sendWAMessage('```' + generateWhatsAppTable(closingToday) + '```'),
    ]);
  }

  if (open.length) {
    await Promise.all([
      sendWAMessage(`OPEN\n${open}`),
      // sendWAMessage('```' + generateWhatsAppTable(open) + '```'),
    ]);
  }

  return { open, closingToday };
}

export async function GET() {
  const { open, closingToday } = await getIpoDetails();
  return Response.json({ open, closingToday });
}
