import compareVersions from 'compare-versions';

export const welcomeUrl =
  "'https://www.notion.so/Welcome-e7c1b2b8d8064a80bdf5600c329b370d'";
export const patchNotes03 =
  'https://www.notion.so/Patch-Notes-afab29148a0c49358df0e55131978d48#cff459ef25ea4135a94a7882d4f2fe15';
export const uninstallUrl =
  "'https://docs.google.com/forms/d/e/1FAIpQLSf2s5y8tIFEQj4dIyk55QXS0DQmHQ_cmspmJmKNTslISOJ6oA/viewform'";

export const choosePatchUrl = (previousVersion) => {
  console.log('[DEBUG] choosePatchUrl', {
    previousVersion,
    show: compareVersions.compare(previousVersion, '0.3', '<'),
  });
  if (compareVersions.compare(previousVersion, '0.3', '<')) {
    return patchNotes03;
  } else {
    return null;
  }
};
