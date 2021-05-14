import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import farmsConfig from 'config/constants/farms'
import { getBalanceNumber } from 'utils/formatBalance'
import { BIG_TEN } from 'utils/bigNumber'
import { DEFAULT_TOKEN_DECIMAL } from 'config'

const fetchFarms = async () => {
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
      const lpAdress = getAddress(farmConfig.lpAddresses)
      const calls = [
        // Balance of token in the LP contract
        {
          address: getAddress(farmConfig.tokenAddresses),
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of quote token on LP contract
        {
          address: getAddress(farmConfig.quoteTokenAdresses),
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: lpAdress,
          name: 'balanceOf',
          params: [getMasterChefAddress()],
        },
        // Total supply of LP tokens
        {
          address: lpAdress,
          name: 'totalSupply',
        },
        // Token decimals
        {
          address: getAddress(farmConfig.tokenAddresses),
          name: 'decimals',
        },
        // Quote token decimals
        {
          address: getAddress(farmConfig.quoteTokenAdresses),
          name: 'decimals',
        },
      ]

      const [
        tokenBalanceLP,
        quoteTokenBlanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals,
      ] = await multicall(erc20, calls)

      // if (farmConfig.lpSymbol === "CCDI-BNB") {
      //   console.log("==========lpSymbol==========",farmConfig.lpSymbol)
      //   console.log("tokenAddresses balanceOf:",  tokenBalanceLP)
      //   console.log("quoteTokenBlanceLP balanceOf",  quoteTokenBlanceLP)
      //   console.log("lpTokenBalanceMC balanceOf",lpTokenBalanceMC)
      //   console.log("Master lpAdress totalSupply", lpTotalSupply)
      // }

      // Ratio in % a LP tokens that are in staking, vs the total number in circulation
      const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

      // Total value in staking in quote token value
      const lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
        .div(DEFAULT_TOKEN_DECIMAL)
        .times(new BigNumber(2))
        .times(lpTokenRatio)

      // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
      const tokenAmount = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals))
      const quoteTokenAmount = new BigNumber(quoteTokenBlanceLP)
        .div(BIG_TEN.pow(quoteTokenDecimals))
        

      // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)

      const [info, totalAllocPoint] = await multicall(masterchefABI, [
        {
          address: getMasterChefAddress(),
          name: 'poolInfo',
          params: [farmConfig.pid],
        },
        {
          address: getMasterChefAddress(),
          name: 'totalAllocPoint',
        },
      ])

      const allocPoint = new BigNumber(info.allocPoint._hex)
      const lockTime = new BigNumber(info.lockTime._hex)
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))

      if (farmConfig.lpSymbol) {
        console.log("==========lpSymbol==========",farmConfig.lpSymbol,farmConfig.pid)
        console.log("tokenAddresses balanceOf:",  tokenBalanceLP.toString())
        console.log("quoteTokenBlanceLP balanceOf",  quoteTokenBlanceLP.toString())
        console.log("lpAdress",getAddress(farmConfig.lpAddresses))
        console.log("tokenAddresses", getAddress(farmConfig.tokenAddresses))
        console.log("quoteTokenAdresses", getAddress(farmConfig.quoteTokenAdresses))
        console.log("tokenAmount ",tokenAmount.toString())
        console.log("quoteTokenAmount",quoteTokenAmount.toString())
        console.log("poolWeight",poolWeight.toString())
      }

      return {
        ...farmConfig,
        tokenBalanceLP:new BigNumber(tokenBalanceLP),
        quoteTokenBlanceLP:new BigNumber(quoteTokenBlanceLP),
        lpTokenBalanceMC:new BigNumber(lpTokenBalanceMC),
        lpTotalSupply:new BigNumber(lpTotalSupply),
        lpTokenRatio:new BigNumber(lpTokenRatio),
        tokenAmount: tokenAmount.toJSON(),
        quoteTokenAmount: quoteTokenAmount.toJSON(),
        lpTotalInQuoteToken,
        tokenPriceVsQuote: quoteTokenAmount.div(tokenAmount).toJSON(),
        poolWeight: poolWeight.toJSON(),
        multiplier: `${allocPoint.toString()}X`,
        depositFeeBP: info.depositFeeBP,
        locktime: lockTime.toNumber(),
        totalAllocPoint:new BigNumber(totalAllocPoint).toNumber(),
      }
    }),
  )
  return data
}

export default fetchFarms
