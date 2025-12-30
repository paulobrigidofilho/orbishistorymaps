///////////////////////////////////////////////////////////////////////
// =================== SUBMIT REVIEW BUTTON ========================== //
///////////////////////////////////////////////////////////////////////

import React from "react";

export default function SubmitReviewBtn({ onClick, children, disabled }) {
  return (
    <button style={{ background: '#ffa41c', color: '#fff', borderRadius: 4, border: 'none', padding: '8px 16px', cursor: 'pointer' }} onClick={onClick} disabled={disabled}>
      {children || "Submit Review"}
    </button>
  );
}
