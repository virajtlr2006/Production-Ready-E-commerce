const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const API_ENDPOINTS = {
  // User Auth
  USER_SIGNIN: `${API_BASE_URL}/users/signin`,
  USER_SIGNUP: `${API_BASE_URL}/users/signup`,
  USER_PROFILE: `${API_BASE_URL}/users/profile`,
  USER_PROFILE_EDIT: `${API_BASE_URL}/users/profile/edit`,
  USER_CHANGE_PASSWORD: `${API_BASE_URL}/users/newpass`,
  USER_PRODUCTS: `${API_BASE_URL}/users/userproducts`,

  // Products
  APPROVED_PRODUCTS: `${API_BASE_URL}/products/approvedproducts`,
  ALL_PRODUCTS: `${API_BASE_URL}/products/allproducts`,
  PRODUCT_DETAILS: (id: string | number) => `${API_BASE_URL}/products/productdetails/${id}`,
  NEW_PRODUCT: `${API_BASE_URL}/products/newproducts`,
  EDIT_PRODUCT: (id: string | number) => `${API_BASE_URL}/products/editproduct/${id}`,
  DELETE_PRODUCT: (id: string | number) => `${API_BASE_URL}/products/deleteproduct/${id}`,
  APPROVE_PRODUCT: (id: string | number) => `${API_BASE_URL}/products/approveproduct/${id}`,
  REJECT_PRODUCT: (id: string | number) => `${API_BASE_URL}/products/rejectproduct/${id}`,

  // Payment
  NEW_PAYMENT: `${API_BASE_URL}/pay/newpayment`,

  // Admin
  ADMIN_SIGNIN: `${API_BASE_URL}/admin/signin`,
  ADMIN_SIGNUP: `${API_BASE_URL}/admin/signup`,
  ADMIN_ALL_USERS: `${API_BASE_URL}/admin/allusers`,
  DELETE_USER: (id: string | number) => `${API_BASE_URL}/admin/deleteuser/${id}`,

  //Notifications
  Get_notification: `${API_BASE_URL}/notification`,

}

export default API_BASE_URL
