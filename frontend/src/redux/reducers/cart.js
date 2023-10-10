import { createReducer } from "@reduxjs/toolkit";

// Initial state for the cart reducer.
const initialState = {
    // Attempt to retrieve cart items from local storage, or set to an empty array if not found.
    cart: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [] ,
}

// Create the cartReducer using createReducer from Redux Toolkit.
export const cartReducer = createReducer(initialState, {
    // Reducer function for the addToCart action.
    addToCart: (state, action) => {
        const item = action.payload; // The item to be added to the cart.
        const isItemExist = state.cart.find((i) => i._id === item._id); // Check if the item is already in the cart.
        
        if (isItemExist) {
            // If the item exists in the cart, update it with the new payload.
            return {
                ...state,
                cart: state.cart.map((i) => i._id === isItemExist._id ? item : i)
            };
        } else {
            // If the item doesn't exist in the cart, add it to the cart array.
            return {
                ...state,
                cart: [...state.cart, item],
            };
        }
    },
    
    // Reducer function for the removeFromCart action.
    removeFromCart: (state, action) => {
        const itemIdToRemove = action.payload; // The _id of the item to be removed.
        
        // Filter out the item to be removed from the cart array.
        return {
            ...state,
            cart: state.cart.filter((i) => i._id !== itemIdToRemove)
        };
    }
});
