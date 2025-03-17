//  ========== Component imports  ========== //

import React from 'react';
import RegisterForm from '../../auth/RegisterForm'; // Import RegisterForm component

///////////////////////////////////////////////////////////////////////
// ========================= JSX BELOW ============================= //
///////////////////////////////////////////////////////////////////////

function Register() {
  return (
    <div>
      <h1>Register</h1>
      <RegisterForm /> {/* Render the RegisterForm component */}
    </div>
  );
}

export default Register;