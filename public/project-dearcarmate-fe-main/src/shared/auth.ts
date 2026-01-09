import { getCookie, setCookie, deleteCookie } from 'cookies-next'

// 개발 환경에서 production 빌드로 띄우는 경우도 있어 NODE_ENV만으로는 secure 여부가 애매하다.
// 실제 프로토콜을 기준으로 secure 여부를 판단한다.
const isHttps =
  typeof window !== 'undefined'
    ? window.location.protocol === 'https:'
    : (process.env.NEXT_PUBLIC_BASE_URL || '').startsWith('https')

export const getAccessToken = () => getCookie('accessToken')

export const setTokenCookies = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken, {
    maxAge: 60 * 60, // 1시간
    // 로컬(http)에서는 secure 쿠키가 전송되지 않으므로 HTTPS가 아닐 때만 끕니다.
    secure: isHttps,
    sameSite: 'strict',
  })
  setCookie('refreshToken', refreshToken, {
    maxAge: 60 * 60 * 24 * 7, // 7일
    secure: isHttps,
    sameSite: 'strict',
  })
}

export const clearTokenCookies = () => {
  deleteCookie('accessToken')
  deleteCookie('refreshToken')
}
