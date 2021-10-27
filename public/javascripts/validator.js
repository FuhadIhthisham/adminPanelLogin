// user login validator
var userLogin = $("#user-login");

userLogin.validate({
  rules: {
    email: {
      required: true,
      email: true,
    },
    pwd: {
      required: true,
      minlength: 5,
    },
  },
  messages: {
    username: {
      required: "This field is required",
    },
  },
});

// admin login validator
var adminLogin = $("#admin-login");

adminLogin.validate({
  rules: {
    adminEmail: {
      required: true,
      email: true,
    },
    adminPassword: {
      required: true,
      minlength: 5,
    },
  },
  messages: {
    adminEmail: {
      required: "This field is required",
    },
  },
});

// admin edit user validator
var editUser = $("#editUser");

editUser.validate({
  rules: {
    name: {
      required: true,
      minlength: 5,
    },
    email: {
      required: true,
      minlength: 5,
      email: true,
    },
  },
  messages: {
    name: {
      required: "Name field is required",
    },
  },
});

// signup validator
var signup = $("#signupForm");

signup.validate({
  rules: {
    email: {
      required: true,
      email: true,
    },
    formCheck: {
      required: true,
    },
    name: {
      required: true,
      minlength: 5,
    },
    pwd: {
      required: true,
      minlength: 5,
    },
  },
  messages: {
    name: {
      required: "Name field is required",
    },
    email: {
      required: "Email field is required",
    },
    pwd: {
      required: "Password field is required",
    },
    formCheck: {
      required: "<style> .form-check{color:red;font-weight:900}  </style>",
    },
  },
});
