export const revalidate = 0;

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import * as cheerio from 'cheerio';

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
    .get();
}

async function getIpoDetails() {
  const page = await fetch(
    'https://www.investorgain.com/report/live-ipo-gmp/331/ipo/'
  ).then((e) => e.text());

  const $ = cheerio.load(page);

  const closingTodayRows = $('tr:has(.badge.rounded-pill.bg-danger)');
  const closedTodayRows = $('tr:has(.badge.rounded-pill.bg-primary)');

  const closingToday = processRows($, closingTodayRows);
  const closedToday = processRows($, closedTodayRows);

  return { closingToday, closedToday };
}

export default async function () {
  const { closingToday, closedToday } = await getIpoDetails();
  console.log(closingToday, closedToday);

  return (
    <main className='p-2'>
      <Table>
        <TableCaption>IPO's Closing today</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>NAME</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Est. Listing Gains</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {closingToday.map((invoice: any) => (
            <TableRow key={invoice.IPO}>
              <TableCell className='font-medium'>{invoice.IPO}</TableCell>
              <TableCell className='font-medium'>₹{invoice.Price}</TableCell>
              <TableCell className='font-medium'>
                {invoice['Est Listing'].split('(')[1].replace(')', '')}
                {invoice.Status.replace('Closing Today', '')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
