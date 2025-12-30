///////////////////////////////////////////////////////////////////////
// =================== DELETE REVIEW BUTTON ========================== //
///////////////////////////////////////////////////////////////////////

import React from "react";

export default function DeleteReviewBtn({ onClick, children }) {
  return (
    <button style={{ background: '#d32f2f', color: '#fff', borderRadius: 4, border: 'none', padding: '8px 16px', cursor: 'pointer' }} onClick={onClick}>
      {children || "Delete"}
    </button>
  );
}
