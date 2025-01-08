const express = require('express');
const { createClient } = require('microcms-js-sdk');
const cors = require('cors');
const app = express();

// microCMSクライアントの初期化
const client = createClient({
  serviceDomain: 'k7z5hga3rc',
  apiKey: '3jeN2ycL30zbCxSBYM8fyueT5SMH2hMGoiV7'
});

app.use(cors());
app.use(express.json());

// ユーザー登録API
app.post('/api/register', async (req, res) => {
  try {
    const userData = {
      studentId: req.body.studentId,
      name: req.body.name,
      grade: req.body.grade,
      class: req.body.class,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password // 暗号化が必要
    };

    const response = await client.create({
      endpoint: 'users',
      content: userData
    });

    res.json({ success: true, user: response });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ログインAPI
app.post('/api/login', async (req, res) => {
  try {
    const { studentId, password } = req.body;
    
    // ユーザーを検索
    const response = await client.get({
      endpoint: 'users',
      queries: { filters: `studentId[equals]${studentId}` }
    });

    if (response.contents.length > 0) {
      const user = response.contents[0];
      if (user.password === password) { // ハッシュ比較に要変更
        res.json({ 
          success: true, 
          user: {
            id: user.id,
            studentId: user.studentId,
            name: user.name
          }
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 注文登録API
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = {
      userId: req.body.userId,
      orderItems: JSON.stringify(req.body.items),
      totalAmount: req.body.totalAmount,
      orderDate: new Date().toISOString()
    };

    const response = await client.create({
      endpoint: 'orders',
      content: orderData
    });

    res.json({ success: true, order: response });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 注文履歴取得API
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const response = await client.get({
      endpoint: 'orders',
      queries: { 
        filters: `userId[equals]${req.params.userId}`,
        orders: '-orderDate'
      }
    });

    res.json({ success: true, orders: response.contents });
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});