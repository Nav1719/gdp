// services.ts

import axios, { AxiosResponse, AxiosError } from "axios";

import * as fs from "fs";
import pdf from "pdf-parse";

const getPDFDataToText = async (dataBuffer: any) => {
  pdf(dataBuffer).then(function (data: { text: string }) {
    // Assuming you have a function to send the text data to your Flask app
    // Replace 'sendTextDataToFlask' with the actual function you have
    return data;
  });
};

// Function to make a GET request to a backend API
async function get<T>(url: string): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in GET request:", error);
    throw error;
  }
}

// Function to make a POST request to a backend API
async function post<T, U>(url: string, data: U): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in POST request:", error);
    throw error;
  }
}

// Other utility functions can be added as needed, e.g., for PUT, DELETE requests, etc.

// Example of using the service functions
async function fetchUserData(userId: number): Promise<UserData | null> {
  const url = `https://example.com/api/users/${userId}`;
  try {
    const userData = await get<UserData>(url);
    return userData;
  } catch (error) {
    // Handle the error or log it as needed
    return null;
  }
}

interface UserData {
  // Define the structure of user data here
  id: number;
  name: string;
  // Add other fields as needed
}

export { get, post, fetchUserData };
