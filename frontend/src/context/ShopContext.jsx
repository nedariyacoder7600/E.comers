import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')) || null);

    const fetchCartData = async (userToken) => {
        if (!userToken) return;
        try {
            const response = await axios.get('http://localhost:5000/api/cart', {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            if (response.data.success && response.data.cartData) {
                let cartDataObj = {};
                response.data.cartData.items.forEach(item => {
                    cartDataObj[item.product._id || item.product] = item.quantity;
                });
                setCartItems(cartDataObj);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCartData(token);
        }
    }, [token]);

    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        
        toast.success("Item added to vault", {
            theme: "dark",
            style: { border: '1px solid #D4AF37', color: '#D4AF37' }
        });

        // Sync with backend only if logged in
        if (token) {
            try {
                await axios.post('http://localhost:5000/api/cart/add', { productId: itemId }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) { console.error('Error syncing cart:', error); }
        }
    }

    const removeFromCart = async (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId] > 0) {
            cartData[itemId] -= 1;
        }
        setCartItems(cartData);
        
        try {
            await axios.post('http://localhost:5000/api/cart/update', { productId: itemId, quantity: cartData[itemId] }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) { console.error('Error syncing cart:', error); }
    }

    const updateQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        
        try {
            await axios.post('http://localhost:5000/api/cart/update', { productId: itemId, quantity }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) { console.error('Error syncing cart:', error); }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = (products) => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items || product.id === items);
            if (itemInfo && cartItems[items] > 0) {
                const price = parseFloat(itemInfo.price.replace(/[^\d.]/g, '')) || 0;
                totalAmount += price * cartItems[items];
            }
        }
        return totalAmount;
    }

    const clearCart = async () => {
        setCartItems({});
        if (token) {
            try {
                await axios.post('http://localhost:5000/api/cart/clear', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) { console.error('Error clearing cart:', error); }
        }
    }

    const value = {
        search, setSearch,
        showSearch, setShowSearch,
        cartItems, addToCart, removeFromCart, updateQuantity,
        getCartCount, getCartAmount, clearCart,
        token, setToken,
        userData, setUserData
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
