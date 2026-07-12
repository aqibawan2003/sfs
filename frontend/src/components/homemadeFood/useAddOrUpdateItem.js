import { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem, updateItem } from "../../store/kitchenSlice";

export const useAddOrUpdateItem = (action, payload, handleClose) => {
  const [itemDetails, setItemDetails] = useState(action === 'Add' ? {
    name: "",
    description: "",
    price: "",
    imageUrls: [""],
    category: "",
    availability: true,
  } : { ...payload });
 
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!itemDetails.name) errors.name = "Name is required";
    if (!itemDetails.description) errors.description = "Description is required";
    if (!itemDetails.price || isNaN(itemDetails.price) || itemDetails.price <= 0) errors.price = "Valid price is required";
    if (!itemDetails.category) errors.category = "Category is required";
    if (itemDetails.availability === undefined) errors.availability = "Availability is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!validate()) {
      return alert("Please fill all the credentials.");
    } else {
      if (action === 'Add') {
        dispatch(addItem(itemDetails));
      } else {
        dispatch(updateItem({ id: payload._id, itemDetails }));
      }

      handleClose();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItemDetails({
      ...itemDetails,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...itemDetails.imageUrls];
    newImageUrls[index] = value;
    setItemDetails({
      ...itemDetails,
      imageUrls: newImageUrls,
    });
  };

  const handleAddImageUrl = () => {
    setItemDetails({
      ...itemDetails,
      imageUrls: [...itemDetails.imageUrls, ""],
    });
  };

  const handleRemoveImageUrl = (index) => {
    const newImageUrls = itemDetails.imageUrls.filter((_, i) => i !== index);
    setItemDetails({
      ...itemDetails,
      imageUrls: newImageUrls,
    });
  };

  const state = { itemDetails };
  const handlers = {
    handleAddImageUrl,
    handleChange,
    handleImageUrlChange,
    handleRemoveImageUrl,
    handleSubmit
  };

  return { state, handlers };
};
