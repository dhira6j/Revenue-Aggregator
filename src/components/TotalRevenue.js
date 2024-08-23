import React from 'react';

const TotalRevenue = ({ products, formatNumber }) => {
  const totalRevenue = products.reduce((acc, product) => acc + product.totalRevenue, 0);

  return (
    <div className="total-revenue">
      <center><strong>Total Revenue: {formatNumber(totalRevenue)}</strong></center>
    </div>
  );
};

export default TotalRevenue;
