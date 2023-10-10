// Action creator to add an item to the wishlist
export const addToWishlist = (data) => async (dispatch, getState) => {
    // Dispatch the addToWishlist action with the data payload
    dispatch({
      type: "addToWishlist",
      payload: data,
    });
  
    // Update local storage with the updated wishlist from the state
    localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
  
    // Return the data (item) that was added to the wishlist
    return data;
  };
  
  // Action creator to remove an item from the wishlist
  export const removeFromWishlist = (data) => async (dispatch, getState) => {
    // Dispatch the removeFromWishlist action with the ID of the item to remove
    dispatch({
      type: "removeFromWishlist",
      payload: data._id,
    });
  
    // Update local storage with the updated wishlist from the state
    localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
  
    // Return the data (item) that was removed from the wishlist
    return data;
  };
  