import React from 'react';
import { useFontSize } from '../context/FontSizeContext';

const FontSizeDemo: React.FC = () => {
  const { fontSize } = useFontSize();

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Font Size Demo</h2>
        <p className="text-sm text-gray-600 mb-4">
          Current font size: <span className="font-semibold text-blue-600">{fontSize}</span>
        </p>
        
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold">Heading 1 - Main Title</h1>
            <p className="text-sm text-gray-500">This is a main heading</p>
          </div>
          
          <div>
            <h2 className="text-3xl font-semibold">Heading 2 - Section Title</h2>
            <p className="text-sm text-gray-500">This is a section heading</p>
          </div>
          
          <div>
            <h3 className="text-2xl font-medium">Heading 3 - Subsection</h3>
            <p className="text-sm text-gray-500">This is a subsection heading</p>
          </div>
          
          <div>
            <h4 className="text-xl">Heading 4 - Minor Section</h4>
            <p className="text-sm text-gray-500">This is a minor section heading</p>
          </div>
          
          <div>
            <h5 className="text-lg">Heading 5 - Small Section</h5>
            <p className="text-sm text-gray-500">This is a small section heading</p>
          </div>
          
          <div>
            <h6 className="text-base">Heading 6 - Tiny Section</h6>
            <p className="text-sm text-gray-500">This is a tiny section heading</p>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-base mb-2">
              This is a regular paragraph with normal text size. It demonstrates how the font size affects 
              the readability and overall appearance of the content.
            </p>
            
            <p className="text-sm text-gray-600 mb-2">
              This is smaller text, typically used for secondary information or captions.
            </p>
            
            <p className="text-xs text-gray-500">
              This is the smallest text size, often used for metadata or fine print.
            </p>
          </div>
          
          <div className="border-t pt-4">
            <div className="space-y-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Regular Button
              </button>
              
              <button className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600">
                Small Button
              </button>
              
              <button className="px-6 py-3 text-lg bg-green-500 text-white rounded hover:bg-green-600">
                Large Button
              </button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Regular input field" 
                className="w-full px-3 py-2 border rounded"
              />
              
              <textarea 
                placeholder="Textarea with multiple lines" 
                className="w-full px-3 py-2 border rounded h-20"
              />
              
              <select className="w-full px-3 py-2 border rounded">
                <option>Select an option</option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontSizeDemo; 