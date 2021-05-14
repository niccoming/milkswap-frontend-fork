import contracts from './contracts'
import { FarmConfig, QuoteToken } from './types'

const farms: FarmConfig[] = [
  {
    pid: 24,
    lpSymbol: 'CCDI-BNB',
    lpAddresses: {
      97: '', // BUSD-BNB
      56: '0x03fc5bdfa985af2a1738734adc4e92b7f45550a5', // BUSD-BNB
    },
    tokenSymbol: 'CCDI',
    tokenAddresses: contracts.ccdi,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  },
  {
    pid: 25,
    lpSymbol: 'CCDI-BUSD',
    lpAddresses: {
      97: '', // CCDI-BUSD
      56: '0x6c81f46b7c3d28aa062bdd9d04c82e61a418fc2e', // CCDI-BUSD
    },
    tokenSymbol: 'CCDI',
    tokenAddresses: contracts.ccdi,
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 11,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      97: '', // BUSD-BNB
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16', // BUSD-BNB
    },
    tokenSymbol: 'BUSD',
    tokenAddresses: contracts.busd,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  },
  {
    pid: 12,
    lpSymbol: 'BUSD-USDT',
    lpAddresses: {
      97: '', // BUSD-USDT
      56: '0x7EFaEf62fDdCCa950418312c6C91Aef321375A00', // BUSD-USDT
    },
    tokenSymbol: 'BUSD',
    tokenAddresses: contracts.busd,
    quoteTokenSymbol: QuoteToken.USDT,
    quoteTokenAdresses: contracts.usdt,
  },
  {
    pid: 13,
    lpSymbol: 'BUSD-USDC',
    lpAddresses: {
      97: '', // BUSD-USDC
      56: '0x2354ef4df11afacb85a5c7f98b624072eccddbb1', // BUSD-USDT
    },
    tokenSymbol: 'BUSD',
    tokenAddresses: contracts.usdc,
    quoteTokenSymbol: QuoteToken.USDC,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 14,
    lpSymbol: 'BUSD-DAI',
    lpAddresses: {
      97: '', // BUSD-DAI
      56: '0x66FDB2eCCfB58cF098eaa419e5EfDe841368e489', // BUSD-DAI
    },
    tokenSymbol: 'BUSD-DAI',
    tokenAddresses: contracts.dai,
    quoteTokenSymbol: QuoteToken.DAI,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 15,
    lpSymbol: 'BTCB-BNB',
    lpAddresses: {
      97: '', // BNB-BTC
      56: '0x61EB789d75A95CAa3fF50ed7E47b96c132fEc082', // BTCB-BNB
    },
    tokenSymbol: 'BTCB-BNB',
    tokenAddresses: contracts.btcb,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  },
  {
    pid: 16,
    lpSymbol: 'ETH-BNB',
    lpAddresses: {
      97: '', // BNB-ETH
      56: '0x74e4716e431f45807dcf19f284c7aa99f18a4fbc', //  BNB-ETH
    },
    tokenSymbol: ' BNB-ETH',
    tokenAddresses: contracts.eth,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  },
  {
    pid: 17,
    lpSymbol: 'DOT-BNB',
    lpAddresses: {
      97: '', // BNB-DOT
      56: '0x74e4716e431f45807dcf19f284c7aa99f18a4fbc', //  BNB-DOT
    },
    tokenSymbol: 'BNB-DOT',
    tokenAddresses: contracts.dot,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  },
  {
    pid: 18,
    lpSymbol: 'CAKE-BUSD',
    lpAddresses: {
      97: '', // CAKE-BUSD
      56: '0x804678fa97d91b974ec2af3c843270886528a9e6', // CAKE-BUSD
    },
    tokenSymbol: 'CAKE-BUSD',
    tokenAddresses: contracts.cake,
    quoteTokenSymbol: QuoteToken.CAKE,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 19,
    lpSymbol: 'CAKE-BNB',
    lpAddresses: {
      97: '', // CAKE-BNB
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0', // CAKE-BNB
    },
    tokenSymbol: 'CAKE-BNB',
    tokenAddresses: contracts.cake,
    quoteTokenSymbol: QuoteToken.CAKE,
    quoteTokenAdresses: contracts.wbnb,
  },
  {
    pid: 20,
    lpSymbol: '4blet',
    lpAddresses: {
      97: '', // 4blet
      56: '0x9cb73f20164e399958261c289eb5f9846f4d1404', // 4blet
    },
    tokenSymbol: '4blet',
    tokenAddresses: contracts.busd,
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
]

export default farms
