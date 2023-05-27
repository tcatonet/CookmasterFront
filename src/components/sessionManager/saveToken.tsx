import Cookies from 'universal-cookie';

//Split le token d'autentification en 2 partie. La 1er partie est stocké dans un cookie
//et la 2nd partie dans le localstorage
export default function saveToken(token: string) {
  const cookies = new Cookies();
  let expirationTime = new Date();
  const tokenLength = token.length;
  const midTokenLength = Math.round(tokenLength) / 2;

  const tokenCookie = token.slice(0, midTokenLength);
  const tokenLocalStorage = token.slice(midTokenLength, tokenLength);

  expirationTime.setTime(expirationTime.getTime() + 1000 * 3600 * 120);
  cookies.set('token', tokenCookie, { path: '/', expires: expirationTime, sameSite: 'Lax' });
  localStorage.setItem('token', tokenLocalStorage);
}
