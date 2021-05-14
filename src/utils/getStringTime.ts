export const getStringTime = (countDown) => {
  const hours=Math.floor(countDown/3600)
  // 计算相差分钟数 
  const minutes=Math.floor(countDown%(3600)/(60))
   
  if (minutes > 0) {
    return `${hours} h:${minutes}m`
  }
  return `${hours} h`
}

export default getStringTime