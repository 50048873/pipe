export default {
  set_signPoint (state, signPoint) {
    state.signPoint = signPoint
  },
  set_signPoint_isSigned (state, signPoint) {
    state.signPoint.forEach((item) => {
      if (item.id === signPoint.id) {
        item.isSigned = true
      }
    })
  },
  set_currentInspectorId (state, currentInspectorId) {
    state.currentInspectorId = currentInspectorId
  },
  set_inspectedPathInfo (state, inspectedPathInfo) {
    state.inspectedPathInfo.push(inspectedPathInfo)
  }
}
