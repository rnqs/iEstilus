import firebaseAuth from "./firebaseAuth";

const getFirebaseIdToken = () => {
  return new Promise((resolve, reject) => {
    firebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        resolve(await user.getIdToken());
      } else {
        reject(Error("It broke"));
      }
    });
  });
};

export default getFirebaseIdToken;
