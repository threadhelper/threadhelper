import { h } from 'preact';
import { useRef } from 'preact/hooks';
import { defaultTo, find, propEq } from 'ramda'; // Object
import { useStorage } from '../hooks/useStorage';
import { msgBG, setStg } from '../utils/dutils';
import { csEvent, csException } from '../utils/ga';

function LoadArchiveIcon() {
  const tooltip = (
    <span class="tooltiptext">
      {' '}
      Click here to upload your Twitter Archive.{' '}
      <a href="https://twitter.com/settings/your_twitter_data">
        Download an archive of your data
      </a>
      , extract it and select data/tweet.js.{' '}
    </span>
  );

  return (
    <div class="archive_icon">
      <button>{`🧾 Load Archive`}</button>
      {/* <button>{`(load archive)`}</button>  */}
      {tooltip}
    </div>
  );
}

export const ArchiveUploader = (props) => {
  const [hasArchive, setHasArchive] = useStorage('hasArchive', false);
  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = (event) => {
    console.log('load archive clicked');
    csEvent('User', 'Load Archive click', '');
    // ts-migrate(2531) FIXME: Object is possibly 'null'.
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file

  // const handleChange = (e: { target: { files: any; }; }) => {
  const handleChange = (e: Event) => {
    const files: FileList = (e.target as HTMLInputElement).files as FileList;
    {
      /* const files = e.target.files; */
    }
    console.log('arch files', files);
    const reader = new FileReader();
    reader.onload = importArchive;
    const file = find(propEq('name', 'tweet.js'))(Array.from(files)) as File;
    console.log('arch file', file);
    try {
      reader.readAsText(file);
    } catch (e) {
      console.log("ERROR: Couldn't load archive");
      csException("Couldn't load archive", false);
    }
  };

  // Parses json and stores in temp to be processed by BG
  function importArchive(this: any) {
    const result = this.result.replace(/^[a-z0-9A-Z\.]* = /, '');
    const importedTweetArchive = JSON.parse(result);

    csEvent(
      'User',
      'Loaded Archive',
      defaultTo(0, importedTweetArchive.length)
    );

    console.log('setting archive', importedTweetArchive);
    setStg('temp_archive', importedTweetArchive).then(() => {
      setHasArchive(true);
      // msgBG({ type: 'temp-archive-stored' });
      hiddenFileInput.current.value = null;
    });
  }
  return (
    <div onClick={handleClick}>
      <LoadArchiveIcon></LoadArchiveIcon>
      <input
        type="file"
        accept=".json,.js"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};
