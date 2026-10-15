export const cart = [];


export function addToCart(item) {

  cart.push(item);

  updateCart();

}


export function removeFromCart(index) {

  cart.splice(index, 1);

  updateCart();

}


export function updateCart() {

  const total =
    cart.reduce(
      (sum, item) =>
        sum + item.price,
      0
    );

  console.log(
    "Total:",
    total
  );

}