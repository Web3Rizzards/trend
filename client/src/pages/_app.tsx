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
      <ThemeUpdaterProvider>
        <Theme>
          <DynamicContextProvider
            settings={{
              environmentId: ENVIRONMENT.DYNAMIC_ID,
              walletConnectors: [EthereumWalletConnectors],
            }}
          >
            <WagmiProvider config={wagmiConfig}>
              <QueryClientProvider client={queryClient}>
                <DynamicWagmiConnector>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </DynamicWagmiConnector>
              </QueryClientProvider>
            </WagmiProvider>
          </DynamicContextProvider>
        </Theme>
      </ThemeUpdaterProvider>
    </>
  );
}
