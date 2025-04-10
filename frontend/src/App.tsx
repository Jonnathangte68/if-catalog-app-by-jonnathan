import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import ProductsPage from '@/features/products/ProductsPage';
import DemoPage from '@/features/demo/DemoPage';
import ProductDetailPage from '@/features/products/ProductDetailPage';
import NotFoundPage from '@/features/notFound/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
