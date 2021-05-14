import { PoolConfig, QuoteToken, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId:0,
    tokenName: 'CCDI',
    stakingTokenName: QuoteToken.CCDI,
    stakingTokenAddress: '0xa36F4aF7e0367FAa9B2Be6E0E2Da9bc461C617c1', // CCDI
    // stakingTokenAddress: '0x9b027b8923D5C5A3135744a128fE7a53F8666DCA', // testnet
    contractAddress: {
      97: '', // MasterChef
      56: '0x9De50068b474890d72419D6d70E5a2cC6B7A28A0', // MasterChef
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://milkswap.app',
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 18,
    multiplier: 10,
    locktime:  0,
  },
  {
    sousId:21,
    tokenName: 'SPON',
    stakingTokenName: QuoteToken.SPON,
    stakingTokenAddress: '0xF6B3777FBD13521db032Cf87fC111a813543549A', // CAKE
    // stakingTokenAddress: '0x9b027b8923D5C5A3135744a128fE7a53F8666DCA', // testnet
    contractAddress: {
      97: '', // MasterChef
      56: '0x9De50068b474890d72419D6d70E5a2cC6B7A28A0', // MasterChef
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://milkswap.app',
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 18,
    multiplier: 6,
    locktime: 0,
    depositFee: 0,
  },
  {
    sousId:26,
    tokenName: 'BUSD',
    stakingTokenName: QuoteToken.BUSD,
    stakingTokenAddress: '0xe9e7cea3dedca5984780bafc599bd69add087d56', // CAKE
    // stakingTokenAddress: '0x9b027b8923D5C5A3135744a128fE7a53F8666DCA', // testnet
    contractAddress: {
      97: '', // MasterChef
      56: '0x9De50068b474890d72419D6d70E5a2cC6B7A28A0', // MasterChef
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://milkswap.app',
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 18,
    multiplier: 2,
    locktime: 180,
    depositFee: 400,
  },
  {
    sousId:2,
    tokenName: 'wBNB',
    stakingTokenName: QuoteToken.BNB,
    stakingTokenAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // CAKE
    // stakingTokenAddress: '0x9b027b8923D5C5A3135744a128fE7a53F8666DCA', // testnet
    contractAddress: {
      97: '', // MasterChef
      56: '0x9De50068b474890d72419D6d70E5a2cC6B7A28A0', // MasterChef
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://milkswap.app',
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 18,
    multiplier: 2,
    locktime: 10800,
    depositFee: 400,
  },
  {
    sousId:3,
    tokenName: 'USDT',
    stakingTokenName: QuoteToken.USDT,
    stakingTokenAddress: '0x55d398326f99059ff775485246999027b3197955', // CAKE
    // stakingTokenAddress: '0x9b027b8923D5C5A3135744a128fE7a53F8666DCA', // testnet
    contractAddress: {
      97: '', // MasterChef
      56: '0x9De50068b474890d72419D6d70E5a2cC6B7A28A0', // MasterChef
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://milkswap.app',
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 18,
    multiplier: 1,
    locktime: 10800,
    depositFee: 400,
  },
  {
    sousId:4,
    tokenName: 'USDC',
    stakingTokenName: QuoteToken.USDC,
    stakingTokenAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // CAKE
    // stakingTokenAddress: '0x9b027b8923D5C5A3135744a128fE7a53F8666DCA', // testnet
    contractAddress: {
      97: '', // MasterChef
      56: '0x9De50068b474890d72419D6d70E5a2cC6B7A28A0', // MasterChef
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://milkswap.app',
    harvest: true,
    tokenPerBlock: '10',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 18,
    multiplier: 1,
    locktime: 10800,
    depositFee: 400,
  },
  {
    sousId:5,
    tokenName: 'DAI',
    stakingTokenName: QuoteToken.DAI,
    stakingTokenAddress: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', // CAKE
    // stakingTokenAddress: '0x9b027b8923D5C5A3135744a128fE7a53F8666DCA', // testnet
    contractAddress: {
      97: '', // MasterChef
      56: '0x9De50068b474890d72419D6d70E5a2cC6B7A28A0', // MasterChef
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://milkswap.app',
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 18,
    multiplier: 1,
    locktime: 10800,
    depositFee: 400,
  },
  {
    sousId:6,
    tokenName: 'BTCB',
    stakingTokenName: QuoteToken.BTCB,
    stakingTokenAddress: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c', // CAKE
    // stakingTokenAddress: '0x9b027b8923D5C5A3135744a128fE7a53F8666DCA', // testnet
    contractAddress: {
      97: '', // MasterChef
      56: '0x9De50068b474890d72419D6d70E5a2cC6B7A28A0', // MasterChef
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://milkswap.app',
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 18,
    multiplier: 2,
    locktime: 10800,
    depositFee: 400,
  },
  {
    sousId:7,
    tokenName: 'ETH',
    stakingTokenName: QuoteToken.ETH,
    stakingTokenAddress: '0x2170ed0880ac9a755fd29b2688956bd959f933f8', // CAKE
    // stakingTokenAddress: '0x9b027b8923D5C5A3135744a128fE7a53F8666DCA', // testnet
    contractAddress: {
      97: '', // MasterChef
      56: '0x9De50068b474890d72419D6d70E5a2cC6B7A28A0', // MasterChef
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://milkswap.app',
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 18,
    multiplier: 2,
    locktime: 10800,
    depositFee: 400,
  },
  {
    sousId:8,
    tokenName: 'DOT',
    stakingTokenName: QuoteToken.DOT,
    stakingTokenAddress: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402', // CAKE
    // stakingTokenAddress: '0x9b027b8923D5C5A3135744a128fE7a53F8666DCA', // testnet
    contractAddress: {
      97: '', // MasterChef
      56: '0x9De50068b474890d72419D6d70E5a2cC6B7A28A0', // MasterChef
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://milkswap.app',
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 18,
    multiplier: 1,
    locktime: 10800,
    depositFee: 400,
  },
  {
    sousId:9,
    tokenName: 'CAKE',
    stakingTokenName: QuoteToken.CAKE,
    stakingTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', // CAKE
    // stakingTokenAddress: '0x9b027b8923D5C5A3135744a128fE7a53F8666DCA', // testnet
    contractAddress: {
      97: '', // MasterChef
      56: '0x9De50068b474890d72419D6d70E5a2cC6B7A28A0', // MasterChef
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://milkswap.app',
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 18,
    multiplier: 1,
    locktime: 10800,
    depositFee: 400,
  },
  {
    sousId:10,
    tokenName: 'BELT',
    stakingTokenName: QuoteToken.BELT,
    stakingTokenAddress: '0xe0e514c71282b6f4e823703a39374cf58dc3ea4f', // CAKE
    // stakingTokenAddress: '0x9b027b8923D5C5A3135744a128fE7a53F8666DCA', // testnet
    contractAddress: {
      97: '', // MasterChef
      56: '0x9De50068b474890d72419D6d70E5a2cC6B7A28A0', // MasterChef
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://milkswap.app',
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 18,
    multiplier: 1,
    locktime: 10800,
    depositFee: 400,
  },
]

export default pools
