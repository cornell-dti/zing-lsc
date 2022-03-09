const { db } = require("../config");
const admin = require("firebase-admin");

function signIn() {
  const provider = new admin.auth.SAMLAuthProvider("saml.cornell-sso");

  admin
    .auth()
    .signInWithPopup(provider)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}
