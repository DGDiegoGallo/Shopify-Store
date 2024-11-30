import { json, type ActionFunctionArgs } from '@shopify/remix-oxygen';

export async function action({ request, context }: ActionFunctionArgs) {
  const { storefront } = context;
  const formData = await request.formData();
  const productId = formData.get('productId');
  const quantity = parseInt(formData.get('quantity'), 10);

  if (!productId || isNaN(quantity)) {
    return json({ error: 'Invalid product ID or quantity' }, { status: 400 });
  }

  try {
    // Llamada a la API de Shopify para reducir el inventario
    await storefront.mutate(REDUCE_STOCK_MUTATION, {
      variables: { productId, quantity },
    });

    return json({ success: true });
  } catch (error) {
    console.error(error);
    return json({ error: 'Failed to reduce stock' }, { status: 500 });
  }
}

const REDUCE_STOCK_MUTATION = `#graphql
  mutation ReduceStock($productId: ID!, $quantity: Int!) {
    reduceStock(productId: $productId, quantity: $quantity) {
      success
    }
  }
`;