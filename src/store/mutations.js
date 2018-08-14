export default {
  set_signPoint (state, signPoint) {
    state.signPoint = signPoint
  },
  set_currentInspectorId (state, currentInspectorId) {
    state.currentInspectorId = currentInspectorId
  },
  set_inspectedPathInfo (state, inspectedPathInfo) {
    state.inspectedPathInfo.push(inspectedPathInfo)
  }
}
