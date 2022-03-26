import { useState, useEffect } from "react";
import { HiTag } from 'react-icons/hi';
import { IoMdWallet } from 'react-icons/io';
import toast, {Toaster} from 'react-hot-toast';
import {useMarketplace, useAddress} from '@thirdweb-dev/react';
import { client } from "../../lib/sanity";

const style = {
  button: `mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer`,
  buttonIcon: `text-xl`,
  buttonText: `ml-2 text-lg font-semibold`,
}

const Purchase = ({isListed,selectedNft,listings}:{isListed:string|string[]|undefined, selectedNft:any, listings:Array<any>}) => {
  const [selectedMarketNft, setSelectedMarketNft] = useState<any>();
  const [enableButton, setEnableButton] = useState(false);
  const marketplace = useMarketplace('0xF1402ECdDeC1a83de2a49dd0e0eF25925Ad47892');
  const address = useAddress();

  useEffect(() => {
    if(!listings || isListed === 'false') return;
    (async () => {
      setSelectedMarketNft(listings?.find(marketNft => parseInt(marketNft?.asset?.id?._hex,16) === parseInt(selectedNft?.metadata?.id?._hex,16)));
    })();
  },[selectedNft,listings, isListed]);

  useEffect(() => {
    if(!selectedMarketNft  || !selectedNft) return;
    setEnableButton(true);
  },[selectedMarketNft, selectedNft]);

console.log(address)
  const confirmPurchase = async (toastHandler = toast) => {
    toastHandler.success(`Purchase successful!`,{
      style:{
        background:'#04111d',
        color:"#fff"
      }
    })
    await fetch('http://localhost:3000/api/collectionData',{method:"POST",headers:{'Content-Type':'application/json'}, body:JSON.stringify({address:address})})
  }


  const buyItem = async (listingId:number ,quantityDesired:number) => {
    const res = await marketplace?.direct?.buyoutListing(listingId,quantityDesired).catch((err) => console.error(err))

    if(res) {
      confirmPurchase();
      
    }
  }
  return (
    <div className="flex h-20 w-full items-center rounded-lg border border-[#151c22] bg-[#303339] px-12">
      <Toaster position='top-center' reverseOrder={false}/>
      {isListed === 'true' ? (
        <>
        <div onClick={() => {
          enableButton ? buyItem(parseInt(selectedMarketNft?.id),1):null
        }}
        className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
        >
              <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>Buy Now</div>
        </div>
        <div
            className={`${style.button} border border-[#151c22]  bg-[#363840] hover:bg-[#4c505c]`}
          >
            <HiTag className={style.buttonIcon} />
            <div className={style.buttonText}>Make Offer</div>
          </div>
        </>
      ):(
<div className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}>
          <IoMdWallet className={style.buttonIcon} />
          <div className={style.buttonText}>List Item</div>
        </div>
      
      )}
    </div>
  )
}
export default Purchase