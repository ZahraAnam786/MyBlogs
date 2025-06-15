import { Client, Databases, Storage, ID, Query } from "appwrite";
import config from "../config/config";

export class DBService {
  client = new Client();
  database;
  bucketstorage;

  constructor() {
    this.client
      .setEndpoint(config.appwriteURL)
      .setProject(config.appwriteProjectId);

    this.database = new Databases(this.client);
    this.bucketstorage = new Storage(this.client);
  }

  async createPost({ Title, slug, Content, FeatureImage, Status, UserID }) {
    try {
      return await this.database.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        { Title, Content, FeatureImage, Status, UserID }
      );
    } catch (error) {
      throw error;
    }
  }

  async updatePost(slug, { Title, Content, FeatureImage, Status }) {
    try {
      return await this.database.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        { Title, Content, FeatureImage, Status }
      );
    } catch (error) {
      throw error;
    }
  }

  async deletePost(slug) {
    try {
      await this.database.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      throw error;
      return false;
    }
  }

  async getPostByID(slug) {
    try {
      return await this.database.getDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug
      );
    } catch (error) {
      throw error;
    }
  }

  //for make query need to make index in collection
  async getAllPost(queries = [Query.equal("status", "active")]) {
    try {
      return await this.database.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        queries
      );
    } catch (error) {
      throw error;
    }
  }

  //file upload service

  async fileUpload(file) {
    try {
      return await this.bucketstorage.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async fileDelete(fileId) {
    try {
      if(fileId != null && fileId != ""){
      return await this.bucketstorage.deleteFile(
        config.appwriteBucketId,
        fileId
      );
      return true;
    }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  getFilePreview(fileId) {
    if(fileId != null && fileId != ""){
      var file = this.bucketstorage.getFileView(config.appwriteBucketId, fileId);
      return file;
    }
  }
}

const dbService = new DBService();
export default dbService;
