import BigNumber from 'bignumber.js'
import { TranslatableText } from 'state/types'

export type IfoStatus = 'coming_soon' | 'live' | 'finished'

export interface Ifo {
  id: string
  isActive: boolean
  address: string
  name: string
  subTitle?: string
  description?: string
  launchDate: string
  launchTime: string
  saleAmount: string
  raiseAmount: string
  cakeToBurn: string
  projectSiteUrl: string
  currency: string
  currencyAddress: string
  tokenDecimals: number
  releaseBlockNumber: number
  campaignId?: string
}

export enum QuoteToken {
  'BNB' = 'BNB',
  'wBNB' = 'wBNB',
  'CAKE' = 'CAKE',
  'SYRUP' = 'SYRUP',
  'BUSD' = 'BUSD',
  'BUSC' = 'BUSC',
  'DAI' = 'DAI',
  'BTCB' = 'BTCB',
  'USDT' = 'USDT',
  'USDC' = 'USDC',
  'DOT' = 'DOT',
  'TWT' = 'TWT',
  'UST' = 'UST',
  'ETH' = 'ETH',
  'BELT' = 'BELT',
  'SPON' = 'SPON',
  'CCDI' = 'CCDI',
  '4blet' = '4blet',
}

export enum PoolCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token
}

export interface Address {
  97?: string
  56: string
}

export interface FarmConfig {
  pid: number
  lpSymbol: string
  lpAddresses: Address
  tokenSymbol: string
  tokenAddresses: Address
  quoteTokenSymbol: QuoteToken
  quoteTokenAdresses: Address
  multiplier?: string
  isCommunity?: boolean
  quoteTokenPriceUsd?:number
  totalAllocPoint?:number
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  }
}

export interface PoolConfig {
  sousId: number
  image?: string
  tokenName: string
  stakingTokenName: QuoteToken
  stakingLimit?: number
  stakingTokenAddress?: string
  multiplier?: number,
  locktime ?: number,
  depositFee?: number,
  contractAddress: Address
  poolCategory: PoolCategory
  projectLink: string
  tokenPerBlock: string
  sortOrder?: number
  harvest?: boolean
  isFinished?: boolean
  tokenDecimals: number
  depositFeeBP?:number
}

export interface PurchaseConfig {
  apy ?: BigNumber
}




export type Images = {
  lg: string
  md: string
  sm: string
  ipfs?: string
}

export type NftImages = {
  blur: string
} & Images

export type Nft = {
  name: string
  description: string
  images: NftImages
  sortOrder: number
  bunnyId: number
}

export type TeamImages = {
  alt: string
} & Images

export type Team = {
  id: number
  name: string
  description: string
  isJoinable?: boolean
  users: number
  points: number
  images: TeamImages
  background: string
  textColor: string
}

export type CampaignType = 'ifo'

export type Campaign = {
  id: string
  type: CampaignType
  title?: TranslatableText
  description?: TranslatableText
  badge?: string
}
