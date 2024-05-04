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

export const chain = defineChain(11155111);
export const contractAddress = "0xB69B8961a4fa3F7D01e7b24807a40C5bB6B69Cf5";

export const CardTable = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const contract = getContract({
    client,
    chain: defineChain(11155111),
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
    const formattedNFTs = allNFTs.map((nft) => ({
      ...nft,
      id: Number(nft.id),
      metadata: {
        ...nft.metadata,
        // customImage: nft.metadata.customImage,
      },
    }));
    setNfts(formattedNFTs);
    setLoading(false);
  }

  useEffect(() => {
    fetchNFT();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl font-medium">Loading...</div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {nfts.map((nft) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <Link
                target="_blank"
                href={`https://sepolia.etherscan.io/address/${contractAddress}`}>
                <div
                  key={nft.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative h-48 w-full">
                    {nft.metadata.image ? (
                      <Image
                        src={resolveIPFS(nft.metadata.image)}
                        alt={nft.metadata.name ?? "NFT"}
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <div>No image available</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h1 className="text-lg font-bold text-gray-900 shadow-sm">
                      {nft.metadata.name}
                    </h1>
                    <p className="text-sm text-gray-700 shadow-sm">
                      {nft.owner
                        ? `Owner: ${walletFormat(nft.owner)}`
                        : "Owner: None"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
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
