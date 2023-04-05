// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { geoInfo } from '../../client'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    res.status(200).json(await geoInfo(req.body.nativeData, req.body.exposition, req.body.datestring))
}