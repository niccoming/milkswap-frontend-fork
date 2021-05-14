import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled , { keyframes } from 'styled-components'
import { Tag, Text,Flex,Skeleton, Heading,Button, IconButton, useModal, AddIcon, Image } from '@pancakeswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import UnlockButton from 'components/UnlockButton'
import Label from 'components/Label'
import { useERC20 } from 'hooks/useContract'
import { useSousApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import useStake from 'hooks/useStake'
import useUnstake  from 'hooks/useUnstake'
import useBlock from 'hooks/useBlock'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { useHarvest ,useLockHarvest} from 'hooks/useHarvest'
import { QuoteToken, PoolCategory } from 'config/constants/types'
import { Pool } from 'state/types'
import { useFarmFromPid, useGetApiPrice,usePriceCakeBusd} from 'state/hooks'
import { getFarmApr } from 'utils/apr'
import {getStringTime} from 'utils/getStringTime'
import { getAddress } from 'utils/addressHelpers'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import CompoundModal from './CompoundModal'
import CardTitle from './CardTitle'
import Card from './Card'
import OldSyrupTitle from './OldSyrupTitle'
import HarvestButton from './HarvestButton'
import CardFooter from './CardFooter'
import ApyButton from './ApyButton'



interface PoolWithApy extends Pool {
  apy: BigNumber
}

interface HarvestProps {
  pool: PoolWithApy
}



const PoolCard: React.FC<HarvestProps> = ({ pool }) => {
  const {
    sousId,
    image,
    tokenName,
    stakingTokenName,
    stakingTokenAddress,
    projectLink,
    harvest,
    apy,
    tokenDecimals,
    poolCategory,
    totalStaked,
    startBlock,
    endBlock,
    isFinished,
    userData,
    stakingLimit,
    locktime,
    multiplier,
    depositFeeBP,
  } = pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const TranslateString = useI18n()
  const stakingTokenContract = useERC20(stakingTokenAddress)
  const { account } = useWallet()
  const block = useBlock()
  const { onApprove } = useSousApprove(stakingTokenContract, sousId)
  const { onStake } = useStake(sousId)
  const { onUnstake } = useUnstake(sousId)
  const { onReward } = useHarvest(sousId)
  const farm = useFarmFromPid(11)

  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)

  const allowance  = new BigNumber(userData?.allowance || 0)
  const balances  = new BigNumber(userData?.balances || 0)
  const amount  = new BigNumber(userData?.amount || 0)
  const harvestTime  = new BigNumber(userData?.harvestTime || 0)
  const pending  = new BigNumber(userData?.pending || 0)
  const locking  = new BigNumber(userData?.locking || 0)
  const countDown = Math.floor(harvestTime.toNumber() + locktime - (Date.now()/1000))

  const locakingTx =  (Date.now()/1000) >= harvestTime.toNumber() + locktime ? 'Harvest':  `${getStringTime(countDown)}`

  const { onLockHarvest } = useLockHarvest(sousId,(Date.now()/1000) < harvestTime.toNumber() + locktime)
  // 授权的数量
  // console.log("allowance",allowance.toString())
  // 余额
  // console.log("balances",balances.toString())
  // 池子中抵押的数量
  // console.log("amount",amount.toString())
  // 锁的开始时间
  // console.log("harvestTime",harvestTime.toString())
  // 当前收益-非锁定的数量
  // if (amount.toNumber() > 0 ) {
  //   console.log(tokenName,harvestTime.toString(),locktime,Date.now()/1000)
  //   console.log("pending",pending.toString())
  //   console.log("locking",locking.toString())  
  // }
 
  const blocksUntilStart = Math.max(startBlock - block, 0)
  const blocksRemaining = Math.max(endBlock - block, 0)
  const isOldSyrup = stakingTokenName === QuoteToken.SYRUP
  const accountHasStakedBalance = amount?.toNumber() > 0
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber() && !isBnbPool
  const isCardActive = pool.tokenName === "CCDI" ||  pool.tokenName === "SPON"

  const cakePrice = usePriceCakeBusd()
  const quoteTokenPriceUsd = useGetApiPrice(pool.stakingTokenAddress)
  const totalLiquidity = totalStaked?totalStaked.times(quoteTokenPriceUsd):new BigNumber(0)
  const apr = new BigNumber(getFarmApr(new BigNumber(pool.multiplier).div(farm.totalAllocPoint), cakePrice, totalLiquidity.plus(1).div(DEFAULT_TOKEN_DECIMAL)))

  // if (totalStaked) {
  //   console.log("TokenName",pool.stakingTokenName)
  //   console.log("quoteTokenPriceUsd",quoteTokenPriceUsd.toString())
  //   console.log("cakePrice",cakePrice.toString())
  //   console.log("totalStaked",totalStaked.toString())
  //   console.log("weight",new BigNumber(pool.multiplier).div(farm.totalAllocPoint).toString())
  //   console.log("totalLiquidity", totalLiquidity.plus(1).toString())
  //   console.log("apr",apr.toString())
  // }

  // const farmAPY = apy && apy.times(new BigNumber(100)).toNumber().toLocaleString('en-US').slice(0, -1)
  // const farmAPY = apr && apr.toNumber().toLocaleString('en-US').slice(0, -1)
  // console.log("farmAPY",farmAPY)

  const convertedLimit = new BigNumber(stakingLimit).multipliedBy(new BigNumber(10).pow(tokenDecimals))
  const [onPresentDeposit] = useModal(
    <DepositModal
      max={stakingLimit && balances.isGreaterThan(convertedLimit) ? convertedLimit : balances}
      onConfirm={onStake}
      tokenName={stakingLimit ? `${stakingTokenName} (${stakingLimit} max)` : stakingTokenName}
    />,
  )

  const [onPresentCompound] = useModal(
    <CompoundModal earnings={pending} onConfirm={onStake} tokenName={stakingTokenName} />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={amount} onConfirm={onUnstake} tokenName={stakingTokenName} />,
  )

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setRequestedApproval])

  return (
    <Card isActive={isCardActive} isFinished={isFinished && sousId !== 0}>
      {isFinished && sousId !== 0 && <PoolFinishedSash />}
      <StyledCardAccent />
      {(pool.tokenName === 'CCDI' || pool.tokenName === 'SPON') && <StyledCardAccent />}
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <Image src={`/images/tokens/${image || tokenName}.png`} width={64} height={64} alt={tokenName} />
          </div>
          <div style={{ flex: 1 }}>
            <Flex flexDirection="column" alignItems="flex-end">
              <Heading mb="8px">{tokenName}</Heading>
              <Flex justifyContent="center">
                <MultiplierTag variant="secondary">{`${multiplier}X`}</MultiplierTag>
              </Flex>
            </Flex>
          </div>
        </div>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{TranslateString(736, 'APR:')}</Text>
          <Text bold style={{ display: 'flex', alignItems: 'center' }}>
            {apy ? (
              <>
                <ApyButton lpLabel = 'aaa' addLiquidityUrl='aaaa' cakePrice={cakePrice} apy={apr} />
                <Balance fontSize="14px" isDisabled={isFinished} value={apr?.toNumber()} decimals={2} unit="%" />
              </>
            ) : (
              <Skeleton height={24} width={80} />
            )}
          </Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{TranslateString(120, 'Earn:')}</Text>
          <Text bold style={{ display: 'flex', alignItems: 'center' }}>
            CCDI
          </Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{TranslateString(736, 'Deposit Fee:')}</Text>
          <Text bold style={{ display: 'flex', alignItems: 'center' }}>
          {depositFeeBP/100}%
          </Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{TranslateString(736, 'Harvest Time:')}</Text>
          <Text bold style={{ display: 'flex', alignItems: 'center' }}>
              {getStringTime(locktime)}
          </Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Balance value={getBalanceNumber(pending, tokenDecimals)}/>
          {account && harvest && (
            <HarvestButton
              disabled={!pending.toNumber() || pendingTx}
              text={pendingTx ? 'Collecting' : 'Harvest'}
              onClick={async () => {
                // setPendingTx(true)
                await onReward()
                setPendingTx(false)
              }}
            />
          )}
        </Flex>
        { locktime > 0 && (
          <BalanceAndCompound>
          <Balance value={ getBalanceNumber(locking, tokenDecimals)} />
            {account && harvest && (
              <HarvestButton
              disabled={!locking.toNumber() || pendingTx}
                text={pendingTx ? TranslateString(999, 'Collecting') : TranslateString(704, locakingTx)}
                onClick={async () => {
                  // setPendingTx(true)
                  await onLockHarvest()
                  setPendingTx(false)
                }}
              />
            )}
          </BalanceAndCompound>
        ) }
        <StyledCardActions>
          {!account && <UnlockButton />}
          {account &&
            (needsApproval && !isOldSyrup ? (
              <div style={{ flex: 1 }}>
                <Button disabled={isFinished || requestedApproval} onClick={handleApprove} fullWidth>
                  {`Approve ${stakingTokenName}`}
                </Button>
              </div>
            ) : (
              <>
                <Button
                  disabled={amount.eq(new BigNumber(0)) || pendingTx}
                  onClick={
                    isOldSyrup
                      ? async () => {
                          // setPendingTx(true)
                          await onUnstake('0')
                          setPendingTx(false)
                        }
                      : onPresentWithdraw
                  }
                >
                  {`Unstake ${stakingTokenName}`}
                </Button>
                <StyledActionSpacer />
                {!isOldSyrup && (
                  <IconButton disabled={isFinished && sousId !== 0} onClick={onPresentDeposit}>
                    <AddIcon color="background" />
                  </IconButton>
                )}
              </>
            ))}
        </StyledCardActions>
        {/* <StyledDetails>
          <div style={{ flex: 1 }}>{TranslateString(736, 'APR')}:</div>
          {isFinished || isOldSyrup || !apy || apy?.isNaN() || !apy?.isFinite() ? (
            '-'
          ) : (
            <Balance fontSize="14px" isDisabled={isFinished} value={apy?.toNumber()} decimals={2} unit="%" />
          )}
        </StyledDetails> */}
        <StyledDetails>
          <div style={{ flex: 1 }}>
            <span role="img" aria-label={stakingTokenName}>
              🥛{' '}
            </span>
            {TranslateString(384, 'Your Stake')}:
          </div>
          <Balance fontSize="14px" isDisabled={isFinished} value={getBalanceNumber(amount)} />
        </StyledDetails>
      </div>
      <CardFooter
        pool = {pool}
        projectLink={projectLink}
        totalStaked={totalStaked}
        blocksRemaining={blocksRemaining}
        isFinished={isFinished}
        blocksUntilStart={blocksUntilStart}
        poolCategory={poolCategory}
      />
    </Card>
  )
}

const PoolFinishedSash = styled.div`
  background-image: url('/images/pool-finished-sash.svg');
  background-position: top right;
  background-repeat: not-repeat;
  height: 135px;
  position: absolute;
  right: -24px;
  top: -24px;
  width: 135px;
`

const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
  width: 100%;
  box-sizing: border-box;
`

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  display: flex;
  font-size: 14px;
`
const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const RainbowLight = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`


const StyledCardAccent = styled.div`
 background: linear-gradient(
    -45deg,
    #ff738e,
    #e4536f 20%,
    #a34054 40%,
    #b7eaff 60%,
    #92cee7 80%,
    #5dc4d9 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 16px;
  filter: blur(8px);
  position: absolute;
  display: none;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

export default PoolCard
