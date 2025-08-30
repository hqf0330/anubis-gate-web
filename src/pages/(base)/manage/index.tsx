import { replace } from 'react-router-dom';

const Manage = () => {
  return null;
};

export const loader = () => {
  // 重定向到发布系统
  return replace('/release');
};

export default Manage;
