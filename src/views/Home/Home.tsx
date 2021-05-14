/*
 * @Author: Nic(❤❤️ niccoming@gmail.com ❤❤️)
 * @Date: 2021-05-13 13:15:55
 * @LastEditors: Nic
 * @LastEditTime: 2021-05-14 13:53:06
 * @FilePath: /milkswap-frontend-fork/src/views/Home/Home.tsx
 */
import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout } from '@pancakeswap-libs/uikit'
import Page from 'components/layout/Page'
import FarmStakingCard from 'views/Home/components/FarmStakingCard'
import CakeStats from 'views/Home/components/CakeStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
import getTimePeriods from 'utils/getTimePeriods'
import { getblockcountdown,getblocknobytimetamp,useStartBlockTimetamp } from 'utils/post_get'
import { useStartBlock } from 'hooks/useTokenBalance'
import TwitterCard from './components/TwitterCard';


const Hero = styled.div`
  align-items: center;
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-position: left center, right center;
    background-size: contain;
    height: 165px;
    padding-top: 0;
  }
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

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

const FatHeading = styled(Heading)`
  font-weight: 800;
`

const FatText = styled(Text)`
  font-weight: 600;
`

const Home: React.FC = () => {

  const startBlock = useStartBlock()
  const timetamp = useStartBlockTimetamp(startBlock)
  const timePeriods  = getTimePeriods(timetamp)
  console.log("timetamp",timetamp)
  return (
    <Page>
      <Hero>
          <img
          height="200" width="200"
            src="/images/cashcowdefi_logo.svg"
            alt="Cashcowdefi Logo"
          />
          <br/>
          <br/>
        <FatText>
          {/* TranslateString(578, 'The #1 AMM and yield farm on Binance Smart Chain.') */}
          The CASHCOWSWAP AMM and yield farm on Binance Smart Chain.
        </FatText>
        {timetamp > 0 &&
          (<FatText>
          <span>{timePeriods.days}      days:{timePeriods.hours}      hours:{timePeriods.minutes}       minutes</span>
          {}
          </FatText>)
        }
      </Hero>
      <Cards>
        <FarmStakingCard />
          <TwitterCard />
          <CakeStats />
        <TotalValueLockedCard />
      </Cards>
    </Page>
  )
}

export default Home
