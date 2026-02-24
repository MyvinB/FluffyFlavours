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
    color: '#5a3e2b',
    fontSize: '14px',
    display: 'block',
    marginBottom: '4px',
  };

  return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '48px', margin: '0 0 8px 0', color: '#5a3e2b', fontWeight: '700', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
          🥐 FluffyFlavours
        </h1>
        <p style={{ color: '#8b6f47', fontSize: '16px', margin: 0 }}>Track your daily orders with ease</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button 
          type="button"
          onClick={() => setActiveTab('orders')}
          style={{ flex: 1, padding: '12px', background: activeTab === 'orders' ? 'linear-gradient(135deg, #ff8a56 0%, #ff6b6b 100%)' : 'white', color: activeTab === 'orders' ? 'white' : '#8b6f47', border: '2px solid #ffd9a6', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}
        >
          Orders
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('inventory')}
          style={{ flex: 1, padding: '12px', background: activeTab === 'inventory' ? 'linear-gradient(135deg, #ff8a56 0%, #ff6b6b 100%)' : 'white', color: activeTab === 'inventory' ? 'white' : '#8b6f47', border: '2px solid #ffd9a6', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}
        >
          Inventory
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('stats')}
          style={{ flex: 1, padding: '12px', background: activeTab === 'stats' ? 'linear-gradient(135deg, #ff8a56 0%, #ff6b6b 100%)' : 'white', color: activeTab === 'stats' ? 'white' : '#8b6f47', border: '2px solid #ffd9a6', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}
        >
          Stats
        </button>
      </div>

      {activeTab === 'orders' ? (
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
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

        <h3 style={{ color: '#5a3e2b', marginBottom: '16px', fontSize: '20px' }}>Order Items</h3>
        {items.map((item, i) => (
          <div key={i} style={{ marginBottom: '20px', padding: '20px', background: 'linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%)', borderRadius: '12px', border: '2px solid #ffd9a6' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
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
            <div style={{ color: '#5a3e2b', fontSize: '14px', fontWeight: '600' }}>
              Total: ₹{((item.sellingPrice * item.quantity) || 0).toFixed(2)} | Profit: ₹{(((item.sellingPrice - item.costPrice) * item.quantity) || 0).toFixed(2)}
            </div>
            {items.length > 1 && (
              <button type="button" onClick={() => removeItem(i)} style={{ padding: '8px 16px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginTop: '12px' }}>
                Remove Item
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addItem} style={{ marginBottom: '24px', padding: '12px 24px', background: 'white', color: '#8b6f47', border: '2px dashed #d4a574', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', width: '100%' }}>
          + Add Another Item
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button type="submit" style={{ flex: 1, padding: '14px 28px', background: 'linear-gradient(135deg, #ff8a56 0%, #ff6b6b 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', boxShadow: '0 4px 12px rgba(255,107,107,0.3)' }}>
            Save to Sheet
          </button>
          {status && <span style={{ color: status.includes('Error') ? '#ff6b6b' : '#51cf66', fontWeight: '600', fontSize: '15px' }}>{status}</span>}
        </div>
      </form>
      ) : activeTab === 'inventory' ? (
      <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
        <h3 style={{ color: '#5a3e2b', marginBottom: '24px', fontSize: '20px' }}>Add New Product</h3>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
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
          <button type="submit" style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #ff8a56 0%, #ff6b6b 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', boxShadow: '0 4px 12px rgba(255,107,107,0.3)', width: '100%' }}>
            Add to Inventory
          </button>
        </form>
        
        <h3 style={{ color: '#5a3e2b', marginTop: '40px', marginBottom: '16px', fontSize: '20px' }}>Current Inventory</h3>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {inventory.map((item, i) => (
            <div key={i} style={{ padding: '16px', marginBottom: '12px', background: 'linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%)', borderRadius: '8px', border: '2px solid #ffd9a6' }}>
              <div style={{ fontWeight: '600', color: '#5a3e2b', marginBottom: '4px' }}>{item.product}</div>
              <div style={{ fontSize: '14px', color: '#8b6f47' }}>Cost: ₹{item.costPrice} | Selling: ₹{item.sellingPrice}</div>
            </div>
          ))}
        </div>
      </div>
      ) : activeTab === 'stats' ? (
      <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
        <h3 style={{ color: '#5a3e2b', marginBottom: '24px', fontSize: '24px', textAlign: 'center' }}>📊 Business Insights</h3>
        
        {stats ? (
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ padding: '24px', background: 'linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%)', borderRadius: '12px', border: '2px solid #ffd9a6' }}>
              <div style={{ fontSize: '14px', color: '#8b6f47', marginBottom: '8px', fontWeight: '600' }}>🏆 MOST SOLD ITEM</div>
              {stats.mostSold ? (
                <>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#5a3e2b', marginBottom: '4px' }}>{stats.mostSold.product}</div>
                  <div style={{ fontSize: '16px', color: '#8b6f47' }}>{stats.mostSold.quantity} units sold</div>
                </>
              ) : <div style={{ color: '#8b6f47' }}>No data yet</div>}
            </div>

            <div style={{ padding: '24px', background: 'linear-gradient(135deg, #d4f4dd 0%, #b8e6c3 100%)', borderRadius: '12px', border: '2px solid #a3d9b1' }}>
              <div style={{ fontSize: '14px', color: '#2d6a3e', marginBottom: '8px', fontWeight: '600' }}>💰 MOST PROFITABLE ITEM</div>
              {stats.mostProfitable ? (
                <>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e4d2b', marginBottom: '4px' }}>{stats.mostProfitable.product}</div>
                  <div style={{ fontSize: '16px', color: '#2d6a3e' }}>₹{stats.mostProfitable.profit.toFixed(2)} profit</div>
                </>
              ) : <div style={{ color: '#2d6a3e' }}>No data yet</div>}
            </div>

            <div style={{ padding: '24px', background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', borderRadius: '12px', border: '2px solid #90caf9' }}>
              <div style={{ fontSize: '14px', color: '#1565c0', marginBottom: '12px', fontWeight: '600' }}>👥 TOP 3 CUSTOMERS</div>
              {stats.topCustomers && stats.topCustomers.length > 0 ? (
                stats.topCustomers.map((customer, i) => (
                  <div key={i} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: i < stats.topCustomers.length - 1 ? '1px solid rgba(21,101,192,0.2)' : 'none' }}>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#0d47a1' }}>{i + 1}. {customer.name}</div>
                    <div style={{ fontSize: '14px', color: '#1565c0' }}>₹{customer.total.toFixed(2)} spent</div>
                  </div>
                ))
              ) : <div style={{ color: '#1565c0' }}>No data yet</div>}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#8b6f47', padding: '40px' }}>Loading stats...</div>
        )}
      </div>
      ) : null}
    </main>
  );
}
