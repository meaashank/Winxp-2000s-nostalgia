import React, { useState } from 'react';
import { playKeyClick, playMouseClick } from '../../utils/audio';

interface NotepadAppProps {
  initialContent?: string;
  fileName?: string;
}

export const NotepadApp: React.FC<NotepadAppProps> = ({
  initialContent = `CABIN 04 - NOTES
================
- Prepaid session: 2 Hours ($4.00)
- LAN Party CS 1.6 starts at 11:30 PM
- Need to copy photos.zip to floppy disk before leaving
- Ask front desk for Mountain Dew / Bawls drink

Don't forget to log out when done!`,
  fileName = 'Untitled - Notepad',
}) => {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="w-full h-full flex flex-col bg-white text-[#111] font-terminal text-[12px] select-text">
      {/* Menu Bar */}
      <div className="bg-[#ece9d8] px-2 py-0.5 border-b border-[#d4d0c8] flex items-center gap-3 text-[11px] font-tahoma select-none">
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">File</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Edit</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Format</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">View</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Help</span>
      </div>

      {/* Main Text Area */}
      <textarea
        value={content}
        onChange={(e) => {
          playKeyClick();
          setContent(e.target.value);
        }}
        className="flex-1 w-full p-2 bg-white text-black outline-none resize-none font-terminal text-[12.5px] leading-relaxed select-text"
      />
    </div>
  );
};
