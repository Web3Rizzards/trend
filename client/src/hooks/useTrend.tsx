import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import { TrendSDK } from "../lib/sign";

export function useTrend() {
  const { data: walletClient } = useWalletClient();
  const [trendSDK, setTrendSDK] = useState<TrendSDK | null>(null);

  useEffect(() => {
    if (walletClient) {
      const sdk = new TrendSDK(undefined, walletClient);
      setTrendSDK(sdk);
    }
  }, [walletClient]);

  return trendSDK;
}
