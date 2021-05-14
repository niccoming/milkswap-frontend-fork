import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Contract } from 'web3-eth-contract'
import { ethers } from 'ethers'
import { useDispatch } from 'react-redux'
import { updateUserAllowance, fetchFarmUserDataAsync,fetchPublicPurchaseDataAsync,fetchBiddingPurchaseDataAsync } from 'state/actions'
import { approve} from 'utils/callHelpers'
import { useMasterchef, useCake,useICake, useSousChef, useLottery,useBusdContract,usePublicPurchase,useBiddingPurchase, } from './useContract'

// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const dispatch = useDispatch()
  const { account }: { account: string } = useWallet()
  const masterChefContract = useMasterchef()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, account)
      dispatch(fetchFarmUserDataAsync(account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, masterChefContract])

  return { onApprove: handleApprove }
}

// Approve a Pool
export const useSousApprove = (lpContract: Contract, sousId) => {
  const dispatch = useDispatch()
  const { account }: { account: string } = useWallet()
  const masterChefContract = useMasterchef()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, account)
      console.log(tx)
      dispatch(updateUserAllowance(sousId, account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, masterChefContract, sousId])

  return { onApprove: handleApprove }
}

export const usePublicPurchaseApprove = () => {
  const dispatch = useDispatch()
  const { account }: { account: string } = useWallet()
  const busdContract = useBusdContract()
  const publicPurchaseContract = usePublicPurchase()


  const handleApprove = useCallback(async () => {
    try {
      console.log("usePublicPurchaseApprove",busdContract, publicPurchaseContract, account)
      const tx = await approve(busdContract, publicPurchaseContract, account)
      console.log(tx)
      dispatch(fetchPublicPurchaseDataAsync( account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, busdContract,publicPurchaseContract])

  return { onPublicPurchaseonApprove: handleApprove }
}

export const usePublicPurchaseApproveCake = () => {
  const dispatch = useDispatch()
  const { account }: { account: string } = useWallet()
  const cakeContract = useCake()
  const publicPurchaseContract = usePublicPurchase()


  const handleApprove = useCallback(async () => {
    try {
      console.log("usePublicPurchaseApprove",cakeContract, publicPurchaseContract, account)
      const tx = await approve(cakeContract, publicPurchaseContract, account)
      console.log(tx)
      dispatch(fetchPublicPurchaseDataAsync( account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, cakeContract,publicPurchaseContract])

  return { onPublicPurchaseonApproveCake: handleApprove }
}

export const useBiddingPurchaseApprove  = () => {
  const dispatch = useDispatch()
  const { account }: { account: string } = useWallet()
  const cakeContract = useCake()
  const biddingPurchaseContract = useBiddingPurchase()

  const handleApprove = useCallback(async () => {
    try {
      
      const tx = await approve(cakeContract, biddingPurchaseContract, account)
      console.log(tx)
      dispatch(fetchBiddingPurchaseDataAsync(account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, cakeContract,biddingPurchaseContract])

  return { onBiddingPurchaseApprove: handleApprove }
}

export const useBiddingPurchaseApproveICake  = () => {
  const dispatch = useDispatch()
  const { account }: { account: string } = useWallet()
  const iCakeContract = useICake()
  const biddingPurchaseContract = useBiddingPurchase()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(iCakeContract, biddingPurchaseContract, account)
      console.log(tx)
      dispatch(fetchBiddingPurchaseDataAsync(account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch,iCakeContract,biddingPurchaseContract])

  return { onBiddingPurchaseApproveICake: handleApprove }
}


// Approve the lottery
export const useLotteryApprove = () => {
  const { account }: { account: string } = useWallet()
  const cakeContract = useCake()
  const lotteryContract = useLottery()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(cakeContract, lotteryContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, cakeContract, lotteryContract])

  return { onApprove: handleApprove }
}

// Approve an IFO
export const useIfoApprove = (tokenContract: Contract, spenderAddress: string) => {
  const { account } = useWallet()
  const onApprove = useCallback(async () => {
    try {
      const tx = await tokenContract.methods
        .approve(spenderAddress, ethers.constants.MaxUint256)
        .send({ from: account })
      return tx
    } catch {
      return false
    }
  }, [account, spenderAddress, tokenContract])

  return onApprove
}
