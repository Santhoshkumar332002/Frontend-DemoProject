import axios from 'axios';
import { Dispatch } from 'redux';

export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

interface FetchProductsRequestAction {
  type: typeof FETCH_PRODUCTS_REQUEST;
}

interface FetchProductsSuccessAction {
  type: typeof FETCH_PRODUCTS_SUCCESS;
  payload: Product[];
}

interface FetchProductsFailureAction {
  type: typeof FETCH_PRODUCTS_FAILURE;
  payload: string;
}

export type ProductActionTypes = FetchProductsRequestAction | FetchProductsSuccessAction | FetchProductsFailureAction;

export const fetchProductsRequest = (): FetchProductsRequestAction => ({
  type: FETCH_PRODUCTS_REQUEST,
});

export const fetchProductsSuccess = (products: Product[]): FetchProductsSuccessAction => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products,
});

export const fetchProductsFailure = (error: string): FetchProductsFailureAction => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error,
});

export const fetchProducts = () => async (dispatch: Dispatch<ProductActionTypes>) => {
  dispatch(fetchProductsRequest());
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await axios.get('http://localhost:5000/api/products/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(fetchProductsSuccess(response.data));
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Handle Axios errors specifically
      dispatch(fetchProductsFailure(error.response?.data?.message || 'Failed to load products'));
    } else if (error instanceof Error) {
      // Handle general JavaScript errors
      dispatch(fetchProductsFailure(error.message));
    } else {
      // Handle unexpected errors
      dispatch(fetchProductsFailure('An unexpected error occurred'));
    }
  }
};
