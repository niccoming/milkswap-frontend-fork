/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import poolsConfig from 'config/constants/pools'
import { fetchPoolsBlockLimits, fetchPoolsTotalStatking } from './fetchPools'
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserStakeBalances,
  fetchUserPendingRewards,
  fetchUserAmount,
  fetchUserHarvestTime,
  fetchUserPending,
  fetchUserLocking
} from './fetchPoolsUser'
import { PoolsState, Pool } from '../types'

const initialState: PoolsState = { data: [...poolsConfig] }

export const PoolsSlice = createSlice({
  name: 'Pools',
  initialState,
  reducers: {
    setPoolsPublicData: (state, action) => {
      const livePoolsData: Pool[] = action.payload
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, ...livePoolData }
      })
    },
    setPoolsUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((pool) => {
        const userPoolData = userData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, userData: userPoolData }
      })
    },
    updatePoolsUserData: (state, action) => {
      const { field, value, sousId } = action.payload
      const index = state.data.findIndex((p) => p.sousId === sousId)
      state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
    },
  },
})

// Actions
export const { setPoolsPublicData, setPoolsUserData, updatePoolsUserData } = PoolsSlice.actions

// Thunks
export const fetchPoolsPublicDataAsync = () => async (dispatch) => {
  const blockLimits = await fetchPoolsBlockLimits()
  const totalStakings = await fetchPoolsTotalStatking()

  const liveData = poolsConfig.map((pool) => {
    const blockLimit = blockLimits.find((entry) => entry.sousId === pool.sousId)
    const totalStaking = totalStakings.find((entry) => entry.sousId === pool.sousId)
    return {
      ...blockLimit,
      ...totalStaking,
    }
  })

  dispatch(setPoolsPublicData(liveData))
}

export const fetchPoolsUserDataAsync = (account) => async (dispatch) => {

  const allowance = await fetchPoolsAllowance(account)
  const balances = await fetchUserBalances(account)
  const amount = await fetchUserAmount(account)
  const harvestTime = await fetchUserHarvestTime(account)
  const pending = await fetchUserPending(account)
  const locking = await fetchUserLocking(account)

  

  const userData = poolsConfig.map((pool) => ({
    sousId: pool.sousId,
    allowance:allowance[pool.sousId],
    balances: balances[pool.sousId],
    amount:amount[pool.sousId],
    pending:pending[pool.sousId],
    locking:locking[pool.sousId],
    harvestTime:harvestTime[pool.sousId]
  }))

  dispatch(setPoolsUserData(userData))
}

export const updateUserBalances = (sousId: string, account: string) => async (dispatch) => {
  const balances = await fetchUserBalances(account)
  dispatch(updatePoolsUserData({ sousId, field: 'balances', value: balances[sousId] }))
}

export const updateUserAmount = (sousId: string, account: string) => async (dispatch) => {
  const amount = await fetchUserAmount(account)
  dispatch(updatePoolsUserData({ sousId, field: 'amount', value: amount[sousId] }))
}

export const updateUserLocking = (sousId: string, account: string) => async (dispatch) => {
  const locking = await fetchUserLocking(account)
  dispatch(updatePoolsUserData({ sousId, field: 'locking', value: locking[sousId] }))
}

export const updateUserPending = (sousId: string, account: string) => async (dispatch) => {
  const pending = await fetchUserPending(account)
  dispatch(updatePoolsUserData({ sousId, field: 'pending', value: pending[sousId] }))
}
export const updateUserHarvestTime = (sousId: string, account: string) => async (dispatch) => {
  const harvestTime = await fetchUserHarvestTime(account)
  dispatch(updatePoolsUserData({ sousId, field: 'pendingReward', value: harvestTime[sousId] }))
}





export const updateUserAllowance = (sousId: string, account: string) => async (dispatch) => {
  const allowances = await fetchPoolsAllowance(account)
  dispatch(updatePoolsUserData({ sousId, field: 'allowance', value: allowances[sousId] }))
}

export const updateUserBalance = (sousId: string, account: string) => async (dispatch) => {
  const tokenBalances = await fetchUserBalances(account)
  dispatch(updatePoolsUserData({ sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] }))
}

export const updateUserStakedBalance = (sousId: string, account: string) => async (dispatch) => {
  const stakedBalances = await fetchUserStakeBalances(account)
  dispatch(updatePoolsUserData({ sousId, field: 'stakedBalance', value: stakedBalances[sousId] }))
}

export const updateUserPendingReward = (sousId: string, account: string) => async (dispatch) => {
  const pendingRewards = await fetchUserPendingRewards(account)
  dispatch(updatePoolsUserData({ sousId, field: 'pendingReward', value: pendingRewards[sousId] }))
}

export default PoolsSlice.reducer
