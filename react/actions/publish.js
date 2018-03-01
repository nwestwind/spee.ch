import * as actions from 'constants/publish_action_types';

// export action creators
export function selectFile (file) {
  return {
    type: actions.FILE_SELECTED,
    data: file,
  };
};

export function clearFile () {
  return {
    type: actions.FILE_CLEAR,
  };
};

export function updateMetadata (name, value) {
  return {
    type: actions.METADATA_UPDATE,
    data: {
      name,
      value,
    },
  };
};

export function updateClaim (value) {
  return {
    type: actions.CLAIM_UPDATE,
    data: value,
  };
};

export function setPublishInChannel (channel) {
  return {
    type: actions.SET_PUBLISH_IN_CHANNEL,
    channel,
  };
};

export function updatePublishStatus (status, message) {
  return {
    type: actions.PUBLISH_STATUS_UPDATE,
    data: {
      status,
      message,
    },
  };
};

export function updateError (name, value) {
  return {
    type: actions.ERROR_UPDATE,
    data: {
      name,
      value,
    },
  };
};

export function updateSelectedChannel (channelName) {
  return {
    type: actions.SELECTED_CHANNEL_UPDATE,
    data: channelName,
  };
};

export function toggleMetadataInputs (showMetadataInputs) {
  return {
    type: actions.TOGGLE_METADATA_INPUTS,
    data: showMetadataInputs,
  };
};

export function updateThumbnailClaim (claim, url) {
  return {
    type: actions.THUMBNAIL_CLAIM_UPDATE,
    data: { claim, url },
  };
};

export function updateThumbnailSelectedFile (file) {
  return {
    type: actions.THUMBNAIL_FILE_SELECT,
    data: file,
  };
};

export function startPublish (history) {
  return {
    type: actions.PUBLISH_START,
    data: { history },
  };
}
