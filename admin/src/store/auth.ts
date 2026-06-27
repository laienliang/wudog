/* ============================================================
   登录态管理
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\store\auth.ts
   ============================================================ */
const TOKEN_KEY = 'admin_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
