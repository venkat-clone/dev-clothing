'use client';
import { useState, useEffect } from 'react';
import { Product } from '../../../../lib/types/product';
import { fetchProducts, saveProduct } from '@/lib/dashboard/productService';
import { fetchSizes, saveSize, deleteSize } from '@/lib/dashboard/productService'; // Import the size services

const ProductsDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [newProduct, setNewProduct] = useState<Product>(Product.defaultProduct());
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  // State for managing sizes
  const [sizes, setSizes] = useState<any[]>([]); // Adjust type as necessary
  const [newSize, setNewSize] = useState({ size: '', sizeGuid: '' });
  const [editingSizeId, setEditingSizeId] = useState<number | null>(null);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts(search);
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(search);
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
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
      setNewProduct(Product.defaultProduct()); // Reset the form
      setEditingProductId(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setNewProduct(product);
    setEditingProductId(product.id);
    loadSizes(product.id); // Load sizes when editing a product
  };

  const loadSizes = async (productId: number) => {
    try {
      const fetchedSizes = await fetchSizes(productId);
      setSizes(fetchedSizes);
    } catch (error) {
      console.error('Error loading sizes:', error);
    }
  };

  const handleSizeInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewSize((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSize(newSize, editingSizeId, newProduct.id);
      loadSizes(newProduct.id); // Refresh sizes after saving
      setNewSize({ size: '', sizeGuid: '' }); // Reset the size form
      setEditingSizeId(null);
    } catch (error) {
      console.error('Error saving size:', error);
    }
  };

  const handleEditSize = (size: any) => {
    setNewSize(size);
    setEditingSizeId(size.id);
  };

  const handleDeleteSize = async (sizeId: number) => {
    if (confirm('Are you sure you want to delete this size?')) {
      try {
        await deleteSize(newProduct.id, sizeId);
        loadSizes(newProduct.id); // Refresh sizes after deletion
      } catch (error) {
        console.error('Error deleting size:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setNewProduct(Product.defaultProduct());
    setEditingProductId(null);
    setSizes([]); // Reset sizes on cancel
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
          {(products ?? []).map((product) => (
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

      {/* Sizes Management Section */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Manage Sizes for {editingProductId ? newProduct.name : 'Product'}
      </h2>
      <form onSubmit={handleSizeSubmit} className="bg-gray-700 p-6 shadow-md rounded">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="size"
            placeholder="Size"
            className="border border-gray-600 bg-gray-800 p-2 rounded text-gray-100"
            value={newSize.size}
            onChange={handleSizeInputChange}
          />
          <input
            type="text"
            name="sizeGuid"
            placeholder="Size GUID"
            className="border border-gray-600 bg-gray-800 p-2 rounded text-gray-100"
            value={newSize.sizeGuid}
            onChange={handleSizeInputChange}
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {editingSizeId ? 'Save Size' : 'Add Size'}
          </button>
        </div>
      </form>

      {/* Display Sizes */}
      <table className="w-full bg-gray-700 text-gray-100 shadow-md rounded mt-6">
        <thead className="bg-gray-600">
          <tr>
            <th className="text-left p-4">Size</th>
            <th className="text-left p-4">Size GUID</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((size) => (
            <tr key={size.id} className="border-b border-gray-600">
              <td className="p-4">{size.size}</td>
              <td className="p-4">{size.sizeGuid}</td>
              <td className="p-4">
                <button
                  onClick={() => handleEditSize(size)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSize(size.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsDashboard;
