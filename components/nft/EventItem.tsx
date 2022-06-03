import { BsFillCartFill } from 'react-icons/bs';
import { FaEthereum } from 'react-icons/fa';
const style = {
  eventItem: `flex px-4 py-5 font-medium`,
  event: `flex items-center`,
  eventIcon: `mr-2 text-xl`,
  eventName: `text-lg font-semibold`,
  eventPrice: `flex items-center`,
  eventPriceValue: `text-lg`,
  ethLogo: `h-5 mr-2`,
  accent: `text-[#2081e2]`,
};

const EventItem = ({
  event,
  listings,
  listingId,
}: {
  event: any;
  listings: any;
  listingId: string;
}) => {
  return (
    <div className={style.eventItem}>
      <div className={`${style.event} flex-[2]`}>
        <div className={style.eventIcon}>
          <BsFillCartFill />
        </div>
        <div className={style.eventName}>{event.event_type}</div>
      </div>
      <div className={`${style.eventPrice} flex-[2]`}>
        <FaEthereum />
        <div className={style.eventPriceValue}>
          {
            listings.find(
              (listing: any) =>
                parseInt(listing?.asset?.id?._hex, 16) ===
                parseInt(listingId, 16)
            )?.buyoutCurrencyValuePerToken.displayValue
          }
        </div>
      </div>
      <div className={`${style.accent} flex-[3]`}>
        {event.from.substring(0, 2) +
          '...' +
          event.from.substring(event.from.length - 2, event.from.length)}
      </div>
      <div className={`${style.accent} flex-[3]`}>
        {event.to.substring(0, 2) +
          '...' +
          event.to.substring(event.to.length - 3, event.to.length + 1)}
      </div>
      <div className={`${style.accent} flex-[2] cursor-pointer underline`}>
        <a
          target='_blank'
          rel='noreferrer'
          href={`https://rinkeby.etherscan.io/tx/${event.transaction_hash}`}
        >
          {event.date}
        </a>
      </div>
    </div>
  );
};
export default EventItem;
