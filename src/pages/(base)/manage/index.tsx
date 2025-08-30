import { replace } from 'react-router-dom';

const Manage = () => {
  return null;
};

export const loader = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // 只重定向applications相关的路由到发布系统
  if (pathname.includes('/manage/applications')) {
    return replace('/release/applications');
  }
  
  // 其他manage路由保持原样，不重定向
  return null;
};

export default Manage;
  