import {
    ADD_TO_CART,
    REMOVE_CART_ITEM,
    SAVE_SHIPPING_INFO,
  } from "../constants/cartConstants";
  
  export const cartReducer = (
    state = { cartItems: [], shippingInfo: {} },
    action
  ) => {
    switch (action.type) {
      case ADD_TO_CART:
        const item = action.payload;  // return krney se pehly jo bhi action.payload se aayega wo item mein aajeyga
  
        const isItemExist = state.cartItems.find(
          (i) => i.product === item.product  // we are using product for id reference
        );
  
        if (isItemExist) {  
          return {
            ...state,
            cartItems: state.cartItems.map((i) =>
              i.product === isItemExist.product ? item : i // agar pehly se exist krta hai wo product toh just replace it
        
            ),
          };
        } else {
          return {
            ...state,
            cartItems: [...state.cartItems, item],  // agar kisi ko ek product cart mein add krna hai or wo product pehlyse cart mien added nhi hai toh | hmaari ...state mein  jo cartItems ki array h usmein add krdo ye item
          };
        }
  
      case REMOVE_CART_ITEM:
        return {
          ...state,
          cartItems: state.cartItems.filter((i) => i.product !== action.payload),
        };
  
      case SAVE_SHIPPING_INFO:
        return {
          ...state,
          shippingInfo: action.payload,
        };
  
      default:
        return state;
    }
  };