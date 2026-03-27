import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AdminLayout from '../AdminLayout';
import { FormContainer, PageHeader, Button } from '../../Components/common';

export default function ProductForm({ product = null, categories = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    category_id: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        stock: product.stock || '',
        description: product.description || '',
        category_id: product.category_id || '',
        image: null
      });

      if (product.image) {
        setImagePreview(product.image_url);
      }
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let normalizedValue = value;

    if (name === 'price') {
      normalizedValue = value === '' ? '' : Number(value);
      if (!Number.isNaN(normalizedValue)) {
        normalizedValue = Math.max(0, Math.min(100000, normalizedValue));
      }
    }

    if (name === 'stock') {
      normalizedValue = value === '' ? '' : Number(value);
      if (!Number.isNaN(normalizedValue)) {
        normalizedValue = Math.max(0, Math.min(10000, Math.floor(normalizedValue)));
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: normalizedValue
    }));

    // clear error while typing
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      setErrors(prev => ({
        ...prev,
        image: ''
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required.';
    }

    if (formData.price === '' || formData.price === null) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid number greater than 0.';
    } else if (Number(formData.price) > 100000) {
      newErrors.price = 'Price must not exceed 100,000.';
    }

    if (formData.stock === '' || formData.stock === null) {
      newErrors.stock = 'Stock is required.';
    } else if (!Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a whole number 0 or higher.';
    } else if (Number(formData.stock) > 10000) {
      newErrors.stock = 'Stock must not exceed 10,000.';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required.';
    }

    if (formData.image) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(formData.image.type)) {
        newErrors.image = 'Image must be jpeg, png, jpg, or gif.';
      }

      if (formData.image.size > maxSize) {
        newErrors.image = 'Image size must not exceed 2MB.';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setAlertMessage('Please fix the invalid fields before submitting.');
      setShowAlert(true);
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category_id', formData.category_id);

    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    if (product) {
      Inertia.post(`/admin/products/${product.id}?_method=PUT`, formDataToSend);
    } else {
      Inertia.post('/admin/products', formDataToSend);
    }
  };

  return (
    <AdminLayout title={product ? 'Edit Product' : 'Create Product'}>
  <PageHeader title={product ? 'Edit Product' : 'Create Product'} subtitle={product ? 'Update product details' : 'Create a new product for the store'} icon={'products'} />
  <FormContainer title={product ? 'Edit Product' : 'Create New Product'}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block font-semibold mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                step="0.01"
                min="0"
                max="100000"
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block font-semibold mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="Enter stock quantity"
                min="0"
                max="10000"
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              rows="4"
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Product Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full p-2 border rounded"
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 h-48 object-cover rounded"
              />
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="px-6 py-2">{product ? 'Update Product' : 'Create Product'}</Button>

            <Button variant="secondary" type="button" className="px-6 py-2" onClick={() => Inertia.get('/admin/products')}>Cancel</Button>
          </div>
        </form>
      </FormContainer>

      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-red-600 mb-3">Validation Error</h3>
            <p className="text-gray-700 mb-5">{alertMessage}</p>
            <Button variant="danger" onClick={() => setShowAlert(false)} className="w-full">OK</Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}