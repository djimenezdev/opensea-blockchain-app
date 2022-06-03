import { CgArrowsExchangeV } from 'react-icons/cg';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import EventItem from './EventItem';

const style = {
  wrapper: `w-full mt-8 border border-[#151b22] rounded-xl bg-[#303339] overflow-hidden`,
  title: `bg-[#262b2f] px-6 py-4 flex items-center`,
  titleLeft: `flex-1 flex items-center text-xl font-bold`,
  titleIcon: `text-3xl mr-2`,
  titleRight: `text-xl`,
  filter: `flex items-center border border-[#151b22] mx-4 my-6 px-3 py-4 rounded-xl bg-[#363840]`,
  filterTitle: `flex-1`,
  tableHeader: `flex w-full bg-[#262b2f] border-y border-[#151b22] mt-8 px-4 py-1`,
  eventItem: `flex px-4`,
  ethLogo: `h-5 mr-2`,
  accent: `text-[#2081e2]`,
};

const ItemActivity = ({
  selectedNft,
  listings,
}: {
  selectedNft: any;
  listings: any;
}) => {
  const [toggle, setToggle] = useState(true);
  const [transactions, setTransactions] = useState<any>([]);
  useEffect(() => {
    if (typeof parseInt(selectedNft?.metadata.id?._hex, 16) === 'number') {
      (async () => {
        const transactionHistory = await fetch(
          `https://os-market-clone.vercel.app/api/assetActivity`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nftID: parseInt(selectedNft?.metadata.id?._hex, 16).toString(),
            }),
          }
        );
        setTransactions(await transactionHistory.json());
      })();
    }
  }, [selectedNft?.metadata.id?._hex]);

  return (
    <div className={style.wrapper}>
      <div className={style.title} onClick={() => setToggle(!toggle)}>
        <div className={style.titleLeft}>
          <span className={style.titleIcon}>
            <CgArrowsExchangeV />
          </span>
          Item Activity
        </div>
        <div className={style.titleRight}>
          {toggle ? <AiOutlineUp /> : <AiOutlineDown />}
        </div>
      </div>
      {toggle && (
        <div>
          <div className={style.filter}>
            <div className={style.filterTitle}>Filter</div>
            <div>
              <AiOutlineDown />
            </div>
          </div>
          <div className={style.tableHeader}>
            <div className='flex-[2]'>Event</div>
            <div className='flex-[2]'>Price</div>
            <div className='flex-[3]'>From</div>
            <div className='flex-[3]'>To</div>
            <div className='flex-[2]'>Date</div>
          </div>
          {transactions?.map((event: any, id: string) => (
            <EventItem
              key={id}
              event={event}
              listings={listings}
              listingId={parseInt(
                selectedNft?.metadata.id?._hex,
                16
              ).toString()}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default ItemActivity;
