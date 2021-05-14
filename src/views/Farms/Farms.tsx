import React, { useEffect, useCallback, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { Heading, Text } from '@pancakeswap-libs/uikit'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useFarms, usePriceBnbBusd, usePriceCakeBusd, usePriceEthBusd,useGetApiPrices } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { getFarmApr } from 'utils/apr'
import { getAddress } from 'utils/addressHelpers'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import FarmTabButtons from './components/FarmTabButtons'
import Divider from './components/Divider'
import Purchase from './components/Purchase'

const Farms: React.FC = () => {
  const { path } = useRouteMatch()
  const farmsLP = useFarms()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const ethPriceUsd = usePriceEthBusd()
  const prices = useGetApiPrices()

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const [stackedOnly, setStackedOnly] = useState(false)

  const activeFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X')
  const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier ==='0X')
  const stackedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )
  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      const cakePriceVsBNB = new BigNumber(farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote || 0)
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
          return farm
        }
        const cakeRewardPerBlock = CAKE_PER_BLOCK.times(farm.poolWeight)
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

        // cakePriceInQuote * cakeRewardPerYear / lpTotalInQuoteToken
        let apy = cakePriceVsBNB.times(cakeRewardPerYear).div(farm.lpTotalInQuoteToken)

        if (farm.quoteTokenSymbol === QuoteToken.BUSD || farm.quoteTokenSymbol === QuoteToken.USDT) {
          apy = cakePriceVsBNB.times(cakeRewardPerYear).div(farm.lpTotalInQuoteToken).times(bnbPrice)
        } else if (farm.quoteTokenSymbol === QuoteToken.ETH) {
          apy = cakePrice.div(ethPriceUsd).times(cakeRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.CCDI) {
          apy = cakeRewardPerYear.div(farm.lpTotalInQuoteToken)
        } else if (farm.dual) {
          const cakeApy =
            farm && cakePriceVsBNB.times(cakeRewardPerBlock).times(BLOCKS_PER_YEAR).div(farm.lpTotalInQuoteToken)
          const dualApy =
            farm.tokenPriceVsQuote &&
            new BigNumber(farm.tokenPriceVsQuote)
              .times(farm.dual.rewardPerBlock)
              .times(BLOCKS_PER_YEAR)
              .div(farm.lpTotalInQuoteToken)

          apy = cakeApy && dualApy && cakeApy.plus(dualApy)
        }

        
      // if (farm.lpSymbol === "BUSD-BNB LP" || farm.lpSymbol === "CCDI-BNB") {
      //   console.log("==========lpSymbol==========",farm.lpSymbol)
      //   console.log("tokenAddresses balanceOf:",  getBalanceNumber(farm.tokenBalanceLP, 18))
      //   console.log("quoteTokenBlanceLP balanceOf",getBalanceNumber(farm.quoteTokenBlanceLP, 18))
      //   console.log("lpTokenBalanceMC balanceOf",getBalanceNumber(farm.lpTokenBalanceMC, 18))
      //   console.log("Master lpAdress totalSupply",getBalanceNumber(farm.lpTotalSupply, 18) )
      //   console.log("Master to lp totalSupply Ratio ",farm.lpTokenRatio.toNumber())
      //   console.log("tokenBalanceLP/tokenAmount ",getBalanceNumber(farm.tokenAmount, 18))
      //   console.log("quoteTokenAmount",getBalanceNumber(farm.quoteTokenAmount, 18))
      //   console.log("poolWeight",farm.poolWeight.toString())
      //   console.log("cakePriceVsBNB",cakePriceVsBNB.toString())
      //   console.log("apy",apy.toString())
      // }

      const quoteTokenPriceUsd = prices[getAddress(farm.quoteTokenAdresses).toLowerCase()]
      const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(quoteTokenPriceUsd)
      const apr = new BigNumber(getFarmApr(farm.poolWeight, cakePrice, totalLiquidity.plus(1)))

      // console.log("TokenName",farm.lpSymbol)
      // console.log("weight",farm.poolWeight)
      // console.log("totalLiquidity", totalLiquidity.plus(1).toString())
      // console.log("apr",apr.toString())

      return { ...farm, apy,apr ,totalLiquidity}

      return farm
      })
      return farmsToDisplayWithAPY.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          bnbPrice={bnbPrice}
          cakePrice={cakePrice}
          ethPrice={ethPriceUsd}
          ethereum={ethereum}
          account={account}
        />
      ))
    },
    [farmsLP, bnbPrice, ethPriceUsd, cakePrice, ethereum, account,prices],
  )

  return (
    <Page>
      <Purchase/>
      {/* <Hero>
        <img
          src="/images/bucket.svg"
          alt="Bucket icon"
          style={{
            height: '190px',
            marginRight: '48px',
          }}
        />
        <div>
          <Heading as="h1" size="xxl" mb="16px">
            Farms
          </Heading>
          <Text>
            Stake LP tokens to earn CCDI.
          </Text>
        </div>
      </Hero> */}
      <div>
        <FlexLayout>
          <Route exact path={`${path}`}>
            {stackedOnly ? farmsList(stackedOnlyFarms, false) : farmsList(activeFarms, false)}
          </Route>
          <Route exact path={`${path}/history`}>
            {farmsList(inactiveFarms, true)}
          </Route>
        </FlexLayout>
      </div>
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

export default Farms
