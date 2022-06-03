import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../lib/sanity';
import NextCors from 'nextjs-cors';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    // Options
    methods: ['POST', 'GET'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    origin: ['http://localhost:3000', 'https://os-market-clone.vercel.app/'],
  });
  if (req.method === 'POST' && req.body.url === '/collections') {
    const query = `*[_type=="marketItems" && contractAddress == "${req.body.collectionId}"] {
        "imageUrl":profileImage.asset->url,
        "bannerImageUrl": bannerImage.asset->url,
        volumeTraded,
        createdBy,
        contractAddress,
        "creator":createdBy->userName,
        title,
        floorPrice,
        "allOwners":owners[]->,
        description
      }`;
    const collectionData = await client.fetch(query);
    res.json(collectionData);
  } else {
    await client
      .create({
        _id: req.body.address,
        _type: 'users',
        userName: req.body.address,
        walletAddress: req.body.address,
      })
      .then(
        async ({
          walletAddress,
          userName,
        }: {
          walletAddress: string;
          userName: string;
        }) => {
          await client
            .patch(process.env.MARKET_ID)
            .insert('after', 'owners[-1]', [
              { _key: walletAddress, userName, walletAddress },
            ])
            .commit();
          res.end();
        }
      )
      .catch((err: any) => res.status(409).send('Document already exists'));
  }
}
