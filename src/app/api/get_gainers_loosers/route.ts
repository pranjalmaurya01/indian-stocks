import { NseIndia } from 'stock-nse-india';
import { IndexEquityInfo } from 'stock-nse-india/build/interface';

interface responseF {
  index: string;
  data: {
    gainers: { symbol: string; change: number; price: number }[];
    losers: { symbol: string; change: number; price: number }[];
  };
}

const indexes = [
  // 'NIFTY 50',
  // 'NIFTY NEXT 50',
  // 'NIFTY 100',
  'NIFTY 200',
  // 'NIFTY 500',
  // 'NIFTY MIDCAP 50',
  // 'NIFTY MIDCAP 100',
  // 'NIFTY SMLCAP 100',
  // 'INDIA VIX',
  // 'NIFTY MIDCAP 150',
  // 'NIFTY SMLCAP 50',
  // 'NIFTY SMLCAP 250',
  // 'NIFTY MIDSML 400',
  // 'NIFTY500 MULTICAP',
  // 'NIFTY LARGEMID250',
  // 'NIFTY MID SELECT',
  // 'NIFTY TOTAL MKT',
  // 'NIFTY MICROCAP250',
];

export async function GET(request: Request) {
  const url = new URL(request.url);

  const cP = Number(url.searchParams.get('changePercentage'));
  const changePercentage = Number.isNaN(cP) ? 1 : cP;

  // const index = url.searchParams.getAll('index');
  // console.log({ index });

  const allPromises: Promise<responseF>[] = [];
  const getGainersAndLosersByIndex = async (
    indexSymbol: string
  ): Promise<responseF> => {
    const nseIndia = new NseIndia();
    const indexData = await nseIndia.getEquityStockIndices(indexSymbol);
    const gainers: IndexEquityInfo[] = [];
    const losers: IndexEquityInfo[] = [];
    indexData.data.forEach((equityInfo: IndexEquityInfo) => {
      if (equityInfo.pChange > changePercentage) gainers.push(equityInfo);
      else if (equityInfo.pChange < -changePercentage) losers.push(equityInfo);
    });

    const g = [...gainers]
      .sort((a, b) => b.pChange - a.pChange)
      .map((g) => ({
        symbol: g.symbol,
        change: g.pChange,
        price: g.lastPrice,
      }));

    const l = [...losers]
      .sort((a, b) => a.pChange - b.pChange)
      .map((g) => ({
        symbol: g.symbol,
        change: g.pChange,
        price: g.lastPrice,
      }));

    return {
      index: indexSymbol,
      data: { losers: l, gainers: g },
    };
  };

  for (const index of indexes) {
    allPromises.push(getGainersAndLosersByIndex(index));
  }
  // console.time();
  const data = await Promise.all(allPromises);
  // console.timeEnd();

  return Response.json(data);
}
