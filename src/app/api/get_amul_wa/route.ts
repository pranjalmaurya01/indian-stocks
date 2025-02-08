import sendWAMessage from '@/utils/whatsapp';

async function getIpoDetails() {
  const page = await fetch(
    'https://shop.amul.com/api/1/entity/ms.products?q=%7B%22alias%22:%22amul-high-protein-rose-lassi-200-ml-or-pack-of-30%22%7D&limit=1'
  ).then((e) => e.json());

  const data = page.data[0];

  const { inventory_quantity, inventory_low_stock_quantity } = data;

  const in_stock_qty = inventory_quantity - inventory_low_stock_quantity;

  if (in_stock_qty > 0) {
    sendWAMessage(`AMUL Protein Lassi back in stock ${in_stock_qty}`);
    1;
  }

  return {
    inventory_quantity,
    inventory_low_stock_quantity,
  };
}

export async function GET() {
  const data = await getIpoDetails();
  return Response.json(data);
}
