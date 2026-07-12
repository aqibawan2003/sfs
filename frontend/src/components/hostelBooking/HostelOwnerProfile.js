import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HostelNavbar from "./HostelOwnerNavbar";
import { AddOrUpdateRoomModal } from "./AddOrUpdateRoomModal/AddOrUpdateRoomModal";
import Profile from "./Profile";

const HostelOwnerProfile = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    action: "Add",
    payload: {},
  });
  const [successMessage, setSuccessMessage] = useState("");

  const dispatch = useDispatch();
  const hostels = useSelector((state) => state.hostels);

  const handleAddRoomSuccess = () => {
    setSuccessMessage("Room added successfully!");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div className="bg-[#1E201E] h-screen flex">
      <HostelNavbar />
      <div className="flex flex-col p-6 ml-[180px] ">
        {/* Flex-grow ensures it takes the remaining space after navbar */}
        <Profile />

        <button
          onClick={() => {
            setModalState({
              isOpen: true,
              action: "Add",
              payload: {},
            });
          }}
          className="bg-[#697565] w-[120px] ml-6 hover:bg-[#3C3D37] md:mt-4 text-white px-4 py-2 rounded"
        >
          Add Room
        </button>

        {modalState.isOpen && (
          <AddOrUpdateRoomModal
            action={modalState.action}
            payload={modalState.payload}
            handleClose={() => {
              setModalState({
                isOpen: false,
                payload: {},
                action: "Add",
              });
            }}
          />
        )}

        {successMessage && (
          <div className="mt-4 p-2 bg-[#ECDFCC] text-white rounded">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelOwnerProfile;
