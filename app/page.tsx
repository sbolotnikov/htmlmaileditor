'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { useHistory } from '@/hooks/useHistory';
import { EmailRow, Element, GlobalStyles, PreviewMode } from '@/types';
import { generateHtml } from '@/utils/htmlGenerator';
import { parseHtml } from '@/utils/htmlParser';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Canvas from '@/components/Canvas';
import PropertiesPanel from '@/components/PropertiesPanel';
import CodeView from '@/components/CodeView';
import { DEFAULT_GLOBAL_STYLES } from '@/constants';
import { DroppedItem } from '@/types';


export default function Home() {
  const { state: emailData, setState: setEmailData, undo, redo, canUndo, canRedo } = useHistory<EmailRow[]>([]);
  const [globalStyles, setGlobalStyles] = useState<GlobalStyles>(DEFAULT_GLOBAL_STYLES);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [showCode, setShowCode] = useState<boolean>(false);

  const selectedElement = useMemo(() => {
    if (!selectedElementId) return null;
    for (const row of emailData) {
      // Defensively check for row.columns
      for (const col of (row.columns || [])) {
        // Defensively check for col.elements
        const el = (col.elements || []).find(e => e.id === selectedElementId);
        if (el) return el;
      }
    }
    return null;
  }, [selectedElementId, emailData]);

  const handleDrop = useCallback((item: DroppedItem, rowIndex: number, colIndex: number, position: number) => {
    setEmailData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      
      if (item.type === 'layout') {
          // If widths are provided, use them. Otherwise, fall back to evenly distributing columns.
          const columnDefs = item.widths 
            ? item.widths.map(width => ({ width }))
            : Array(item.columns || 1).fill(0).map(() => ({ width: `${100 / (item.columns || 1)}%` }));

          const newRow: EmailRow = {
              id: `row-${Date.now()}`,
              columns: columnDefs.map((def, i) => ({
                  id: `col-${Date.now()}-${i}`,
                  elements: [],
                  style: {
                      width: def.width,
                  }
              })),
              style: {},
          };
          newData.splice(rowIndex + 1, 0, newRow);
      } else {
        const newElement: Element = {
          id: `${item.type}-${Date.now()}`,
          type: item.type,
          content: {},
          style: {},
        };
        
        // Default content based on type
        switch(item.type) {
            case 'text':
                newElement.content = { text: 'This is a new text block. Click to edit.' };
                newElement.style = { 
                    color: '#000000', 
                    fontSize: '16px', 
                    padding: '10px',
                    textAlign: 'left',
                    fontWeight: 'normal',
                    fontFamily: 'Arial, sans-serif',
                };
                break;
            case 'image':
                newElement.content = { src: 'https://picsum.photos/600/400', alt: 'Placeholder Image' };
                newElement.style = { padding: '10px', textAlign: 'center', verticalAlign: 'middle' };
                break;
            case 'button':
                newElement.content = { text: 'Click Me', href: '#' };
                newElement.style = { backgroundColor: '#4F46E5', color: '#FFFFFF', padding: '12px 24px', borderRadius: '4px', textAlign: 'center' };
                break;
            case 'divider':
                newElement.style = { borderTop: '1px solid #cccccc', padding: '10px 0' };
                break;
            case 'spacer':
                newElement.style = { height: '20px' };
                break;
            case 'social':
                newElement.content = {
                    links: [
                        { platform: 'Facebook', href: '#' },
                        { platform: 'Twitter', href: '#' },
                        { platform: 'Instagram', href: '#' },
                        { platform: 'LinkedIn', href: '#' },
                    ]
                };
                newElement.style = { padding: '10px', textAlign: 'center' };
                break;
        }

        if (newData[rowIndex] && newData[rowIndex].columns[colIndex]) {
            newData[rowIndex].columns[colIndex].elements.splice(position, 0, newElement);
        } else if (newData.length === 0) { // Dropping on empty canvas
             const newRow: EmailRow = {
              id: `row-${Date.now()}`,
              columns: [{ id: `col-${Date.now()}-0`, elements: [newElement], style: { width: '100%' } }],
              style: {},
            };
            newData.push(newRow);
        }
      }
      return newData;
    });
  }, [setEmailData]);

  const handleElementUpdate = useCallback((updatedElement: Element) => {
    setSelectedElementId(updatedElement.id);
    setEmailData(prevData => {
      // Add defensive checks to prevent mapping on undefined
      return prevData.map(row => ({
        ...row,
        columns: (row.columns || []).map(col => ({
          ...col,
          elements: (col.elements || []).map(el => el.id === updatedElement.id ? updatedElement : el)
        }))
      }));
    }, true); // `true` to replace last history state for minor tweaks
  }, [setEmailData]);

  const handleElementDelete = useCallback((elementId: string) => {
    setEmailData(prevData => {
      const newData = prevData
        .map(row => {
          // Create new columns, filtering out the deleted element
          const newColumns = (row.columns || [])
            .map(col => ({
              ...col,
              // Defensively filter elements
              elements: (col.elements || []).filter(el => el.id !== elementId),
            }))
            // Filter out columns that are now empty
            .filter(col => col.elements.length > 0);
          
          return { ...row, columns: newColumns };
        })
        // Filter out rows that are now empty
        .filter(row => row.columns.length > 0);

      setSelectedElementId(null);
      return newData;
    });
  }, [setEmailData]);
  
  const handleHtmlImport = (html: string) => {
    try {
      const { rows, styles } = parseHtml(html);
      setEmailData(rows);
      setGlobalStyles(styles);
      setSelectedElementId(null);
    } catch (error) {
      console.error("Failed to parse HTML:", error);
      alert("Could not parse the imported HTML. Please check the file format.");
    }
  };

  const handleJsonImport = (jsonString: string) => {
    try {
      const { rows, styles } = JSON.parse(jsonString);
      if (Array.isArray(rows) && typeof styles === 'object' && styles !== null) {
        setEmailData(rows);
        setGlobalStyles(styles);
        setSelectedElementId(null);
      } else {
        throw new Error("Invalid JSON format for template.");
      }
    } catch (error) {
      console.error("Failed to parse JSON template:", error);
      alert("Could not parse the imported JSON template. Please check the file format.");
    }
  };

  const generatedHtml = useMemo(() => generateHtml(emailData, globalStyles), [emailData, globalStyles]);

  return (
    <div className="flex flex-col h-screen font-sans antialiased text-slate-800">
      <Header
        onPreviewChange={setPreviewMode}
        currentPreview={previewMode}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onToggleCode={() => setShowCode(s => !s)}
        showCode={showCode}
        onHtmlImport={handleHtmlImport}
        generatedHtml={generatedHtml}
        onJsonImport={handleJsonImport}
        emailData={emailData}
        globalStyles={globalStyles}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main 
          className="flex-1 overflow-auto p-4 md:p-8"
          style={{ background: globalStyles.background }}
        >
          <Canvas
            emailData={emailData}
            onDrop={handleDrop}
            onSelectElement={setSelectedElementId}
            selectedElementId={selectedElementId}
            onDeleteElement={handleElementDelete}
            previewMode={previewMode}
            globalStyles={globalStyles}
          />
        </main>
        {showCode ? (
          <CodeView code={generatedHtml} />
        ) : (
          <PropertiesPanel
            selectedElement={selectedElement}
            onUpdate={handleElementUpdate}
            globalStyles={globalStyles}
            onGlobalStylesUpdate={setGlobalStyles}
          />
        )}
      </div>
    </div>
  );
}
 