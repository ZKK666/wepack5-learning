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
    { id: 1, name: 'Webpack 高级教程', price: 99, stock: 100, category: '前端' },
    { id: 2, name: 'React 实战指南', price: 129, stock: 50, category: '前端' },
    { id: 3, name: 'Node.js 服务端开发', price: 89, stock: 200, category: '后端' },
    { id: 4, name: 'TypeScript 入门到精通', price: 79, stock: 150, category: '前端' },
    { id: 5, name: 'Vue3 组合式 API', price: 109, stock: 80, category: '前端' },
    { id: 6, name: 'Docker 容器化部署', price: 99, stock: 120, category: '运维' },
    { id: 7, name: 'MySQL 性能优化', price: 139, stock: 60, category: '数据库' },
    { id: 8, name: 'Redis 实战', price: 89, stock: 90, category: '数据库' },
    { id: 9, name: 'Nginx 配置详解', price: 69, stock: 200, category: '运维' },
    { id: 10, name: 'Git 工作流', price: 49, stock: 300, category: '工具' },
    { id: 11, name: 'Jest 单元测试', price: 79, stock: 110, category: '测试' },
    { id: 12, name: 'Cypress E2E 测试', price: 99, stock: 70, category: '测试' },
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

  // POST /api/register - 注册
  app.post('/api/register', async (req, res) => {
    await delay(600);
    const { username, email, password } = req.body;

    // 检查用户名是否已存在
    const exists = mockData.users.find(u => u.name === username || u.email === email);
    if (exists) {
      res.status(400).json({
        code: 400,
        message: '用户名或邮箱已存在',
      });
      return;
    }

    const newUser = {
      id: mockData.users.length + 1,
      name: username,
      email,
      role: 'user',
    };
    mockData.users.push(newUser);

    res.json({
      code: 0,
      message: 'success',
      data: newUser,
    });
  });

  // POST /api/orders - 创建订单
  app.post('/api/orders', async (req, res) => {
    await delay(800);
    const { items, totalAmount } = req.body;

    const newOrder = {
      id: 1000 + mockData.orders.length + 1,
      items,
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    mockData.orders.push(newOrder);

    res.json({
      code: 0,
      message: 'success',
      data: newOrder,
    });
  });

  // GET /api/products/:id - 获取单个产品
  app.get('/api/products/:id', async (req, res) => {
    await delay(300);
    const product = mockData.products.find(p => p.id === parseInt(req.params.id));
    if (product) {
      res.json({ code: 0, message: 'success', data: product });
    } else {
      res.status(404).json({ code: 404, message: 'Product not found' });
    }
  });

  // PUT /api/products/:id - 更新产品
  app.put('/api/products/:id', async (req, res) => {
    await delay(500);
    const index = mockData.products.findIndex(p => p.id === parseInt(req.params.id));
    if (index !== -1) {
      mockData.products[index] = { ...mockData.products[index], ...req.body };
      res.json({ code: 0, message: 'success', data: mockData.products[index] });
    } else {
      res.status(404).json({ code: 404, message: 'Product not found' });
    }
  });

  // DELETE /api/products/:id - 删除产品
  app.delete('/api/products/:id', async (req, res) => {
    await delay(400);
    const index = mockData.products.findIndex(p => p.id === parseInt(req.params.id));
    if (index !== -1) {
      mockData.products.splice(index, 1);
      res.json({ code: 0, message: 'success' });
    } else {
      res.status(404).json({ code: 404, message: 'Product not found' });
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

  // GET /api/statistics - 获取统计数据
  app.get('/api/statistics', async (req, res) => {
    await delay(500);
    res.json({
      code: 0,
      message: 'success',
      data: {
        totalUsers: mockData.users.length,
        totalProducts: mockData.products.length,
        totalOrders: mockData.orders.length,
        revenue: mockData.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
      },
    });
  });

  console.log('📡 Mock API routes registered');
}

module.exports = { setupMockRoutes, mockData };
