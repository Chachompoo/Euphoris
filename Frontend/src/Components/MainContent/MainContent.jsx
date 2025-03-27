import React from 'react';

function MainContent() {
  return (
    <div className="main-content-home">
      <div className="new-post-section-home">
        {/* ส่วนสำหรับสร้างโพสต์ใหม่ */}
        <div className="new-post-input-home"></div>
        <div className="new-post-actions-home"></div>
      </div>
      <div className="posts-section-home">
        {/* ส่วนสำหรับแสดงโพสต์ต่างๆ */}
        <div className="post-item-home"></div>
        <div className="post-item-home"></div>
      </div>
    </div>
  );
}

export default MainContent;