import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/index";
import { createProduct } from "../slices/productCreationSlice";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
  productname: string;
  description: string;
  price: string;
  stock: number;
  images: FileList | null;
}

const ProductCreationForm: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.productCreation);

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append("productname", data.productname);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("stock", data.stock.toString());
    if (data.images) {
      Array.from(data.images).forEach((file) => {
        formData.append("images", file);
      });
    }

    dispatch(createProduct(formData))
      .then(() => reset())
      .finally(() => {
        if (error) {
          toast.error(error);
        }
      });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "#674188", color: "#F7EFE5", textAlign: 'center', fontWeight: 'bold', fontSize: 30 }}>Create Product</DialogTitle>
      <DialogContent sx={{ bgcolor: "#F7EFE5" }}>
        <Box
          sx={{
            maxWidth: 500,
            margin: "auto",
            padding: 2,
            border: "1px solid #E2BFD9",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Product Name"
              {...register("productname", { required: "Product name is required" })}
              margin="normal"
              error={!!errors.productname}
              helperText={errors.productname?.message}
              sx={{ input: { color: "#674188" }, bgcolor: "#E2BFD9" }}
            />
            <TextField
              fullWidth
              label="Description"
              {...register("description", { required: "Description is required" })}
              margin="normal"
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
              sx={{ input: { color: "#674188" }, bgcolor: "#E2BFD9" }}
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              {...register("price", { required: "Price is required" })}
              margin="normal"
              error={!!errors.price}
              helperText={errors.price?.message}
              sx={{ input: { color: "#674188" }, bgcolor: "#E2BFD9" }}
            />
            <TextField
              fullWidth
              label="Stock"
              type="number"
              {...register("stock", { required: "Stock is required", valueAsNumber: true })}
              margin="normal"
              error={!!errors.stock}
              helperText={errors.stock?.message}
              sx={{ input: { color: "#674188" }, bgcolor: "#E2BFD9" }}
            />
            <input
              type="file"
              multiple
              accept="image/*"
              {...register("images", { required: "At least one image is required" })}
              style={{ margin: "20px 0", backgroundColor: "#E2BFD9" }}
            />
            {errors.images && <Typography color="error" sx={{ color: "#674188" }}>{errors.images.message}</Typography>}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 2, bgcolor: "#674188", color: "#F7EFE5", "&:hover": { bgcolor: "#C8A1E0" } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Create Product"}
            </Button>
          </form>
        </Box>
      </DialogContent>
      <DialogActions sx={{ bgcolor: "#674188" }}>
        <Button onClick={onClose} sx={{ color: "white" }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductCreationForm;
