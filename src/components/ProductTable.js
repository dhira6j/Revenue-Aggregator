import React from 'react';

const ProductTable = ({ products, formatNumber }) => {
  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Total Revenue</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.name}>
            <td>{product.name}</td>
            <td>{formatNumber(product.totalRevenue)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
