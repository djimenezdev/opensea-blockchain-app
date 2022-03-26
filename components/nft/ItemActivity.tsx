import { CgArrowsExchangeV } from 'react-icons/cg';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import moment from "moment";
import EventItem from './EventItem';


interface TransactionData {
    from_account:{address:string}
    to_account:{address:string}
    event_type:string 
    transaction:{ transaction_hash:string}
    created_date:string
}

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
  }

  const getTime = (timestamp:string) => {
    const current = moment(new Date());
    const timeOfAction = moment.utc(timestamp).local().format();
    const seconds = current.diff(timeOfAction, "seconds");
    const minutes = current.diff(timeOfAction,"minutes");
    const hours = current.diff(timeOfAction, "hours");
    const days = current.diff(timeOfAction, "days");
    const years = current.diff(timeOfAction, "years");
    
    if(minutes < 1&& hours < 1 && days < 1 && years < 1){
        return seconds + " " + "seconds ago"
    } else if(minutes >= 1 && hours < 1 && days < 1 && years < 1){
        return minutes + ' ' + "minutes ago"
    } else if(minutes >= 1 && hours >= 1 && days < 1 && years < 1){
        return hours + ' ' + 'hours ago'
    } else if(minutes >= 1 && hours >= 1 && days >= 1 && years < 1) {
        return days + ' ' + `day${days > 1 &&"s"} ago`
    }else if(minutes >= 1 && hours >= 1 && days >= 1 && years >= 1) {
        return years + ' ' + `year${years > 1 &&"s"} ago`
    }
   
  }

const ItemActivity = ({selectedNft}:{selectedNft:any}) => {
    
    const [toggle, setToggle] = useState(true);
    const [transactions, setTransactions] = useState<any>([]);
    useEffect(() => {
        if(!selectedNft)return;
        (async () => {
            const transactionHistory = await fetch(`https://testnets-api.opensea.io/api/v1/events?asset_contract_address=0x9ead73ea86276c6153a3360B6281aCE6808e20F1&only_opensea=false`,{
                method: 'GET',
                headers: {Accept: 'application/json', 'X-API-KEY': '5bec8ae0372044cab1bef0d866c98618'}
              }).then((res) => res.json())
            setTransactions(transactionHistory?.asset_events?.filter((transaction:any) => transaction?.asset?.token_id === parseInt(selectedNft?.metadata.id?._hex, 16).toString()).map(({from_account:{address},created_date,to_account:{address:addr},event_type, transaction:{transaction_hash}}:TransactionData) => ({
                    from:address,
                    to:addr,
                    date: getTime(created_date),
                    price:null,
                    transaction_hash,
                    event_type
            })));
        })();
    }, [selectedNft]);

  return (
    <div className={style.wrapper}>
        <div className={style.title} onClick={()=> setToggle(!toggle)}>
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
               {transactions?.map((event:any, id:string) => (
                  <EventItem key={id} event={event}/>
               ))}
           </div> 
        )}
    </div>
  )
}
export default ItemActivity