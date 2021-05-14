import fetch from 'node-fetch'
import { useEffect, useState } from 'react'
import useRefresh from '../hooks/useRefresh'

function get<T>(url: string): Promise<T> {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json()
  })
}
interface Blockcountdown {
  message: string
  result: {
    CountdownBlock: number
    CurrentBlock:number
    EstimateTimeInSec:number
    RemainingBlock: number
  }
  status: string
}

export const getblocknobytimetamp = async (timetamp) => {
  const url = `https://api.bscscan.com/api?module=block&action=getblocknobytime×tamp=${timetamp}&closest=before&apikey=23QG1P3NJESFH641PMFCDVX663WZ17AT4U`
  const res = await get(url)
  console.log("getblocknobytimetamp",timetamp,res)
}

export  const getblockcountdown = async (blockno) => {
  const url = `https://api.bscscan.com/api?module=block&action=getblockcountdown&blockno=${blockno}&apikey=23QG1P3NJESFH641PMFCDVX663WZ17AT4U`
  const countdown = await get<Blockcountdown>(url)
  console.log("getblockcountdown",countdown)
  return countdown.status === "1"?countdown.result.EstimateTimeInSec:0
}

export const useStartBlockTimetamp = (blockno) => {
  const { fastRefresh } = useRefresh()
  const [startTimetamp, setStartTimetamp] = useState<number>()

  useEffect(() => {
    async function fetchStartBlock() {
      const timetamp = await getblockcountdown(blockno)
      setStartTimetamp(timetamp)
    }
    fetchStartBlock()
  }, [fastRefresh,blockno])

  return startTimetamp
}