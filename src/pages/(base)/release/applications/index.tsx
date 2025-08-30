import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Input, Space, Tag, Modal, message, Checkbox, Pagination, Select } from 'antd';
import { SearchOutlined, PlusOutlined, SettingOutlined, UserOutlined, HomeOutlined, CloudOutlined, FileTextOutlined, EditOutlined, UserSwitchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

// 应用数据类型定义
interface Application {
  id: string;
  name: string;
  responsiblePersons: string[];
  description: string;
  publicAccess: boolean;
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
}

// 模拟数据
const mockApplications: Application[] = [
  {
    id: '1',
    name: 'rs_datacube',
    responsiblePersons: ['文西', '长松', '电台', '魂守', '麦当', '圣涛', '泽鹏', '冰湖'],
    description: '锐鲨蘑方运营数据展现系统',
    publicAccess: false,
    status: 'active',
    createTime: '2024-01-15',
    updateTime: '2024-01-20'
  },
  {
    id: '2',
    name: 'rs_diana',
    responsiblePersons: ['文西', '长松', '电台'],
    description: '锐鲨数据智能分析系统',
    publicAccess: false,
    status: 'active',
    createTime: '2024-01-10',
    updateTime: '2024-01-18'
  },
  {
    id: '3',
    name: 'rs_content',
    responsiblePersons: ['魂守', '麦当', '圣涛'],
    description: '锐鲨内容管理系统',
    publicAccess: false,
    status: 'active',
    createTime: '2024-01-08',
    updateTime: '2024-01-16'
  },
  {
    id: '4',
    name: 'frontend_deploy',
    responsiblePersons: ['泽鹏', '冰湖'],
    description: '前端部署系统',
    publicAccess: false,
    status: 'active',
    createTime: '2024-01-05',
    updateTime: '2024-01-14'
  },
  {
    id: '5',
    name: 'sonar-scanner',
    responsiblePersons: ['文西', '长松'],
    description: '代码质量扫描工具',
    publicAccess: false,
    status: 'active',
    createTime: '2024-01-03',
    updateTime: '2024-01-12'
  },
  {
    id: '6',
    name: 'rs_open',
    responsiblePersons: ['电台', '魂守'],
    description: '锐鲨开放平台',
    publicAccess: false,
    status: 'active',
    createTime: '2024-01-01',
    updateTime: '2024-01-10'
  },
  {
    id: '7',
    name: 'grayapi',
    responsiblePersons: ['麦当', '圣涛', '泽鹏'],
    description: '灰度发布API系统',
    publicAccess: false,
    status: 'active',
    createTime: '2023-12-28',
    updateTime: '2024-01-08'
  }
];

const ApplicationsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 过滤后的应用数据
  const filteredApplications = useMemo(() => {
    if (!searchText) return mockApplications;
    return mockApplications.filter(app => 
      app.name.toLowerCase().includes(searchText.toLowerCase()) ||
      app.description.toLowerCase().includes(searchText.toLowerCase()) ||
      app.responsiblePersons.some(person => 
        person.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText]);

  // 分页后的数据
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredApplications.slice(startIndex, endIndex);
  }, [filteredApplications, currentPage, pageSize]);

  // 表格列定义
  const columns: ColumnsType<Application> = [
    {
      title: <Checkbox 
        checked={selectedRowKeys.length === paginatedApplications.length && paginatedApplications.length > 0}
        indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < paginatedApplications.length}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedRowKeys(paginatedApplications.map(app => app.id));
          } else {
            setSelectedRowKeys([]);
          }
        }}
      />,
      dataIndex: 'select',
      key: 'select',
      width: 60,
      render: (_, record) => (
        <Checkbox 
          checked={selectedRowKeys.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record.id]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter(key => key !== record.id));
            }
          }}
        />
      )
    },
    {
      title: '应用名',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <Space>
          <HomeOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{name}</span>
        </Space>
      )
    },
    {
      title: '责任人',
      dataIndex: 'responsiblePersons',
      key: 'responsiblePersons',
      render: (persons: string[]) => (
        <Space wrap>
          {persons.map((person, index) => (
            <Tag key={index} color="blue" icon={<UserOutlined />}>
              {person}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: '功能描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 300
    },
    {
      title: '访问公网',
      dataIndex: 'publicAccess',
      key: 'publicAccess',
      render: (publicAccess: boolean) => (
        <Tag color={publicAccess ? 'green' : 'red'}>
          {publicAccess ? '是' : '否'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 400,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small"
            onClick={() => handleViewDetails(record)}
          >
            应用详情
          </Button>
          <Button 
            type="primary" 
            size="small"
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            onClick={() => handleViewRelease(record)}
          >
            发布详情
          </Button>
          <Button 
            type="primary" 
            size="small"
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            onClick={() => handleEnterIntegration(record)}
          >
            进入集成
          </Button>
          <Button 
            type="primary" 
            size="small"
            danger
            onClick={() => handleRecycle(record)}
          >
            回收
          </Button>
          <Button 
            type="primary" 
            size="small"
            style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
            onClick={() => handlePinToTop(record)}
          >
            置顶
          </Button>
        </Space>
      )
    }
  ];

  // 操作函数
  const handleViewDetails = (app: Application) => {
    message.info(`查看应用详情: ${app.name}`);
    // TODO: 实现查看详情逻辑
  };

  const handleViewRelease = (app: Application) => {
    message.info(`查看发布详情: ${app.name}`);
    // TODO: 实现查看发布详情逻辑
  };

  const handleEnterIntegration = (app: Application) => {
    message.info(`进入集成: ${app.name}`);
    // TODO: 实现进入集成逻辑
  };

  const handleRecycle = (app: Application) => {
    message.info(`回收应用: ${app.name}`);
    // TODO: 实现回收逻辑
  };

  const handlePinToTop = (app: Application) => {
    message.info(`置顶应用: ${app.name}`);
    // TODO: 实现置顶逻辑
  };

  const handleApplyNewApp = () => {
    // 跳转到新增应用页面
    navigate('/release/applications/new');
  };

  const handleBatchOperation = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要操作的应用');
      return;
    }
    message.info(`批量操作 ${selectedRowKeys.length} 个应用`);
    // TODO: 实现批量操作逻辑
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1); // 重置到第一页
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>
          <HomeOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          应用管理
        </h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          管理系统中的应用列表，支持搜索、筛选和批量操作
        </p>
      </div>

      {/* 主要内容卡片 */}
      <Card>
        {/* 顶部操作区 */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* 标签页选择器 */}
            <div style={{ display: 'flex', border: '1px solid #d9d9d9', borderRadius: '6px' }}>
              <Button 
                type="primary" 
                style={{ borderRadius: '6px 0 0 6px', border: 'none' }}
              >
                我的应用
              </Button>
              <Button 
                style={{ borderRadius: '0 6px 6px 0', border: 'none' }}
              >
                全部应用
              </Button>
            </div>

            {/* 搜索框 */}
            <Search
              placeholder="搜索应用"
              allowClear
              style={{ width: 300 }}
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {/* 批量操作按钮 */}
            {selectedRowKeys.length > 0 && (
              <Button 
                onClick={handleBatchOperation}
                icon={<SettingOutlined />}
              >
                批量操作 ({selectedRowKeys.length})
              </Button>
            )}
            
            {/* 申请新应用按钮 */}
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleApplyNewApp}
            >
              新增应用
            </Button>
          </div>
        </div>

        {/* 应用列表表格 */}
        <Table
          columns={columns}
          dataSource={paginatedApplications}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="middle"
          scroll={{ x: 1200 }}
        />

        {/* 分页器 */}
        <div style={{ 
          marginTop: '16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <span style={{ color: '#666' }}>
            共 {filteredApplications.length} 条
          </span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredApplications.length}
              onChange={(page, size) => {
                setCurrentPage(page);
                if (size !== pageSize) {
                  setPageSize(size);
                  setCurrentPage(1);
                }
              }}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => 
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }
            />
            
            <Select
              value={pageSize}
              onChange={setPageSize}
              style={{ width: 100 }}
              options={[
                { label: '10条/页', value: 10 },
                { label: '20条/页', value: 20 },
                { label: '50条/页', value: 50 },
                { label: '100条/页', value: 100 }
              ]}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export const handle = {
  i18nKey: 'route.(base)_release_applications',
  title: '应用管理',
  icon: 'mdi:application',
  order: 1
};

export default ApplicationsPage;
  