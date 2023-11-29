import {
  Button,
  CircularProgress,
  FormControl,
  Input,
  InputLabel,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import DataService from "../Services/data.service";
import { User } from "../models/user";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
const AdminUserManage = () => {
  const [adminUsers, setAdminUsers] = useState<User[]>([]);

  const [filteredAdminUsers, setFilteredAdminUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdminDetails, setNewAdminDetails] = useState({
    password: "",
    email: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getAllAdmins();
  }, []);

  const isCurrentUser = (email: string) => {
    const currentUser = DataService.getCurrentUser();
    return currentUser?.email === email;
  };

  const getAllAdmins = async () => {
    setLoading(true);
    try {
      const res = await DataService.getAllAdminUsers();
      if (res) {
        console.log(res);
        setAdminUsers(res);
        setFilteredAdminUsers(res);
      } else {
        throw new Error("");
      }
    } catch (e) {
      console.log(e);
      alert("Unable to get admin users !!!");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewAdminDetails({ password: "", email: "" }); // Clear the form on close
  };

  const handleAddAdmin = () => {
    // Implement addition logic here, possibly making API calls to a backend server
    // const newAdminUser = {
    //   id: adminUsers.length + 1,
    //   password: newAdminDetails.password,
    //   email: newAdminDetails.email,
    // };
    // setAdminUsers([...adminUsers, newAdminUser]);
    // setFilteredAdminUsers([...adminUsers, newAdminUser]); // Update filtered list
    // handleCloseModal();
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setNewAdminDetails({ ...newAdminDetails, [name]: value });
  };

  const handleSearch = () => {
    const filteredUsers = adminUsers.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAdminUsers(filteredUsers);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredAdminUsers(adminUsers);
  };

  const handleDeleteAdmin = async (adminId: any) => {
    if (!window.confirm("Sure want to delete this admin user ?")) {
      return;
    }
    setLoading(true);
    try {
      await DataService.deleteUserByDocId(adminId);
      getAllAdmins();
    } catch (e) {
      console.log(e);
      alert("Unable to delete this admin !!!");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminVerify = async (adminId: any) => {
    if (
      !window.confirm(
        "Sure want to mark this admin verified ? this action cannot be undone !"
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      await DataService.markAdminVerified(adminId);
      getAllAdmins();
    } catch (e) {
      console.log(e);
      alert("Unable to mark admin verified !!!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <h2>Admin Users</h2>
      <div className="row my-3"></div>
      <div className="row my-3">
        <div className="col-9">
          <TextField
            size="small"
            sx={{ width: "80%" }}
            label="Search"
            variant="outlined"
            color="primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleSearch}
            style={{ marginLeft: "10px" }}
          >
            Search
          </Button>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={clearSearch}
            style={{ marginLeft: "10px" }}
          >
            Clear
          </Button>
        </div>
        {/* <div className="col-3">
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            size="small"
          >
            Add Admin
          </Button>
        </div> */}
      </div>

      {loading ? (
        <>
          <CircularProgress />
        </>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No.</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Password</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAdminUsers.map((adminUser, index: number) => (
                <TableRow key={adminUser.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {adminUser.email}{" "}
                    {isCurrentUser(adminUser?.email) && <small>(You)</small>}
                  </TableCell>
                  <TableCell>{"************"}</TableCell>
                  <TableCell>
                    <Stack direction={"row"} spacing={3}>
                      <Button
                        disabled={isCurrentUser(adminUser?.email)}
                        variant="text"
                        color="error"
                        onClick={() => handleDeleteAdmin(adminUser.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        disabled={
                          isCurrentUser(adminUser?.email) ||
                          adminUser?.isVerifiedAdmin
                        }
                        variant="text"
                        color="success"
                        onClick={() => handleAdminVerify(adminUser.id)}
                      >
                        {adminUser?.isVerifiedAdmin
                          ? "Verified"
                          : "Mark as verified"}
                      </Button>
                    </Stack>
                    {/* Add more actions (e.g., edit) as needed */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Paper sx={style}>
          <div
          // style={{
          //   position: "absolute",
          //   top: "50%",
          //   left: "50%",
          //   transform: "translate(-50%, -50%)",
          // }}
          >
            <div className="row  my-4">
              {" "}
              <FormControl fullWidth>
                <InputLabel htmlFor="email-input">Email</InputLabel>
                <Input
                  id="email-input"
                  name="email"
                  type="email"
                  value={newAdminDetails.email}
                  onChange={handleInputChange}
                  required
                />
              </FormControl>
            </div>
            <div className="row my-4">
              {" "}
              <FormControl fullWidth>
                <InputLabel htmlFor="username-input">Password</InputLabel>
                <Input
                  id="username-input"
                  name="email"
                  type="password"
                  value={newAdminDetails.password}
                  onChange={handleInputChange}
                  required
                />
              </FormControl>
            </div>

            <div className="row">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddAdmin}
                fullWidth
                style={{ marginTop: "10px" }}
              >
                Add Admin
              </Button>
            </div>
          </div>
        </Paper>
      </Modal>
    </div>
  );
};

export default AdminUserManage;
