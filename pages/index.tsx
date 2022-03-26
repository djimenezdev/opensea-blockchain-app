
import type { NextPage } from 'next';
import { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Home/Hero';
import { client } from '../lib/sanity';
import toast, {Toaster} from 'react-hot-toast';
import { useAddress, useMetamask } from '@thirdweb-dev/react';

const style = {
  wrapper: ``,
  walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
  button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text=[#282b2f] font-semibold mt-4`,
}


const Home: NextPage = () => {
  const metaLogin = useMetamask();
  const address = useAddress();

  useEffect(() => {
    if(!address) return;
    
    /* (async () => {
      const user = await fetch(`https://rinkeby-api.opensea.io/user/${address}`).then((res) => res.json());
      const userDoc = {
        _type:'users',
        _id: address,
        userName:user?.username,
        walletAddress:address
      }; 
      const result = await client.createIfNotExists(userDoc); */
      welcomeUser(address.slice(0,6) +"..." + '"')
    // })();

  },[address]);

  const welcomeUser = (userName:string, toastHandler = toast)  => {
    toastHandler.success(`Welcome back${userName !== 'Unnamed' ? ` ${userName}`:'Unnamed'}!`,{
      style:{
        background:'#04111d',
        color:"#fff"
      }
    })
  }

  return (
    <>
    {address ? (
      <>
      <Toaster position='top-center' reverseOrder={false}/>
      <Header />
    <Hero />
      </>
    ):(
      <div className={style.wrapper}>
        <div className={style.walletConnectWrapper}>
          <button type="button" className={style.button} onClick={metaLogin}>Connect Wallet</button>
          <p className={style.details}>You need to be in chrome to run app</p>
        </div>
      </div>
    )}
  </>
  )
}

export default Home
