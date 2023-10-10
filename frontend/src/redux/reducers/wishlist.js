import { createReducer } from "@reduxjs/toolkit";

// Initial state for the wishlist
const initialState = {
  wishlist: localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems"))
    : [],
};

// Create the wishlist reducer using createReducer
export const wishlistReducer = createReducer(initialState, {
  // Reducer logic for adding an item to the wishlist
  addToWishlist: (state, action) => {
    const item = action.payload;
    const isItemExist = state.wishlist.find((i) => i._id === item._id);
    if (isItemExist) {
      // If item already exists in wishlist, update it
      return {
        ...state,
        wishlist: state.wishlist.map((i) =>
          i._id === isItemExist._id ? item : i
        ),
      };
    } else {
      // If item does not exist in wishlist, add it
      return {
        ...state,
        wishlist: [...state.wishlist, item],
      };
    }
  },

  // Reducer logic for removing an item from the wishlist
  removeFromWishlist: (state, action) => {
    return {
      ...state,
      // Filter out the item with the specified ID from the wishlist
      wishlist: state.wishlist.filter((i) => i._id !== action.payload),
    };
  },
});
