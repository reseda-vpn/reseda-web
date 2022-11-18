import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest) {
  return new ImageResponse(
    (
        <div style={{
            backgroundColor: "rgb(10,10,10)",
            display: "flex",
            height: "100%",
            width: "100%"
        }}>
            <div style={{
                backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.2) 8%, transparent 8%)",
                backgroundPosition: "0% 0%",
                backgroundSize: "5px 5px",
                height: "100%",
                transition: "background-position 350ms ease",
                width: "100%",
                display: "flex"
            }}>
                <h1>Reseda VPN</h1>
            </div>
        </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}