export const revalidate = 3600;
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import * as cheerio from 'cheerio';
import { Metadata } from 'next';

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
    .filter((e) => e);
}

async function getIpoDetails() {
  const page = await fetch(
    'https://www.investorgain.com/report/live-ipo-gmp/331/ipo/'
  ).then((e) => e.text());

  const $ = cheerio.load(page);

  const allRows: any[] = processRows($, $('tr'));

  const open = allRows.filter((e) => e?.Status?.split(' ')[0] === 'Open');

  return { open };
}

export const metadata: Metadata = {
  title: 'IPO Details',
};

export default async function () {
  const { open } = await getIpoDetails();

  return (
    <main className='p-2'>
      <Tabs defaultValue='open'>
        <TabsList>
          <TabsTrigger value='open'>
            Open {new Date().toDateString()}
          </TabsTrigger>
        </TabsList>
        <TabsContent value='open'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NAME</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Est. Listing Gains</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {open.map((invoice: any) => (
                <TableRow key={invoice.IPO}>
                  <TableCell className='font-medium'>{invoice.IPO}</TableCell>
                  <TableCell className='font-medium'>
                    ₹{invoice.Price}
                  </TableCell>
                  <TableCell className='font-medium'>
                    {invoice['Est Listing'].split('(')[1].replace(')', '')}
                  </TableCell>
                  <TableCell className='font-medium'>
                    {invoice.Status.replace('Closing Today', '').replace(
                      'Open',
                      ''
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </main>
  );
}
