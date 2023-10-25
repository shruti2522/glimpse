// This is the config used in order to send
// our token with Axios requests
import Cookies from "js-cookie";

export const axiosConfig = () => {
  const token = Cookies.get('authToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


/**
 * EndPoints of the API used in the code
 */

export const PROD_URL = `https://glimpse-zy3s.onrender.com`;

// CreatePost Screen
export const CREATE_POST_URL = `${PROD_URL}/createpost`;

// Home Screen
export const ALL_POST_URL = `${PROD_URL}/allpost`;

// Login Screen
export const LOGIN_URL = `${PROD_URL}/signin`;

// NewPassword Screen
export const NEW_PWD_URL = `${PROD_URL}/new-pwd`;

// Profile Screen
export const MY_POST_URL = `${PROD_URL}/mypost`;
export const MY_BOOKMARKS_URL = `${PROD_URL}/bookmarks`;

// ResetPassword Screen
export const RESET_PWD_URL = `${PROD_URL}/reset-pwd`;

// SignUp Screen
export const SIGNUP_URL = `${PROD_URL}/signup`;

// SubscribePosts Screen
export const SUB_POST_URL = `${PROD_URL}/subspost`;

//DeletePost 
export const DEL_POST_URL = `${PROD_URL}/deletepost`;
