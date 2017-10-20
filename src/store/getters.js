const getters = {
  deviceList: state => state.device.deviceList,
  selectMac: state => state.device.selectMac,
  // device type object example {17 : {....}}
  deviceTypes: state => state.type.deviceTypes,
  // device type object array example [{typeName:'test'},...]
  typeList: state => state.type.typeList,
  selectTypeName: state => state.type.selectTypeName,
  selectType: state => state.type.selectType,
  profileList: state => state.profile.profileList,
  selectProfile: state => state.profile.selectProfile,
  isLoading: state => state.status.isLoading,
  isAddProfile: state => state.status.isAddProfile
}
export default getters
