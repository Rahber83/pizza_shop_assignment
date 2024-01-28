import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const CancelModalPopup = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} toggle={onCancel}>
      <ModalHeader toggle={onCancel}>Cancel Order</ModalHeader>
      <ModalBody>
        <p>Sure you want to cancel the order?</p>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="danger" onClick={onConfirm}>
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CancelModalPopup;
