export const addTocart = (data) => async (dispatch, getState) => {
  // Dispatch an action to add an item to the cart.
  dispatch({
    type: "addToCart",
    payload: data,
  });

  // Update the cart items in local storage with the current state of the cart.
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));

  // Return the data (item) that was added to the cart.
  return data;
};

export const removeFromCart = (data) => async (dispatch, getState) => {
  // Dispatch an action to remove an item from the cart.
  dispatch({
    type: "removeFromCart",
    payload: data._id,
  });

  // Update the cart items in local storage with the current state of the cart.
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));

  // Return the data (item) that was removed from the cart.
  return data;
};
