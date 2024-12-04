import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/index";
import { fetchProducts } from "../slices/productSlice";
import { deleteProduct } from "../slices/productDeleteSlice";
import ProductEditForm from "./ProductEditForm";
import ProductFilterForm from "./ProductFilterForm";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  TablePagination
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Utility function to construct URLs
const constructURL = (baseURL: string, relativePath: string): string => {
  return `${baseURL.replace(/\/+$/, "")}/${relativePath.replace(/^\/+/, "")}`;
};

const BASE_URL = "http://localhost:5000"; // Set your base URL here

const ProductDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, loading, error } = useSelector((state: RootState) => state.products);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(3); 
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleOpenDeleteDialog = (productId: string) => {
    setProductIdToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductIdToDelete(null);
  };

  const handleDeleteProduct = () => {
    if (productIdToDelete) {
      dispatch(deleteProduct(productIdToDelete)).then(() => {
        dispatch(fetchProducts()); 
      });
    }
    handleCloseDeleteDialog();
  };

  const handleOpenEditDialog = (product: Product) => {
    setProductToEdit(product);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setProductToEdit(null);
  };

  // Helper function to determine the image URL
  const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return `${BASE_URL}/default-image.png`; // Fallback image URL
    return constructURL(BASE_URL, imagePath);
  };

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null, 
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 3));
    setPage(0); // Reset page to 0 when rows per page change
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#F7EFE5">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6" align="center" bgcolor="#F7EFE5" padding={2}>
        {error}
      </Typography>
    );
  }

  // Get the current page products
  const currentProducts = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div style={{ backgroundColor: "#F7EFE5", padding: '20px' }}>
      <Button sx={{ bgcolor: "#674188", color: "white" }} onClick={() => navigate('/')}>
        Home
      </Button>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: "#674188" }}>
        Product Dashboard
      </Typography>
      <ProductFilterForm />
      {products.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ color: "#674188" }}>
          No products available
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ backgroundColor: "#E2BFD9" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#674188" }}>Image</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#674188" }}>Product Name</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#674188" }}>Description</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#674188" }}>Price</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#674188" }}>Stock</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#674188" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentProducts.map((product) => {
                  const imageUrl = getImageUrl(product.images?.[0]);
                  return (
                    <TableRow key={product._id}>
                      <TableCell>
                        <img src={imageUrl} alt={product.productname} style={{ width: '100px', height: 'auto', objectFit: 'cover' }} />
                      </TableCell>
                      <TableCell align="center" sx={{ color: "#674188", fontWeight: "semibold" }}>{product.productname}</TableCell>
                      <TableCell align="center" sx={{ color: "#674188" }}>{product.description}</TableCell>
                      <TableCell align="center" sx={{ color: "#674188" }}>${product.price.toFixed(2)}</TableCell>
                      <TableCell align="center" sx={{ color: "#674188" }}>{product.stock}</TableCell>
                      <TableCell align="center">
                      <Button
                        variant="contained"
                        
                        onClick={() => handleOpenEditDialog(product)}
                        sx={{ marginRight: "8px",color:"#674188",fontWeight:"bold" ,backgroundColor: "#F7EFE5" }}
                      >
                        Edit
                      </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleOpenDeleteDialog(product._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[3, 6, 12]}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteProduct} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ProductEditForm
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        product={productToEdit}
      />
    </div>
  );
};

export default ProductDashboard;
