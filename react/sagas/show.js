import { call, put, takeLatest } from 'redux-saga/effects';
import * as actions from 'constants/show_action_types';
import { addAssetRequest, updateRequestError, showNewAsset, updateShowAsset, addAssetToAssetList, addChannelRequest, showNewChannel, updateShowChannel, addNewChannelToChannelList, updateFileAvailability, updateDisplayAssetError } from 'actions/show';
import { UNAVAILABLE, AVAILABLE } from 'constants/asset_display_states';
import { checkFileAvailability, triggerClaimGet } from 'api/fileApi';
import { getLongClaimId, getShortId, getClaimData } from 'api/assetApi';
import { getChannelData, getChannelClaims } from 'api/channelApi';

function* newAssetRequest (action) {
  const { id, name, modifier } = action.data;
  let success, message, longId;
  try {
    ({success, message, data: longId} = yield call(getLongClaimId, name, modifier));
  } catch (error) {
    return yield put(updateRequestError(error.message));
  }
  if (!success) {
    return yield put(updateRequestError(message));
  }
  yield put(addAssetRequest(id, null, name, longId));
  yield put(showNewAsset(name, longId));
};

function* getAssetDataAndShowAsset (action) {
  const {id, name, claimId} = action.data;
  // get short Id
  let success, message, shortId;
  try {
    ({success, message, data: shortId} = yield call(getShortId, name, claimId));
  } catch (error) {
    return yield put(updateShowAsset(error.message, name, claimId));
  }
  if (!success) {
    return yield put(updateShowAsset(message, name, claimId));
  }
  // if no error, get claim data
  success = null;
  let claimData;
  try {
    ({success, message, data: claimData} = yield call(getClaimData, name, claimId));
  } catch (error) {
    return yield put(updateShowAsset(error.message, name, claimId));
  }
  if (!success) {
    return yield put(updateShowAsset(message, name, claimId));
  }
  yield put(updateShowAsset(null, name, claimId, shortId, claimData));
  yield put(addAssetToAssetList(id, null, name, claimId, shortId, claimData));
}

function* retrieveFile (action) {
  const name = action.data.name;
  const claimId = action.data.claimId;
  // see if the file is available
  let success, message, isAvailable;
  try {
    ({ success, message, data: isAvailable } = yield call(checkFileAvailability, name, claimId));
  } catch (error) {
    return yield put(updateDisplayAssetError(error.message));
  };
  if (!success) {
    return yield put(updateDisplayAssetError(message));
  }
  if (isAvailable) {
    return yield put(updateFileAvailability(AVAILABLE));
  }
  yield put(updateFileAvailability(UNAVAILABLE));
  // initiate get request for the file
  try {
    ({ success, message } = yield call(triggerClaimGet, name, claimId));
  } catch (error) {
    return yield put(updateDisplayAssetError(error.message));
  };
  if (!success) {
    return yield put(updateDisplayAssetError(message));
  }
  yield put(updateFileAvailability(AVAILABLE));
};

function* newChannelRequest (action) {
  const { id, name, channelId } = action.data;
  let success, message, data;
  try {
    ({success, message, data} = yield call(getChannelData, name, channelId));
  } catch (error) {
    // return yield put(addChannelRequest(id, error.message, null, null, null));
    return yield put(updateRequestError(message));
  }
  if (!success) {
    // return yield put(addChannelRequest(id, message, null, null, null));
    return yield put(updateRequestError(message));
  }
  const { longChannelClaimId: longId, shortChannelClaimId: shortId } = data;
  yield put(addChannelRequest(id, null, name, longId, shortId));
  const channelData = {name, longId, shortId};
  yield put(showNewChannel(channelData));
}

function* getNewChannelDataAndShowChannel (action) {
  const { id, channelData: {name, shortId, longId} } = action.data;
  let success, message, claimsData;
  try {
    ({ success, message, data: claimsData } = yield call(getChannelClaims, name, longId, 1));
  } catch (error) {
    return yield put(updateShowChannel(error.message, name, shortId, longId));
  }
  if (!success) {
    return yield put(updateShowChannel(message, name, shortId, longId));
  }
  yield put(updateShowChannel(null, name, shortId, longId, claimsData));
  const channelData = {name, shortId, longId};
  yield put(addNewChannelToChannelList(id, null, channelData, claimsData));
}

export function* watchNewAssetRequest () {
  yield takeLatest(actions.ASSET_REQUEST_NEW, newAssetRequest);
};

export function* watchNewChannelRequest () {
  yield takeLatest(actions.CHANNEL_REQUEST_NEW, newChannelRequest);
};

export function* watchShowNewAsset () {
  yield takeLatest(actions.SHOW_ASSET_NEW, getAssetDataAndShowAsset);
};

export function* watchShowNewChannel () {
  yield takeLatest(actions.SHOW_CHANNEL_NEW, getNewChannelDataAndShowChannel);
};

export function* watchFileIsRequested () {
  yield takeLatest(actions.FILE_REQUESTED, retrieveFile);
};
