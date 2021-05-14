import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import useWeb3 from 'hooks/useWeb3'
import styled from 'styled-components'
import Page from 'components/layout/Page'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import UnlockButton from 'components/UnlockButton'
import {getStringTime} from 'utils/getStringTime'
import { Heading, Card, CardBody, Button, BaseLayout,Flex,Text, useModal, IconButton,AddIcon } from '@pancakeswap-libs/uikit'
import { usePublicPurchaseApprove,useBiddingPurchaseApprove,usePublicPurchaseApproveCake,useBiddingPurchaseApproveICake } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import {usePublicSwapSpon,usePublicBidding,usePublicWithDraw,usePublicHarvest,usePublicRestart,usePublicWithdrawbyDev
  ,useBiddingBidding,useBiddingWithDraw,useBiddingHarvest,useBiddingRestart
  } from 'hooks/useStake'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import {usePublicPurchase,useBiddingPurchase } from 'state/hooks'
import WithdrawModal from './WithdrawModal'
import DepositModal from './DepositModal'


const PurchaseGrade = ["unopen","activity","rest"]

const StyledFarmStakingCard = styled(Card)`
  background-repeat: no-repeat;
  background-position: top right;
  min-height: 376px;
`

const TextEx = styled.div`
  margin-right: 1rem;
  flex: 1;
  display: flex;
  align-items: center;
`
const Block = styled.div`
  margin-bottom: 16px;
`
const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`

const Actions = styled.div`
  margin-top: 24px;
  display: flex;
`
const SubList = styled.div`
  line-height: 2;
`
const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  ${Heading} {
    position: relative;

    > div {
      right: 0;
      top: 10px;
      position: absolute;
      cursor: pointer;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      border-radius: 50%;
      border: 1px solid #ddd;
    }
  }

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`


