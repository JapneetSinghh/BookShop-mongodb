const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shops/shop', {
      pageTitle: 'Our Products',
      path: '/',
      products: products,
      editMode: false
    });
  });
};

exports.getDetails = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId);
  Product.findById(prodId, product => {
    res.render('shops/details', { pageTitle: 'Details', products: product, path: '' })
  });
}

exports.getCart = (req, res, next) => {
  const cartProducts = [];
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      for (product of products) {
        const cartProductData = cart.products.find(prod => prod.productId === product.productId);
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.productQty });
        }
      }
      // console.log(cartProducts);
      res.render('yourCart', {
        pageTitle: 'Cart',
        path: '/cart',
        totalPrice: cart.totalPrice,
        products: cartProducts
      });
    });
  });
};

exports.getAddToCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    // console.log(prodId, product.productPrice);
    Cart.addProduct(prodId, product.productPrice);
    try {
      res.redirect('/cart');
    } catch (error) {
      console.log(error);
    }
  })
}

exports.getRemoveFromCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.getDeleteProductFromCart(prodId, product.productPrice);
    res.redirect('/cart');
  })
}