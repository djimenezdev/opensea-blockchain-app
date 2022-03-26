import { NextPage } from "next"
import { useRouter } from "next/router";
import Header from "../../components/Header";
import {useEffect,  useState} from 'react';
import NFTImage from "../../components/nft/NFTImage";
import GeneralDetails from "../../components/nft/GeneralDetails";
import ItemActivity from "../../components/nft/ItemActivity";
import Purchase from "../../components/nft/Purchase";
import {useMarketplace, useNFTCollection} from "@thirdweb-dev/react";
const style = {
    wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
    container: `container p-6`,
    topContent: `flex`,
    nftImgContainer: `flex-1 mr-4`,
    detailsContainer: `flex-[2] ml-4`,
  }

const NftItemId: NextPage = () => {
    const router = useRouter();
    const [selectedNft, setSelectedNft] = useState<any>();
    const [listings, setListings] = useState<any>([]);
    const nftCollection = useNFTCollection('0x9ead73ea86276c6153a3360B6281aCE6808e20F1');
    const marketplace = useMarketplace('0xF1402ECdDeC1a83de2a49dd0e0eF25925Ad47892');
  
    
      useEffect(() => {
        if(!nftCollection) return;
        (async () => {
          await nftCollection.getAll().then(async (data) => {
            if(data?.length) {
              setSelectedNft(data.find((nft) => parseInt(nft?.metadata?.id?._hex,16) === parseInt(router?.query?.nft)));
            }
        }
        )})();
      }, [nftCollection,router.query.nft]);
  
    
      useEffect(() => {
        if(!marketplace) return;
        (async () => {
          setListings(await marketplace.getAllListings());
        })();
      },[marketplace]);
  return (
    <div>
        <Header />
        <div className={style.wrapper}>
            <div className={style.container}>
                <div className={style.topContent}>
                    <div className={style.nftImgContainer}>
                        <NFTImage selectedNft={selectedNft}/>
                    </div>
                    <div className={style.detailsContainer}>
                        <GeneralDetails selectedNft={selectedNft}/>
                        <Purchase isListed={router.query.isListed} selectedNft={selectedNft} listings={listings} />
                    </div>
                </div>
                <ItemActivity selectedNft={selectedNft} />
            </div>
        </div>
    </div>

  )
}
export default NftItemId;