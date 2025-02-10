import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Container, Paper } from '@mui/material';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState({
    userId: '123e4567-e89b-12d3-a456-426614174000', // Example user ID
    name: '',
    email: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Fetch user profile on component mount
  useEffect(() => {
    axios.get(`/api/user/${user.userId}`)
      .then(response => {
        setUser(response.data);
      })
      .catch(() => {
        setError('Error fetching user data');
      });
  }, [user.userId]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  // Validate inputs
  const validateInputs = () => {
    if (!user.name || !user.email || !user.address) {
      setError('All fields are required.');
      return false;
    }
    setError(null); // Clear previous error if inputs are valid
    return true;
  };

  // Handle form submission for updating user details
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    axios.put(`http://localhost:3002/user/675118cbc97ec451978b1dca`, {
      name: user.name,
      email: user.email,
      address: user.address,
    })
      .then(() => {
        setIsLoading(false);
        alert('Profile updated successfully!');
      })
      .catch(() => {
        setIsLoading(false);
        setError('Error updating profile');
      });
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsLoading(true);
      axios.delete(`http://localhost:3002/user/675118cbc97ec451978b1dca`)
        .then(() => {
          setIsLoading(false);
          alert('Account deleted successfully!');
          // Redirect to login or home page after deletion
        })
        .catch(() => {
          setIsLoading(false);
          setError('Error deleting account');
        });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: 4 }}>
        <Typography variant="h5" gutterBottom>Update Profile</Typography>

        {error && <Typography color="error">{error}</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required // Adds native browser validation
            error={!user.name && error !== null}
            helperText={!user.name && error ? "Name is required" : ""}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required // Adds native browser validation
            error={!user.email && error !== null}
            helperText={!user.email && error ? "Email is required" : ""}
          />
          <TextField
            label="Address"
            name="address"
            value={user.address}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required // Adds native browser validation
            error={!user.address && error !== null}
            helperText={!user.address && error ? "Address is required" : ""}
          />
          
          <Box sx={{ marginTop: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </Box>
        </form>

        <Box sx={{ marginTop: 3, textAlign: 'center' }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleDeleteAccount}
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
