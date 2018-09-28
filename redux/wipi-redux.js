import {createStore,applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

//
//Initial State
//

const initialState={
    userId:null,
    userLoggedIn:false,
    isLoadingComplete:false
};


//
//Reducer
//

const reducer = (state=initialState,action) =>{

};

//
// Store
//
const store = createStore(reducer,applyMiddleware(thunkMiddleware));


  export {store}