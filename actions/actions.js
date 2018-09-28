export const LOGIN_USER = 'LOGIN_USER';

function loginUser(userId=null){
    return {
        type:LOGIN_USER,
        userId
    }
} 