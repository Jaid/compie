const anyType = "PropTypes.any"

export default jsdocType => {
  if (!jsdocType) {
    return anyType
  }
  const jsdocTypeNormalized = jsdocType.trim().toLowerCase()
  if (jsdocTypeNormalized === "string") {
    return "PropTypes.string"
  }
  if (jsdocTypeNormalized === "object") {
    return "PropTypes.object"
  }
  if (jsdocTypeNormalized === "boolean") {
    return "PropTypes.bool"
  }
  if (jsdocTypeNormalized === "number") {
    return "PropTypes.number"
  }
  return anyType
}