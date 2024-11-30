import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Image } from '@shopify/hydrogen';
import { Link } from '@remix-run/react';
import { FaStar } from 'react-icons/fa';

const ADJUST_INVENTORY_MUTATION = gql`
  mutation adjustInventory($inventoryItemId: ID!, $availableDelta: Int!) {
    inventoryAdjustQuantity(input: { inventoryItemId: $inventoryItemId, availableDelta: $availableDelta }) {
      inventoryLevel {
        available
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function adjustInventory(inventoryItemId, quantity) {
  try {
    const response = await fetch('/api/shopify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: ADJUST_INVENTORY_MUTATION,
        variables: {
          inventoryItemId,
          availableDelta: -quantity, // Reduce el inventario
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('Error ajustando el inventario:', result.errors);
    } else {
      console.log('Inventario ajustado:', result.data);
    }
  } catch (error) {
    console.error('Error en la solicitud de ajuste de inventario:', error);
  }
}

export default function Modal({ isOpen, onClose, product }) {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const pricePerUnit = parseFloat(product.priceRange.minVariantPrice.amount);
  const totalPrice = (pricePerUnit * quantity).toFixed(2);

  async function handleBuy() {
    try {
      const response = await fetch('/reduceStock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al reducir el stock');
      }

      alert(`Compraste ${product.title} x${quantity}`);
      adjustInventory(product.variants.nodes[0].id, quantity);
    } catch (error) {
      console.error(error);
      alert('Hubo un problema al procesar tu compra.');
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-half" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="product-detail">
          {product.featuredImage && (
            <Image
              alt={product.featuredImage.altText || product.title}
              data={product.featuredImage}
              style={{ width: '60%', height: 'auto' }}
              className="object-cover rounded-lg"
            />
          )}
          {product.variants.nodes.length > 0 && (
            <div className="flex space-x-2">
              {product.variants.nodes[0].title.split(' ').slice(0, 3).map((word, index) => (
                <span key={index} className="text-black border border-gray-300 bg-gray-100 p-1 w-20 h-8 flex items-center justify-center">
                  {word}
                </span>
              ))}
            </div>
          )}
          <h4>{product.title}</h4>
          {product.description && <p className="text-gray-500">{product.description}</p>}
          <div className="flex items-center justify-between">
            <div className="stars flex space-x-1">
              {[...Array(5)].map((_, index) => (
                <FaStar key={index} className="text-black text-sm" />
              ))}
            </div>
          </div>
          <div className="purchase-summary">
            <div className="summary-item">
              <p>Quantity</p>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="quantity-input"
              />
            </div>
            <hr />
            <div className="summary-item">
              <p>Price</p>
              <p>${pricePerUnit.toFixed(2)} / Each</p>
            </div>
            <hr />
            <div className="summary-item">
              <p>Discount</p>
              <p>$0.00</p>
            </div>
            <hr />
            <div className="summary-item">
              <p>Total</p>
              <p>${totalPrice}</p>
            </div>
          </div>
          <button className="buy-button" onClick={() => alert(`Buying ${product.title} x${quantity}`)}>
            Buy {product.title} x{quantity}
          </button>
        </div>
      </div>
    </div>
  );
}