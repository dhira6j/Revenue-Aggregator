import React, { useState, useEffect } from 'react';
import ProductTable from './components/ProductTable';
import SearchBar from './components/SearchBar';
import TotalRevenue from './components/TotalRevenue';
import formatNumber from './utils/formatNumber';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(
    () => JSON.parse(localStorage.getItem('dark-theme')) || false
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchUrls = ['/data/branch1.json', '/data/branch2.json', '/data/branch3.json'];
        const responses = await Promise.all(branchUrls.map(url => fetch(url)));
        const branches = await Promise.all(responses.map(response => response.json()));

        let allProducts = [];

        branches.forEach(branch => {
          branch.products.forEach(product => {
            const existingProduct = allProducts.find(p => p.name === product.name);
            const totalRevenue = product.unitPrice * product.sold;

            if (existingProduct) {
              existingProduct.totalRevenue += totalRevenue;
            } else {
              allProducts.push({
                name: product.name,
                totalRevenue
              });
            }
          });
        });

        allProducts.sort((a, b) => a.name.localeCompare(b.name));
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, products]);

  useEffect(() => {
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
    localStorage.setItem('dark-theme', JSON.stringify(isDarkTheme));
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(prevTheme => !prevTheme);
  };

  return (
    <div className="App">
      <header className="app-header">
      <a href="https://www.wisdomleaf.com/" target="_blank" rel="noopener noreferrer" className="logo-link">
        <img src="/images/Leaf.png" alt="Logo" className="app-logo" />
      </a>
        <h1>Revenue Aggregator</h1>
        <button onClick={toggleTheme} className="theme-toggle-button">
          {isDarkTheme ? '☀️' : '🌙'}
        </button>
      </header>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ProductTable products={filteredProducts} formatNumber={formatNumber} />
      <TotalRevenue products={filteredProducts} formatNumber={formatNumber} />
      <footer className="app-footer">
        <p>
          Created by <a href="https://dhira6j.netlify.app/" target="_blank" rel="noopener noreferrer">Dhiraj M</a> - Revenue Aggregator App
        </p>
      </footer>
    </div>
  );
};

export default App;
