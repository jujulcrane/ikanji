// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type Profile = {
  username: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Profile>,
) {
  res.status(200).json({ username: "JohnDoe" });
}
