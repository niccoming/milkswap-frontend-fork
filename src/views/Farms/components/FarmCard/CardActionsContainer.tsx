import React, { useMemo, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import { getAddress } from 'utils/addressHelpers'
import { Button, Flex, Text } from '@pancakeswap-libs/uikit'
import { Farm } from 'state/types'
import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
import Balance from 'components/Balance'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { useApprove } from 'hooks/useApprove'
import {getStringTime} from 'utils/getStringTime'
import useStake from 'hooks/useStake'
import useUnstake  from 'hooks/useUnstake'
import { useHarvest ,useLockHarvest} from 'hooks/useHarvest'
import { getBalanceNumber } from 'utils/formatBalance'
import config from 'components/Menu/config'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'
import HarvestButton from './HarvestButton'


const Action = styled.div`
  padding-top: 16px;
`
export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
  depositFeeBP?: number
  tokenDecimals?: number

}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  ethereum?: provider
  account?: string
  addLiquidityUrl?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, ethereum, account, addLiquidityUrl }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses,depositFeeBP,tokenDecimals,locktime } = useFarmFromSymbol(farm.lpSymbol)
  const { allowance, tokenBalance, stakedBalance, earnings,amount,harvestTime,pending,locking } = useFarmUser(pid)
  const lpAddress = getAddress(lpAddresses)
  const lpName = farm.lpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpAddress)
  }, [ethereum, lpAddress])

  const { onApprove } = useApprove(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  const { onReward } = useHarvest(pid)
  
  const [pendingTx, setPendingTx] = useState(false)

  const countDown = Math.floor(harvestTime.toNumber() + locktime - (Date.now()/1000))

  const locakingTx =  (Date.now()/1000) >= harvestTime.toNumber() + locktime ? 'Harvest':  `${getStringTime(countDown)}`

  const { onLockHarvest } = useLockHarvest(pid,(Date.now()/1000) < harvestTime.toNumber() + locktime)


  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={lpName}
        pid={pid}
        addLiquidityUrl={addLiquidityUrl}
      />
    ) : (
      <Button mt="8px" fullWidth disabled={requestedApproval} onClick={handleApprove}>
        {TranslateString(758, 'Approve Contract')}
      </Button>
    )
  }
  return (
    <Action>
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
          {account && (
            <HarvestButton
              disabled={!pending.toNumber() || pendingTx}
              text={pendingTx ? 'Collecting' : 'Harvest'}
              onClick={async () => {
                setPendingTx(true)
                await onReward()
                setPendingTx(false)
              }}
            />
          )}
        </Flex>
        { locktime > 0 && (
          <BalanceAndCompound>
          <Balance value={ getBalanceNumber(locking, tokenDecimals)} />
            {account && (
              <HarvestButton
              disabled={!locking.toNumber() || pendingTx}
                text={pendingTx ? TranslateString(999, 'Collecting') : TranslateString(704, locakingTx)}
                onClick={async () => {
                  setPendingTx(true)
                  await onLockHarvest()
                  setPendingTx(false)
                }}
              />
            )}
          </BalanceAndCompound>
        ) }
      {!account ? <UnlockButton mt="8px" fullWidth /> : renderApprovalOrStakeButton()}
    </Action>
  )
}

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`

export default CardActions
