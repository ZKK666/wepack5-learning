/**
 * 实战功能演示
 *
 * 整合真实项目中常用的功能模块
 */
import { useState } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import DataTablePage from '../pages/DataTablePage';
import ShoppingCartPage from '../pages/ShoppingCartPage';

// 用户信息展示组件
function UserInfo() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div style={{
      padding: '10px 15px',
      background: '#d4edda',
      borderRadius: '8px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>
        欢迎，<strong>{user?.name}</strong>
        <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
          ({user?.role})
        </span>
      </span>
      <button
        className="btn btn-secondary"
        onClick={logout}
        style={{ padding: '5px 10px', fontSize: '12px' }}
      >
        退出登录
      </button>
    </div>
  );
}

// 主要内容组件
function MainContent() {
  const [activeTab, setActiveTab] = useState('login');
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  const tabs = [
    { id: 'login', name: '登录注册', requireAuth: false },
    { id: 'table', name: '数据表格', requireAuth: false },
    { id: 'cart', name: '购物车', requireAuth: false },
  ];

  return (
    <div>
      <UserInfo />

      {/* 标签导航 */}
      <div className="nav" style={{ marginBottom: '20px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
            {tab.requireAuth && !isAuthenticated && ' 🔒'}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="demo-area">
        {activeTab === 'login' && (
          <div>
            <h3 style={{ marginBottom: '20px' }}>用户认证</h3>
            {isAuthenticated ? (
              <div className="tip-box success">
                您已登录，可以访问所有功能
              </div>
            ) : (
              <LoginPage onSuccess={() => setActiveTab('cart')} />
            )}
          </div>
        )}

        {activeTab === 'table' && <DataTablePage />}
        {activeTab === 'cart' && <ShoppingCartPage />}
      </div>
    </div>
  );
}

function RealWorldDemo() {
  return (
    <div className="example-section">
      <span className="feature-tag">实战功能</span>
      <h2>真实项目功能演示</h2>

      <div className="tip-box">
        <strong>包含功能：</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>用户认证（登录/注册/状态持久化）</li>
          <li>数据表格（分页/搜索/排序）</li>
          <li>购物车（增删改/本地存储/结算）</li>
          <li>自定义 Hooks（useFetch/useDebounce/useForm 等）</li>
        </ul>
      </div>

      <AuthProvider>
        <MainContent />
      </AuthProvider>

      <div style={{ marginTop: '30px' }}>
        <h3>项目中使用的自定义 Hooks</h3>
        <div className="code-block">
{`// src/hooks/index.js

// 1. useFetch - 数据请求
const { data, loading, error, refetch } = useFetch('/api/users');

// 2. useDebounce - 防抖
const debouncedValue = useDebounce(searchTerm, 300);

// 3. useThrottle - 节流
const throttledValue = useThrottle(scrollY, 100);

// 4. useLocalStorage - 本地存储
const [value, setValue] = useLocalStorage('key', initialValue);

// 5. usePagination - 分页
const {
  currentPage,
  totalPages,
  nextPage,
  prevPage,
  goToPage,
} = usePagination(totalItems, itemsPerPage);

// 6. useForm - 表单处理
const {
  values,
  errors,
  handleChange,
  handleSubmit,
} = useForm(initialValues, validate);`}
        </div>

        <h3 style={{ marginTop: '20px' }}>Mock API 接口列表</h3>
        <div className="code-block">
{`// 用户相关
POST /api/login        - 登录
POST /api/register     - 注册
GET  /api/users        - 用户列表
GET  /api/users/:id    - 用户详情

// 产品相关
GET    /api/products      - 产品列表
GET    /api/products/:id  - 产品详情
PUT    /api/products/:id  - 更新产品
DELETE /api/products/:id  - 删除产品

// 订单相关
GET  /api/orders       - 订单列表
POST /api/orders       - 创建订单

// 其他
POST /api/upload       - 文件上传
GET  /api/statistics   - 统计数据`}
        </div>
      </div>
    </div>
  );
}

export default RealWorldDemo;
