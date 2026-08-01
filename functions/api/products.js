import { products } from '../_lib/catalog';

export function onRequestGet() {
  return new Response(JSON.stringify(products), {
    headers: { 'Content-Type': 'application/json' },
  });
}
