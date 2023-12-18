import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { MODE } from "../../constants";
import { AddTodo } from "./AddTodo";

export const AddTodoModal = ({ addItem }: { addItem: Function }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Add
      </Button>

      <Modal
        style={{
          width: "100%",
          height: "100vh",
          paddingTop: 120,
        }}
        show={show}
        onHide={handleClose}
      >
        <AddTodo mode={MODE.ADD} addItem={addItem} onComplete={handleClose} />
      </Modal>
    </div>
  );
};
