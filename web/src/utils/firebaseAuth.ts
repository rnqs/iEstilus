import firebaseApp from "./firebaseApp";

const firebaseAuth = firebaseApp.auth();

firebaseAuth.languageCode = "pt";

export default firebaseAuth;
