import React from 'react';

function Profile() {
  // Example: Fetch user profile data (could be from localStorage, API, etc.)
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', email: 'user@example.com' };

  return (
    <div className="content">
      <h2>Profil Pengguna</h2>
      <p><strong>Nama:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}

export default Profile;
