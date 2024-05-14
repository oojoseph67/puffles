"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client, walletFormat } from "./navbar";
import { getNFTs } from "thirdweb/extensions/erc721";
import Link from "next/link";

interface METADATA {
  // customImage: string;
  id: bigint;
  uri: string;
  name?: string;
  description?: string;
  image?: string;
  animation_url?: string;
  external_url?: string;
  background_color?: string;
  properties?: Record<string, any>;
  attributes?: Record<string, any>;
}

interface NFT {
  metadata: METADATA;
  owner: string | null;
  id: number; // Ensure this is number if you convert it when setting the state
  tokenURI: string;
  type: string;
}

export const chain = defineChain(97);
// export const contractAddress = "0xC0d314ccE6073497B709b0dd1D699237478a1E0c";
export const contractAddress = "0xE16C07D687A7Bf5e295D3C552edC927C28F25EE9";

export const CardTable = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const contract = getContract({
    client,
    chain,
    address: contractAddress,
  });

  // @ts-ignore
  async function fetchNFT() {
    setLoading(true);
    const allNFTs = await getNFTs({
      contract,
      start: 0,
      count: 10,
    });
    console.log({ allNFTs });
    const formattedNFTs = allNFTs.map((nft) => ({
      ...nft,
      id: Number(nft.id),
      metadata: {
        ...nft.metadata,
        // customImage: nft.metadata.customImage,
      },
    }));
    console.log({ formattedNFTs });
    setNfts(formattedNFTs);
    setLoading(false);
  }

  useEffect(() => {
    fetchNFT();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl font-medium">Loading...</div>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl">
            {nfts.slice(1).map((nft) => (
              <Link
                key={nft.id}
                href={`https://sepolia.etherscan.io/address/${contractAddress}`}
                target="_blank"
                className="block bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="relative h-48 w-full">
                  {nft.metadata.image ? (
                    <Image
                      src={resolveIPFS(nft.metadata.image)}
                      alt={nft.metadata.name ?? "NFT"}
                      layout="fill"
                      objectFit="cover"
                      className="hover:opacity-90"
                    />
                  ) : (
                    <div className="flex justify-center items-center h-full bg-gray-100 text-gray-500">
                      No image available
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h1 className="text-lg font-bold text-gray-900">
                    {nft.metadata.name}
                  </h1>
                  <p className="text-sm text-gray-700">
                    {nft.owner
                      ? `Owner: ${walletFormat(nft.owner)}`
                      : "Owner: None"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const resolveIPFS = (url: string) => {
  if (!url) return "https://images.app.goo.gl/thQDD7YrpDdgnDTu8";
  const ipfsPrefix = "ipfs://";
  if (url.startsWith(ipfsPrefix)) {
    return `https://ipfs.io/ipfs/${url.slice(ipfsPrefix.length)}`;
  }
  return url;
};
