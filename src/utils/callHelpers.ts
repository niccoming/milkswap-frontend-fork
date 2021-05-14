import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

export const approve = async (lpContract, masterChefContract, account) => {
  console.log(lpContract)
  console.log(masterChefContract)
  console.log(account)
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const stake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gas: 300000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}


export const publicSwapSpon = async (PublicPurchaseContract, amount, account) => {
  console.log("publicSwapSpon",PublicPurchaseContract, amount, account)
  return PublicPurchaseContract.methods
    .swapSpon(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gas: 300000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const publicBidding = async (PublicPurchaseContract, amount, account) => {
  console.log("publicBidding",PublicPurchaseContract, amount, account)
  return PublicPurchaseContract.methods
    .bidding(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gas: 300000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const publicWithDraw = async (PublicPurchaseContract, account) => {
  console.log("publiccWithDraw",PublicPurchaseContract, account)
  return PublicPurchaseContract.methods
    .withdraw()
    .send({ from: account, gas: 300000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const publicHarvest = async (PublicPurchaseContract, account) => {
  console.log("publicHarvest",PublicPurchaseContract, account)
  return PublicPurchaseContract.methods
    .harvest()
    .send({ from: account, gas: 300000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const publicRestart = async (PublicPurchaseContract, account) => {
  console.log("publicRestart",PublicPurchaseContract, account)
  return PublicPurchaseContract.methods
    .restart()
    .send({ from: account, gas: 300000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const publicWithdrawbyDev = async (PublicPurchaseContract,amount, account) => {
  console.log("publicRestart",PublicPurchaseContract,amount, account)
  return PublicPurchaseContract.methods
    .withdrawbyDev(amount)
    .send({ from: account, gas: 300000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}



export const biddingBidding = async (BiddingPurchaseContract, account) => {
  console.log("biddingBidding",BiddingPurchaseContract, account)
  return BiddingPurchaseContract.methods
    .bidding()
    .send({ from: account, gas: 300000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const biddingWithDraw = async (BiddingPurchaseContract, account) => {
  console.log("biddingWithDraw",BiddingPurchaseContract, account)
  return BiddingPurchaseContract.methods
    .withdraw()
    .send({ from: account, gas: 300000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
export const biddingHarvest = async (BiddingPurchaseContract, account) => {
  console.log("biddingHarvest",BiddingPurchaseContract, account)
  return BiddingPurchaseContract.methods
    .harvest()
    .send({ from: account, gas: 300000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
export const biddingRestart = async (BiddingPurchaseContract, account) => {
  console.log("biddingRestart",BiddingPurchaseContract, account)
  return BiddingPurchaseContract.methods
    .restart()
    .send({ from: account, gas: 300000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}


export const sousStake = async (sousChefContract, amount, account) => {
  console.log(sousChefContract, amount, account)
  return sousChefContract.methods
    .deposit(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gas: 300000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousStakeBnb = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .deposit()
    .send({ from: account, gas: 300000, value: new BigNumber(amount).times(new BigNumber(10).pow(18)).toString() })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  console.log("unstake",pid, amount, account)
  return masterChefContract.methods
    .withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gas: 300000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousUnstake = async (sousChefContract, amount, account) => {
  console.log("sousUnstake",sousChefContract, amount, account)
  // shit code: hard fix for old CTK and BLK
  if (sousChefContract.options.address === '0x3B9B74f48E89Ebd8b45a53444327013a2308A9BC') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }
  if (sousChefContract.options.address === '0xBb2B66a2c7C2fFFB06EA60BeaD69741b3f5BF831') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  return sousChefContract.methods
    .withdraw(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gas: 300000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousEmegencyUnstake = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .emergencyWithdraw()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}



export const harvest = async (masterChefContract, pid, account) => {
  // if (pid === 0) {
  //   return masterChefContract.methods
  //     .leaveStaking('0')
  //     .send({ from: account, gas: 300000 })
  //     .on('transactionHash', (tx) => {
  //       return tx.transactionHash
  //     })
  // }

  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account, gas: 300000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const lockHarvest = async (masterChefContract, pid, account,isLocak) => {
  if (isLocak) {
    return masterChefContract.methods
      .emergencHarvestLocking(pid)
      .send({ from: account, gas: 300000 })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }
  return masterChefContract.methods
    .harvestLocking(pid)
    .send({ from: account, gas: 300000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}



export const soushHarvest = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit('0')
    .send({ from: account, gas: 300000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const soushHarvestBnb = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit()
    .send({ from: account, gas: 300000, value: new BigNumber(0) })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
