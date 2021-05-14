import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import masterChefABI from 'config/abi/masterchef.json'
import cakeABI from 'config/abi/cake.json'
import wbnbABI from 'config/abi/weth.json'
import erc20 from 'config/abi/erc20.json'
import { QuoteToken } from 'config/constants/types'
import { getAddress, getWbnbAddress,getMasterChefAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import multicall from 'utils/multicall'


export const fetchPoolsBlockLimits = async () => {
  const poolsWithEnd = poolsConfig.filter((p) => p.sousId !== 0)
  const callsStartBlock = poolsConfig.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'startBlock',
    }
  })
  const callsEndBlock = poolsConfig.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'poolInfo',
      params: [poolConfig.sousId],
    }
  })

  const starts = await multicall(masterChefABI, callsStartBlock)
  const ends = await multicall(masterChefABI, callsEndBlock)

  return poolsConfig.map((cakePoolConfig, index) => {
    const startBlock = starts[index]
    const endBlock = ends[index]
    return {
      sousId: cakePoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      depositFeeBP: new BigNumber(endBlock.depositFeeBP).toJSON(),
      poolStartBlock: new BigNumber(startBlock.depositFeeBP).toJSON(),
    }
  })
}

export const fetchPoolsTotalStatking = async () => {
  const nonBnbPools = poolsConfig.filter((p) => p.stakingTokenName !== 'BNB')
  const bnbPool = poolsConfig.filter((p) => p.stakingTokenName === 'BNB')

  const callsNonBnbPools = nonBnbPools.map((poolConfig) => {
    return {
      address:  poolConfig.stakingTokenAddress,
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  const callsBnbPools = bnbPool.map((poolConfig) => {
    return {
      address: getWbnbAddress(),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })


  const nonBnbPoolsTotalStaked = await multicall(cakeABI, callsNonBnbPools)
  const bnbPoolsTotalStaked = await multicall(wbnbABI, callsBnbPools)

  
  return [
    ...nonBnbPools.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(nonBnbPoolsTotalStaked[index]),
    })),
    ...bnbPool.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(bnbPoolsTotalStaked[index]),
    })),
  ]
}
