import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import moment from 'moment';

interface TransactionData {
  from_account: { address: string };
  to_account: { address: string };
  event_type: string;
  transaction: { transaction_hash: string };
  created_date: string;
}

const getTime = (timestamp: string) => {
  const current = moment(new Date());
  const timeOfAction = moment.utc(timestamp).local().format();
  const seconds = current.diff(timeOfAction, 'seconds');
  const minutes = current.diff(timeOfAction, 'minutes');
  const hours = current.diff(timeOfAction, 'hours');
  const days = current.diff(timeOfAction, 'days');
  const years = current.diff(timeOfAction, 'years');

  if (minutes < 1 && hours < 1 && days < 1 && years < 1) {
    return seconds + ' ' + 'seconds ago';
  } else if (minutes >= 1 && hours < 1 && days < 1 && years < 1) {
    return minutes + ' ' + 'minutes ago';
  } else if (minutes >= 1 && hours >= 1 && days < 1 && years < 1) {
    return hours + ' ' + 'hours ago';
  } else if (minutes >= 1 && hours >= 1 && days >= 1 && years < 1) {
    return days + ' ' + `day${days > 1 && 's'} ago`;
  } else if (minutes >= 1 && hours >= 1 && days >= 1 && years >= 1) {
    return years + ' ' + `year${years > 1 && 's'} ago`;
  }
};

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
    const transactionHistory = await fetch(
      `https://testnets-api.opensea.io/api/v1/events?asset_contract_address=0x9ead73ea86276c6153a3360B6281aCE6808e20F1&only_opensea=false`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
      }
    ).then((res) => res.json());
    const formattedAssetActivity = transactionHistory?.asset_events
      ?.filter(
        (transaction: any) =>
          transaction?.asset?.token_id ===
          parseInt(req.body.nftID, 16).toString()
      )
      .map(
        ({
          from_account: { address },
          created_date,
          to_account: { address: addr },
          event_type,
          transaction: { transaction_hash },
        }: TransactionData) => ({
          from: address,
          to: addr,
          date: getTime(created_date),
          price: null,
          transaction_hash,
          event_type,
        })
      );
    res.json(formattedAssetActivity);
  }
}
