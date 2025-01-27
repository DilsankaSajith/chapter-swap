// @desc    Register user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req, res) => {
  res.send("register user");
};

// @desc    Auth user
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req, res) => {
  res.send("auth user");
};

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
export const logout = async (req, res) => {
  res.send("logout user");
};
