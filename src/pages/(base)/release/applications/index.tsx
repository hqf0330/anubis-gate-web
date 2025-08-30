import React, { useState, useMemo, useEffect } from 'react';
import { Card, Table, Button, Input, Space, Tag, Modal, message, Checkbox, Pagination, Select, Form, Divider, Row, Col } from 'antd';
import { SearchOutlined, PlusOutlined, SettingOutlined, UserOutlined, HomeOutlined, CloudOutlined, FileTextOutlined, EditOutlined, UserSwitchOutlined, AppstoreOutlined, BranchesOutlined } from '@ant-design/icons';
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

// 新增应用表单数据类型
interface NewApplicationForm {
  name: string;
  description: string;
  framework: string;
  gitUrl: string;
  branch: string;
  buildCommand: string;
  outputDir: string;
  owner: string;
}

// 集成变更数据类型
interface IntegrationChange {
  id: string;
  crId: string;
  title: string;
  gitBranch: string;
  creator: string;
  status: 'pending' | 'approved' | 'rejected' | 'integrated';
  createTime: string;
  description?: string;
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

// 模拟集成变更数据
const mockIntegrationChanges: IntegrationChange[] = [
  {
    id: '1',
    crId: 'CR-2024-001',
    title: '修复用户登录验证问题',
    gitBranch: 'feature/fix-login-validation',
    creator: '文西',
    status: 'pending',
    createTime: '2024-01-20 14:30:00',
    description: '修复了用户登录时的验证逻辑问题，提升了登录成功率'
  },
  {
    id: '2',
    crId: 'CR-2024-002',
    title: '优化数据查询性能',
    gitBranch: 'feature/optimize-query-performance',
    creator: '长松',
    status: 'approved',
    createTime: '2024-01-19 16:45:00',
    description: '优化了数据库查询语句，提升了查询响应速度'
  },
  {
    id: '3',
    crId: 'CR-2024-003',
    title: '新增用户权限管理功能',
    gitBranch: 'feature/user-permission-management',
    creator: '电台',
    status: 'integrated',
    createTime: '2024-01-18 09:15:00',
    description: '新增了用户权限管理模块，支持细粒度权限控制'
  }
];

// 模拟发布任务详情数据
const mockReleaseTasks = {
  appName: 'rs_datacube',
  changeType: 'JAVA',
  branch: 'release_online',
  gitAddress: 'xiaodian/rs_datacube',
  commit: '1b6fe4562a6201b9ca366225265ef444999865f1',
  taskId: '562195',
  tasks: [
    {
      id: '1',
      name: 'Clone代码',
      status: 'Git Clone 成功',
      startTime: '2024-12-17 10:59:07',
      endTime: '2024-12-17 10:59:10',
      actions: ['合并详情']
    },
    {
      id: '2',
      name: '代码构建',
      status: '构建成功,有警告!(1/1)',
      startTime: '2024-12-17 10:59:11',
      endTime: '2024-12-17 11:00:10',
      actions: ['构建详情', 'JAR包DIFF']
    },
    {
      id: '3',
      name: '镜像构建',
      status: '构建成功(1/1)',
      startTime: '2024-12-17 11:00:10',
      endTime: '2024-12-17 11:00:32',
      actions: ['构建详情', 'JAR包DIFF']
    },
    {
      id: '4',
      name: '部署',
      status: '发布成功(1/1)',
      startTime: '2024-12-17 11:00:32',
      endTime: '',
      actions: ['发布详情']
    }
  ]
};

const ApplicationsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [newAppModalVisible, setNewAppModalVisible] = useState(false);
  const [newAppForm] = Form.useForm();
  const [newAppLoading, setNewAppLoading] = useState(false);
  const [integrationModalVisible, setIntegrationModalVisible] = useState(false);
  const [currentIntegrationApp, setCurrentIntegrationApp] = useState<Application | null>(null);
  const [currentEnvironment, setCurrentEnvironment] = useState<'daily' | 'pre' | 'prod'>('daily');
  const [integrationTab, setIntegrationTab] = useState<'details' | 'records'>('details');
  const navigate = useNavigate();

