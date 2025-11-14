import { useState, useEffect } from 'react'

const API_BASE = 'https://priceoptimize-api.onrender.com/api'

function App() {
  const [products, setProducts] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [pendingChanges, setPendingChanges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [productsRes, analyticsRes, pendingRes] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/analytics`),
        fetch(`${API_BASE}/price-changes/pending`)
      ])

      const productsData = await productsRes.json()
      const analyticsData = await analyticsRes.json()
      const pendingData = await pendingRes.json()

      setProducts(productsData.products || [])
      setAnalytics(analyticsData)
      setPendingChanges(pendingData.pending_changes || [])
    } catch (err) {
      setError('Failed to load data. Please refresh the page.')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading">
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <Header />
        <div className="container">
          <div className="error">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header />
      
      <div className="container">
        {/* Dashboard Metrics */}
        {analytics && (
          <div className="dashboard-grid">
            <MetricCard
              title="Revenue Lift"
              value={`$${(analytics.revenue_impact?.revenue_lift || 0).toLocaleString()}`}
              trend={`+${(analytics.revenue_impact?.revenue_lift_percentage || 0).toFixed(1)}%`}
            />
            <MetricCard
              title="Total Products"
              value={analytics.summary?.total_products || 0}
              trend={`${products.length} active`}
            />
            <MetricCard
              title="Pending Approvals"
              value={analytics.summary?.pending_approvals || 0}
              trend={pendingChanges.length > 0 ? 'Needs attention' : 'All clear'}
            />
            <MetricCard
              title="Avg Confidence"
              value={`${((analytics.summary?.avg_confidence || 0) * 100).toFixed(0)}%`}
              trend="High accuracy"
            />
          </div>
        )}

        {/* Products Section */}
        <div className="section">
          <h2>📦 Product Catalog</h2>
          <ProductsTable products={products} />
        </div>

        {/* Pending Approvals */}
        {pendingChanges.length > 0 && (
          <div className="section">
            <h2>⏳ Pending Price Changes</h2>
            <PendingChangesTable changes={pendingChanges} />
          </div>
        )}

        {/* Analytics Summary */}
        {analytics && (
          <div className="section">
            <h2>📊 Analytics Summary</h2>
            <AnalyticsSummary analytics={analytics} />
          </div>
        )}
      </div>
    </div>
  )
}

function Header() {
  return (
    <div className="header">
      <h1>🤖 PriceOptimize AI</h1>
      <p>Dynamic Pricing Intelligence Dashboard</p>
    </div>
  )
}

function MetricCard({ title, value, trend }) {
  return (
    <div className="metric-card">
      <h3>{title}</h3>
      <div className="value">{value}</div>
      <div className="trend">{trend}</div>
    </div>
  )
}

function ProductsTable({ products }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Current Price</th>
            <th>Recommended</th>
            <th>Margin</th>
            <th>Confidence</th>
            <th>Inventory</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td><strong>{product.name}</strong></td>
              <td>{product.sku}</td>
              <td><span className="badge info">{product.category}</span></td>
              <td>${product.current_price.toFixed(2)}</td>
              <td>
                <strong style={{ color: product.recommended_price < product.current_price ? '#10b981' : '#f59e0b' }}>
                  ${product.recommended_price.toFixed(2)}
                </strong>
              </td>
              <td>
                <span className={`badge ${product.margin >= 30 ? 'success' : 'warning'}`}>
                  {product.margin.toFixed(0)}%
                </span>
              </td>
              <td>{(product.confidence * 100).toFixed(0)}%</td>
              <td>{product.inventory_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PendingChangesTable({ changes }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Current Price</th>
            <th>New Price</th>
            <th>Change</th>
            <th>Reason</th>
            <th>Confidence</th>
            <th>New Margin</th>
          </tr>
        </thead>
        <tbody>
          {changes.map((change) => {
            const priceChange = ((change.new_price - change.old_price) / change.old_price * 100).toFixed(1)
            const isIncrease = change.new_price > change.old_price
            
            return (
              <tr key={change.id}>
                <td><strong>{change.product_name}</strong></td>
                <td>${change.old_price.toFixed(2)}</td>
                <td><strong>${change.new_price.toFixed(2)}</strong></td>
                <td>
                  <span style={{ color: isIncrease ? '#10b981' : '#ef4444' }}>
                    {isIncrease ? '+' : ''}{priceChange}%
                  </span>
                </td>
                <td>{change.reason}</td>
                <td>{(change.confidence * 100).toFixed(0)}%</td>
                <td>
                  <span className={`badge ${change.margin_after_change >= 30 ? 'success' : 'warning'}`}>
                    {change.margin_after_change.toFixed(1)}%
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function AnalyticsSummary({ analytics }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', color: '#666' }}>Revenue Impact</h3>
        <p><strong>Actual Revenue:</strong> ${(analytics.revenue_impact?.actual_revenue || 0).toLocaleString()}</p>
        <p><strong>Without AI:</strong> ${(analytics.revenue_impact?.counterfactual_revenue || 0).toLocaleString()}</p>
        <p style={{ color: '#10b981', fontWeight: 'bold', marginTop: '0.5rem' }}>
          Lift: ${(analytics.revenue_impact?.revenue_lift || 0).toLocaleString()} 
          ({(analytics.revenue_impact?.revenue_lift_percentage || 0).toFixed(2)}%)
        </p>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', color: '#666' }}>Margin Distribution</h3>
        <p><strong>Average:</strong> {(analytics.margin_distribution?.average_margin || 0).toFixed(1)}%</p>
        <p><strong>Range:</strong> {(analytics.margin_distribution?.min_margin || 0).toFixed(1)}% - {(analytics.margin_distribution?.max_margin || 0).toFixed(1)}%</p>
        <p><strong>Products Below 30%:</strong> {analytics.margin_distribution?.products_below_30 || 0}</p>
      </div>
    </div>
  )
}

export default App
