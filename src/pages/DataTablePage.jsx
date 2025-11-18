/**
 * 数据表格页面
 *
 * 【实战功能】分页、搜索、排序
 */
import { useState, useMemo } from 'react';
import { useFetch, useDebounce, usePagination } from '../hooks';

function DataTablePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  // 获取产品数据
  const { data: products, loading, error, refetch } = useFetch('/api/products');

  // 防抖搜索
  const debouncedSearch = useDebounce(searchTerm, 300);

  // 过滤和排序数据
  const processedData = useMemo(() => {
    if (!products) return [];

    let result = [...products];

    // 搜索过滤
    if (debouncedSearch) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.id.toString().includes(debouncedSearch)
      );
    }

    // 排序
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [products, debouncedSearch, sortConfig]);

  // 分页
  const pagination = usePagination(processedData.length, 5);
  const paginatedData = processedData.slice(pagination.startIndex, pagination.endIndex);

  // 处理排序点击
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // 获取排序图标
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (loading) return <div className="loading">加载中...</div>;
  if (error) return <div className="tip-box warning">错误: {error}</div>;

  return (
    <div>
      <h3>产品列表</h3>

      {/* 搜索栏 */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="搜索产品名称或ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <button className="btn btn-secondary" onClick={refetch}>
          刷新
        </button>
      </div>

      {/* 数据表格 */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th
                style={{ padding: '12px', textAlign: 'left', cursor: 'pointer', borderBottom: '2px solid #e0e0e0' }}
                onClick={() => handleSort('id')}
              >
                ID {getSortIcon('id')}
              </th>
              <th
                style={{ padding: '12px', textAlign: 'left', cursor: 'pointer', borderBottom: '2px solid #e0e0e0' }}
                onClick={() => handleSort('name')}
              >
                名称 {getSortIcon('name')}
              </th>
              <th
                style={{ padding: '12px', textAlign: 'right', cursor: 'pointer', borderBottom: '2px solid #e0e0e0' }}
                onClick={() => handleSort('price')}
              >
                价格 {getSortIcon('price')}
              </th>
              <th
                style={{ padding: '12px', textAlign: 'right', cursor: 'pointer', borderBottom: '2px solid #e0e0e0' }}
                onClick={() => handleSort('stock')}
              >
                库存 {getSortIcon('stock')}
              </th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0' }}>
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '12px' }}>{product.id}</td>
                <td style={{ padding: '12px' }}>{product.name}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>¥{product.price}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <span style={{
                    color: product.stock < 50 ? '#dc3545' : '#28a745',
                    fontWeight: 'bold'
                  }}>
                    {product.stock}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    编辑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页控制 */}
      <div style={{
        marginTop: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '14px', color: '#666' }}>
          共 {processedData.length} 条，第 {pagination.currentPage}/{pagination.totalPages} 页
        </span>
        <div>
          <button
            className="btn btn-secondary"
            onClick={pagination.prevPage}
            disabled={!pagination.hasPrev}
            style={{ padding: '5px 10px', fontSize: '12px' }}
          >
            上一页
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`btn ${page === pagination.currentPage ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => pagination.goToPage(page)}
              style={{ padding: '5px 10px', fontSize: '12px', margin: '0 2px' }}
            >
              {page}
            </button>
          ))}
          <button
            className="btn btn-secondary"
            onClick={pagination.nextPage}
            disabled={!pagination.hasNext}
            style={{ padding: '5px 10px', fontSize: '12px' }}
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTablePage;
