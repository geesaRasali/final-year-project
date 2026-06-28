import React, { useState, useEffect } from 'react';
import { FiTag, FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Salad', updated: '28/06/2026' },
  { id: 2, name: 'Rolls', updated: '28/06/2026' },
  { id: 3, name: 'Deserts', updated: '28/06/2026' },
  { id: 4, name: 'Sandwich', updated: '28/06/2026' },
  { id: 5, name: 'Cake', updated: '28/06/2026' },
  { id: 6, name: 'Pure Veg', updated: '28/06/2026' },
  { id: 7, name: 'Pasta', updated: '28/06/2026' },
  { id: 8, name: 'Noodles', updated: '28/06/2026' },
  { id: 9, name: 'Koththu', updated: '28/06/2026' },
];

const Categories = () => {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('foodCategories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse categories from localStorage', e);
      }
    }
    return DEFAULT_CATEGORIES;
  });

  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    localStorage.setItem('foodCategories', JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmedName = categoryName.trim();
    if (!trimmedName) {
      toast.error('Category name cannot be empty');
      return;
    }

    if (categories.some((cat) => cat.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error('Category already exists');
      return;
    }

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    const newCategory = {
      id: Date.now(),
      name: trimmedName,
      updated: formattedDate,
    };

    setCategories((prev) => [newCategory, ...prev]);
    setCategoryName('');
    toast.success('Category added successfully');
  };

  const handleDeleteCategory = (id, name) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    toast.success(`Category "${name}" deleted`);
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setEditName(category.name);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const trimmedName = editName.trim();
    if (!trimmedName) {
      toast.error('Category name cannot be empty');
      return;
    }

    if (categories.some((cat) => cat.id !== editingCategory.id && cat.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error('Category name already exists');
      return;
    }

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === editingCategory.id ? { ...cat, name: trimmedName, updated: formattedDate } : cat
      )
    );
    setEditingCategory(null);
    setEditName('');
    toast.success('Category updated successfully');
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-zinc-50 px-4 py-6 dark:bg-zinc-900 md:px-7">
      <div className="mx-auto max-w-6xl">
        {/* Main Card Layout */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_14px_34px_rgba(0,0,0,0.02)] dark:border-zinc-800 dark:bg-zinc-950 md:p-8">
          
          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 dark:bg-zinc-900 text-orange-500">
              <FiTag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Food Categories</h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Organize menu items with reusable categories for easier browsing.
              </p>
            </div>
          </div>

          {/* Grid Content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            
            {/* Left Column: Add/Edit Form */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/30">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-5">
                  Add food category
                </h3>
                
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Category name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Salad, Deserts..."
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-orange-500 transition duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add category
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Existing Categories List */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/30">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-5">
                  Existing categories
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800 pb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">
                        <th className="pb-3 pr-4">Name</th>
                        <th className="pb-3 pr-4">Updated</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
                      {categories.map((category) => (
                        <tr key={category.id} className="group transition-colors hover:bg-zinc-100/30 dark:hover:bg-zinc-800/10">
                          <td className="py-4 pr-4 font-semibold text-zinc-800 dark:text-zinc-200">
                            {category.name}
                          </td>
                          <td className="py-4 pr-4 text-zinc-500 dark:text-zinc-400">
                            {category.updated}
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end items-center gap-2">
                              <button
                                onClick={() => handleEditClick(category)}
                                className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-350 transition"
                              >
                                <FiEdit className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.id, category.name)}
                                className="inline-flex items-center gap-1 rounded-lg bg-red-600 hover:bg-red-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition"
                              >
                                <FiTrash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                  Edit Category
                </p>
                <h2 className="mt-1 text-xl font-black text-zinc-900 dark:text-zinc-100">
                  {editingCategory.name}
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Update the category name for your menu.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                <FiX className="text-lg leading-none" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-800"
                  placeholder="Enter new category name"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-black text-white transition hover:bg-orange-600 shadow-md"
                >
                  Save category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Categories;
