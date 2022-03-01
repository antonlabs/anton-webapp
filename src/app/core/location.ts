export const currentLocation = () => {
  let pathname = 'en';
  try{
    pathname = location.pathname.split('/')[1] ?? 'end';
  }catch(e) {}
  return location.origin + '/' + pathname;
}
