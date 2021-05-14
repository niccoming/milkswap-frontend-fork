import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { kebabCase } from 'lodash'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Toast, toastTypes } from '@pancakeswap-libs/uikit'
import { useSelector, useDispatch } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import { useAppDispatch } from 'state'
import { QuoteToken, Team } from 'config/constants/types'
import { getBalanceNumber } from 'utils/formatBalance'
import {
  getAddress,
  getCakeAddress,
  getSopnAddress,
} from 'utils/addressHelpers'
import {
  fetchFarmsPublicDataAsync,
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchPublicPurchaseDataAsync,
  fetchBiddingPurchaseDataAsync,
  push as pushToast,
  remove as removeToast,
  clear as clearToast,
} from './actions'
import { State, Farm, Pool, ProfileState, TeamsState, PriceState,AchievementState } from './types'
import { fetchProfile } from './profile'
import { fetchTeam, fetchTeams } from './teams'
import { fetchAchievements } from './achievements'
import { fetchPrices } from './prices'

const ZERO = new BigNumber(0)
// Prices
export const useFetchPriceList = () => {
  const { slowRefresh } = useRefresh()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchPrices())
  }, [dispatch, slowRefresh])
}


export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
    dispatch(fetchPoolsPublicDataAsync())
  }, [dispatch, slowRefresh])
}

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
    balances  :  farm.userData ? new BigNumber(farm.userData.balances) : new BigNumber(0),
    amount  :  farm.userData ? new BigNumber(farm.userData.amount) : new BigNumber(0),
    harvestTime  :  farm.userData ? new BigNumber(farm.userData.harvestTime) : new BigNumber(0),
    pending  :  farm.userData ? new BigNumber(farm.userData.pending) : new BigNumber(0),
    locking  : farm.userData ? new BigNumber(farm.userData.locking) : new BigNumber(0),
  }
}

export const usePublicPurchase = (account) => {
  
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPublicPurchaseDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const publicPurchase = useSelector((state: State) => state.purchase.publicPurchase)
  return publicPurchase
}

export const useBiddingPurchase = (account) => {
  
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    console.log("hooks useBiddingPurchase")
    if (account) {
      dispatch(fetchBiddingPurchaseDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const biddingPurchase = useSelector((state: State) => state.purchase.bidding)
  return biddingPurchase
}

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const pools = useSelector((state: State) => state.pools.data)
  return pools
}

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return pool
}

// Prices
export const useGetApiPrices = () => {
  const prices: PriceState['data'] = useSelector((state: State) => state.prices.data)
  return prices
}

export const useGetApiPrice = (address: string) => {

  const cakePrice = usePriceCakeBusd().toNumber()
  
  const prices = useGetApiPrices()
  if (!prices) {
    return 0
  }

  if (address === getCakeAddress()) {
    return cakePrice
  } 

  if (address === getSopnAddress()) {
    return 10
  }

  return prices[address.toLowerCase()]?prices[address.toLowerCase()]:0
}

export const usePriceBnbBusd = (): BigNumber => {
  const pid = 11 // BUSD-BNB LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(1).div(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceCakeBusd = (): BigNumber => {
  const bnbPriceUSD = usePriceBnbBusd()
  const farm = useFarmFromPid(24)
  return  farm.tokenPriceVsQuote ? bnbPriceUSD.times(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceEthBusd = (): BigNumber => {
  const pid = 14 // ETH-BNB LP
  const bnbPriceUSD = usePriceBnbBusd()
  const farm = useFarmFromPid(pid)
  return ZERO
}

export const usePriceEthBnb = (): BigNumber => {
  const priceBnbBusd = usePriceBnbBusd()
  const priceEthBusd = usePriceEthBusd()
  return priceEthBusd.div(priceBnbBusd)
}

// Toasts
export const useToast = () => {
  const dispatch = useDispatch()
  const helpers = useMemo(() => {
    const push = (toast: Toast) => dispatch(pushToast(toast))

    return {
      toastError: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.DANGER, title, description })
      },
      toastInfo: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.INFO, title, description })
      },
      toastSuccess: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.SUCCESS, title, description })
      },
      toastWarning: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.WARNING, title, description })
      },
      push,
      remove: (id: string) => dispatch(removeToast(id)),
      clear: () => dispatch(clearToast()),
    }
  }, [dispatch])

  return helpers
}

// Profile

export const useFetchProfile = () => {
  const { account } = useWallet()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchProfile(account))
  }, [account, dispatch])
}

export const useProfile = () => {
  const { isInitialized, isLoading, data, hasRegistered }: ProfileState = useSelector((state: State) => state.profile)
  return { profile: data, hasProfile: isInitialized && hasRegistered, isInitialized, isLoading }
}

// Teams

export const useTeam = (id: number) => {
  const team: Team = useSelector((state: State) => state.teams.data[id])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTeam(id))
  }, [id, dispatch])

  return team
}

export const useTeams = () => {
  const { isInitialized, isLoading, data }: TeamsState = useSelector((state: State) => state.teams)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTeams())
  }, [dispatch])

  return { teams: data, isInitialized, isLoading }
}

// Achievements

export const useFetchAchievements = () => {
  const { account } = useWallet()
  const dispatch = useDispatch()

  useEffect(() => {
    if (account) {
      dispatch(fetchAchievements(account))
    }
  }, [account, dispatch])
}

export const useAchievements = () => {
  const achievements: AchievementState['data'] = useSelector((state: State) => state.achievements.data)
  return achievements
}

export const useTotalValue = (): BigNumber => {
  const farms = useFarms()
  const pools = useSelector((state: State) => state.pools.data)
  const cakePrice = usePriceCakeBusd()
  const prices: PriceState['data'] = useSelector((state: State) => state.prices.data)
  const getPrice = (address)=>{
    if (address === getCakeAddress()) {
      return cakePrice
    } 
    if (address === getSopnAddress()) {
      return  new BigNumber(10)
    }
    if (prices) {
      return prices[address.toLowerCase()]?prices[address.toLowerCase()]:0  
    }
    return 0
  }
  let value = new BigNumber(0)
  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i]
    const quoteTokenPriceUsd = getPrice(getAddress(farm.quoteTokenAdresses))
    if (farm.lpTotalInQuoteToken) {
      const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(quoteTokenPriceUsd)
      value = value.plus(totalLiquidity)
    }
  }
  for (let index = 0; index < pools.length; index++) {
    const pool = pools[index]
    const quoteTokenPriceUsd = getPrice(pool.stakingTokenAddress)
    if (pool.totalStaked) {
      const totalLiquidity = new BigNumber(getBalanceNumber(pool.totalStaked,18)).times(quoteTokenPriceUsd)
      value = value.plus(totalLiquidity)
    }
  }
  return value
}
