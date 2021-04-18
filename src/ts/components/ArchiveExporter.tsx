import { Fragment, h } from 'preact';
import { getData } from '../stg/dutils';

const archiveTooltip = <>{'Export your TH archive.'}</>;

const statusReducer = (state, action) => {
  console.log('statusReducer', { state, action });
  switch (action) {
    case 'idle':
      return 'idle';
    case 'failed':
      return 'failed';
    case 'waiting':
      return 'waiting';
    case 'empty':
      return state === 'waiting' ? 'success' : 'idle';
    // case 'success': return <span>'Archive Loaded!'</span>;
    default:
      throw new Error('Unexpected action');
  }
};
const statusMsg = {
  idle: null,
  failed: (
    <span class="text-red-600 ml-8">
      This file isn't supported. Try another.
    </span>
  ),
  waiting: 'Loading archive...',
  success: 'Archive Loaded!',
};

const saveTemplateAsFile = (filename, jsonToWrite) => {
  const blob = new Blob([jsonToWrite], { type: 'text/json' });
  const link = document.createElement('a');

  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ['text/json', link.download, link.href].join(':');

  const evt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  link.dispatchEvent(evt);
  return link;
};

export const ArchiveExporter = (props) => {
  const exportArch = async () => {
    //   TODO: ask bg for exported idb
    const myObjAsJson = getData('idbExport');

    const link = saveTemplateAsFile('thArchive.json', myObjAsJson);
    return () => {
      link.remove();
    };
  };

  return (
    <div onClick={exportArch}>
      <span>Export TH Archive</span>
    </div>
  );
};
