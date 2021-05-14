import { AbiItem } from 'web3-utils'
import poolsConfig from 'config/constants/pools'
import masterChefABI from 'config/abi/masterchef.json'
import sousChefABI from 'config/abi/sousChef.json'
import erc20ABI from 'config/abi/erc20.json'
import { QuoteToken } from 'config/constants/types'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { getWeb3 } from 'utils/web3'
import BigNumber from 'bignumber.js'

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const nonBnbPools = poolsConfig.filter((p) => p.stakingTokenName !== QuoteToken.BNB)
const bnbPools = poolsConfig.filter((p) => p.stakingTokenName === QuoteToken.BNB)
const nonMasterPools = poolsConfig.filter((p) => p.sousId !== 0)
const web3 = getWeb3()
const masterChefContract = new web3.eth.Contract((masterChefABI as unknown) as AbiItem, getMasterChefAddress())

export const fetchPoolsAllowance = async (account) => {
  const calls = poolsConfig.map((p) => ({
    address: p.stakingTokenAddress,
    name: 'allowance',
    params: [account, getAddress(p.contractAddress)],
  }))

  const allowances = await multicall(erc20ABI, calls)
  return poolsConfig.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(allowances[index]).toJSON() }),
    {},
  )
}

export const fetchUserBalances = async (account) => {
  // Non BNB pools
  const calls = poolsConfig.map((p) => ({
    address: p.stakingTokenAddress,
    name: 'balanceOf',
    params: [account],
  }))
  const tokenBalancesRaw = await multicall(erc20ABI, calls)
  const tokenBalances = poolsConfig.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(tokenBalancesRaw[index]).toJSON() }),
    {},
  )

  // BNB pools
  const bnbBalance = await web3.eth.getBalance(account)
  const bnbBalances = bnbPools.reduce(
    (acc, pool) => ({ ...acc, [pool.sousId]: new BigNumber(bnbBalance).toJSON() }),
    {},
  )

  return { ...tokenBalances, ...bnbBalances }
}

export const fetchUserStakeBalances = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'userInfo',
    params: [account],
  }))
  const userInfo = await multicall(masterChefABI, calls)
  console.log("fetchUserStakeBalances",userInfo)
  const stakedBalances = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(userInfo[index].amount._hex).toJSON(),
    }),
    {},
  )
  // Cake / Cake pool
  const { amount: masterPoolAmount } = await masterChefContract.methods.userInfo('0', account).call()

  return { ...stakedBalances, 0: new BigNumber(masterPoolAmount).toJSON() }
}

export const fetchUserPendingRewards = async (account) => {
  const calls = poolsConfig.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'pendingSail',
    params: [p.sousId,account],
  }))
  const res = await multicall(masterChefABI, calls)

  return poolsConfig.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  )
}

export const fetchUserAmount = async (account) => {
  const calls = poolsConfig.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'userInfo',
    params: [p.sousId,account],
  }))
  const res = await multicall(masterChefABI, calls)
  return poolsConfig.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(res[index].amount._hex).toJSON(),
    }),
    {},
  )
}

export const fetchUserHarvestTime = async (account) => {
  const calls = poolsConfig.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'userInfo',
    params: [p.sousId,account],
  }))
  const res = await multicall(masterChefABI, calls)
  return poolsConfig.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(res[index].lastLockTime._hex).toJSON(),
    }),
    {},
  )
}

export const fetchUserPending = async (account) => {
  const calls = poolsConfig.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'pendingSail',
    params: [p.sousId,account],
  }))
  const res = await multicall(masterChefABI, calls)
  return poolsConfig.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  )
}
export const fetchUserLocking = async (account) => {
  const calls = poolsConfig.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'lockingSail',
    params: [p.sousId,account],
  }))
  const res = await multicall(masterChefABI, calls)
  return poolsConfig.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  )
}

export const fetchPoolsUserInfo = async (account) => {
  const calls = poolsConfig.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'userInfo',
    params: [p.sousId,account],
  }))

  const userInfo = await multicall(masterChefABI, calls)
  return poolsConfig.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: 
      {
        amount:new BigNumber(userInfo[index].amount._hex).toJSON() ,
        rewardDebt:new BigNumber(userInfo[index].rewardDebt._hex).toJSON() ,
        locking:new BigNumber(userInfo[index].locking._hex).toJSON() ,
        pending:new BigNumber(userInfo[index].pending._hex).toJSON() ,
        lastLockTime:new BigNumber(userInfo[index].lastLockTime._hex).toJSON() ,
      }
      }),
    {},
  )
}

