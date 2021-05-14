/* eslint-disable no-param-reassign */
import BigNumber from 'bignumber.js'
import { createSlice } from '@reduxjs/toolkit'
import {
  fetchPublicPurchaseUserAmount,
  fetchPublicPurchaseUserAward,
  fetchPublicPurchaseUserQueueUp,
  fetchPublicPurchaseUserAllowance,
  fetchPublicPurchaseUserBalances,
  fetchPublicPurchaseUserAllowanceCake,
  fetchPublicPurchaseUserBalancesCake,
  fetchPublicPurchaseUserRealAward,
  fetcBiddingPurchaseUserAmount,
  fetcBiddingPurchaseUserAward,
  fetcBiddingPurchaseUserAllowanceCake,
  fetcBiddingPurchaseUserAllowanceICake,
  fetcBiddingPurchaseUserBalancesCake,
  fetcBiddingPurchaseUserRealAward,
} from './fetchPurchaseUser'
import {
  fetchPublicPurchaseInfo,
  fetchBiddingPurchaseInfo
} from './fetchPurchase'


import { PurchaseState } from '../types'


const initialState:PurchaseState = { 
  publicPurchase: {
    allowance: new BigNumber (0),
    balances:new BigNumber (0),
    allowanceCake: new BigNumber (0),
    balancesCake:new BigNumber (0),
    amount:new BigNumber (0),
    award:new BigNumber (0),
    realAward:new BigNumber (0),
    queueUp:new BigNumber (0),  
    purchaseInfo:{
      lastPurchaseTime :new BigNumber(0),
      purchaseGrade:new BigNumber(0),
      biddingTotal:new BigNumber(0),
      PURCHASE_TIME:new BigNumber(0),
      READY_TIME:new BigNumber(0),
      PURCHASE_BONUS:new BigNumber(0),
      BonusPrice:new BigNumber(0),
      balance:new BigNumber(0),
    }
  }, 
  bidding: {
    biddingUser:{
      allowanceCake: new BigNumber (0),
      allowanceICake: new BigNumber (0),
      balancesCake:new BigNumber (0),
      amount:new BigNumber (0),
      award:new BigNumber (0),
      realAward:new BigNumber (0),
    },
    biddingPurchase:{
      lastPurchaseTime :new BigNumber(0),
      biddingTotal:new BigNumber(0),
      PURCHASE_TIME:new BigNumber(0),
      BonusPrice:new BigNumber(0),
      balance:new BigNumber(0),
      conversion:new BigNumber(0),
      awardAddress:[],
    }
  } 
}

export const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    setPublicPurchaseData: (state, action) => {
      // console.log(state,action)
      state.publicPurchase = action.payload
    },
    setBiddingPurchaseData: (state, action) => {
      state.bidding = action.payload
    },
  },
})

// Actions
export const { setPublicPurchaseData, setBiddingPurchaseData } = purchaseSlice.actions

export const fetchPublicPurchaseDataAsync = (account) => async (dispatch) => {
  const amount = await fetchPublicPurchaseUserAmount(account)
  const award = await fetchPublicPurchaseUserAward(account)
  const realAward = await fetchPublicPurchaseUserRealAward(account)
  const queueup = await fetchPublicPurchaseUserQueueUp(account)
  const allowance = await fetchPublicPurchaseUserAllowance(account)
  const balances= await fetchPublicPurchaseUserBalances(account)
  const allowanceCake = await fetchPublicPurchaseUserAllowanceCake(account)
  const balancesCake = await fetchPublicPurchaseUserBalancesCake(account)
  const purchaseInfo = await fetchPublicPurchaseInfo()

  const purchaseData = {
    purchaseInfo,
    allowance : new BigNumber(allowance),
    balances : new BigNumber(balances),
    allowanceCake : new BigNumber(allowanceCake),
    balancesCake : new BigNumber(balancesCake),
    amount  :  new BigNumber(amount),
    award  : new BigNumber(award),
    realAward : new BigNumber(realAward),
    queueUp  : new BigNumber(queueup),
  }

  dispatch(setPublicPurchaseData(purchaseData))
}

export const fetchBiddingPurchaseDataAsync = (account) => async (dispatch) => {

  const amount = await fetcBiddingPurchaseUserAmount(account)
  // const award = await fetcBiddingPurchaseUserAward(account)
  const award = 0
  const realAward = await fetcBiddingPurchaseUserRealAward(account)
  const allowanceCake = await fetcBiddingPurchaseUserAllowanceCake(account)
  const allowanceICake = await fetcBiddingPurchaseUserAllowanceICake(account)
  const balancesCake = await fetcBiddingPurchaseUserBalancesCake(account)
  const biddingPurchase = await fetchBiddingPurchaseInfo()


  const purchaseData = {
    biddingPurchase,
    biddingUser:{
      allowanceCake : new BigNumber(allowanceCake),
      allowanceICake: new BigNumber(allowanceICake),
      balancesCake : new BigNumber(balancesCake),
      amount  :  new BigNumber(amount),
      award  : new BigNumber(award),
      realAward : new BigNumber(realAward),
    }
  }

  // console.log("fetchBiddingPurchaseDataAsync",purchaseData)

  dispatch(setBiddingPurchaseData(purchaseData))
}
export default purchaseSlice.reducer
