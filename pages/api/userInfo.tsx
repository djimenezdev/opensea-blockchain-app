import type { NextApiRequest, NextApiResponse } from 'next';
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
  if (req.method === 'POST') {
    const user = await fetch(
      `https://testnets-api.opensea.io/user/${req.body.owner}`
    ).then((res) => res.json());
    if (user?.username) {
      res.json({ name: user?.username });
    } else {
      res.json({ name: req.body.owner });
    }
  }
}
