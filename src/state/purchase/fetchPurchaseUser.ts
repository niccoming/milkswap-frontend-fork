import { AbiItem } from 'web3-utils'
import BigNumber from 'bignumber.js'
import publicPurchaseABI from 'config/abi/publicPurchase.json'
import biddingPurchasefABI from 'config/abi/biddingPurchase.json'
import erc20ABI from 'config/abi/erc20.json'
import { getBusdAddress ,getCakeAddress,getICakeAddress,getPublicPurchaseAddress, getBiddingPurchaseAddress } from 'utils/addressHelpers'
import { getWeb3 } from 'utils/web3'

const web3 = getWeb3()
const publicPurchaseContract = new web3.eth.Contract((publicPurchaseABI as unknown) as AbiItem, getPublicPurchaseAddress())
const biddingPurchaseContract = new web3.eth.Contract((biddingPurchasefABI as unknown) as AbiItem, getBiddingPurchaseAddress())
const busdContract = new web3.eth.Contract((erc20ABI as unknown) as AbiItem, getBusdAddress())
const cakeContract = new web3.eth.Contract((erc20ABI as unknown) as AbiItem, getCakeAddress())
const ICakeContract = new web3.eth.Contract((erc20ABI as unknown) as AbiItem, getICakeAddress())
export const fetchPublicPurchaseUserAmount = async (account: string) => {
  return publicPurchaseContract.methods.getAmount().call({from:account})
}

export const fetchPublicPurchaseUserAward = async (account: string) => {

  return publicPurchaseContract.methods.getAward().call({from:account})
}

export const fetchPublicPurchaseUserRealAward = async (account: string) => {
  const usetInfo = await publicPurchaseContract.methods.userInfo(account).call({from:account})
  
  return usetInfo.award
}

export const fetchPublicPurchaseUserQueueUp = async (account: string) => {

  return publicPurchaseContract.methods.queueUp().call({from:account})
}

export const fetchPublicPurchaseUserAllowance = async (account: string) => {

  return busdContract.methods.allowance(account,getPublicPurchaseAddress()).call({from:account})
}

export const fetchPublicPurchaseUserBalances = async (account: string) => {
  
  return busdContract.methods.balanceOf(account).call({from:account})
}

export const fetchPublicPurchaseUserAllowanceCake = async (account: string) => {

  return cakeContract.methods.allowance(account,getPublicPurchaseAddress()).call({from:account})
}

export const fetchPublicPurchaseUserBalancesCake = async (account: string) => {
  
  return cakeContract.methods.balanceOf(account).call({from:account})
}
// BiddingPurchase
export const fetcBiddingPurchaseUserAmount = async (account: string) => {
  return biddingPurchaseContract.methods.getAmount().call({from:account})
}

export const fetcBiddingPurchaseUserAward = async (account: string) => {
  return biddingPurchaseContract.methods.getAward().call({from:account})
}

export const fetcBiddingPurchaseUserRealAward = async (account: string) => {
  return biddingPurchaseContract.methods.getRealAward().call({from:account})
}

export const fetcBiddingPurchaseUserAllowanceCake = async (account: string) => {

  return cakeContract.methods.allowance(account,getBiddingPurchaseAddress()).call({from:account})
}

export const fetcBiddingPurchaseUserAllowanceICake = async (account: string) => {

  return ICakeContract.methods.allowance(account,getBiddingPurchaseAddress()).call({from:account})
}

export const fetcBiddingPurchaseUserBalancesCake = async (account: string) => {
  
  return cakeContract.methods.balanceOf(account).call({from:account})
}