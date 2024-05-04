"use client";

import { createThirdwebClient } from "thirdweb";
import { useActiveAccount, useConnect } from "thirdweb/react";
import { createWallet, injectedProvider } from "thirdweb/wallets";

const clientId = "195326385802c0608eeeb5be3e013035";
export const client = createThirdwebClient({ clientId });

export const Navbar = () => {
  const { connect, isConnecting, error } = useConnect();
  const activeAccount = useActiveAccount();

  const { address } = activeAccount || {};
  console.log("activeAccount", activeAccount);

  const handleConnect = async () => {
    connect(async () => {
      const metamask = createWallet("io.metamask");
      if (injectedProvider("io.metamask")) {
        await metamask.connect({ client });
      } else {
        await metamask.connect({
          client,
          walletConnect: { showQrModal: true },
        });
      }
      return metamask;
    });
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">Joseph Puffles Collection </h1>
        <div>
          {address ? (
            walletFormat(address)
          ) : (
            <button onClick={handleConnect}>Connect Wallet</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export function walletFormat(wallet: string) {
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
}
