import {type MetaFunction, useLoaderData} from '@remix-run/react';
import Navbar from '~/components/Navbar';
import { FaStar } from 'react-icons/fa';
import { BsArrowUpRightCircle, BsArrowLeftSquare, BsArrowRightSquare } from "react-icons/bs";
import '../styles/styles.css';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {Image, Money} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import React, { useState } from 'react';
import Modal from '~/components/Modal';
import { AsideProvider } from '~/components/Aside';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args) {
  const products = await fetchProductsFromShopify(args);
  return {products};
}

async function fetchProductsFromShopify({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  const response = await storefront.query(PRODUCTS_QUERY, {
    variables: {
      first: 3, // Cambiado a 3 productos
    },
  });

  if (!response || !response.products) {
    throw new Error('Error al obtener productos de Shopify');
  }

  return response.products;
}

const PRODUCTS_QUERY = `#graphql
  query Products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          featuredImage {
            altText
            url
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            nodes {
              title
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export default function Index() {
  const {products} = useLoaderData();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleButtonClick = (product) => (event) => {
    event.preventDefault();
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <AsideProvider>
      <div className="min-h-screen flex flex-col">
        <div className="relative bg-cover bg-center" style={{ backgroundImage: "url('/assets/andrew-neel-HqtYwlY9dxs-unsplash.jpg')" }}>
          <Navbar className="absolute top-0 left-0 w-full z-10" />
          <div className="h-screen"></div>
        </div>
        <div className="bg-black flex items-center justify-start text-white py-1 px-4 overflow-hidden">
          <div className="marquee">
            <div className="marquee-item">Fashion</div>
            <FaStar className="marquee-star" />
            <div className="marquee-item">Men's Clothing</div>
            <FaStar className="marquee-star" />
            <div className="marquee-item">Style</div>
            <FaStar className="marquee-star" />
            <div className="marquee-item">High Quality</div>
            <FaStar className="marquee-star" />
            <div className="marquee-item">International Shipping</div>
            <FaStar className="marquee-star" />
            <div className="marquee-item">Independent Certified</div>
          </div>
        </div>
        <div className="bg-gray-100 flex flex-col p-4">
          <div className="border border-black p-2 mb-2 self-start">
            <p>1# Style Recommend</p>
          </div>
          <div className="flex flex-row justify-between w-full my-4">
            <div className="flex flex-row space-x-2 self-start">
              <p>12,000+ 5-star Reviews</p>
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <FaStar key={index} className="text-yellow-500" />
                ))}
              </div>
            </div>
            <div className="flex flex-row space-x-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="border border-white p-4">
                  {/* Contenido del rectángulo */}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-8">
          <h2 className="font-bold">Comfortable and Stylish</h2>
          <h1 className="text-2xl font-bold">Start with your Style</h1>
          <p className="text-center mt-2">We can become what we want to be by</p>
          <p className="text-center mt-2">Is what we are</p>
        </div>
        <div className="flex justify-around py-8">
          {['alexandra-gorn-WF0LSThlRmw-unsplash.jpg', 'eliud-gil-samaniego-_1bPErRSKco-unsplash.jpg', 'gabriel-cote-yez0hCVOy9Y-unsplash.jpg'].map((image, index) => (
            <div key={index} className="flex flex-col items-start space-y-0.5">
              <img src={`/assets/${image}`} alt={`Image ${index + 1}`} className="w-50 h-80 object-cover mb-1" />
              <div className="flex items-center justify-between w-full">
                <p className="text-left">
                  {index === 0 && (
                    <>
                      Stylish
                      <br />
                      Optimize your Style
                    </>
                  )}
                  {index === 1 && (
                    <>
                      Creativity
                      <br />
                      Enhance your self-perception
                    </>
                  )}
                  {index === 2 && (
                    <>
                      Be yourself
                      <br />
                      No one can stop you.
                    </>
                  )}
                </p>
                <BsArrowUpRightCircle className="ml-2 text-2xl" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-200 flex items-end justify-center py-8">
          <div className="flex items-end">
            <FaStar className="text-yellow-500 text-xl mr-2" />
            <h2 className="font-bold text-xl">Trending</h2>
          </div>
        </div>
        <div className="bg-gray-200 flex flex-col items-center justify-center py-8">
          <div className="flex justify-between items-center w-full max-w-md">
            <BsArrowLeftSquare className="text-2xl" />
            <h1 className="font-bold text-2xl">Clothes</h1>
            <BsArrowRightSquare className="text-2xl" />
          </div>
          <a href="#" className="text-blue-500 hover:underline mt-2">View All</a>
          <div className="flex justify-around w-max h-max max-w-6xl">
            {products.edges.map(({node: product}, index) => (
              <div key={product.id} className="product-container">
                <Link to={`/products/${product.handle}`}>
                  {product.featuredImage && (
                    <Image
                      alt={product.featuredImage.altText || product.title}
                      data={product.featuredImage}
                      className="w-full h-full object-cover rounded-lg"
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
                    <div className="price-button-container">
                      <button className="add-button justify-end w-full" onClick={handleButtonClick(product)}>
                        Add • $<span className="ml-auto">{parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}</span>
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} product={selectedProduct}>
          <h2>Detalles del Producto</h2>
          <p>Aquí puedes añadir más información sobre el producto.</p>
        </Modal>
      </div>
    </AsideProvider>
  );
}