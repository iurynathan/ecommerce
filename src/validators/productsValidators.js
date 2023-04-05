const validateFields = (data, expectedFields) => {
  const missingFields = [];
  expectedFields.forEach((field) => {
    if (!(field in data)) {
      missingFields.push(field);
    }
  });
  if (missingFields.length > 0) {
    return {
      success: false,
      message: `Os seguintes campos são obrigatórios: ${missingFields.join(', ')}`,
    };
  }
  return {
    success: true,
  };
};

module.exports = validateFields;
