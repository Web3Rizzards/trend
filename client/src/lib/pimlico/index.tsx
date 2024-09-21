import { createSmartAccountClient } from "permissionless";
import { toSimpleSmartAccount } from "permissionless/accounts";
import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { useWalletClient } from "wagmi";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { entryPoint07Address } from "viem/account-abstraction";
import ENVIRONMENT from "@/configuration/environment";
import { privateKeyToAccount } from "viem/accounts";

const BASE_PIMLICO_URL = `https://api.pimlico.io/v2/sepolia/rpc?apikey=`;

const ENTRY_POINT: {
  address: `0x${string}`;
  version: "0.7" | "0.6";
} = {
  address: entryPoint07Address,
  version: "0.7",
};

const usePimlico = () => {
  const { data: walletClient } = useWalletClient();
  const [smartAccountClient, setSmartAccountClient] = useState<any>();

  const paymasterClient = createPimlicoClient({
    entryPoint: ENTRY_POINT,
    transport: http(`${BASE_PIMLICO_URL}${ENVIRONMENT.PERMISSIONLESS_API_KEY}`),
  });

  const initSmartAccount = async () => {
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(),
    });

    const simpleAccount = await toSimpleSmartAccount({
      client: publicClient,
      owner: privateKeyToAccount("0x..."),
      entryPoint: ENTRY_POINT,
    });

    const smartAccountClient = createSmartAccountClient({
      account: simpleAccount,
      chain: baseSepolia,
      paymaster: paymasterClient,
      bundlerTransport: http(
        `${BASE_PIMLICO_URL}${ENVIRONMENT.PERMISSIONLESS_API_KEY}`
      ),
      userOperation: {
        estimateFeesPerGas: async () =>
          (await paymasterClient.getUserOperationGasPrice()).fast,
      },
    });

    setSmartAccountClient(smartAccountClient);
  };

  useEffect(() => {
    initSmartAccount();
  }, []);

  return { smartAccountClient };
};

export default usePimlico;
