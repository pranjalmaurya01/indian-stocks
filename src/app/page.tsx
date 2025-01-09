import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <Menubar>
        <MenubarMenu>
          <Link href='/ipo' className='cursor-pointer'>
            <MenubarTrigger>IPO Details</MenubarTrigger>
          </Link>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