const Purchase  = () => {
  const TranslateString = useI18n()
  const { account } = useWallet()
  const web3 = useWeb3()
  const { onPublicPurchaseonApprove } = usePublicPurchaseApprove()
  const { onPublicPurchaseonApproveCake } = usePublicPurchaseApproveCake()
  const { onBiddingPurchaseApprove } = useBiddingPurchaseApprove()  
  const { onBiddingPurchaseApproveICake } = useBiddingPurchaseApproveICake()  
  

  const [requestedApproval, setRequestedApproval] = useState(false)

  const {allowance,balances,allowanceCake,balancesCake,amount,award,realAward,queueUp,purchaseInfo} = usePublicPurchase(account)

  const {biddingUser,biddingPurchase} = useBiddingPurchase(account)
  
  const publicNeedsApproval =  !allowance.toNumber()

  const publicNeedsApprovalCake =  !allowanceCake.toNumber()

  const publicCountDown = Math.floor(purchaseInfo.lastPurchaseTime.toNumber() + (purchaseInfo.purchaseGrade.eq(1)? purchaseInfo.PURCHASE_TIME.toNumber(): purchaseInfo.READY_TIME.toNumber()) - (Date.now()/1000))

  const biddinNeedsApproval =  !biddingUser.allowanceCake.toNumber() || !biddingUser.allowanceICake.toNumber()
 
  const biddinCountDown = Math.floor(biddingPurchase.lastPurchaseTime.toNumber() +  biddingPurchase.PURCHASE_TIME.toNumber() - (Date.now()/1000))

 
  const { onUsePublicSwapSpon } = usePublicSwapSpon()
  const { onUsePublicBidding } = usePublicBidding()
  const { onUsePublicWithDraw } = usePublicWithDraw()
  const { onUsePublicHarvest } = usePublicHarvest()
  const { onUsePublicRestart } = usePublicRestart()
  const { onUsePublicWithdrawbyDev } = usePublicWithdrawbyDev(web3.utils.toWei('5.5', 'ether'))

  const { onUseBiddingBidding } = useBiddingBidding()
  const { onUseBiddingWithDraw } = useBiddingWithDraw()
  const { onUseBiddingHarvest } = useBiddingHarvest()
  const { onUseBiddingRestart } = useBiddingRestart()

  const [pendingTx, setPendingTx] = useState(false)

  const handlePublicPurchaseonApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onPublicPurchaseonApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onPublicPurchaseonApprove, setRequestedApproval])

  const handlePublicPurchaseonApproveCake = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onPublicPurchaseonApproveCake()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onPublicPurchaseonApproveCake, setRequestedApproval])

  const handleBiddingPurchaseApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onBiddingPurchaseApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onBiddingPurchaseApprove, setRequestedApproval])

  const handleBiddingPurchaseApproveICake = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onBiddingPurchaseApproveICake()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onBiddingPurchaseApproveICake, setRequestedApproval])


  const [onPresentPublicSwapSpon] = useModal(
    <DepositModal
      max={ balances}
      onConfirm={onUsePublicSwapSpon}
      tokenName= 'BUSD'
    />,
  )

  const [onPresentPublicBidding] = useModal(
    <DepositModal
      max={balancesCake}
      onConfirm={onUsePublicBidding}
      tokenName= 'CCDI'
    />,
  )

  return (
    <Cards>
    <StyledFarmStakingCard>
      <CardBody>
        <Flex justifyContent="space-between" alignItems="left">
        <Heading size='xl' mb='24px'>
          {PurchaseGrade[purchaseInfo.purchaseGrade.toNumber()]}
        </Heading>
        {publicCountDown <= 0 ? 
            <Button
              // disabled={realAward.eq(new BigNumber(0)) || pendingTx}
              onClick={async () => {
                await onUsePublicRestart()
              }}
            >
              Achieve
            </Button>:
        <Heading size='xl' mb='24px'>
            {purchaseInfo.purchaseGrade.lt(1)?'':getStringTime(publicCountDown)}
        </Heading>}
        <div>?</div>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{TranslateString(120, 'buy back:')}</Text>
          <Text>{TranslateString(120, `${getBalanceNumber(purchaseInfo.balance, 18)} busd`)}</Text>
        </Flex>
        {/* <Flex justifyContent="space-between" alignItems="center">
          <Text>{TranslateString(120, 'bonus epicycle:')}</Text>
          <Balance value={getBalanceNumber(purchaseInfo.BonusPrice.times(purchaseInfo.PURCHASE_BONUS),18)}/>
        </Flex> */}
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{TranslateString(120, '1 busd = 0.1 spon')}</Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{TranslateString(120, `1 CCDI = ${purchaseInfo.BonusPrice} busd`)}</Text>
        </Flex>
        <StyledCardActions>
          {!account && <UnlockButton />}
          {account &&
            (publicNeedsApproval  ? (
              <div style={{ flex: 1 }}>
                <Button disabled={requestedApproval} onClick={handlePublicPurchaseonApprove} fullWidth>
                  Approve BUSD
                </Button>
              </div>
            ) : (
              <>
                <Button
                  onClick={onPresentPublicSwapSpon}
                >
                Conversion SPON
                </Button>
                <StyledActionSpacer />
              </>
            ))}
        </StyledCardActions>
        {/* <Block>
          <Label>Sponsor</Label>
        </Block> */}
        {/* <Block>
          <Label>总CCID:</Label>
          xxx
        </Block> */}
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{TranslateString(120, 'Total bidding:')}</Text>
          <Balance value={getBalanceNumber(purchaseInfo.biddingTotal, 18)}/>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{TranslateString(120, 'waiting:')}</Text>
          <Text bold style={{ display: 'flex', alignItems: 'center' }}>
          <Balance value={getBalanceNumber(queueUp, 18)}/>
          </Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{TranslateString(120, 'expected busd:')}</Text>
          <Text bold style={{ display: 'flex', alignItems: 'center' }}>
          <Balance value={getBalanceNumber(award, 18)}/>
          </Text>
        </Flex>
        <Actions>
          <TextEx>
            <Balance value={getBalanceNumber(realAward, 18)}/>
          </TextEx>
          <Button
            disabled={realAward.eq(new BigNumber(0))}
            onClick={async () => {
              await onUsePublicHarvest()
            }}
          >
            Harvest BUSD
          </Button>
        </Actions>
        <Actions>
          <TextEx>
          <Balance value={getBalanceNumber(amount, 18)}/>
          </TextEx>
          <StyledCardActions>
          {!account && <UnlockButton />}
          {account &&
            (publicNeedsApprovalCake  ? (
              <div style={{ flex: 1 }}>
                <Button disabled={requestedApproval} onClick={handlePublicPurchaseonApproveCake} fullWidth>
                  Approve CCDI
                </Button>
              </div>
            ) : (
              <>
                <Button
                  disabled={amount.eq(0)}
                  onClick={async () => {
                    await onUsePublicWithDraw()
                  }}
                >
                Withdraw
                </Button>
                <StyledActionSpacer />
                <Button  
                  disabled={purchaseInfo.purchaseGrade.lt(1)}
                  onClick={onPresentPublicBidding}>
                    {/* <AddIcon color="background" /> */}
                    {purchaseInfo.purchaseGrade.lt(1)?'unopen':'JOIN CCDI'}
                </Button>
              </>
            ))}
        </StyledCardActions>
          {/* <Button
              // disabled={realAward.eq(new BigNumber(0)) || pendingTx}
              onClick={async () => {
                await onUsePublicWithdrawbyDev()
              }}
            >
              withdrawbyDev
            </Button> */}
        </Actions>
      </CardBody>
    </StyledFarmStakingCard>

    <StyledFarmStakingCard>
      <CardBody>
      <Flex justifyContent="space-between" alignItems="left">
          <Heading size='xl' mb='24px'>
            {PurchaseGrade[purchaseInfo.purchaseGrade.toNumber()]}
          </Heading>
          {biddinCountDown <= 0 ? 
              <Button
                // disabled={realAward.eq(new BigNumber(0)) || pendingTx}
                onClick={async () => {
                  await onUseBiddingRestart()
                }}
              >
                Achieve
              </Button>:
          <Heading size='xl' mb='24px'>
              {purchaseInfo.purchaseGrade.lt(1)?'':getStringTime(biddinCountDown)}
          </Heading>}
          <div>?</div>
          </Flex>

        <Text>{TranslateString(120, `BONUS:${getBalanceNumber(biddingPurchase.balance, 18)}/${getBalanceNumber(biddingPurchase.BonusPrice.times(3),18)}`)}</Text>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{TranslateString(120, 'expected busd:')}</Text>
          <Text bold style={{ display: 'flex', alignItems: 'center' }}>
          <Balance value={getBalanceNumber(biddingUser.award, 18)}/>
          </Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{TranslateString(120, `1 ICCDI = ${getBalanceNumber(biddingPurchase.conversion?biddingPurchase.conversion:new BigNumber(web3.utils.toWei('1', 'ether')), 18)} CCDI`)}</Text>
        </Flex>
        <Actions>
          <TextEx>
            <Balance value={getBalanceNumber(biddingUser.realAward, 18)}/>
          </TextEx>
          <Button
            // disabled={realAward.eq(new BigNumber(0)) || pendingTx}
            onClick={async () => {
              await onUseBiddingHarvest()
            }}
          >
            Harvest BUSD
          </Button>
        </Actions>

        <Actions>
          <TextEx>
          <Balance value={getBalanceNumber(biddingUser.amount, 18)}/>
          </TextEx>
          <StyledCardActions>
          {!account && <UnlockButton />}
          {account &&
            (biddinNeedsApproval  ? (
              <div style={{ flex: 1 }}>
                <Button disabled={requestedApproval} onClick={handleBiddingPurchaseApprove} fullWidth>
                  Approve CCDI
                </Button>
              </div>
            ) : (
              <>
                <Button
                  disabled={biddingUser.amount.eq(0) || pendingTx}
                  onClick={async () => {
                    await onUseBiddingWithDraw()
                  }}
                >
                Withdraw
                </Button>
                <StyledActionSpacer />
                <Button  
                  disabled={purchaseInfo.purchaseGrade.lt(1) || pendingTx || getBalanceNumber(biddingUser.balancesCake, 18) < 10}
                  onClick={onUseBiddingBidding}>
                    {/* <AddIcon color="background" /> */}
                    {purchaseInfo.purchaseGrade.lt(1)?'unopen':'10 CCDI'}
                </Button>
              </>
            ))}
        </StyledCardActions>
        </Actions>
        <Block>
          <Label>award address:</Label>
          <SubList>
            <div>
            {biddingPurchase.awardAddress[0]?`${biddingPurchase.awardAddress[0].substr(0,4)}****${biddingPurchase.awardAddress[0].substr(-4,4)} 【award】:  ${getBalanceNumber(biddingPurchase.BonusPrice,18)}  busd`:'null'}
            </div>
            <div>
            {biddingPurchase.awardAddress[1]?`${biddingPurchase.awardAddress[1].substr(0,4)}****${biddingPurchase.awardAddress[1].substr(-4,4)} 【award】:  ${getBalanceNumber(biddingPurchase.BonusPrice,18)}  busd`:'null'}
            </div>
            <div>
            {biddingPurchase.awardAddress[2]?`${biddingPurchase.awardAddress[2].substr(0,4)}****${biddingPurchase.awardAddress[2].substr(-4,4)} 【award】:  ${getBalanceNumber(biddingPurchase.BonusPrice,18)}  busd`:'null'}
            </div>
          </SubList>
        </Block>
      </CardBody>
    </StyledFarmStakingCard>

    </Cards>
  )
}

const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
  width: 100%;
  box-sizing: border-box;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

export default Purchase
