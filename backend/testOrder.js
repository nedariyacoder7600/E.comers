const testOrderWithMockProduct = async () => {
    try {
      // 1. Login
      const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@hookah.com', password: 'admin123' })
      }).then(r => r.json());
      
      const token = loginRes.token;
      const userId = loginRes.user._id;
  
      // 2. Create a mock product
      const productRes = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: "Mock Hookah",
            title: "Mock Hookah",
            price: "₹1000",
            category: "Classic",
            img: "mock.jpg"
        })
      }).then(r => r.json());

      const productId = productRes.product._id;
  
      // 3. Place order
      const orderData = {
        user: userId,
        products: [{ product: productId, quantity: 2 }],
        totalPrice: 1500,
        shippingAddress: {
          street: '123 Test St',
          city: 'Mumbai',
          zipCode: '400001',
          country: 'India'
        }
      };
      
      const orderRes = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderData)
      }).then(r => r.json());
      
      console.log("Order SUCCESS:", orderRes);
    } catch (err) {
      console.error("Order FAILURE:", err);
    }
  };
  
  testOrderWithMockProduct();
