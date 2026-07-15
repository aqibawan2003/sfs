import { useAddOrUpdateItem } from "./useAddOrUpdateItem";
import InlineUploadButton from "../common/InlineUploadButton";



export function AddOrUpdateItemModal({ action, payload, handleClose }) {
  const { state, handlers } = useAddOrUpdateItem(action, payload, handleClose);
  const { itemDetails } = state; // itemDetails will contain existing data from payload when editing

  const {
    handleAddImageUrl,
    handleChange,
    handleImageUrlChange,
    handleRemoveImageUrl,
    handleSubmit,
  } = handlers;
 console.log(action);
  // Ensure initial values come from itemDetails (existing data or empty string/false)
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-h-[80vh] w-full max-w-2xl overflow-y-auto text-black">
        <h2 className="text-xl font-bold mb-4">
          {action} Item
        </h2>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={itemDetails.name || ""} 
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <input
            type="text"
            name="description"
            value={itemDetails.description || ""}  
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={itemDetails.price || ""}  
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Availability</label>
          <input
            type="checkbox"
            name="availability"
            checked={itemDetails.availability || false}  
            onChange={handleChange}
            className="mr-2"
          />
          Available
        </div>
        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={itemDetails.category || ""}  
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Image URLs</label>
          {itemDetails.imageUrls.map((url, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={url || ""}  
                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <InlineUploadButton
                uploadType="kitchen"
                onUploaded={(url) => handleImageUrlChange(index, url)}
              />
              <button
                type="button"
                onClick={() => handleRemoveImageUrl(index)}
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddImageUrl}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Image URL
          </button>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          <button
            onClick={handleClose}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
