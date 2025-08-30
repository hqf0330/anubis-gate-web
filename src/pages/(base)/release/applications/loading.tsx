import { Spin } from 'antd';

const ApplicationsLoading = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '200px' 
    }}>
      <Spin size="large" tip="加载应用管理页面..." />
    </div>
  );
};

export default ApplicationsLoading;
  