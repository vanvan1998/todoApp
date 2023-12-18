import React, { useState } from "react";
import { Form, Button, Card, Alert, Image } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { storage } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

export const UpdateProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [name, setName] = useState(currentUser.displayName);
  const [imgUrl, setImgUrl] = useState(currentUser.photoURL);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitImage = (e: any) => {
    e.preventDefault();
    const file = e.target[0]?.files[0];
    const promises: any[] = [];
    if (!file) return;

    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      () => {
        // const progress = Math.round(
        //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        // );
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);

          promises.push(updateProfile({ photoURL: downloadURL }));
        });
      }
    );

    Promise.all(promises)
      .then(() => {
        setSuccess("Update Avatar successfull")
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();

    const promises = [];
    setLoading(true);
    setError("");
    setSuccess("");

    // if (email !== currentUser.email) {
    //   promises.push(updateEmail(email));
    // }
    if (name) {
      promises.push(updateProfile({ name }));
    }

    Promise.all(promises)
      .then(() => {
        setSuccess("Update account successfull")
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="w-100" style={{ maxWidth: "400px" }}>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmitImage}>
            <Form.Group id="file">
              <div className="mb-4 text-center">
                {imgUrl && (
                  <Image src={imgUrl} alt="uploaded file" height={300} />
                )}
              </div>
              <Form.Label>Avatar</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
            <Button className="w-100 mt-4" type="submit">
              Update Avatar
            </Button>
          </Form>

          <Form onSubmit={handleSubmit}>
            <Form.Group id="name">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                defaultValue={currentUser.email}
              />
            </Form.Group>
            <Form.Group id="email" className="mt-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={currentUser.email}
                disabled
                // onChange={(e) => {
                //   setEmail(e.target.value);
                // }}
                // required
                defaultValue={currentUser.email}
              />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-4" type="submit">
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/left-menu">Cancel</Link>
      </div>
    </div>
  );
}
