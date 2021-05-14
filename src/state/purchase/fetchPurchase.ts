import { AbiItem } from 'web3-utils'
import BigNumber from 'bignumber.js'
import publicPurchaseABI from 'config/abi/publicPurchase.json'
import biddingPurchasefABI from 'config/abi/biddingPurchase.json'
import erc20ABI from 'config/abi/erc20.json'
import { getBusdAddress ,getCakeAddress,getPublicPurchaseAddress, getBiddingPurchaseAddress } from 'utils/addressHelpers'
import { getWeb3 } from 'utils/web3'

const web3 = getWeb3()
const publicPurchaseContract = new web3.eth.Contract((publicPurchaseABI as unknown) as AbiItem, getPublicPurchaseAddress())
const biddingPurchaseContract = new web3.eth.Contract((biddingPurchasefABI as unknown) as AbiItem, getBiddingPurchaseAddress())
const busdContract = new web3.eth.Contract((erc20ABI as unknown) as AbiItem, getBusdAddress())
const cakeContract = new web3.eth.Contract((erc20ABI as unknown) as AbiItem, getCakeAddress())
export const fetchPublicPurchaseInfo = async () => {

  const lastPurchaseTime = await publicPurchaseContract.methods.lastPurchaseTime().call()
  
  const purchaseGrade = await publicPurchaseContract.methods.purchaseGrade().call()

  const biddingTotal = await publicPurchaseContract.methods.biddingTotal().call()

  const PURCHASE_TIME = await publicPurchaseContract.methods.PURCHASE_TIME().call()
  
  const READY_TIME = await publicPurchaseContract.methods.READY_TIME().call()

  const PURCHASE_BONUS = await publicPurchaseContract.methods.PURCHASE_BONUS().call()

  const BonusPrice = await publicPurchaseContract.methods.BonusPrice().call()

  const balance = await  busdContract.methods.balanceOf(getPublicPurchaseAddress()).call({from:getPublicPurchaseAddress()})

  return {
    lastPurchaseTime :new BigNumber(lastPurchaseTime),
    purchaseGrade:new BigNumber(purchaseGrade),
    biddingTotal:new BigNumber(biddingTotal),
    PURCHASE_TIME:new BigNumber(PURCHASE_TIME),
    READY_TIME:new BigNumber(READY_TIME),
    PURCHASE_BONUS:new BigNumber(PURCHASE_BONUS),
    BonusPrice:new BigNumber(BonusPrice),
    balance:new BigNumber(balance),
  }
}

export const  fetchBiddingPurchaseInfo = async () => {
    const lastPurchaseTime = await biddingPurchaseContract.methods.lastPurchaseTime().call()
    
    const biddingTotal = await cakeContract.methods.balanceOf(getBiddingPurchaseAddress()).call({from:getBiddingPurchaseAddress()})
  
    const PURCHASE_TIME = await biddingPurchaseContract.methods.PURCHASE_TIME().call()
    
    const BonusPrice = await biddingPurchaseContract.methods.BonusPrice().call()
  
    const balance = await  busdContract.methods.balanceOf(getBiddingPurchaseAddress()).call({from:getBiddingPurchaseAddress()})

    const conversion = await biddingPurchaseContract.methods.getConversion().call()

    const biddingLength = await biddingPurchaseContract.methods.biddingLength().call()

    const length = new BigNumber(biddingLength).toNumber()

    console.log("conversionnew",new BigNumber(conversion).toString())

    const awardAddress = [];

    const Promises = [];
    if(length > 0){
      for(let i = 0; i < length; i++){
        Promises.push(biddingPurchaseContract.methods.biddingInfo(i).call())
      }
      const results = await Promise.all(Promises)
      for (let index = results.length - 1; index >= 0; index--) {
        const userInfo = results[index];
        const bidding = new BigNumber(userInfo.bidding)
        if (bidding) {
          awardAddress.push(userInfo.user)
          if (awardAddress.length >= 3) {
            break
          }
        }
      }
    }
    return {
      lastPurchaseTime :new BigNumber(lastPurchaseTime),
      biddingTotal:new BigNumber(biddingTotal),
      PURCHASE_TIME:new BigNumber(PURCHASE_TIME),
      BonusPrice:new BigNumber(BonusPrice),
      conversion:new BigNumber(conversion),
      balance:new BigNumber(balance),
      awardAddress
    }
}
