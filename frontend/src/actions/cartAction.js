import {
    ADD_TO_CART,
    REMOVE_CART_ITEM,
    SAVE_SHIPPING_INFO,
  } from "../constants/cartConstants";
  import axios from "axios";
  
  // Add to Cart
  export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/v1/product/${id}`);
  
    dispatch({
      type: ADD_TO_CART,
      payload: {
        // coz reducer mein hum product use kr rhein hai id ki reference mein ,so cart reducer mein product ka mtlb hoga id
        product: data.product._id, 
        name: data.product.name,  // ye sab 
        price: data.product.price,
        image: data.product.images[0].url,  // bhej denegy
        stock: data.product.stock,
        quantity,  // quantity bhi bhej denegy asitise
      },
    });

    // taaki page reload se cart mein added items remove na ho
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
    // getState se hum state ko access kr skety
  };
  
  // REMOVE FROM CART
  export const removeItemsFromCart = (id) => async (dispatch, getState) => {
    dispatch({
      type: REMOVE_CART_ITEM,
      payload: id,
    });
  
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  };
  
  // SAVE SHIPPING INFO
  export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
      type: SAVE_SHIPPING_INFO,
      payload: data,
    });
  
    localStorage.setItem("shippingInfo", JSON.stringify(data));
  };