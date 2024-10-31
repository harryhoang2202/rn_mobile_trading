export const applicationProperties = {
  defaultTheme: {
    code: "dark",
    icon: "Dark",
    name: "Dark",
  },
  themes: [
    {
      code: "dark",
      icon: "Dark",
      name: "Dark",
    },
    {
      code: "light",
      icon: "Light",
      name: "Light",
    },
  ],
  defaultCurrency: { code: "USD", value: 1, name: "US Dollar", symbol: "$" },
  currencies: [
    {
      code: "AUD",
      name: "Australian Dollar",
      symbol: "$",
    },
    {
      code: "EUR",
      name: "Euro",
      symbol: "€",
    },
    {
      code: "GBP",
      name: "British Pound",
      symbol: "£",
    },
    {
      code: "RUB",
      name: "Russian Ruble",
      symbol: "₽",
    },
    {
      code: "USD",
      name: "US Dollar",
      symbol: "$",
    },
  ],
  defaultWalletName: "PentaWallet",
  logoURI: {
    app: "https://pentawallet.herokuapp.com/logo.png",
    eth: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    bsc: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
    polygon:
      "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
    tron: "https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png",
  },
  endpoints: {
    app: {
      url: "https://pentawallet.herokuapp.com",
      wssUrl: "https://pentawallet.herokuapp.com/wss/v1/hello-wss",
      kycUrl: "https://penta-kyc-a5abc7bb33a8.herokuapp.com",
    },
    cryptoCompare: {
      apiKey:
        "919b58d5e51b9a788012e79178b7af7e541744bed5aaa2042c1f683120abfad1",
    },
    apiBtc: "https://blockstream.info/api/",
    apiBsc:
      "https://api.bscscan.com/api?apiKey=DI5F6DDAVHJHHNE3HH8SF7UTP2R4D7PTBU",
    apiEth:
      "https://api.etherscan.com/api?apiKey=JW4VI7MBC4BFBYI29FGN17IYQCSNBCJSMQ",
    apiPolygon:
      "https://api.polygonscan.com/api?apiKey=Z2BKEA7HR8YYQNAWT6AI1BFVWFNA6X2YSN",
    privacyPolicy: "https://www.pentawallet.com/privacy-policy/",
    termsOfService: "https://www.pentawallet.com/terms-of-services/",
    ramp: "https://app.ramp.network/?hostApiKey=ycrtmt9ec9xmgn3cgqvgbt9sw6jyptmxyfnm7f3x&hostAppName=PentaWallet&hostLogoUrl=https://www.pentawallet.com/wp-content/uploads/2023/08/PentaWallet-Logo_updated.png",
    helpCenter: "https://www.pentawallet.com/#Home",
    twitter: "https://pentawallet.com",
    telegram: "https://pentawallet.com",
    facebook: "https://pentawallet.com",
    reddit: "https://pentawallet.com",
    youtube: "https://pentawallet.com",
    about: "https://www.pentawallet.com/#Home",
    discord: "https://pentawallet.com",
  },
  dapps: [
    {
      id: "curve-finance",
      name: "Curve Finance",
      desc: "Creating deep on-chain liquidity using advanced bonding curves",
      logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/6538.png",
      url: "https://curve.fi/",
    },
    {
      id: "yearn.finance",
      name: "yearn.finance",
      desc: "Decentralized finance (DeFi) platform which aims to perform a host of function such as aggregated liquidity, leveraged trading, and automated marketing making",
      logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/5864.png",
      url: "https://yearn.finance/vaults",
    },
    {
      id: "aave",
      name: "Aave",
      desc: "Open source and non-custodial protocal to earn interest on deposits & borrow assets",
      logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png",
      url: "https://app.aave.com/",
    },
    {
      id: "uniswap",
      name: "Uniswap Exchange",
      desc: "Uniswap is a protocal for automated token exchange",
      logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
      url: "https://app.uniswap.org/#/swap",
    },
    {
      id: "1inch.io",
      name: "1inch.io",
      desc: "Token Swap Aggregator",
      logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/8104.png",
      url: "https://app.1inch.io/#/1/unified/swap/ETH/DAI",
    },
    {
      id: "pancakeswap.finance",
      name: "Exchange | PancakeSwap",
      desc: "The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by PancakeSwap), NFTs, and more, on a platform you can trust.",
      logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png",
      url: "https://pancakeswap.finance/swap",
    },
    {
      id: "arbitrum.bridge",
      name: "Arbitrum | Bridge",
      desc: "Built to scale Ethereum, Arbitrum brings you 10x lower costs while inheriting Ethereum’s security model. Arbitrum is a Layer 2 Optimistic Rollup.",
      logo: "https://bridge.arbitrum.io/logo.png",
      url: "https://bridge.arbitrum.io/",
    },
  ],
  walletConnect: {
    description: "PentaWallet",
    url: "https://www.pentawallet.com/policy",
    icons: ["https://pentawallet.herokuapp.com/logo.png"],
    name: "Penta Wallet",
    ssl: true,
  },
  oneSignal: {
    appId: "a4223982-d066-4125-aabb-e7e259cadce9",
  },
  networks: [
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      chain: "ETH",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    },
    {
      id: "binance-chain",
      name: "Binance Smart Chain",
      chain: "BSC",
      symbol: "BNB",
      logoURI:
        "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
    },
    {
      id: "polygon",
      name: "Polygon",
      chain: "POLYGON",
      symbol: "MATIC",
      logoURI:
        "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
    },
  ],
};
