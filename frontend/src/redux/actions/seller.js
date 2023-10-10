import axios from "axios";
import { server } from "../../server";

export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "loadSellerRequest",
    });
    const { data } = await axios.get(`${server}/shop/getseller`, {
      withCredentials: true,
    });
    dispatch({
      type: "loadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    dispatch({
      type: "loadSellerFailed",
      payload: error.response.data.message,
    });
  }
};

export const getAllSellers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllSellersRequest",
    });

    const { data } = await axios.get(`${server}/shop/admin-all-sellers`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllSellersSuccess",
      payload: data.sellers,
    });
    
  } catch (error) {
    dispatch({
      type: "getAllSellerFailed",
      //   payload: error.response.data.message,
    });
  }
};
