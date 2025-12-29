/////////////////////////////////////////////////
// ======== DELETE USER FUNCTION ============= //
/////////////////////////////////////////////////

// This function deletes a user account from the admin panel

// ======= Constants ======= //
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/////////////////////////////////////////////////
// ========= DELETE USER API CALL ============ //
/////////////////////////////////////////////////

const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete user");
    }

    return data;
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
};

export default deleteUser;
