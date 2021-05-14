import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import cakeABI from 'config/abi/cake.json'
import masterChef from 'config/abi/masterchef.json'
import { getContract } from 'utils/web3'
import { getTokenBalance } from 'utils/erc20'
import { getCakeAddress,getMasterChefAddress } from 'utils/addressHelpers'
import useRefresh from './useRefresh'

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(ethereum, tokenAddress, account)
      setBalance(new BigNumber(res))
    }

    if (account && ethereum) {
      fetchBalance()
    }
  }, [account, ethereum, tokenAddress, fastRefresh])

  return balance
}

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const cakeContract = getContract(cakeABI, getCakeAddress())
      const supply = await cakeContract.methods.totalSupply().call()
      setTotalSupply(new BigNumber(supply))
    }

    fetchTotalSupply()
  }, [slowRefresh])

  return totalSupply
}



export const useStartBlock = () => {
  const { fastRefresh } = useRefresh()
  const [startBlock, setStartBlock] = useState<number>()

  useEffect(() => {
    async function fetchStartBlock() {
      const masterChefContract = getContract(masterChef, getMasterChefAddress())
      const block = await masterChefContract.methods.startBlock().call()
      setStartBlock(new BigNumber(block).toNumber())
    }
    fetchStartBlock()
  }, [fastRefresh])

  return startBlock
}

// export const masterChefStartBlock = () => {
//   const { fastRefresh } = useRefresh()
//   const [startBlock, setStartBlock] = useState<BigNumber>()

//   useEffect(() => {
//     async function fetchStartBlock() {
//       const masterChefContract = getContract(masterChef, getMasterChefAddress())
//       const block = await masterChefContract.methods.StartBlock().call()
//       setStartBlock(new BigNumber(block))
//     }
//     fetchStartBlock()
//   }, [fastRefresh])

//   return startBlock
// }

export const useBurnedBalance = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    async function fetchTotalSupply() {
      const cakeContract = getContract(cakeABI, getCakeAddress())
      const supply = await cakeContract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call()
      setBalance(new BigNumber(supply))
    }

    fetchTotalSupply()
  },[slowRefresh])

  return balance
}


// export const useBurnedBalance = (tokenAddress: string) => {
//   const [balance, setBalance] = useState(new BigNumber(0))
//   const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
//   const { slowRefresh } = useRefresh()

//   useEffect(() => {
//     const fetchBalance = async () => {
//       const res = await getTokenBalance(ethereum, tokenAddress, '0x000000000000000000000000000000000000dEaD')
//       setBalance(new BigNumber(res))
//     }

//     if (account && ethereum) {
//       fetchBalance()
//     }
//   }, [account, ethereum, tokenAddress, slowRefresh])

//   return balance
// }

export default useTokenBalance
