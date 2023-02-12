// Imports
import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Jumbotron from "../components/Jumbotron";
import { ADD_ORDER } from '../utils/mutations';
import { idbPromise } from '../utils/helpers';

function Success() {
  // Note: Page potentially needs a refactor to account for people navigating directly to this url
  // Would maybe(?) set the order history to the user's cart despite never checking out

  const [addOrder] = useMutation(ADD_ORDER);

  // Effect on load
  useEffect(() => {
    async function saveOrder() {
      // Get cart data
      const cart = await idbPromise('cart', 'get');
      const products = cart.map(el => {return el._id});

      // If there is cart data then save the order to IDB
      if (products.length) {
        const { data } = await addOrder({ variables: { products }});
        const productData = data.addOrder.products;

        productData.forEach((item) => {
          idbPromise('cart', 'delete', item);
        })
      }

      // After 3 seconds then redirect
      setTimeout(() => {
        window.location.assign('/');
      }, 3000);
    }

    saveOrder();
  }, [addOrder]);

  // JSX
  return (
    <div>
      <Jumbotron>
        <h1>Success!</h1>
        <h2>
          Thank you for your purchase!
        </h2>
        <h2>
          You will now be redirected to the homepage
        </h2>
      </Jumbotron>
    </div>
  );
};

// Export page
export default Success;