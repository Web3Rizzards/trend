import { createConfig } from "wagmi";
import { http } from "viem";
import { mainnet, base } from "viem/chains";

const wagmiConfig = createConfig({
  chains: [mainnet, base],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});

export default wagmiConfig;
