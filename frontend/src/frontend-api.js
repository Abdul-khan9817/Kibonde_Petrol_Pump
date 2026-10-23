(() => {
  const API_BASE = 'http://localhost:5000/api';

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
      if (response.status === 404 && options.allowNotFound) {
        return { data: null };
      }
      throw new Error(data?.message || `Request failed with status ${response.status}`);
    }

    return data;
  }

  window.KibondeAPI = {
    request,
    signupUser(payload) {
      return request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    signinUser(payload) {
      return request('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    signinAdmin(payload) {
      return request('/admin/signin', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    resetAdminPassword(payload) {
      return request('/admin/reset-password', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    listUsers() {
      return request('/users');
    },
    createCoupon(payload) {
      return request('/coupons', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    listCoupons(userId) {
      const query = userId !== undefined && userId !== null ? `?user_id=${encodeURIComponent(userId)}` : '';
      return request(`/coupons${query}`);
    },
    getCouponByCode(code) {
      return request(`/coupons/${encodeURIComponent(code)}`, { allowNotFound: true });
    },
    listOrders(userId) {
      const query = userId !== undefined && userId !== null ? `?user_id=${encodeURIComponent(userId)}` : '';
      return request(`/orders${query}`);
    },
    createOrder(payload) {
      return request('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    getFuelPrices() {
      return request('/fuel-prices');
    },
    setFuelPrices(payload) {
      return request('/admin/fuel-prices', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },
    updateOrderStatus(orderId, status) {
      return request(`/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
    createMessage(payload) {
      return request('/messages', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    listMessages() {
      return request('/messages');
    },
  };
})();
