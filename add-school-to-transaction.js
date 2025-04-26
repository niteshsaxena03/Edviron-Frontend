// Script to update a transaction with the school ID
const axios = require("axios");
const { MongoClient, ObjectId } = require("mongodb");

// Configuration
const API_URL = "http://localhost:8000/api";
const MONGODB_URI = "mongodb://127.0.0.1:27017/school_payment_app"; // Update with your actual MongoDB connection string
const SCHOOL_ID = "65b0e6293e9f76a9694d84b4";
const TRANSACTION_ID = "680b9eebb36805761d4bd831"; // Replace with your actual transaction ID

async function updateTransaction() {
  let client;
  try {
    console.log("Connecting to MongoDB...");
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const ordersCollection = db.collection("orders");

    // Update the transaction to associate it with the school
    const result = await ordersCollection.updateOne(
      {
        _id: new ObjectId(TRANSACTION_ID),
        // Or if it's already an ObjectId in the database
        // _id: ObjectId.createFromHexString(TRANSACTION_ID)
      },
      {
        $set: {
          school_id: SCHOOL_ID,
        },
      }
    );

    if (result.matchedCount === 0) {
      console.log(`No transaction found with ID: ${TRANSACTION_ID}`);
    } else if (result.modifiedCount === 0) {
      console.log(
        `Transaction found but not modified. It may already have the school ID set.`
      );
    } else {
      console.log(
        `Transaction updated successfully: ${TRANSACTION_ID} now associated with school: ${SCHOOL_ID}`
      );
    }

    // Verify the update
    const updatedTransaction = await ordersCollection.findOne({
      _id: new ObjectId(TRANSACTION_ID),
    });
    console.log("Updated transaction:", updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
  } finally {
    if (client) {
      await client.close();
      console.log("MongoDB connection closed");
    }
  }
}

// Run the update
updateTransaction().catch(console.error);
