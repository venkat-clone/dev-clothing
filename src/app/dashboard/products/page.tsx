'use client';
import { useState, useEffect } from 'react';
import { Product } from '../../../../lib/types/product';
import { fetchProducts, saveProduct } from '@/lib/dashboard/productService';

const ProductsDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [newProduct, setNewProduct] = useState<Product>(Product.defaultProduct());
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const loadProducts = async () => {
    try {
      const data = await fetchProducts(search);
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };
  useEffect(() => {

    loadProducts();
  }, [search]);



  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveProduct(newProduct, editingProductId);
      const data = await fetchProducts(search); // Fetch updated products
      setProducts(data);
      setNewProduct(Product.defaultProduct()); // Reset the form (make sure to define the default structure)
      setEditingProductId(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setNewProduct(product);
    setEditingProductId(product.id);
  };

  const handleCancelEdit = () => {
    setNewProduct(Product.defaultProduct());
    setEditingProductId(null);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Products Dashboard</h1>

      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Search products..."
          className="border border-gray-600 bg-gray-700 p-2 rounded-l-md w-full text-gray-100"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={loadProducts}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-md"
        >
          Search
        </button>
      </div>

      <table className="w-full bg-gray-700 text-gray-100 shadow-md rounded">
        <thead className="bg-gray-600">
          <tr>
            <th className="text-left p-4">Name</th>
            <th className="text-left p-4">Description</th>
            <th className="text-left p-4">Price</th>
            <th className="text-left p-4">Discount</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-600">
              <td className="p-4">{product.name}</td>
              <td className="p-4">{product.description}</td>
              <td className="p-4">${product.price.toFixed(2)}</td>
              <td className="p-4">{product.discount}%</td>
              <td className="p-4">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        {editingProductId ? 'Edit Product' : 'Add New Product'}
      </h2>
      <form onSubmit={handleSubmit} className="bg-gray-700 p-6 shadow-md rounded">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            className="border border-gray-600 bg-gray-800 p-2 rounded text-gray-100"
            value={newProduct.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            className="border border-gray-600 bg-gray-800 p-2 rounded text-gray-100"
            value={newProduct.description}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            className="border border-gray-600 bg-gray-800 p-2 rounded text-gray-100"
            value={newProduct.price}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="discount"
            placeholder="Discount (%)"
            className="border border-gray-600 bg-gray-800 p-2 rounded text-gray-100"
            value={newProduct.discount}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {editingProductId ? 'Save Changes' : 'Add Product'}
          </button>
          {editingProductId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductsDashboard;
