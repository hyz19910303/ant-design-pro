// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? sessionStorage.getItem('userAuthority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || [];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return sessionStorage.setItem('userAuthority', JSON.stringify(proAuthority));
}

export function removeAuthority(authority){
  const key = typeof authority === 'userAuthority' ? 'userAuthority': authority;
  sessionStorage.removeItem(key);
}

///获取访问路径下所需的凭证
export function getRouterAuthority(pathname, routeData) {
    let routeAuthority = ['noAuthority'];
    const getAuthority = (key, routes) => {
      routes.map(route => {
        if (route.path && pathToRegexp(route.path).test(key)) {
          routeAuthority = route.authority;
        } else if (route.routes) {
          routeAuthority = getAuthority(key, route.routes);
        }
        return route;
      });
      return routeAuthority;
    };
    return getAuthority(pathname, routeData);
  }