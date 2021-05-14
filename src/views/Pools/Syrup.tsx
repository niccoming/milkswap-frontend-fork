import React, { useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Heading, Text } from '@pancakeswap-libs/uikit'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK } from 'config'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import useI18n from 'hooks/useI18n'
import useBlock from 'hooks/useBlock'
import { getBalanceNumber } from 'utils/formatBalance'
import { useFarms, usePriceBnbBusd, usePools, usePriceEthBnb,useGetApiPrice, usePriceCakeBusd, useFarmFromPid } from 'state/hooks'
import { QuoteToken, PoolCategory } from 'config/constants/types'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { getAddress } from 'utils/addressHelpers'
import { getFarmApr } from 'utils/apr'
import Coming from './components/Coming'
import PoolCard from './components/PoolCard'
import PoolTabButtons from './components/PoolTabButtons'
import Divider from './components/Divider'

const Farm: React.FC = () => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const { account } = useWallet()
  const farms = useFarms()
  const pools = usePools(account)
  const bnbPriceUSD = usePriceBnbBusd()
  const ethPriceBnb = usePriceEthBnb()
  const block = useBlock()
  const [stackedOnly, setStackedOnly] = useState(false)

  // const priceToBnb = (tokenName: string, tokenPrice: BigNumber, quoteToken: QuoteToken): BigNumber => {
  //   const tokenPriceBN = new BigNumber(tokenPrice)
  //   if (tokenName === 'BNB') {
  //     return new BigNumber(1)
  //   }
  //   if (tokenPrice && quoteToken === QuoteToken.BUSD) {
  //     return tokenPriceBN.div(bnbPriceUSD)
  //   }
  //   return tokenPriceBN
  // }

  // const poolsWithApy = pools.map((pool) => {
  //   const isBnbPool = pool.poolCategory === PoolCategory.BINANCE
  //   const rewardTokenFarm = farms.find((f) => f.tokenSymbol === pool.tokenName)
  //   const stakingTokenFarm = farms.find((s) => s.tokenSymbol === pool.stakingTokenName)

  //   // tmp mulitplier to support ETH farms
  //   // Will be removed after the price api
  //   const tempMultiplier = stakingTokenFarm?.quoteTokenSymbol === 'ETH' ? ethPriceBnb : 1

  //   // /!\ Assume that the farm quote price is BNB
  //   const stakingTokenPriceInBNB = isBnbPool ? new BigNumber(1) : new BigNumber(stakingTokenFarm?.tokenPriceVsQuote)
  //   const rewardTokenPriceInBNB = priceToBnb(
  //     pool.tokenName,
  //     rewardTokenFarm?.tokenPriceVsQuote,
  //     rewardTokenFarm?.quoteTokenSymbol,
  //   )

  //   const totalRewardPricePerYear = rewardTokenPriceInBNB.times(CAKE_PER_BLOCK).times(BLOCKS_PER_YEAR)
  //   const totalStakingTokenInPool = stakingTokenPriceInBNB.times(getBalanceNumber(pool.totalStaked))
  //   const apy = totalRewardPricePerYear.div(totalStakingTokenInPool.plus(1)).times(100)

  //   console.log("totalRewardPricePerYear",totalRewardPricePerYear.toString())
  //   console.log("totalStakingTokenInPool",totalStakingTokenInPool.toString())
  //   console.log("apy",apy.toString())

      




  //   return {
  //     ...pool,
  //     isFinished: false,
  //     apy,
  //   }
  // })

  const priceToBnb = (tokenName: string, tokenPrice: BigNumber, quoteToken: QuoteToken): BigNumber => {
    const tokenPriceBN = new BigNumber(tokenPrice)
    if (tokenName === 'BNB') {
      return new BigNumber(1)
    }
    if (tokenPrice && quoteToken === QuoteToken.BUSD) {
      return tokenPriceBN.div(bnbPriceUSD)
    }
    return tokenPriceBN
  }

  const poolsWithApy = pools.map((pool) => {
    const isBnbPool = pool.poolCategory === PoolCategory.BINANCE
    const rewardTokenFarm = farms.find((f) => f.tokenSymbol === pool.tokenName)
    const stakingTokenFarm = farms.find((s) => s.tokenSymbol === pool.stakingTokenName)

    // /!\ Assume that the farm quote price is BNB
    const stakingTokenPriceInBNB = isBnbPool ? new BigNumber(1) : new BigNumber(stakingTokenFarm?.tokenPriceVsQuote)
    const rewardTokenPriceInBNB = priceToBnb(
      pool.tokenName,
      rewardTokenFarm?.tokenPriceVsQuote,
      rewardTokenFarm?.quoteTokenSymbol,
    )

    const totalRewardPricePerYear = rewardTokenPriceInBNB.times(pool.tokenPerBlock).times(BLOCKS_PER_YEAR)
    const totalStakingTokenInPool = stakingTokenPriceInBNB.times(getBalanceNumber(pool.totalStaked))
    const apy = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)

    return {
      ...pool,
      isFinished: pool.sousId === 0 ? false : pool.isFinished || block > pool.endBlock,
      apy,
    }
  })


  const [finishedPools, openPools] = partition(poolsWithApy, (pool) => pool.isFinished)
  const stackedOnlyPools = openPools.filter(
    (pool) => pool.userData && new BigNumber(pool.userData.amount).isGreaterThan(0),
  )

  return (
    <Page>
      {/* <Hero>
        <img
          src="/images/bowl.svg"
          alt="Bowl POOL icon"
          style={{
            height: '190px',
            marginRight: '48px',
          }}
        />
        <div>
          <Heading as="h1" size="xxl" mb="16px">
            Pools
          </Heading>
          <Text>
            Stake CCDI to earn new tokens. You can unstake at any time. Rewards are calculated per block.
          </Text>
        </div>
      </Hero> */}
      <FlexLayout>
        <Route exact path={`${path}`}>
          <>
            {stackedOnly
              ? orderBy(stackedOnlyPools, ['sortOrder']).map((pool) => <PoolCard key={pool.sousId} pool={pool} />)
              : orderBy(openPools, ['sortOrder']).map((pool) => <PoolCard key={pool.sousId} pool={pool} />)}
          </>
        </Route>
        <Route path={`${path}/history`}>
          {orderBy(finishedPools, ['sortOrder']).map((pool) => (
            <PoolCard key={pool.sousId} pool={pool} />
          ))}
        </Route>
      </FlexLayout>
    </Page>
  )
}

const Hero = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  justify-content: center;
  padding: 48px 0;
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    font-size: 16px;
    li {
      margin-bottom: 4px;
    }
  }
`

export default Farm
