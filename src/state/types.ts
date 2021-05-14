import { Toast } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import { CampaignType, FarmConfig, Nft, PoolConfig,PurchaseConfig, Team } from 'config/constants/types'

export type TranslatableText =
  | string
  | {
      id: number
      fallback: string
      data?: {
        [key: string]: string | number
      }
    }

export interface Farm extends FarmConfig {
  tokenAmount?: BigNumber
  quoteTokenAmount?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  totalLiquidity?:BigNumber
  totalAllocPoint?:number
  tokenPriceVsQuote?: BigNumber
  poolWeight?: BigNumber
  locktime?:number
  depositFeeBP?:number
  tokenDecimals?:number 
  userData?: {
    allowance: BigNumber
    tokenBalance: BigNumber
    stakedBalance: BigNumber
    earnings: BigNumber
    rewardDebt:BigNumber
    balances:BigNumber
    amount:BigNumber
    locking:BigNumber
    pending:BigNumber
    harvestTime:number
  }
}
export interface Purchase extends PurchaseConfig {

}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber
  startBlock?: number
  endBlock?: number
  lockTime?:number
  price?:number
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
    balances:BigNumber
    amount:BigNumber
    rewardDebt:BigNumber
    locking:BigNumber
    pending:BigNumber
    harvestTime:number
  }
}

export interface Profile {
  userId: number
  points: number
  teamId: number
  nftAddress: string
  tokenId: number
  isActive: boolean
  username: string
  nft?: Nft
  team: Team
  hasRegistered: boolean
}

// Slices states

export interface ToastsState {
  data: Toast[]
}

export interface FarmsState {
  data: Farm[]
}

export interface PoolsState {
  data: Pool[]
}

export interface ProfileState {
  isInitialized: boolean
  isLoading: boolean
  hasRegistered: boolean
  data: Profile
}
export interface publicPurchaseInfo {
  lastPurchaseTime : BigNumber,
  purchaseGrade: BigNumber,
  biddingTotal: BigNumber,
  PURCHASE_TIME: BigNumber,
  READY_TIME: BigNumber,
  PURCHASE_BONUS: BigNumber,
  BonusPrice: BigNumber,
  balance: BigNumber,
}
export interface biddingPurchaseInfo {
  lastPurchaseTime : BigNumber,
  biddingTotal: BigNumber,
  PURCHASE_TIME: BigNumber,
  BonusPrice: BigNumber,
  balance: BigNumber,
  conversion: BigNumber,
  awardAddress:string[]
}
export interface biddingUserInfo {
  allowanceICake:BigNumber
  allowanceCake: BigNumber
  balancesCake: BigNumber
  amount:BigNumber
  award:BigNumber
  realAward:BigNumber
}

export interface PurchaseState {
  /**
   * name
   */
  publicPurchase?: {
    purchaseInfo:publicPurchaseInfo
    allowance: BigNumber
    balances:BigNumber
    allowanceCake: BigNumber
    balancesCake: BigNumber
    amount:BigNumber
    award:BigNumber
    realAward:BigNumber
    queueUp:BigNumber    
  }
  bidding?: {
    biddingUser:biddingUserInfo,
    biddingPurchase:biddingPurchaseInfo,
  } 
}

export type TeamResponse = {
  0: string
  1: string
  2: string
  3: string
  4: boolean
}

export type TeamsById = {
  [key: string]: Team
}

export interface TeamsState {
  isInitialized: boolean
  isLoading: boolean
  data: TeamsById
}

export interface Achievement {
  id: string
  type: CampaignType
  address: string
  title: TranslatableText
  description?: TranslatableText
  badge: string
  points: number
}

export interface AchievementState {
  data: Achievement[]
}

// Global state

export interface State {
  farms: FarmsState
  toasts: ToastsState
  pools: PoolsState
  profile: ProfileState
  prices: PriceState
  teams: TeamsState
  cakePrice:BigNumber
  achievements: AchievementState
  purchase:PurchaseState
}


// API Price State
export interface PriceApiList {
  /* eslint-disable camelcase */
  [key: string]: {
    name: string
    symbol: string
    price: string
    price_BNB: string
  }
}

export interface PriceApiListThunk {
  /* eslint-disable camelcase */
  [key: string]: number
}

export interface PriceApiResponse {
  /* eslint-disable camelcase */
  updated_at: string
  data: PriceApiList
}


export interface PriceApiResponse {
  /* eslint-disable camelcase */
  updated_at: string
  data: PriceApiList
}


export interface PriceApiThunk {
  /* eslint-disable camelcase */
  updated_at: string
  data: PriceApiListThunk
}

export interface PriceState {
  isLoading: boolean
  lastUpdated: string
  data: PriceApiListThunk
}