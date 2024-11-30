import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import { FaStar } from 'react-icons/fa';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  return (
    <div className="product-price" style={{ display: 'flex', alignItems: 'right', justifyContent: 'space-between' }}>
      {compareAtPrice ? (
        <div className="product-price-on-sale">
          {price ? <Money data={price} /> : null}
          <s>
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
      <div className="stars" style={{ marginLeft: 'auto' }}>
        {[...Array(5)].map((_, index) => (
          <FaStar key={index} className="text-black text-2xl" />
        ))}
      </div>
    </div>
  );
}
