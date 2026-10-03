// src/components/layout/AdminLayoute/AddProduct/EditProduct.tsx
import { useParams } from "react-router";
import ProductForm from "../Product/ProductForm";

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Product ID is missing</p>
      </div>
    );
  }

  return <ProductForm mode="edit" productId={id} />;
}