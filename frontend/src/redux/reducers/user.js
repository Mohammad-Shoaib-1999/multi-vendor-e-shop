import { createReducer } from "@reduxjs/toolkit";



const initialState = {
    isAuthenticated:false
}

export const userReducer = createReducer(initialState,{
    loadUserRequest:(state)=>{
        state.loading = true;
    },
    loadUserSuccess:(state,action)=>{
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload
    },
    loadUserFail:(state,action)=>{
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload
    },

    // update user information
    updateUserInfoRequest:(state)=>{
        state.loading = true;
    },
    updateUserInfoSuccess:(state,action)=>{
        state.loading = false;
        state.user = action.payload
    },
    updateUserInfoFailed:(state,action)=>{
        state.loading= false;
        state.error = action.payload
    },
    // update user address
    updateUserAddressRequest:(state)=>{
        state.addressloading=true
    },
    updateUserAddressSuccess:(state,action)=>{
        state.addressloading= false
        state.successMessage = action.payload.successMessage;

        state.user = action.payload.user
    },
    updateUserAddressFailed:(state,action)=>{
        state.addressloading = false
        state.error = action.payload
    },

    deleteUserAddressRequest:(state)=>{
        state.addressloading = true
    },
    deleteUserAddressSuccess:(state,action)=>{
        state.addressloading = false
        state.user = action.payload.user
        state.successMessage = action.payload.successMessage
    },
    deleteUserAddressFalied:(state,action)=>{
        state.addressloading = false
        state.error = action.payload
    },
    getAllUsersRequest: (state) => {
        state.usersLoading = true;
      },
      getAllUsersSuccess: (state,action) => {
        state.usersLoading = false;
        state.users = action.payload;
      },
      getAllUsersFailed: (state,action) => {
        state.usersLoading = false;
        state.error = action.payload;
      },


    clearErrors:(state)=>{
        state.error = null
    }
})

