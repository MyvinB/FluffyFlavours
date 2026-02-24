'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [customer, setCustomer] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([{ product: '', quantity: 1, sellingPrice: '', costPrice: '', timeTaken: '' }]);
  const [status, setStatus] = useState('');
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [newProduct, setNewProduct] = useState({ product: '', costPrice: '', sellingPrice: '' });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    if (activeTab === 'stats') {
      loadStats();
    }
  }, [activeTab]);

  const loadInventory = () => {
    fetch('/api/inventory')
      .then(res => res.json())
      .then(data => setInventory(data.inventory || []))
      .catch(err => console.error(err));
  };

  const loadStats = () => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  };

  const addItem = () => setItems([...items, { product: '', quantity: 1, sellingPrice: '', costPrice: '', timeTaken: '' }]);
  
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    
    if (field === 'product') {
      const inventoryItem = inventory.find(inv => inv.product === value);
      if (inventoryItem) {
        updated[index].costPrice = inventoryItem.costPrice;
        updated[index].sellingPrice = inventoryItem.sellingPrice;
      }
    }
    
    setItems(updated);
  };

  const saveNewProduct = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/inventory/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      
      if (res.ok) {
        loadInventory();
        setNewProduct({ product: '', costPrice: '', sellingPrice: '' });
        setStatus('Product added!');
        setTimeout(() => setStatus(''), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Saving...');
    
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, date, items })
      });
      
      if (res.ok) {
        setStatus('Saved!');
        setCustomer('');
        setItems([{ product: '', quantity: 1, sellingPrice: '', costPrice: '', timeTaken: '' }]);
        setTimeout(() => setStatus(''), 2000);
      } else {
        setStatus('Error saving');
      }
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '6px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '8px',
    fontSize: '15px',
    background: 'rgba(255,255,255,0.9)',
    transition: 'all 0.2s',
  };

  const numberInputStyle = {
    ...inputStyle,
    MozAppearance: 'textfield',
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#c2185b',
    fontSize: '14px',
    display: 'block',
    marginBottom: '4px',
  };

  return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: 'clamp(32px, 8vw, 48px)', margin: '0 0 8px 0', color: '#c2185b', fontWeight: '700', textShadow: '2px 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <img src="/logo.jpeg" alt="FluffyFlavours" style={{ width: 'clamp(50px, 15vw, 80px)', height: 'clamp(50px, 15vw, 80px)', borderRadius: '50%', objectFit: 'cover' }} />
          FluffyFlavours
        </h1>
        <p style={{ color: '#880e4f', fontSize: 'clamp(14px, 3vw, 16px)', margin: 0 }}>Track your daily orders with ease</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button 
          type="button"
          onClick={() => setActiveTab('orders')}
          style={{ flex: '1 1 auto', minWidth: '100px', padding: '12px', background: activeTab === 'orders' ? 'linear-gradient(135deg, #f48fb1 0%, #ec407a 100%)' : 'white', color: activeTab === 'orders' ? 'white' : '#c2185b', border: '2px solid #f8bbd0', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}
        >
          Orders
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('inventory')}
          style={{ flex: '1 1 auto', minWidth: '100px', padding: '12px', background: activeTab === 'inventory' ? 'linear-gradient(135deg, #f48fb1 0%, #ec407a 100%)' : 'white', color: activeTab === 'inventory' ? 'white' : '#c2185b', border: '2px solid #f8bbd0', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}
        >
          Inventory
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('stats')}
          style={{ flex: '1 1 auto', minWidth: '100px', padding: '12px', background: activeTab === 'stats' ? 'linear-gradient(135deg, #f48fb1 0%, #ec407a 100%)' : 'white', color: activeTab === 'stats' ? 'white' : '#c2185b', border: '2px solid #f8bbd0', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}
        >
          Stats
        </button>
      </div>

      {activeTab === 'orders' ? (
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 'clamp(16px, 4vw, 32px)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Customer Name</label>
          <input 
            type="text" 
            value={customer} 
            onChange={(e) => setCustomer(e.target.value)}
            required
            style={inputStyle}
            placeholder="Enter customer name"
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={labelStyle}>Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <h3 style={{ color: '#c2185b', marginBottom: '16px', fontSize: '20px' }}>Order Items</h3>
        {items.map((item, i) => (
          <div key={i} style={{ marginBottom: '20px', padding: '20px', background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)', borderRadius: '12px', border: '2px solid #f48fb1' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Product</label>
              <select
                value={item.product} 
                onChange={(e) => updateItem(i, 'product', e.target.value)}
                required
                style={inputStyle}
              >
                <option value="">Select a product</option>
                {inventory.map((inv, idx) => (
                  <option key={idx} value={inv.product}>{inv.product}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  value={item.quantity} 
                  onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                  required
                  style={numberInputStyle}
                  placeholder="1"
                />
              </div>
              <div>
                <label style={labelStyle}>Selling Price</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={item.sellingPrice} 
                  onChange={(e) => updateItem(i, 'sellingPrice', e.target.value)}
                  required
                  style={numberInputStyle}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label style={labelStyle}>Cost</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={item.costPrice} 
                  onChange={(e) => updateItem(i, 'costPrice', e.target.value)}
                  required
                  style={numberInputStyle}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label style={labelStyle}>Time (hrs)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={item.timeTaken} 
                  onChange={(e) => updateItem(i, 'timeTaken', e.target.value)}
                  required
                  style={numberInputStyle}
                  placeholder="0.0"
                />
              </div>
            </div>
            <div style={{ color: '#c2185b', fontSize: '14px', fontWeight: '600' }}>
              Total: ₹{((item.sellingPrice * item.quantity) || 0).toFixed(2)} | Profit: ₹{(((item.sellingPrice - item.costPrice) * item.quantity) || 0).toFixed(2)}
            </div>
            {items.length > 1 && (
              <button type="button" onClick={() => removeItem(i)} style={{ padding: '8px 16px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginTop: '12px' }}>
                Remove Item
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addItem} style={{ marginBottom: '24px', padding: '12px 24px', background: 'white', color: '#c2185b', border: '2px dashed #f48fb1', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', width: '100%' }}>
          + Add Another Item
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button type="submit" style={{ flex: 1, padding: '14px 28px', background: 'linear-gradient(135deg, #f48fb1 0%, #ec407a 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', boxShadow: '0 4px 12px rgba(236,64,122,0.3)' }}>
            Save to Sheet
          </button>
          {status && <span style={{ color: status.includes('Error') ? '#ff6b6b' : '#51cf66', fontWeight: '600', fontSize: '15px' }}>{status}</span>}
        </div>
      </form>
      ) : activeTab === 'inventory' ? (
      <div style={{ background: 'white', padding: 'clamp(16px, 4vw, 32px)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
        <h3 style={{ color: '#c2185b', marginBottom: '24px', fontSize: '20px' }}>Add New Product</h3>
        <form onSubmit={saveNewProduct}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Product Name</label>
            <input 
              type="text" 
              value={newProduct.product} 
              onChange={(e) => setNewProduct({...newProduct, product: e.target.value})}
              required
              style={inputStyle}
              placeholder="e.g., Chocolate Cake"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>Cost Price</label>
              <input 
                type="number" 
                step="0.01"
                value={newProduct.costPrice} 
                onChange={(e) => setNewProduct({...newProduct, costPrice: e.target.value})}
                required
                style={numberInputStyle}
                placeholder="0.00"
              />
            </div>
            <div>
              <label style={labelStyle}>Selling Price</label>
              <input 
                type="number" 
                step="0.01"
                value={newProduct.sellingPrice} 
                onChange={(e) => setNewProduct({...newProduct, sellingPrice: e.target.value})}
                required
                style={numberInputStyle}
                placeholder="0.00"
              />
            </div>
          </div>
          <button type="submit" style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #f48fb1 0%, #ec407a 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', boxShadow: '0 4px 12px rgba(236,64,122,0.3)', width: '100%' }}>
            Add to Inventory
          </button>
        </form>
        
        <h3 style={{ color: '#c2185b', marginTop: '40px', marginBottom: '16px', fontSize: '20px' }}>Current Inventory</h3>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {inventory.map((item, i) => (
            <div key={i} style={{ padding: '16px', marginBottom: '12px', background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)', borderRadius: '8px', border: '2px solid #f48fb1' }}>
              <div style={{ fontWeight: '600', color: '#c2185b', marginBottom: '4px' }}>{item.product}</div>
              <div style={{ fontSize: '14px', color: '#880e4f' }}>Cost: ₹{item.costPrice} | Selling: ₹{item.sellingPrice}</div>
            </div>
          ))}
        </div>
      </div>
      ) : activeTab === 'stats' ? (
      <div style={{ background: 'white', padding: 'clamp(16px, 4vw, 32px)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
        <h3 style={{ color: '#c2185b', marginBottom: '24px', fontSize: '24px', textAlign: 'center' }}>📊 Business Insights</h3>
        
        {stats ? (
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ padding: '24px', background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)', borderRadius: '12px', border: '2px solid #f48fb1' }}>
              <div style={{ fontSize: '14px', color: '#880e4f', marginBottom: '8px', fontWeight: '600' }}>🏆 MOST SOLD ITEM</div>
              {stats.mostSold ? (
                <>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#c2185b', marginBottom: '4px' }}>{stats.mostSold.product}</div>
                  <div style={{ fontSize: '16px', color: '#880e4f' }}>{stats.mostSold.quantity} units sold</div>
                </>
              ) : <div style={{ color: '#880e4f' }}>No data yet</div>}
            </div>

            <div style={{ padding: '24px', background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)', borderRadius: '12px', border: '2px solid #ce93d8' }}>
              <div style={{ fontSize: '14px', color: '#6a1b9a', marginBottom: '8px', fontWeight: '600' }}>💰 MOST PROFITABLE ITEM</div>
              {stats.mostProfitable ? (
                <>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#8e24aa', marginBottom: '4px' }}>{stats.mostProfitable.product}</div>
                  <div style={{ fontSize: '16px', color: '#6a1b9a' }}>₹{stats.mostProfitable.profit.toFixed(2)} profit</div>
                </>
              ) : <div style={{ color: '#6a1b9a' }}>No data yet</div>}
            </div>

            <div style={{ padding: '24px', background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e1 100%)', borderRadius: '12px', border: '2px solid #ffb6c1' }}>
              <div style={{ fontSize: '14px', color: '#c2185b', marginBottom: '12px', fontWeight: '600' }}>👥 TOP 3 CUSTOMERS</div>
              {stats.topCustomers && stats.topCustomers.length > 0 ? (
                stats.topCustomers.map((customer, i) => (
                  <div key={i} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: i < stats.topCustomers.length - 1 ? '1px solid rgba(194,24,91,0.2)' : 'none' }}>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#c2185b' }}>{i + 1}. {customer.name}</div>
                    <div style={{ fontSize: '14px', color: '#880e4f' }}>₹{customer.total.toFixed(2)} spent</div>
                  </div>
                ))
              ) : <div style={{ color: '#c2185b' }}>No data yet</div>}
            </div>

            <div style={{ padding: '24px', background: 'linear-gradient(135deg, #fff9e6 0%, #ffe8b3 100%)', borderRadius: '12px', border: '2px solid #ffd966' }}>
              <div style={{ fontSize: '14px', color: '#b8860b', marginBottom: '12px', fontWeight: '600' }}>📅 MONTHLY PERFORMANCE</div>
              {stats.monthlyPerformance && stats.monthlyPerformance.length > 0 ? (
                stats.monthlyPerformance.map((month, i) => (
                  <div key={i} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: i < stats.monthlyPerformance.length - 1 ? '1px solid rgba(184,134,11,0.2)' : 'none' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#b8860b', marginBottom: '4px' }}>{month.month}</div>
                    <div style={{ fontSize: '14px', color: '#8b6914' }}>₹{month.sales.toFixed(2)} sales | ₹{month.profit.toFixed(2)} profit | {month.orders} orders</div>
                  </div>
                ))
              ) : <div style={{ color: '#b8860b' }}>No data yet</div>}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#880e4f', padding: '40px' }}>Loading stats...</div>
        )}
      </div>
      ) : null}
    </main>
  );
}
