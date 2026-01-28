# Quick Reference - Sidebar Navigation System

## 🔧 Common Customizations

### 1. Change Sidebar Colors

**File:** `src/components/Sidebar.css`

```css
/* Change gradient colors */
.sidebar {
  background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}

/* Change active link color */
.nav-link.active {
  background: rgba(255, 255, 255, 0.25);
  border-left: 4px solid white;
}
```

### 2. Add New Menu Item

**File:** `src/components/Sidebar.jsx`

```jsx
const userMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  // ... existing items ...
  { id: 'new-page', label: 'New Page', icon: '✨' }, // Add this line
];
```

### 3. Create New Page

**Step 1:** Create file `src/pages/user/NewPage.jsx`
```jsx
import React from 'react';

const NewPage = () => {
  return (
    <div className="page">
      <h1>New Page Title</h1>
      <p>Page description here</p>
      {/* Your content */}
    </div>
  );
};

export default NewPage;
```

**Step 2:** Update `src/components/Layout.jsx`
```jsx
import NewPage from '../pages/user/NewPage';

// In renderContent() function, add:
case 'new-page':
  return (
    <div className="page-content">
      <NewPage />
    </div>
  );
```

### 4. Change Active Link Color

```css
.nav-link.active {
  background: rgba(255, 255, 255, 0.25);
  border-left: 4px solid white; /* Change this color */
}

.nav-link.active {
  font-weight: 600;
}
```

### 5. Adjust Sidebar Width

```css
.sidebar {
  width: 260px; /* Change this value */
}

.main-content {
  margin-left: 260px; /* Must match sidebar width */
}
```

---

## 📦 Menu Items Reference

```jsx
const userMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'parking-zones', label: 'Parking Zones', icon: '🏢' },
  { id: 'view-slots', label: 'View Slots', icon: '🚗' },
  { id: 'charges', label: 'Charges', icon: '💰' },
  { id: 'slot-booking', label: 'Slot Booking', icon: '📅' },
  { id: 'booking-history', label: 'Booking History', icon: '📋' },
  { id: 'exit-checkout', label: 'Exit Checkout', icon: '🚪' }
];
```

---

## 🎨 CSS Class Reference

### Layout Classes
```css
.layout                 /* Main flex container */
.main-content          /* Content area with margin */
.page-content          /* Page wrapper */
.page                  /* Page padding container */
```

### Sidebar Classes
```css
.sidebar               /* Main sidebar */
.sidebar-header        /* Logo section */
.sidebar-nav           /* Navigation list */
.nav-item              /* Menu item */
.nav-link              /* Menu link button */
.nav-link.active       /* Active menu state */
.sidebar-footer        /* User profile section */
.user-profile          /* User info display */
```

### Page Classes
```css
.zones-grid            /* Grid for zone cards */
.zone-card             /* Individual zone card */
.slots-table           /* Slots availability table */
.pricing-grid          /* Pricing cards grid */
.booking-form          /* Booking form container */
.booking-card          /* Booking history card */
.stat-card             /* Statistics card */
```

### Button Classes
```css
.btn-primary           /* Primary button */
.btn-secondary         /* Secondary button */
.btn-small             /* Small button */
.btn-large             /* Large button */
.btn-disabled          /* Disabled state */
```

---

## 🔄 State Management

### Current Active Page
```jsx
const [currentPage, setCurrentPage] = useState('dashboard');

const handlePageChange = (page) => {
  setCurrentPage(page);
};
```

### Page Routing in Layout
```jsx
const renderContent = () => {
  switch(currentPage) {
    case 'dashboard':
      return <Dashboard />;
    case 'parking-zones':
      return <ParkingZones />;
    // ... more cases
    default:
      return <Dashboard />;
  }
};
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Desktop: 1200px+ */
/* Tablet: 768px - 1199px */
/* Mobile: < 768px */
/* Small mobile: < 640px */

@media (max-width: 768px) {
  .sidebar { width: 220px; }
  .main-content { margin-left: 220px; }
  .page { padding: 20px; }
}

@media (max-width: 640px) {
  .main-content { margin-left: 0; }
  .page { padding: 16px; }
}
```

---

## 🎯 Icon Reference (Emojis Used)

```
🏠 Dashboard
🏢 Parking Zones
🚗 View Slots / Vehicle
💰 Charges / Payment
📅 Slot Booking / Calendar
📋 Booking History / List
🚪 Exit Checkout
```

---

## 🔗 Navigation Flow

```
User clicks menu item → handlePageChange('page-id')
    ↓
State updated: setCurrentPage('page-id')
    ↓
Component re-renders
    ↓
renderContent() switch statement matches 'page-id'
    ↓
Corresponding page component displayed
    ↓
No page refresh - SPA behavior
```

---

## 🎨 Color Palette

```
Primary Gradient: #667eea → #764ba2
Text Dark: #1e293b
Text Light: #64748b
Background: #f8fafc
Border: #e2e8f0
Success: #16a34a
Danger: #dc2626
Warning: #ea580c
```

---

## 📋 Component Props

### Sidebar Props
```jsx
<Sidebar 
  currentPage={currentPage}           // Current active page
  onPageChange={handlePageChange}     // Handler for page changes
/>
```

### Layout Props
```jsx
<Layout />  // No props required - uses internal state
```

### Page Components
```jsx
// All page components accept no props
// They are self-contained
<Dashboard />
<ParkingZones />
// etc.
```

---

## 🚀 Performance Tips

1. **Lazy Load Pages** (if needed):
```jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('../pages/user/Dashboard'));

<Suspense fallback={<div>Loading...</div>}>
  <Dashboard />
</Suspense>
```

2. **Memoize Components**:
```jsx
import { memo } from 'react';

const Sidebar = memo(({ currentPage, onPageChange }) => {
  // Component code
});

export default Sidebar;
```

3. **Use useCallback** for handlers:
```jsx
const handlePageChange = useCallback((page) => {
  setCurrentPage(page);
}, []);
```

---

## 🐛 Troubleshooting

### Sidebar not showing
- Check `Sidebar.jsx` is imported in `Layout.jsx`
- Verify `position: fixed` and `z-index: 1000` in CSS

### Links not working
- Ensure menu item `id` matches case in `renderContent()` switch
- Check `handlePageChange` is passed to Sidebar correctly

### Styles not applying
- Clear browser cache (Ctrl+Shift+R)
- Check CSS file paths are correct
- Verify class names match between JSX and CSS

### Active link not highlighting
- Check `.nav-link.active` class has proper styles
- Verify `className={`nav-link ${currentPage === item.id ? 'active' : ''}`}` logic

---

## ✨ Best Practices

1. ✅ Keep menu items in desired order
2. ✅ Use meaningful page IDs (kebab-case)
3. ✅ Add icons that represent functionality
4. ✅ Keep page names descriptive
5. ✅ Use consistent class naming
6. ✅ Comment CSS sections
7. ✅ Test on mobile devices
8. ✅ Keep components small and focused

---

## 📚 Additional Resources

- [React Router v6 Docs](https://reactrouter.com/)
- [React Hooks Documentation](https://react.dev/reference/react)
- [CSS Grid Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Flexbox Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)

---

**Last Updated:** January 2024  
**Version:** 1.0.0
