from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="PriceOptimize AI",
    description="Dynamic Pricing Agent - Demo API",
    version="1.0.0"
)

# Enable CORS for all origins (demo purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "🚀 PriceOptimize AI API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "demo_products": "/api/products",
            "demo_analytics": "/api/analytics"
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "PriceOptimize AI",
        "database": "connected",
        "cache": "active"
    }

# Demo endpoints
@app.get("/api/products")
def get_products():
    return {
        "products": [
            {
                "id": 1,
                "sku": "SKU-001",
                "name": "Apple iPhone 15 Pro 256GB",
                "category": "Electronics",
                "current_price": 1062.50,
                "cost": 850.00,
                "margin": 25.0,
                "competitor_avg_price": 1099.99,
                "inventory_level": 45,
                "recommended_price": 1049.99,
                "confidence": 0.92
            },
            {
                "id": 2,
                "sku": "SKU-002",
                "name": "Nike Air Max 270 Sneakers",
                "category": "Apparel",
                "current_price": 116.25,
                "cost": 75.00,
                "margin": 55.0,
                "competitor_avg_price": 129.99,
                "inventory_level": 120,
                "recommended_price": 119.99,
                "confidence": 0.88
            },
            {
                "id": 3,
                "sku": "SKU-003",
                "name": "KitchenAid Stand Mixer 5-Quart",
                "category": "Home Goods",
                "current_price": 304.50,
                "cost": 210.00,
                "margin": 45.0,
                "competitor_avg_price": 319.99,
                "inventory_level": 28,
                "recommended_price": 299.99,
                "confidence": 0.85
            }
        ],
        "total": 3,
        "message": "Demo data - showing sample products"
    }

@app.get("/api/analytics")
def get_analytics():
    return {
        "revenue_impact": {
            "actual_revenue": 150000,
            "counterfactual_revenue": 140000,
            "revenue_lift": 10000,
            "revenue_lift_percentage": 7.14,
            "price_changes_count": 25
        },
        "margin_distribution": {
            "average_margin": 38.5,
            "min_margin": 15.2,
            "max_margin": 62.8,
            "products_below_30": 12,
            "products_30_to_50": 28,
            "products_above_50": 10
        },
        "summary": {
            "total_products": 50,
            "pending_approvals": 3,
            "auto_approved_today": 7,
            "avg_confidence": 0.87
        },
        "message": "Demo analytics data"
    }

@app.get("/api/price-changes/pending")
def get_pending_changes():
    return {
        "pending_changes": [
            {
                "id": 1,
                "product_name": "Sony WH-1000XM5 Headphones",
                "sku": "SKU-010",
                "old_price": 350.00,
                "new_price": 329.99,
                "reason": "Competitive adjustment - Amazon pricing",
                "confidence": 0.90,
                "margin_after_change": 28.5,
                "requires_approval": True
            },
            {
                "id": 2,
                "product_name": "Levi's 501 Original Fit Jeans",
                "sku": "SKU-015",
                "old_price": 54.25,
                "new_price": 49.99,
                "reason": "High inventory (250 units) - clearance discount",
                "confidence": 0.85,
                "margin_after_change": 42.8,
                "requires_approval": True
            }
        ],
        "total": 2,
        "message": "Demo pending approvals"
    }
