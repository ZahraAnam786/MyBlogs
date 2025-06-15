// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   updateProfile,
// } from "firebase/auth";
// import { auth } from "../config/firebaseConfig";

// export class AuthService {
//   constructor() {
//     // Firebase doesn't need manual initialization here after config
//   }

//   async createAccount({ email, password, name }) {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Set display name after creation
//       await updateProfile(user, { displayName: name });

//       // Automatically log in
//       return await this.login({ email, password });
//     } catch (error) {
//       throw error;
//     }
//   }

//   async login({ email, password }) {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       return userCredential.user;
//     } catch (error) {
//       throw error;
//     }
//   }

//   async getCurrentUser() {
//     return new Promise((resolve) => {
//       onAuthStateChanged(auth, (user) => {
//         resolve(user || null);
//       });
//     });
//   }

//   async logout() {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.log("Error on :: logout", error);
//     }
//   }
// }

// const authService = new AuthService();

// export default authService;

import { Client, Account, ID } from "appwrite";
import config from "../config/config";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(config.appwriteURL)
      .setProject(config.appwriteProjectId);

    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        //call anoher method
        await this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      console.log("Error on :: creteUser", error);
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log("Error on :: login", error);
    }
  }

  async getCurrentUser() {
    const user = await this.account.get().catch((e) => {
      console.log("Not logged in", e.message);
    });
    console.log("Current user:", user);
  }

  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.log("Error on :: logout", error);
    }
    return null;
  }
}

const authService = new AuthService();

export default authService;
