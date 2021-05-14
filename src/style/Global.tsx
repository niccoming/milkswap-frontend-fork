/*
 * @Author: Nic(❤❤️ niccoming@gmail.com ❤❤️)
 * @Date: 2021-03-10 18:57:51
 * @LastEditors: Nic
 * @LastEditTime: 2021-05-14 14:33:47
 * @FilePath: /milkswap-frontend-fork/src/style/Global.tsx
 */
import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@pancakeswap-libs/uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Arial', sans-serif;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
    background-image: url('./images/cashcowdefi-bg-dark.svg');
    background-repeat: no-repeat;
    background-position: top;
    background-size: cover;

    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
