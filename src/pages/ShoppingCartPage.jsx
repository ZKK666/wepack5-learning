/**
 * 购物车页面
 *
 * 【实战功能】状态管理、数量操作、计算总价
 */
import { useState, useMemo } from 'react';
import { useFetch, useLocalStorage } from '../hooks';

function ShoppingCartPage() {
  // 使用 localStorage 持久化购物车
  const [cartItems, setCartItems] = useLocalStorage('shopping_cart', []);
  const { data: products, loading } = useFetch('/api/products');

  // 添加到购物车
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // 从购物车移除
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // 更新数量
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // 清空购物车
  const clearCart = () => {
    setCartItems([]);
  };

  // 计算总价
  const totals = useMemo(() => {
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { itemCount, totalPrice };
  }, [cartItems]);

  // 模拟下单
  const [orderStatus, setOrderStatus] = useState(null);
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('购物车为空');
      return;
    }

    setOrderStatus('processing');

    // 模拟请求
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setOrderStatus('success');
    clearCart();

    setTimeout(() => {
      setOrderStatus(null);
    }, 3000);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* 产品列表 */}
        <div>
          <h3>产品列表</h3>
          {loading ? (
            <div className="loading">加载中...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {products?.map((product) => (
                <div
                  key={product.id}
                  style={{
                    padding: '15px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <strong>{product.name}</strong>
                    <p style={{ margin: '5px 0 0', color: '#667eea', fontWeight: 'bold' }}>
                      ¥{product.price}
                    </p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => addToCart(product)}
                    style={{ padding: '8px 15px' }}
                  >
                    加入购物车
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 购物车 */}
        <div>
          <h3>
            购物车
            {totals.itemCount > 0 && (
              <span style={{
                marginLeft: '10px',
                padding: '2px 8px',
                background: '#667eea',
                color: 'white',
                borderRadius: '10px',
                fontSize: '12px'
              }}>
                {totals.itemCount}
              </span>
            )}
          </h3>

          {cartItems.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
              购物车为空
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '15px',
                      background: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <strong>{item.name}</strong>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc3545',
                          cursor: 'pointer',
                        }}
                      >
                        删除
                      </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <button
                          className="btn btn-secondary"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ padding: '2px 8px', fontSize: '12px' }}
                        >
                          -
                        </button>
                        <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                        <button
                          className="btn btn-secondary"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ padding: '2px 8px', fontSize: '12px' }}
                        >
                          +
                        </button>
                      </div>
                      <span style={{ color: '#667eea', fontWeight: 'bold' }}>
                        ¥{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 结算区域 */}
              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '8px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span>总计 ({totals.itemCount} 件):</span>
                  <span style={{ fontSize: '20px', color: '#dc3545', fontWeight: 'bold' }}>
                    ¥{totals.totalPrice.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={clearCart}
                    style={{ flex: 1 }}
                  >
                    清空购物车
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleCheckout}
                    disabled={orderStatus === 'processing'}
                    style={{ flex: 2 }}
                  >
                    {orderStatus === 'processing' ? '处理中...' : '结算'}
                  </button>
                </div>
              </div>

              {orderStatus === 'success' && (
                <div className="tip-box success" style={{ marginTop: '15px' }}>
                  订单提交成功！
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingCartPage;
