import React from 'react';
import {
  Layers,
  Footprints,
  Briefcase,
  Sparkles,
  Shirt,
  HeartHandshake,
  Home,
  Wrench
} from 'lucide-react';

const CATEGORY_ICONS = {
  All: Layers,
  Shoes: Footprints,
  Bags: Briefcase,
  Women: Sparkles,
  Men: Shirt,
  'Makeup & Beauty': HeartHandshake,
  Beauty: HeartHandshake,
  Makeup: HeartHandshake,
  'Home Decor': Home,
  'Home Utilities': Wrench
};

export default function CategoryNav({
  categories = [],
  activeCategory,
  onSelectCategory,
  totalProductsCount = 111
}) {
  return (
    <div className="category-bar-wrapper">
      <div className="container category-nav">
        {/* All Products Tab */}
        <button
          className={`cat-chip ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => onSelectCategory('All')}
        >
          <Layers size={16} />
          <span>All Curations</span>
          <span className="cat-count">{totalProductsCount}</span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const IconComponent = CATEGORY_ICONS[cat.name] || Layers;
          const isActive = activeCategory.toLowerCase() === cat.name.toLowerCase();

          return (
            <button
              key={cat.name}
              className={`cat-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.name)}
            >
              <IconComponent size={16} />
              <span>{cat.name}</span>
              <span className="cat-count">{cat.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
