// Imports
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

// Redux imports
import { UPDATE_PRODUCTS, ADD_TO_CART, UPDATE_CART_QUANTITY, REMOVE_FROM_CART } from '../utils/redux/slices/storeSlice';
import { useSelector, useDispatch } from 'react-redux';

import { QUERY_PRODUCTS } from '../utils/queries';
import spinner from '../assets/spinner.gif';
import Cart from '../components/Cart';

import { idbPromise } from '../utils/helpers';

function Detail() {
  const state = useSelector((state) => state.storeReducer);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [currentProduct, setCurrentProduct] = useState({});
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const { products, cart } = state;

  // Effect to run on load
  useEffect(() => {
    if (products.length) {
      // Sets the current product to the product of the page we're on
      setCurrentProduct(products.find(product => product._id === id));
    } else if (data) {
      // If there's no data, dispatch data.products to global state
      dispatch(UPDATE_PRODUCTS(data.products));

      // Add data to IDB
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    }

    // If the data is not loading then send an IDB promise to get data
    else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        dispatch(UPDATE_PRODUCTS(indexedProducts));
      });
    }
  }, [products, data, loading, dispatch, id]);

  // Add to cart logic (sends dispatches and caches data to IDB)
  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);
    if (itemInCart) {
      dispatch(UPDATE_CART_QUANTITY(
        {
          _id: id, 
          purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
        }
      ));
      idbPromise('cart', 'put', { 
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch(ADD_TO_CART({
          ...currentProduct, 
          purchaseQuantity: 1 
        }
      ));
      idbPromise('cart', 'put', {...currentProduct, purchaseQuantity: 1});
    }
  };

  // Remove from cart logic (sends dispatches and saves to IDB)
  const removeFromCart = () => {
    dispatch(REMOVE_FROM_CART(
      {
        _id: currentProduct._id
      }
    ));
    idbPromise('cart','delete',{...currentProduct});
  };

  // JSX
  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCart}>Add to Cart</button>
            <button 
              disabled={!cart.find(p => p._id === currentProduct._id)}
              onClick={removeFromCart}>
                Remove from Cart
            </button>
          </p>
          {products.length ?
            <img
              src={`/images/${currentProduct.image}`}
              alt={currentProduct.name}
            />
            :
            null
          }
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart/>
    </>
  );
}

// Export
export default Detail;
