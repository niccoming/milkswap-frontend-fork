import React from 'react'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { getCakeAddress } from 'utils/addressHelpers'
import CardValue from './CardValue'

const StyledCakeStats = styled(Card)`
  align-items: center;
  display: flex;
  flex: 1;
`
const CardBodyExtended = styled(CardBody)`
  width: 100%;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const CakeStats = () => {
  const totalSupply = useTotalSupply()
  const burnedBalance = useBurnedBalance()

  return (
    <StyledCakeStats>
      <CardBodyExtended>
        <Heading size="xl" mb="24px">
          CCDI Stats
        </Heading>
        <Row>
          <Text fontSize="14px">Total CCDI Supply</Text>
          {totalSupply && <CardValue fontSize="14px" value={getBalanceNumber(totalSupply)} />}
        </Row>
        <Row>
          <Text fontSize="14px">Total CCDI Burned</Text>
          <CardValue fontSize="14px" value={getBalanceNumber(burnedBalance)} />
        </Row>
        <Row>
          <Text fontSize="14px">New CCDI/block</Text>
          <CardValue fontSize="14px" decimals={0} value={5} />
        </Row>
      </CardBodyExtended>
    </StyledCakeStats>
  )
}

export default CakeStats
