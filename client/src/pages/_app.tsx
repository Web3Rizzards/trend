import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Theme from "@/components/Shared/Theme/Theme";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import ENVIRONMENT from "@/configuration/environment";
import wagmiConfig from "@/configuration/wagmi";
import Layout from "@/components/Shared/Layout";
import BaseFont from "@/styles/fonts";
import { ThemeUpdaterProvider } from "@/context/useThemeUpdater";
import { UserProvider } from "@/context/UserContext";
import { ZeroDevSmartWalletConnectorsWithConfig } from "@dynamic-labs/ethereum-aa";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html,
        body {
          font-family: ${BaseFont.style.fontFamily};
        }

        input,
        textarea {
          font-family: ${BaseFont.style.fontFamily};
        }
      `}</style>
      <Toaster position="bottom-right" reverseOrder={false} />
      <ThemeUpdaterProvider>
        <Theme>
          <DynamicContextProvider
            settings={{
              environmentId: ENVIRONMENT.DYNAMIC_ID,
              walletConnectors: [
                EthereumWalletConnectors,
                ZeroDevSmartWalletConnectorsWithConfig({
                  bundlerRpc: process.env.NEXT_PUBLIC_ZERODEV_BUNDLER_RPC,
                  paymasterRpc: process.env.NEXT_PUBLIC_ZERODEV_PAYMASTER_RPC,
                }),
              ],
            }}
          >
            <WagmiProvider config={wagmiConfig}>
              <QueryClientProvider client={queryClient}>
                <DynamicWagmiConnector>
                  <UserProvider>
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  </UserProvider>
                </DynamicWagmiConnector>
              </QueryClientProvider>
            </WagmiProvider>
          </DynamicContextProvider>
        </Theme>
      </ThemeUpdaterProvider>
    </>
  );
}
