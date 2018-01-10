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
  isAddProfile: state => state.status.isAddProfile,
  isAddDevice: state => state.status.isAddDevice,
  isDeviceForm: state => state.status.isDeviceForm,
  selectBindDevice: state => state.device.selectBindDevice,
  bindDeviceList: state => state.device.bindDeviceList,
  zoneList: state => state.zone.zoneList
}
export default getters
