import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from '../../components/Header';
import { CgWebsite } from 'react-icons/cg';
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { HiDotsVertical } from 'react-icons/hi';
import NFTCard from "../../components/Collection/NFTCard";
import { NextPage } from "next";
import {useAddress, useMarketplace, useNFTCollection} from "@thirdweb-dev/react";
import Image from "next/image";

const style = {
  bannerImageContainer: `relative z-0 h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `object-cover`,
  infoContainer: `relative w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileContainer:`relative w-40 h-40 mt-[-4rem]  rounded-full border-2 border-[#202225]`,
  profileImg: ` object-cover rounded-full`,
  socialIconsContainer: `flex text-3xl mb-[-2rem] mr-2`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `relative h-6 w-10 r-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
}

interface collectionStructure {
  imageUrl:string
  bannerImageUrl:string
  volumeTraded:number|undefined
  createdBy:string
  contractAddress:string
  creator:string
  title:string
  floorPrice:string
  allOwners:Array<any>
  description:string
 


}

const Collection:NextPage = () => {
  const router = useRouter();
  const collectionId = router?.query?.collectionId?router?.query?.collectionId as string:undefined ;
  const nftCollection = useNFTCollection(collectionId);
  const marketplace = useMarketplace('0xF1402ECdDeC1a83de2a49dd0e0eF25925Ad47892')
  const [collection,setCollection] = useState<collectionStructure>();
  const [nfts, setNfts] = useState<any>([])
  const [listings, setListings] = useState<any>([]);
  const address = useAddress();
  
  
  useEffect(() => {
    if(!nftCollection) return;
    (async () => {
      const nfts = await nftCollection.getAll();
      setNfts(nfts);
    })();
  }, [nftCollection]);

  useEffect(() => {
    if(!marketplace) return;
    (async () => {
      setListings(await marketplace.getAllListings());
    })();
  },[marketplace]);


 /*  useEffect(() => {
  setOwners([...new Set<string>(nfts.map(({owner}:{owner:string}) => owner))])
  },[nfts]) */

  useEffect(() => {
    if(!collectionId) return;
    const fetchCollectionData = async () => {
        const fetchCollection = await fetch('https://os-market-clone.vercel.app/api/collectionData',{
          method:'POST',
          body:JSON.stringify({collectionId: collectionId, url:"/collections"}),
          headers:{
            'Content-Type':'application/json'
          }
        }).then((res) => res.json());
 setCollection(fetchCollection[0])
}
    fetchCollectionData()
  }, [ collectionId])

  return (
    <div className="overflow-hidden">
      <Header />
      <div className={style.bannerImageContainer}>
        <Image className={style.bannerImage} src={collection?.bannerImageUrl ? collection?.bannerImageUrl: 'https://via.placeholder.com/200'} alt="banner" layout="fill" priority/>
      </div>
      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <div className={style.profileContainer}>
          <Image className={style.profileImg} src={collection?.imageUrl ? collection?.imageUrl : 'https://via.placeholder.com/200'} alt="profile pic" layout="fill" />
        </div>
        </div>
        <div className={style.endRow}>
          <div className={style.socialIconsContainer}>
            <div className={style.socialIconsWrapper}>
              <div className={style.socialIconsContent}>
                <div className={style.socialIcon}>
                  <CgWebsite />
                </div>
                <div className={style.divider} /><div className={style.socialIcon}>
                  <AiOutlineInstagram />
                </div>
                <div className={style.divider} /><div className={style.socialIcon}>
                  <AiOutlineTwitter />
                </div>
                <div className={style.divider} /><div className={style.socialIcon}>
                  <HiDotsVertical />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.title}>{collection?.title}</div>
        </div>
        <div className={style.midRow}>
          <div className={style.createdBy}>
            Created By 
            <span className="text-[#2081e2]"> {collection?.creator}</span>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.statsContainer}>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                {nfts?.length}
              </div>
              <div className={style.statName}>items</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>{collection?.allOwners ? collection.allOwners.length : ''}</div>
              <div className={style.statName}>owners</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <div className={style.ethLogo}>
                <Image src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg" alt="eth logo" layout="fill"/>
               </div>
                {collection?.floorPrice}
              </div>
              <div className={style.statName}>floor price</div>
            </div><div className={style.collectionStat}>
              <div className={style.statValue}>
              <div className={style.ethLogo}>
                <Image src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg" alt="eth logo" layout="fill"/>
              </div>
                {!!collection?.volumeTraded && collection?.volumeTraded/1000}.5K
              </div>
              <div className={style.statName}>ETH</div>
            </div>
           
          </div>
        </div>
        <div className={style.midRow}>
  <div className={style.description}>{collection?.description}</ div>
</div>
      </div>
      <div className="flex flex-wrap justify-center">
        {
          nfts.map((item:any, id:string) => (
            <NFTCard key={id} nftItem={item} title={collection?.title} listings={listings}/>
          ))
        }
      </div>
    </div>
  )
}
export default Collection