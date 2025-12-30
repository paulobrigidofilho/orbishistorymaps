///////////////////////////////////////////////////////////////////////
// =================== EDIT REVIEW BUTTON ============================ //
///////////////////////////////////////////////////////////////////////

import React from "react";

export default function EditReviewBtn({ onClick, children }) {
  return (
    <button style={{ background: '#ffa41c', color: '#fff', borderRadius: 4, border: 'none', padding: '8px 16px', cursor: 'pointer' }} onClick={onClick}>
      {children || "Edit your review"}
    </button>
  );
}
