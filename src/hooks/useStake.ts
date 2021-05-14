import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync, updateUserStakedBalance, updateUserBalance ,fetchPublicPurchaseDataAsync,fetchBiddingPurchaseDataAsync} from 'state/actions'
import { stake, sousStake, sousStakeBnb,publicSwapSpon,publicBidding,publicWithDraw,publicHarvest,publicRestart,publicWithdrawbyDev,
  
  biddingBidding,biddingWithDraw,biddingHarvest,biddingRestart } from 'utils/callHelpers'
import { useMasterchef, useSousChef,useBiddingPurchase,usePublicPurchase } from './useContract'

const useStake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useMasterchef()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onStake: handleStake }
}

export const usePublicSwapSpon = () => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const publicPurchaseContract = usePublicPurchase()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await publicSwapSpon(publicPurchaseContract, amount, account)
      dispatch(fetchPublicPurchaseDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, publicPurchaseContract],
  )

  return { onUsePublicSwapSpon: handleStake }
}

export const usePublicBidding = () => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const publicPurchaseContract = usePublicPurchase()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await publicBidding(publicPurchaseContract, amount, account)
      dispatch(fetchPublicPurchaseDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, publicPurchaseContract],
  )

  return { onUsePublicBidding: handleStake }
}
export const usePublicWithDraw = () => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const publicPurchaseContract = usePublicPurchase()

  const handleStake = useCallback(
    async () => {
      const txHash = await publicWithDraw(publicPurchaseContract, account)
      dispatch(fetchPublicPurchaseDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, publicPurchaseContract],
  )

  return { onUsePublicWithDraw: handleStake }
}
export const usePublicHarvest = () => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const publicPurchaseContract = usePublicPurchase()

  const handleStake = useCallback(
    async () => {
      const txHash = await publicHarvest(publicPurchaseContract, account)
      dispatch(fetchPublicPurchaseDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, publicPurchaseContract],
  )

  return { onUsePublicHarvest: handleStake }
}

export const usePublicRestart = () => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const publicPurchaseContract = usePublicPurchase()

  const handleStake = useCallback(
    async () => {
      const txHash = await publicRestart(publicPurchaseContract, account)
      dispatch(fetchPublicPurchaseDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, publicPurchaseContract],
  )

  return { onUsePublicRestart: handleStake }
}

export const usePublicWithdrawbyDev = (amount) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const publicPurchaseContract = usePublicPurchase()

  const handleStake = useCallback(
    async () => {
      const txHash = await publicWithdrawbyDev(publicPurchaseContract,amount, account)
      dispatch(fetchPublicPurchaseDataAsync(account))
      console.info(txHash)
    },
    [account, amount,dispatch, publicPurchaseContract],
  )

  return { onUsePublicWithdrawbyDev: handleStake }
}


export const useBiddingBidding = () => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const biddingPurchaseContract = useBiddingPurchase()

  const handleStake = useCallback(
    async () => {
      const txHash = await biddingBidding(biddingPurchaseContract, account)
      dispatch(fetchBiddingPurchaseDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, biddingPurchaseContract],
  )

  return { onUseBiddingBidding: handleStake }
}

export const useBiddingWithDraw = () => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const biddingPurchaseContract = useBiddingPurchase()

  const handleStake = useCallback(
    async () => {
      const txHash = await  biddingWithDraw(biddingPurchaseContract, account)
      dispatch(fetchBiddingPurchaseDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, biddingPurchaseContract],
  )

  return { onUseBiddingWithDraw: handleStake }
}
export const useBiddingHarvest = () => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const biddingPurchaseContract = useBiddingPurchase()

  const handleStake = useCallback(
    async () => {
      const txHash = await  biddingHarvest(biddingPurchaseContract, account)
      dispatch(fetchBiddingPurchaseDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, biddingPurchaseContract],
  )

  return { onUseBiddingHarvest: handleStake }
}

export const useBiddingRestart = () => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const biddingPurchaseContract = useBiddingPurchase()

  const handleStake = useCallback(
    async () => {
      const txHash = await  biddingRestart(biddingPurchaseContract, account)
      dispatch(fetchBiddingPurchaseDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, biddingPurchaseContract],
  )

  return { onUseBiddingRestart: handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useMasterchef()

  const handleStake = useCallback(
    async (amount: string) => {
      await stake(masterChefContract, 0, amount, account)
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, masterChefContract, sousId],
  )

  return { onStake: handleStake }
}

export default useStake
