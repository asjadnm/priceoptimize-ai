import { useState, useEffect } from 'react'

const API_BASE = 'https://priceoptimize-api.onrender.com/api'

function App() {
  const [products, setProducts] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [pendingChanges, setPendingChanges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

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
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="loading">
          <div className="loading-spinner-fancy"></div>
          <p className="loading-text">Loading your pricing intelligence...</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="container">
          <div className="error-fancy">
            <div className="error-icon">⚠️</div>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button className="btn-primary" onClick={fetchData}>
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="container fade-in">
        {/* Hero Banner */}
        <div className="hero-banner">
          <div className="hero-content">
            <h2>🚀 AI-Powered Pricing Intelligence</h2>
            <p>Real-time optimization • 87% confidence • $10K revenue lift</p>
          </div>
          <div className="hero-badge">
            <span className="badge-live">● LIVE</span>
          </div>
        </div>

        {/* Dashboard Metrics with Icons */}
        {analytics && (
          <div className="dashboard-grid">
            <MetricCardEnhanced
              title="Revenue Lift"
              value={`$${(analytics.revenue_impact?.revenue_lift || 0).toLocaleString()}`}
              trend={`+${(analytics.revenue_impact?.revenue_lift_percentage || 0).toFixed(1)}%`}
              icon="💰"
              color="green"
              delay="0.1s"
            />
            <MetricCardEnhanced
              title="Total Products"
              value={analytics.summary?.total_products || 0}
              trend={`${products.length} optimized`}
              icon="📦"
              color="blue"
              delay="0.2s"
            />
            <MetricCardEnhanced
              title="Pending Approvals"
              value={analytics.summary?.pending_approvals || 0}
              trend={pendingChanges.length > 0 ? 'Action needed' : 'All clear'}
              icon="⏳"
              color="orange"
              delay="0.3s"
            />
            <MetricCardEnhanced
              title="AI Confidence"
              value={`${((analytics.summary?.avg_confidence || 0) * 100).toFixed(0)}%`}
              trend="High accuracy"
              icon="🎯"
              color="purple"
              delay="0.4s"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="action-btn primary" onClick={fetchData}>
            <span className="btn-icon">🔄</span>
            Refresh Data
          </button>
          <button className="action-btn secondary">
            <span className="btn-icon">📊</span>
            Export Report
          </button>
          <button className="action-btn secondary">
            <span className="btn-icon">⚙️</span>
            Settings
          </button>
        </div>

        {/* Products Section */}
        <div className="section card-elevated">
          <div className="section-header">
            <div>
              <h2>📦 Product Catalog</h2>
              <p className="section-subtitle">AI-optimized pricing recommendations</p>
            </div>
            <div className="section-badge">
              {products.length} Products
            </div>
          </div>
          <ProductsTableEnhanced products={products} />
        </div>

        {/* Pending Approvals */}
        {pendingChanges.length > 0 && (
          <div className="section card-elevated pulse-border">
            <div className="section-header">
              <div>
                <h2>⏳ Pending Price Changes</h2>
                <p className="section-subtitle">Review and approve AI recommendations</p>
              </div>
              <div className="urgent-badge">
                {pendingChanges.length} Pending
              </div>
            </div>
            <PendingChangesTableEnhanced changes={pendingChanges} />
          </div>
        )}

        {/* Analytics Charts */}
        {analytics && (
          <div className="charts-grid">
            <div className="section card-elevated">
              <h2>📈 Revenue Impact</h2>
              <RevenueChart analytics={analytics} />
            </div>
            
            <div className="section card-elevated">
              <h2>🎯 Margin Distribution</h2>
              <MarginChart analytics={analytics} />
            </div>
          </div>
        )}

        {/* Achievement Badge */}
        <div className="achievement-card">
          <div className="achievement-icon">🏆</div>
          <div className="achievement-content">
            <h3>Revenue Milestone Achieved!</h3>
            <p>Your AI has generated over $10,000 in additional revenue</p>
          </div>
          <div className="achievement-sparkle">✨</div>
        </div>
      </div>
    </div>
  )
}

function Header({ darkMode, setDarkMode }) {
  return (
    <div className="header-fancy">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-icon">🤖</div>
          <div>
            <h1>PriceOptimize AI</h1>
            <p className="tagline">Dynamic Pricing Intelligence</p>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="dark-mode-toggle" 
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <div className="user-avatar">A</div>
        </div>
      </div>
    </div>
  )
}

function MetricCardEnhanced({ title, value, trend, icon, color, delay }) {
  return (
    <div className={`metric-card-fancy ${color}`} style={{ animationDelay: delay }}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-content">
        <h3>{title}</h3>
        <div className="metric-value">{value}</div>
        <div className="metric-trend">{trend}</div>
      </div>
      <div className="metric-glow"></div>
    </div>
  )
}

function ProductsTableEnhanced({ products }) {
  return (
    <div className="table-container-fancy">
      <table className="table-fancy">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Current Price</th>
            <th>AI Recommended</th>
            <th>Margin</th>
            <th>Confidence</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => {
            const priceDiff = product.recommended_price - product.current_price
            const shouldIncrease = priceDiff > 0
            
            return (
              <tr key={product.id} className="table-row-hover" style={{ animationDelay: `${idx * 0.05}s` }}>
                <td>
                  <div className="product-cell">
                    <div className="product-icon">📱</div>
                    <strong>{product.name}</strong>
                  </div>
                </td>
                <td>
                  <span className="badge-category">{product.category}</span>
                </td>
                <td className="price-cell">${product.current_price.toFixed(2)}</td>
                <td>
                  <div className="recommended-price">
                    <span className={shouldIncrease ? 'price-up' : 'price-down'}>
                      ${product.recommended_price.toFixed(2)}
                    </span>
                    <span className="price-arrow">
                      {shouldIncrease ? '↗' : '↘'}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="margin-bar">
                    <div 
                      className="margin-fill" 
                      style={{ 
                        width: `${product.margin}%`,
                        background: product.margin >= 40 ? '#10b981' : product.margin >= 25 ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                    <span className="margin-text">{product.margin.toFixed(0)}%</span>
                  </div>
                </td>
                <td>
                  <div className="confidence-badge">
                    {(product.confidence * 100).toFixed(0)}%
                    {product.confidence >= 0.9 && <span className="confidence-star">⭐</span>}
                  </div>
                </td>
                <td>
                  <span className={`stock-badge ${product.inventory_level < 50 ? 'low' : 'good'}`}>
                    {product.inventory_level}
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

function PendingChangesTableEnhanced({ changes }) {
  return (
    <div className="pending-cards">
      {changes.map((change, idx) => {
        const priceDiff = change.new_price - change.old_price
        const percentChange = (priceDiff / change.old_price * 100).toFixed(1)
        const isIncrease = priceDiff > 0
        
        return (
          <div key={change.id} className="pending-card" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="pending-header">
              <h3>{change.product_name}</h3>
              <span className="pending-sku">{change.sku}</span>
            </div>
            
            <div className="pending-prices">
              <div className="price-old">
                <span className="price-label">Current</span>
                <span className="price-value">${change.old_price.toFixed(2)}</span>
              </div>
              <div className="price-arrow-big">{isIncrease ? '→' : '→'}</div>
              <div className="price-new">
                <span className="price-label">Recommended</span>
                <span className={`price-value ${isIncrease ? 'increase' : 'decrease'}`}>
                  ${change.new_price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pending-change">
              <span className={`change-badge ${isIncrease ? 'positive' : 'negative'}`}>
                {isIncrease ? '+' : ''}{percentChange}%
              </span>
            </div>

            <div className="pending-reason">
              <strong>Reason:</strong> {change.reason}
            </div>

            <div className="pending-meta">
              <div className="meta-item">
                <span className="meta-label">Confidence:</span>
                <span className="meta-value confidence-high">{(change.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">New Margin:</span>
                <span className={`meta-value ${change.margin_after_change >= 30 ? 'margin-good' : 'margin-warning'}`}>
                  {change.margin_after_change.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="pending-actions">
              <button className="btn-approve">
                ✓ Approve
              </button>
              <button className="btn-reject">
                ✗ Reject
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function RevenueChart({ analytics }) {
  const actual = analytics.revenue_impact?.actual_revenue || 0
  const counterfactual = analytics.revenue_impact?.counterfactual_revenue || 0
  const maxValue = Math.max(actual, counterfactual)
  
  return (
    <div className="chart-container">
      <div className="chart-bars">
        <div className="chart-bar">
          <div className="bar-label">Without AI</div>
          <div className="bar-wrapper">
            <div 
              className="bar-fill counterfactual" 
              style={{ width: `${(counterfactual / maxValue) * 100}%` }}
            >
              <span className="bar-value">${(counterfactual / 1000).toFixed(0)}K</span>
            </div>
          </div>
        </div>
        <div className="chart-bar">
          <div className="bar-label">With AI</div>
          <div className="bar-wrapper">
            <div 
              className="bar-fill actual" 
              style={{ width: `${(actual / maxValue) * 100}%` }}
            >
              <span className="bar-value">${(actual / 1000).toFixed(0)}K</span>
            </div>
          </div>
        </div>
      </div>
      <div className="chart-footer">
        <div className="chart-stat">
          <span className="stat-label">Revenue Lift:</span>
          <span className="stat-value success">+${((actual - counterfactual) / 1000).toFixed(1)}K</span>
        </div>
      </div>
    </div>
  )
}

function MarginChart({ analytics }) {
  const dist = analytics.margin_distribution || {}
  const total = dist.products_below_30 + dist.products_30_to_50 + dist.products_above_50
  
  const segments = [
    { label: 'Below 30%', value: dist.products_below_30, color: '#ef4444', percent: ((dist.products_below_30 / total) * 100).toFixed(0) },
    { label: '30-50%', value: dist.products_30_to_50, color: '#f59e0b', percent: ((dist.products_30_to_50 / total) * 100).toFixed(0) },
    { label: 'Above 50%', value: dist.products_above_50, color: '#10b981', percent: ((dist.products_above_50 / total) * 100).toFixed(0) }
  ]
  
  return (
    <div className="pie-chart">
      <div className="pie-segments">
        {segments.map((seg, idx) => (
          <div key={idx} className="pie-segment" style={{ flex: seg.value }}>
            <div className="segment-bar" style={{ background: seg.color, height: '80px' }}>
              <span className="segment-percent">{seg.percent}%</span>
            </div>
            <div className="segment-label">{seg.label}</div>
            <div className="segment-count">{seg.value} products</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
