import {
  Grouping,
  CreateGrouping,
  DeleteDocument,
  UpdateGroupingType,
  UpdateGroupingData,
  updateGroupingRename,
  UpdateGroupingTopology,
  UpdateGroupingDesc,
  UpdateGroupingState,
  UpdateGroupingAssetURLs,
  UpdateGroupingDocState,
  UpdateGroupingAvatarUrl,
  GroupingAdd,
  DocumentDelete,
  GroupingUpdate
} from './Grouping.gql';

import {
  User,
  CreateUser,
  UpdateUser,
  DeleteUser,
  UserAdd,
  UserUpdate,
  UserDelete
} from './User.gql';

export default {
  queries: {
    grouping: Grouping,
    user: User
  },
  mutations: {
    createGrouping: CreateGrouping,
    deleteDocument: DeleteDocument,
    updateGroupingData: UpdateGroupingData,
    updateGroupingRename: updateGroupingRename,
    updateGroupingTopology: UpdateGroupingTopology,
    updateGroupingType: UpdateGroupingType,
    updateGroupingDesc: UpdateGroupingDesc,
    updateGroupingState: UpdateGroupingState,
    updateGroupingAssetURLs: UpdateGroupingAssetURLs,
    updateGroupingDocState: UpdateGroupingDocState,
    updateGroupingAvatarUrl: UpdateGroupingAvatarUrl,
    // User mutations
    createUser: CreateUser,
    updateUser: UpdateUser,
    deleteUser: DeleteUser
  },
  subscriptions: {
    groupingAdd: GroupingAdd,
    documentDelete: DocumentDelete,
    groupingUpdate: GroupingUpdate,
    // User subscriptions
    userAdd: UserAdd,
    userUpdate: UserUpdate,
    userDelete: UserDelete
  }
};