  // 管理页面滚动状态
  useEffect(() => {
    if (integrationModalVisible || newAppModalVisible) {
      // 模态框打开时，禁用背景页面滚动
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else {
      // 模态框关闭时，恢复背景页面滚动
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    }

    // 清理函数：组件卸载时恢复滚动
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    };
  }, [integrationModalVisible, newAppModalVisible]);

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
    setCurrentIntegrationApp(app);
    setIntegrationModalVisible(true);
    setCurrentEnvironment('daily');
    setIntegrationTab('details');
  };

  const handleRecycle = (app: Application) => {
    message.info(`回收应用: ${app.name}`);
    // TODO: 实现回收逻辑
  };

  const handlePinToTop = (app: Application) => {
    message.info(`置顶应用: ${app.name}`);
    // TODO: 实现置顶逻辑
  };

  // 新增应用相关函数
  const handleNewAppSubmit = async (values: NewApplicationForm) => {
    setNewAppLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const applicationInfo = {
        appName: values.name,
        description: values.description,
        framework: values.framework,
        gitUrl: values.gitUrl,
        branch: values.branch,
        buildCommand: values.buildCommand,
        outputDir: values.outputDir,
        owner: values.owner,
        createTime: new Date().toISOString()
      };

      console.log('应用申请信息:', applicationInfo);

      message.success('应用申请成功！');
      message.info('您的应用已提交审核，审核通过后可在应用列表中找到');

      // 关闭模态框并重置表单
      setNewAppModalVisible(false);
      newAppForm.resetFields();
    } catch (error) {
      message.error('申请失败，请重试');
    } finally {
      setNewAppLoading(false);
    }
  };

  const handleNewAppCancel = () => {
    setNewAppModalVisible(false);
    newAppForm.resetFields();
  };

  // 集成相关函数
  const handleIntegrationCancel = () => {
    setIntegrationModalVisible(false);
    setCurrentIntegrationApp(null);
  };

  const handleRestartApplication = () => {
    message.success(`应用 ${currentIntegrationApp?.name} 重启成功！`);
  };

  const handleAddToIntegration = () => {
    message.info('跳转到集成申请页面');
    // TODO: 实现跳转到集成申请页面
  };

  const handleNewChange = () => {
    message.info('跳转到新建变更页面');
    // TODO: 实现跳转到新建变更页面
  };

  const handleImportChange = () => {
    message.info('跳转到导入变更页面');
    // TODO: 实现跳转到导入变更页面
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'blue';
      case 'rejected': return 'red';
      case 'integrated': return 'green';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待审核';
      case 'approved': return '已通过';
      case 'rejected': return '已拒绝';
      case 'integrated': return '已集成';
      default: return '未知';
    }
  };

  const handleApplyNewApp = () => {
    // 打开新增应用模态框
    setNewAppModalVisible(true);
    newAppForm.resetFields();
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

      {/* 新增应用模态框 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <PlusOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            新增应用
          </div>
        }
        open={newAppModalVisible}
        onCancel={handleNewAppCancel}
        footer={null}
        width={800}
        destroyOnClose
        maskClosable={false}
        keyboard={false}
      >
        <Form
          form={newAppForm}
          layout="vertical"
          onFinish={handleNewAppSubmit}
          initialValues={{
            framework: 'react-vite',
            branch: 'main',
            buildCommand: 'npm run build',
            outputDir: 'dist'
          }}
        >
          {/* 应用信息 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#1890ff' }}>
              <AppstoreOutlined style={{ marginRight: '8px' }} />
              应用信息
            </h3>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="应用名称"
                  rules={[{ required: true, message: '请输入应用名称' }]}
                >
                  <Input
                    placeholder="请输入应用名称,如: my-app"
                    prefix={<AppstoreOutlined />}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="framework"
                  label="技术框架"
                  rules={[{ required: true, message: '请选择技术框架' }]}
                >
                  <Select placeholder="选择技术框架">
                    <Select.Option value="react-vite">React + Vite</Select.Option>
                    <Select.Option value="vue-vite">Vue + Vite</Select.Option>
                    <Select.Option value="angular">Angular</Select.Option>
                    <Select.Option value="nextjs">Next.js</Select.Option>
                    <Select.Option value="nuxtjs">Nuxt.js</Select.Option>
                    <Select.Option value="svelte">Svelte</Select.Option>
                    <Select.Option value="other">其他</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="应用描述"
              rules={[{ required: true, message: '请输入应用描述' }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="请简要描述应用的功能和用途"
                showCount
                maxLength={200}
              />
            </Form.Item>
          </div>

          <Divider />

          {/* 代码仓库配置 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#52c41a' }}>
              <BranchesOutlined style={{ marginRight: '8px' }} />
              代码仓库配置
            </h3>

            <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  name="gitUrl"
                  label="Git 仓库地址"
                  rules={[{ required: true, message: '请输入Git仓库地址' }]}
                >
                  <Input
                    placeholder="https://github.com/username/repository.git"
                    prefix={<BranchesOutlined />}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="branch"
                  label="默认分支"
                  rules={[{ required: true, message: '请输入默认分支' }]}
                >
                  <Input
                    placeholder="main"
                    prefix={<BranchesOutlined />}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* 构建配置 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#722ed1' }}>
              <SettingOutlined style={{ marginRight: '8px' }} />
              构建配置
            </h3>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="buildCommand"
                  label="构建命令"
                  rules={[{ required: true, message: '请输入构建命令' }]}
                >
                  <Input
                    placeholder="npm run build"
                    addonBefore="构建命令"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="outputDir"
                  label="输出目录"
                  rules={[{ required: true, message: '请输入输出目录' }]}
                >
                  <Input
                    placeholder="dist"
                    addonBefore="输出目录"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* 负责人信息 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#13c2c2' }}>
              <UserOutlined style={{ marginRight: '8px' }} />
              负责人信息
            </h3>

            <Form.Item
              name="owner"
              label="负责人"
              rules={[{ required: true, message: '请输入负责人' }]}
            >
              <Input
                placeholder="请输入负责人姓名"
                prefix={<UserOutlined />}
              />
            </Form.Item>
          </div>

          {/* 操作按钮 */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Space size="large">
              <Button
                size="large"
                onClick={handleNewAppCancel}
                style={{ minWidth: '100px' }}
              >
                取消
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={newAppLoading}
                icon={<PlusOutlined />}
                style={{ minWidth: '100px' }}
              >
                {newAppLoading ? '申请中...' : '提交申请'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* 进入集成模态框 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', paddingRight: '50px' }}>
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
              <CloudOutlined style={{ marginRight: '8px', color: '#1890ff', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                进入集成 - {currentIntegrationApp?.name}
              </span>
            </div>
            <div style={{ fontSize: '14px', color: '#666', flexShrink: 0, marginLeft: '16px' }}>
              发布应用列表 {'>'} 跳转发布详情 - {currentIntegrationApp?.name}
            </div>
          </div>
        }
        open={integrationModalVisible}
        onCancel={handleIntegrationCancel}
        footer={null}
        width={1200}
        destroyOnClose
        style={{ 
          top: '5vh'
        }}
        bodyStyle={{ 
          maxHeight: '70vh', 
          overflowY: 'auto',
          padding: '24px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#d9d9d9 #f5f5f5'
        }}
        wrapClassName="integration-modal-wrapper"
        maskClosable={false}
        keyboard={false}
      >
        {/* 环境选择标签页 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', border: '1px solid #d9d9d9', borderRadius: '6px', width: 'fit-content' }}>
            <Button
              type={currentEnvironment === 'daily' ? 'primary' : 'default'}
              style={{ borderRadius: '6px 0 0 6px', border: 'none' }}
              onClick={() => setCurrentEnvironment('daily')}
            >
              日常环境
            </Button>
            <Button
              type={currentEnvironment === 'pre' ? 'primary' : 'default'}
              style={{ borderRadius: '0', border: 'none' }}
              onClick={() => setCurrentEnvironment('pre')}
            >
              预发环境
            </Button>
            <Button
              type={currentEnvironment === 'prod' ? 'primary' : 'default'}
              style={{ borderRadius: '0 6px 6px 0', border: 'none' }}
              onClick={() => setCurrentEnvironment('prod')}
            >
              线上环境
            </Button>
          </div>
        </div>

        {/* 操作按钮区 */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              type="primary"
              icon={<CloudOutlined />}
              onClick={handleRestartApplication}
            >
              重启应用
            </Button>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleNewChange}
            >
              +新建变更
            </Button>
            <Button
              type="primary"
              icon={<FileTextOutlined />}
              onClick={handleImportChange}
            >
              导入变更
            </Button>
          </div>
        </div>

        {/* 子标签页 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', border: '1px solid #d9d9d9', borderRadius: '6px', width: 'fit-content' }}>
            <Button
              type={integrationTab === 'details' ? 'primary' : 'default'}
              style={{ borderRadius: '6px 0 0 6px', border: 'none' }}
              onClick={() => setIntegrationTab('details')}
            >
              发布详情
            </Button>
            <Button
              type={integrationTab === 'records' ? 'primary' : 'default'}
              style={{ borderRadius: '0 6px 6px 0', border: 'none' }}
              onClick={() => setIntegrationTab('records')}
            >
              发布记录
            </Button>
          </div>
        </div>

        {/* 发布详情内容 */}
        {integrationTab === 'details' && (
          <div>
            {/* 日常环境和预发环境显示待集成区 */}
            {(currentEnvironment === 'daily' || currentEnvironment === 'pre') && (
              <div style={{ 
                marginBottom: '24px',
                padding: '20px',
                backgroundColor: '#fafafa',
                borderRadius: '8px',
                border: '1px solid #e8e8e8'
              }}>
                {/* 标题和操作按钮 */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '4px',
                      height: '20px',
                      backgroundColor: '#1890ff',
                      borderRadius: '2px',
                      marginRight: '12px'
                    }} />
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: 600, 
                      margin: 0, 
                      color: '#262626',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <CloudOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                      待集成区
                    </h3>
                    <Tag 
                      color="blue" 
                      style={{ 
                        marginLeft: '12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        padding: '2px 8px'
                      }}
                    >
                      {mockIntegrationChanges.length} 个变更
                    </Tag>
                  </div>
                  <Button
                    type="primary"
                    icon={<CloudOutlined />}
                    onClick={handleAddToIntegration}
                    style={{
                      borderRadius: '6px',
                      height: '36px',
                      padding: '0 16px',
                      fontWeight: 500
                    }}
                  >
                    加入集成
                  </Button>
                </div>

                {/* 统计信息卡片 */}
                <div style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  marginBottom: '20px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    border: '1px solid #f0f0f0',
                    minWidth: '120px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: '#1890ff' }}>
                      {mockIntegrationChanges.filter(item => item.status === 'pending').length}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>待审核</div>
                  </div>
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    border: '1px solid #f0f0f0',
                    minWidth: '120px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: '#52c41a' }}>
                      {mockIntegrationChanges.filter(item => item.status === 'approved').length}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>已通过</div>
                  </div>
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    border: '1px solid #f0f0f0',
                    minWidth: '120px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: '#722ed1' }}>
                      {mockIntegrationChanges.filter(item => item.status === 'integrated').length}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>已集成</div>
                  </div>
                </div>

                {/* 集成变更表格 */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #f0f0f0',
                  overflow: 'hidden'
                }}>
                  <Table
                    columns={[
                      {
                        title: (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            fontWeight: 600,
                            color: '#262626'
                          }}>
                            <div style={{
                              width: '3px',
                              height: '16px',
                              backgroundColor: '#1890ff',
                              borderRadius: '1.5px',
                              marginRight: '8px'
                            }} />
                            CRID
                          </div>
                        ),
                        dataIndex: 'crId',
                        key: 'crId',
                        width: 'auto',
                        minWidth: 100,
                        render: (crId) => (
                          <Tag 
                            color="blue" 
                            style={{ 
                              fontFamily: 'monospace',
                              fontWeight: 500,
                              borderRadius: '4px'
                            }}
                          >
                            {crId}
                          </Tag>
                        )
                      },
                      {
                        title: (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            fontWeight: 600,
                            color: '#262626'
                          }}>
                            <div style={{
                              width: '3px',
                              height: '16px',
                              backgroundColor: '#52c41a',
                              borderRadius: '1.5px',
                              marginRight: '8px'
                            }} />
                            变更标题
                          </div>
                        ),
                        dataIndex: 'title',
                        key: 'title',
                        ellipsis: {
                          showTitle: true
                        },
                        width: 'auto',
                        minWidth: 250,
                        render: (title) => (
                          <div style={{ 
                            color: '#262626',
                            fontWeight: 500,
                            lineHeight: '1.5',
                            wordBreak: 'break-word',
                            whiteSpace: 'normal',
                            maxWidth: '280px'
                          }}
                          title={title}
                          >
                            {title}
                          </div>
                        )
                      },
                      {
                        title: (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            fontWeight: 600,
                            color: '#262626'
                          }}>
                            <div style={{
                              width: '3px',
                              height: '16px',
                              backgroundColor: '#13c2c2',
                              borderRadius: '1.5px',
                              marginRight: '8px'
                            }} />
                            Git分支
                          </div>
                        ),
                        dataIndex: 'gitBranch',
                        key: 'gitBranch',
                        width: 'auto',
                        minWidth: 180,
                        render: (branch) => (
                          <Tag 
                            color="green" 
                            icon={<BranchesOutlined />}
                            style={{
                              borderRadius: '4px',
                              fontWeight: 500,
                              maxWidth: '200px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                            title={branch}
                          >
                            {branch}
                          </Tag>
                        )
                      },
                      {
                        title: (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            fontWeight: 600,
                            color: '#262626'
                          }}>
                            <div style={{
                              width: '3px',
                              height: '16px',
                              backgroundColor: '#722ed1',
                              borderRadius: '1.5px',
                              marginRight: '8px'
                            }} />
                            创建人
                          </div>
                        ),
                        dataIndex: 'creator',
                        key: 'creator',
                        width: 100,
                        render: (creator) => (
                          <Tag 
                            color="blue" 
                            icon={<UserOutlined />}
                            style={{
                              borderRadius: '4px',
                              fontWeight: 500
                            }}
                          >
                            {creator}
                          </Tag>
                        )
                      },
                      {
                        title: (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            fontWeight: 600,
                            color: '#262626'
                          }}>
                            <div style={{
                              width: '3px',
                              height: '16px',
                              backgroundColor: '#fa8c16',
                              borderRadius: '1.5px',
                              marginRight: '8px'
                            }} />
                            状态
                          </div>
                        ),
                        dataIndex: 'status',
                        key: 'status',
                        width: 100,
                        render: (status) => (
                          <Tag 
                            color={getStatusColor(status)}
                            style={{
                              borderRadius: '4px',
                              fontWeight: 500,
                              minWidth: '60px',
                              textAlign: 'center'
                            }}
                          >
                            {getStatusText(status)}
                          </Tag>
                        )
                      },
                      {
                        title: (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            fontWeight: 600,
                            color: '#262626'
                          }}>
                            <div style={{
                              width: '3px',
                              height: '16px',
                              backgroundColor: '#eb2f96',
                              borderRadius: '1.5px',
                              marginRight: '8px'
                            }} />
                            创建时间
                          </div>
                        ),
                        dataIndex: 'createTime',
                        key: 'createTime',
                        width: 150,
                        render: (time) => (
                          <div style={{ 
                            color: '#666',
                            fontSize: '13px',
                            fontFamily: 'monospace'
                          }}>
                            {time}
                          </div>
                        )
                      },
                      {
                        title: (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            fontWeight: 600,
                            color: '#262626'
                          }}>
                            <div style={{
                              width: '3px',
                              height: '16px',
                              backgroundColor: '#f5222d',
                              borderRadius: '1.5px',
                              marginRight: '8px'
                            }} />
                            操作
                          </div>
                        ),
                        key: 'action',
                        width: 200,
                        render: (_, record) => (
                          <Space size="small">
                            <Button 
                              size="small" 
                              type="link"
                              style={{
                                padding: '0 8px',
                                height: 'auto',
                                color: '#1890ff',
                                fontWeight: 500
                              }}
                            >
                              查看详情
                            </Button>
                            <Button 
                              size="small" 
                              type="link"
                              style={{
                                padding: '0 8px',
                                height: 'auto',
                                color: '#52c41a',
                                fontWeight: 500
                              }}
                            >
                              审核
                            </Button>
                          </Space>
                        )
                      }
                    ]}
                    dataSource={mockIntegrationChanges}
                    rowKey="id"
                    pagination={false}
                    size="middle"
                    scroll={{ x: 'max-content' }}
                    style={{
                      borderRadius: '8px'
                    }}
                    rowClassName={(record, index) => 
                      index % 2 === 0 ? 'table-row-even' : 'table-row-odd'
                    }
                    tableLayout="auto"
                  />
                </div>
              </div>
            )}

            {/* 线上环境显示发布任务详情 */}
            {currentEnvironment === 'prod' && (
              <div>
                {/* 应用信息 */}
                <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #e8e8e8' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: '#1890ff', display: 'flex', alignItems: 'center' }}>
                    <AppstoreOutlined style={{ marginRight: '8px' }} />
                    应用信息
                  </h3>
                  
                  <Row gutter={24}>
                    <Col span={12}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '12px 16px', 
                        backgroundColor: 'white', 
                        borderRadius: '6px',
                        border: '1px solid #f0f0f0',
                        marginBottom: '12px'
                      }}>
                        <span style={{ 
                          fontWeight: 600, 
                          color: '#666', 
                          minWidth: '80px',
                          fontSize: '14px'
                        }}>
                          应用名
                        </span>
                        <span style={{ 
                          marginLeft: '12px', 
                          color: '#262626',
                          fontWeight: 500
                        }}>
                          {mockReleaseTasks.appName}
                        </span>
                      </div>
                    </Col>
                    
                    <Col span={12}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '12px 16px', 
                        backgroundColor: 'white', 
                        borderRadius: '6px',
                        border: '1px solid #f0f0f0',
                        marginBottom: '12px'
                      }}>
                        <span style={{ 
                          fontWeight: 600, 
                          color: '#666', 
                          minWidth: '80px',
                          fontSize: '14px'
                        }}>
                          变更类型
                        </span>
                        <span style={{ 
                          marginLeft: '12px', 
                          color: '#262626',
                          fontWeight: 500
                        }}>
                          {mockReleaseTasks.changeType}
                        </span>
                      </div>
                    </Col>
                  </Row>
                  
                  <Row gutter={24}>
                    <Col span={12}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '12px 16px', 
                        backgroundColor: 'white', 
                        borderRadius: '6px',
                        border: '1px solid #f0f0f0',
                        marginBottom: '12px'
                      }}>
                        <span style={{ 
                          fontWeight: 600, 
                          color: '#666', 
                          minWidth: '80px',
                          fontSize: '14px'
                        }}>
                          分支
                        </span>
                        <span style={{ 
                          marginLeft: '12px', 
                          color: '#262626',
                          fontWeight: 500
                        }}>
                          {mockReleaseTasks.branch}
                        </span>
                        <Button 
                          size="small" 
                          type="link" 
                          style={{ 
                            marginLeft: '8px',
                            padding: '0 8px',
                            height: 'auto',
                            color: '#1890ff'
                          }}
                        >
                          Diff
                        </Button>
                      </div>
                    </Col>
                    
                    <Col span={12}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '12px 16px', 
                        backgroundColor: 'white', 
                        borderRadius: '6px',
                        border: '1px solid #f0f0f0',
                        marginBottom: '12px'
                      }}>
                        <span style={{ 
                          fontWeight: 600, 
                          color: '#666', 
                          minWidth: '80px',
                          fontSize: '14px'
                        }}>
                          Git地址
                        </span>
                        <span style={{ 
                          marginLeft: '12px', 
                          color: '#262626',
                          fontWeight: 500,
                          fontFamily: 'monospace',
                          fontSize: '13px'
                        }}>
                          {mockReleaseTasks.gitAddress}
                        </span>
                      </div>
                    </Col>
                  </Row>
                  
                  <Row gutter={24}>
                    <Col span={24}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '12px 16px', 
                        backgroundColor: 'white', 
                        borderRadius: '6px',
                        border: '1px solid #f0f0f0'
                      }}>
                        <span style={{ 
                          fontWeight: 600, 
                          color: '#666', 
                          minWidth: '80px',
                          fontSize: '14px'
                        }}>
                          Commit
                        </span>
                        <span style={{ 
                          marginLeft: '12px', 
                          color: '#262626',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          backgroundColor: '#f5f5f5',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #e8e8e8'
                        }}>
                          {mockReleaseTasks.commit}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* 任务详情 */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#52c41a' }}>
                    <SettingOutlined style={{ marginRight: '8px' }} />
                    任务详情 (ID: {mockReleaseTasks.taskId})
                  </h3>
                  <Table
                    columns={[
                      {
                        title: '任务',
                        dataIndex: 'name',
                        key: 'name',
                        width: 120
                      },
                      {
                        title: '状态',
                        dataIndex: 'status',
                        key: 'status',
                        width: 200,
                        render: (status) => {
                          let color = 'default';
                          if (status.includes('成功')) color = 'success';
                          if (status.includes('警告')) color = 'warning';
                          if (status.includes('失败')) color = 'error';
                          return <Tag color={color}>{status}</Tag>;
                        }
                      },
                      {
                        title: '开始时间',
                        dataIndex: 'startTime',
                        key: 'startTime',
                        width: 150
                      },
                      {
                        title: '结束时间',
                        dataIndex: 'endTime',
                        key: 'endTime',
                        width: 150
                      },
                      {
                        title: '操作',
                        key: 'action',
                        width: 200,
                        render: (_, record) => (
                          <Space size="small">
                            {record.actions.map((action, index) => (
                              <Button key={index} size="small" type="link">
                                {action}
                              </Button>
                            ))}
                          </Space>
                        )
                      }
                    ]}
                    dataSource={mockReleaseTasks.tasks}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </div>

                {/* 发布流程 */}
                <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f6ffed', borderRadius: '6px', border: '1px solid #b7eb8f' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#52c41a' }}>
                    <CloudOutlined style={{ marginRight: '8px' }} />
                    发布流程
                  </h3>
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <div style={{ color: '#52c41a', fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
                      恭喜,发布已完成
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#52c41a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</div>
                        <span style={{ marginLeft: '8px' }}>发布申请</span>
                      </div>
                      <div style={{ width: '20px', height: '2px', backgroundColor: '#52c41a' }}></div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#52c41a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</div>
                        <span style={{ marginLeft: '8px' }}>审批</span>
                      </div>
                      <div style={{ width: '20px', height: '2px', backgroundColor: '#52c41a' }}></div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#52c41a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</div>
                        <span style={{ marginLeft: '8px' }}>构建</span>
                      </div>
                      <div style={{ width: '20px', height: '2px', backgroundColor: '#52c41a' }}></div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#52c41a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</div>
                        <span style={{ marginLeft: '8px' }}>部署</span>
                      </div>
                      <div style={{ width: '20px', height: '2px', backgroundColor: '#52c41a' }}></div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#52c41a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</div>
                        <span style={{ marginLeft: '8px' }}>合并master</span>
                      </div>
                      <div style={{ width: '20px', height: '2px', backgroundColor: '#52c41a' }}></div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#52c41a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</div>
                        <span style={{ marginLeft: '8px' }}>完成</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Button type="primary" size="small" style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                      审批
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 发布记录内容 */}
        {integrationTab === 'records' && (
          <div>
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
              <FileTextOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <div>暂无发布记录</div>
            </div>
          </div>
        )}
      </Modal>

      {/* 自定义样式 */}
      <style>{`
        /* 模态框打开时，禁用背景页面滚动 */
        body.modal-open {
          overflow: hidden !important;
          position: fixed !important;
          width: 100% !important;
        }
        
        .integration-modal-wrapper .ant-modal {
          position: fixed !important;
          top: 5vh !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          margin: 0 !important;
          max-height: 90vh !important;
          z-index: 1000 !important;
        }
        
        .integration-modal-wrapper .ant-modal-content {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
        }
        
        .integration-modal-wrapper .ant-modal-body {
          flex: 1 !important;
          overflow-y: auto !important;
          scrollbar-width: thin !important;
          scrollbar-color: #d9d9d9 #f5f5f5 !important;
        }
        
        .integration-modal-wrapper .ant-modal-body::-webkit-scrollbar {
          width: 8px !important;
        }
        
        .integration-modal-wrapper .ant-modal-body::-webkit-scrollbar-track {
          background: #f5f5f5 !important;
          border-radius: 4px !important;
        }
        
        .integration-modal-wrapper .ant-modal-body::-webkit-scrollbar-thumb {
          background: #d9d9d9 !important;
          border-radius: 4px !important;
        }
        
        .integration-modal-wrapper .ant-modal-body::-webkit-scrollbar-thumb:hover {
          background: #bfbfbf !important;
        }
        
        /* 确保模态框遮罩层阻止背景滚动 */
        .ant-modal-mask {
          position: fixed !important;
          z-index: 999 !important;
        }
        
        /* 表格行交替颜色 */
        .table-row-even {
          background-color: #fafafa !important;
        }
        
        .table-row-odd {
          background-color: #ffffff !important;
        }
        
        /* 表格悬停效果 */
        .ant-table-tbody > tr:hover > td {
          background-color: #f0f8ff !important;
        }
        
        /* 表格自适应优化 */
        .ant-table {
          table-layout: auto !important;
        }
        
        .ant-table-thead > tr > th {
          white-space: nowrap !important;
          word-break: keep-all !important;
        }
        
        .ant-table-tbody > tr > td {
          word-break: break-word !important;
          white-space: normal !important;
          vertical-align: top !important;
          padding: 12px 16px !important;
        }
        
        /* 确保标签不会重叠 */
        .ant-tag {
          max-width: 100% !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }
      `}</style>
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
  