/*
 * @Author: Nic(❤❤️ niccoming@gmail.com ❤❤️)
 * @Date: 2021-03-10 18:57:51
 * @LastEditors: Nic
 * @LastEditTime: 2021-05-14 13:08:26
 * @FilePath: /milkswap-frontend-fork/src/views/Pools/components/Card.tsx
 */
import styled from 'styled-components'

const Card = styled.div<{ isActive?: boolean; isFinished?: boolean }>`
  background: ${(props) => props.theme.card.background};
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  border-radius: 32px;
  display: flex;
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'secondary']};
  box-shadow: ${({ isActive }) =>
    isActive
      ? '-3px -3px 10px 1px #fc6600, 3px 3px 10px 1px #f6ff00'
      : '0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05)'};
  flex-direction: column;
  position: relative;
`

export default Card
