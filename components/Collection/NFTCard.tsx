import { useEffect, useState } from 'react';
import { BiHeart } from 'react-icons/bi';
import Router from 'next/router';
import Image from 'next/image';
import { FaEthereum } from 'react-icons/fa';
interface NFTCardType {
  nftItem: { metadata: { image: string; id: string; name: string } };
  title: string | undefined;
  listings: Array<any>;
}

const style = {
  wrapper: `bg-[#303339] w-[20vw] h-[24rem] my-10 mx-5 rounded-2xl overflow-hidden cursor-pointer`,
  imgContainer: `h-2/3 overflow-hidden flex justify-center items-center`,
  nftImg: `relative w-full h-full`,
  details: `p-3`,
  info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
  infoLeft: `flex-0.6 flex-wrap`,
  collectionName: `font-semibold text-sm text-[#8a939b]`,
  assetName: `font-bold text-lg mt-2`,
  infoRight: `flex-0.4 text-right`,
  priceTag: `font-semibold text-sm text-[#8a939b]`,
  priceValue: `flex items-center text-xl font-bold mt-2`,
  ethLogo: `relative h-5 w-3 mr-2`,
  likes: `text-[#8a939b] font-bold flex items-center w-full justify-end mt-3`,
  likeIcon: `text-xl mr-2`,
};

const NFTCard = ({
  nftItem: {
    metadata: { image, id, name },
  },
  title,
  listings,
}: NFTCardType) => {
  const [isListed, setIsListed] = useState(false);
  const [price, setPrice] = useState(0);
  useEffect(() => {
    const listing = listings.find(
      (listing) => parseInt(listing?.asset?.id?._hex, 16) === parseInt(id, 16)
    );
    if (!listing) return;
    setIsListed(true);
    setPrice(listing.buyoutCurrencyValuePerToken.displayValue);
  }, [listings, id]);
  return (
    <div
      className={style.wrapper}
      onClick={() => {
        Router.push({
          pathname: `/nfts/${parseInt(id, 16)}`,
          query: { isListed: isListed },
        });
      }}
    >
      <div className={style.imgContainer}>
        <div className={style.nftImg}>
          <Image src={image} alt={name} layout='fill' />
        </div>
      </div>
      <div className={style.details}>
        <div className={style.info}>
          <div className={style.infoLeft}>
            <div className={style.collectionName}>{title}</div>
            <div className={style.assetName}>{name}</div>
          </div>
          {isListed && (
            <div className={style.infoRight}>
              <div className={style.priceTag}>Price</div>
              <div className={style.priceValue}>
                <div className={style.ethLogo}>
                  <FaEthereum />
                </div>
                {price}
              </div>
            </div>
          )}
        </div>
        <div className={style.likes}>
          <span className={style.likeIcon}>
            <BiHeart />
          </span>
        </div>
      </div>
    </div>
  );
};
export default NFTCard;
