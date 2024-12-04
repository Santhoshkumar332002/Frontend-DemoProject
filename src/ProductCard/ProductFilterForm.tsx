import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/index";
import { fetchFilteredProducts } from "../slices/productSlice";
import { Button, TextField, Box } from "@mui/material";

interface FormData {
  productname: string;
  createdDate: string;
  stock?: string; 
}

const ProductFilterForm: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data);

    dispatch(fetchFilteredProducts(data));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}
    >
      <TextField
        label="Product Name"
        {...register("productname")}
        sx={{ flex: 1, minWidth: '200px' }}
      />
      <TextField
        label="Created Date"
        type="date"
        slotProps={{
          inputLabel: { shrink: true } 
        }}
        {...register("createdDate")}
        sx={{ flex: 1, minWidth: '200px' }}
      />
      <TextField
        label="Stock"
        type="number"
        {...register("stock")}
        sx={{ flex: 1, minWidth: '200px' }}
      />
      <Button type="submit" variant="contained" color="primary">
        Filter
      </Button>
      <Button type="button" variant="outlined" color="secondary" onClick={() => reset()}>
        Reset
      </Button>
    </Box>
  );
};

export default ProductFilterForm;
