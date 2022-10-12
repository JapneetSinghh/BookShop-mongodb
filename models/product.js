const product = [];
const path = require('path');
const p = path.join(path.dirname(require.main.filename),
  'data',
  'products.json'
);
const Cart = require('./cart')
const fs = require('fs');
const e = require('express');
const getProductsFromFile = callback => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      console.log('fileEmpty');
      return callback([]);
    } else {
      callback(JSON.parse(fileContent));
    }
  });
}

module.exports = class Product {
  constructor(productId, productName, productPrice, productImage, productDescription) {
    this.productId = productId;
    this.productName = productName;
    this.productPrice = productPrice;
    this.productDescription = productDescription;
    this.productImage = productImage;
  }
  save() {
    // product.push(this);
    // console.log(product);
    getProductsFromFile(products => {
      // FOR UPDATION
      if (this.productId) {
        console.log('We have to edit this array', products);
        const existingProductIndex = products.findIndex(product => product.productId === this.productId);
        console.log('EXISTING PRODUCT INDEX' + existingProductIndex);
        const updatedProduct = [...products];
        updatedProduct[existingProductIndex] = this;
        console.log('updatedProduct[existingProductIndex]', updatedProduct[existingProductIndex]);
        fs.writeFile(p,JSON.stringify(updatedProduct),(err) => {
          if(err){
            console.log('Some error occured in updating');
          }
        });
      }
      else {
        // FOR ADDITION
        const prodId = Math.random().toString();
        this.productId = prodId;
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
         if(err){
          console.log('Some error occured in adding product');
         }
        });
      }

    });
  }
  static fetchAll(callback) {
    getProductsFromFile(callback);
  }
  static findById(id, callback) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.productId === id);
      console.log('Product By Id ' + product);
      callback(product);
    });
  }
  static delById(id){
    getProductsFromFile(products=>{
      const product = products.find(prod=>prod.productId===id);
      const updatedProducts=products.filter(p=>p.productId !== id);
      console.log('Product to be deleted',updatedProducts);
      fs.writeFile(p,JSON.stringify(updatedProducts),err=>{
        if(err){
          console.log('There was an error in deleting')
        }else{
            Cart.getDeleteProductFromCart(id,product.productPrice);
        }
      })
    });
  }
}