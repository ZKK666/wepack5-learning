/**
 * Mock API 数据
 *
 * 【面试重点】前端 Mock 方案
 *
 * 常见 Mock 方案：
 * 1. webpack-dev-server 的 before/after 钩子
 * 2. Mock.js 拦截 XHR
 * 3. 独立 Mock 服务器（json-server, msw）
 * 4. 代理到 Mock 服务
 *
 * 本示例使用 webpack-dev-server 的 setupMiddlewares
 */

// 模拟延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock 数据
const mockData = {
  // 用户列表
  users: [
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: 'user' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user' },
    { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: 'guest' },
  ],

  // 产品列表
  products: [
    { id: 1, name: 'Webpack 高级教程', price: 99, stock: 100 },
    { id: 2, name: 'React 实战指南', price: 129, stock: 50 },
    { id: 3, name: 'Node.js 服务端开发', price: 89, stock: 200 },
    { id: 4, name: 'TypeScript 入门到精通', price: 79, stock: 150 },
  ],

  // 订单列表
  orders: [
    { id: 1001, userId: 1, productId: 1, quantity: 2, status: 'completed' },
    { id: 1002, userId: 2, productId: 2, quantity: 1, status: 'pending' },
    { id: 1003, userId: 1, productId: 3, quantity: 3, status: 'shipping' },
  ],
};

/**
 * 设置 Mock 路由
 */
function setupMockRoutes(app) {
  // 【面试重点】RESTful API Mock

  // GET /api/users - 获取用户列表
  app.get('/api/users', async (req, res) => {
    await delay(500); // 模拟网络延迟
    res.json({
      code: 0,
      message: 'success',
      data: mockData.users,
    });
  });

  // GET /api/users/:id - 获取单个用户
  app.get('/api/users/:id', async (req, res) => {
    await delay(300);
    const user = mockData.users.find(u => u.id === parseInt(req.params.id));
    if (user) {
      res.json({ code: 0, message: 'success', data: user });
    } else {
      res.status(404).json({ code: 404, message: 'User not found' });
    }
  });

  // POST /api/users - 创建用户
  app.post('/api/users', async (req, res) => {
    await delay(500);
    const newUser = {
      id: mockData.users.length + 1,
      ...req.body,
    };
    mockData.users.push(newUser);
    res.json({ code: 0, message: 'success', data: newUser });
  });

  // GET /api/products - 获取产品列表
  app.get('/api/products', async (req, res) => {
    await delay(400);
    res.json({
      code: 0,
      message: 'success',
      data: mockData.products,
    });
  });

  // GET /api/orders - 获取订单列表
  app.get('/api/orders', async (req, res) => {
    await delay(600);
    res.json({
      code: 0,
      message: 'success',
      data: mockData.orders,
    });
  });

  // POST /api/login - 模拟登录
  app.post('/api/login', async (req, res) => {
    await delay(800);
    const { username, password } = req.body;

    if (username === 'admin' && password === '123456') {
      res.json({
        code: 0,
        message: 'success',
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: mockData.users[0],
        },
      });
    } else {
      res.status(401).json({
        code: 401,
        message: '用户名或密码错误',
      });
    }
  });

  // 模拟上传接口
  app.post('/api/upload', async (req, res) => {
    await delay(1000);
    res.json({
      code: 0,
      message: 'success',
      data: {
        url: 'https://example.com/uploads/file-' + Date.now() + '.png',
      },
    });
  });

  console.log('📡 Mock API routes registered');
}

module.exports = { setupMockRoutes, mockData };
